import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch students
    const students = await prisma.student.findMany({
      select: {
        id: true,
        name: true,
        surname: true,
        username: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    // Fetch teachers
    const teachers = await prisma.teacher.findMany({
      select: {
        id: true,
        name: true,
        surname: true,
        username: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    // Fetch parents
    const parents = await prisma.parent.findMany({
      select: {
        id: true,
        name: true,
        surname: true,
        username: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    // Combine and format
    const users = [
      ...students.map((s) => ({ ...s, type: "STUDENT" as const })),
      ...teachers.map((t) => ({ ...t, type: "TEACHER" as const })),
      ...parents.map((p) => ({ ...p, type: "PARENT" as const })),
    ];

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

