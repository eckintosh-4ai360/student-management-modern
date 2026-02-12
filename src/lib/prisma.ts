import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const connectionString = `${process.env.DATABASE_URL}`
const isValidConnectionString = connectionString && connectionString.startsWith('postgresql://')

let adapter;
if (isValidConnectionString) {
  const pool = new pg.Pool({ connectionString })
  adapter = new PrismaPg(pool)
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? (adapter ? new PrismaClient({ adapter }) : new PrismaClient())

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma

