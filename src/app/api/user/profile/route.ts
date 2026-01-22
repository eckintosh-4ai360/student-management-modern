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

    const userRole = (session.user as any)?.role || "student";
    const username = (session.user as any)?.username;

    let userData = null;
    let userType: "STUDENT" | "TEACHER" | "PARENT" | "ADMIN" = "STUDENT";

    if (userRole === "student") {
      const student = await prisma.student.findUnique({
        where: { username },
        select: {
          id: true,
          name: true,
          surname: true,
          email: true,
          phone: true,
          username: true,
          img: true,
        },
      });
      userData = student;
      userType = "STUDENT";
    } else if (userRole === "teacher") {
      const teacher = await prisma.teacher.findUnique({
        where: { username },
        select: {
          id: true,
          name: true,
          surname: true,
          email: true,
          phone: true,
          username: true,
          img: true,
        },
      });
      userData = teacher;
      userType = "TEACHER";
    } else if (userRole === "parent") {
      const parent = await prisma.parent.findUnique({
        where: { username },
        select: {
          id: true,
          name: true,
          surname: true,
          email: true,
          phone: true,
          username: true,
        },
      });
      userData = parent;
      userType = "PARENT";
    } else if (userRole === "admin") {
      const admin = await prisma.admin.findUnique({
        where: { username },
        select: {
          id: true,
          username: true,
          name: true,
          email: true,
          phone: true,
          img: true,
        },
      });
      if (admin) {
        userData = {
          ...admin,
          surname: "", // Admin only has 'name' in schema
        };
      }
      userType = "ADMIN";
    }

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...userData,
      userType,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

