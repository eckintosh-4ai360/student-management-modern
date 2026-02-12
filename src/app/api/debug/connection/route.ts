import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  const envStatus = {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PHASE: process.env.NEXT_PHASE,
    DATABASE_URL: process.env.DATABASE_URL ? "Defined (Start with " + process.env.DATABASE_URL.substring(0, 10) + "...)" : "Missing",
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "Defined (Length: " + process.env.NEXTAUTH_SECRET.length + ")" : "Missing",
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "Missing",
  };

  let dbConnection = "Unknown";
  let dbError = null;

  try {
    // Attempt a simple query to verify connection
    await prisma.$queryRaw`SELECT 1`;
    dbConnection = "Success";
  } catch (error: any) {
    dbConnection = "Failed";
    dbError = {
      message: error.message,
      code: error.code,
      meta: error.meta,
      name: error.name
    };
  }

  return NextResponse.json({
    status: "Debug Report",
    timestamp: new Date().toISOString(),
    environment: envStatus,
    database: {
      connection: dbConnection,
      error: dbError
    }
  }, { status: 200 });
}
