import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';
const urlSource = process.env.DATABASE_URL ? 'environment variable' : 'fallback dummy';

if (!isBuildPhase) {
  console.log(`[Prisma Runtime] Initializing with ${urlSource}`);
}

const connectionString = process.env.DATABASE_URL || "postgresql://dummy:dummy@localhost:5432/dummy"
const pool = new pg.Pool({ 
  connectionString,
  ssl: { rejectUnauthorized: false } // Required for many serverless/managed DBs like Neon
})
const adapter = new PrismaPg(pool)

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prismaClient = globalForPrisma.prisma ?? new PrismaClient({ adapter })

// Create a build-safe proxy that catches database errors during the prerendering phase
// this allows the build to complete even if the database is unreachable
export const prisma = new Proxy(prismaClient, {
  get(target, prop) {
    const original = (target as any)[prop];
    
    // Only wrap models (which are objects with prisma methods)
    if (typeof original === 'object' && original !== null && !['$on', '$connect', '$disconnect', '$use', '$executeRaw', '$queryRaw'].includes(prop as string)) {
      return new Proxy(original, {
        get(modelTarget, modelProp) {
          const method = modelTarget[modelProp];
          if (typeof method === 'function') {
            return (...args: any[]) => {
              try {
                const result = method.apply(modelTarget, args);
                
                // Prisma methods return a PrismaPromise which is thenable/catchable
                if (process.env.NEXT_PHASE === 'phase-production-build' && result && typeof result.catch === 'function') {
                  return result.catch((err: any) => {
                    // Log the fallback attempt
                    console.warn(`[Prisma Build Fallback] ${String(prop)}.${String(modelProp)}: ${err.message}`);
                    
                    // Return sensible defaults based on the method name
                    const name = String(modelProp).toLowerCase();
                    if (name.includes('many')) return [];
                    if (name.includes('count')) return 0;
                    if (name.includes('findunique') || name.includes('findfirst')) return null;
                    return null;
                  });
                }
                return result;
              } catch (syncError) {
                if (process.env.NEXT_PHASE === 'phase-production-build') {
                  console.warn(`[Prisma Build Fallback Sync] ${String(prop)}.${String(modelProp)}`);
                  return null;
                }
                throw syncError;
              }
            };
          }
          return method;
        },
      });
    }
    return original;
  },
}) as PrismaClient;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prismaClient

export default prisma

