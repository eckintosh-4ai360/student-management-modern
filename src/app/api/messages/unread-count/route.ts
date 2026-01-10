import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ count: 0 });
    }

    const userRole = (session.user as any)?.role || "student";
    const username = (session.user as any)?.username;

    // Get user ID and type based on role
    let userId: string | null = null;
    let userType: "STUDENT" | "TEACHER" | "PARENT" | "ADMIN" = "STUDENT";

    if (userRole === "student") {
      const student = await prisma.student.findUnique({
        where: { username },
        select: { id: true },
      });
      userId = student?.id || null;
      userType = "STUDENT";
    } else if (userRole === "teacher") {
      const teacher = await prisma.teacher.findUnique({
        where: { username },
        select: { id: true },
      });
      userId = teacher?.id || null;
      userType = "TEACHER";
    } else if (userRole === "parent") {
      const parent = await prisma.parent.findUnique({
        where: { username },
        select: { id: true },
      });
      userId = parent?.id || null;
      userType = "PARENT";
    } else if (userRole === "admin") {
      const admin = await prisma.admin.findUnique({
        where: { username },
        select: { id: true },
      });
      userId = admin?.id || null;
      userType = "ADMIN";
    }

    if (!userId) {
      return NextResponse.json({ count: 0 });
    }

    // Count unread messages
    const count = await prisma.message.count({
      where: {
        receiverId: userId,
        receiverType: userType,
        read: false,
      },
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error fetching unread count:", error);
    return NextResponse.json({ count: 0 });
  }
}

