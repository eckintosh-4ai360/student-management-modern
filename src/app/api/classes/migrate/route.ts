import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "admin" || session.user.adminRole !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sourceClassId, targetClassId, studentIds } = await request.json();

    if (!sourceClassId || !targetClassId) {
      return NextResponse.json({ error: "Source and target class IDs are required" }, { status: 400 });
    }

    if (sourceClassId === targetClassId) {
      return NextResponse.json({ error: "Source and target classes cannot be the same" }, { status: 400 });
    }

    // Migrate students from source class to target class
    // If studentIds is provided, only migrate those specific students
    const result = await prisma.student.updateMany({
      where: {
        classId: sourceClassId,
        ...(studentIds && studentIds.length > 0 ? { id: { in: studentIds } } : {}),
      },
      data: {
        classId: targetClassId,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Successfully migrated ${result.count} students`,
      count: result.count,
    });
  } catch (error) {
    console.error("Class migration error:", error);
    return NextResponse.json({ error: "Failed to migrate students" }, { status: 500 });
  }
}
