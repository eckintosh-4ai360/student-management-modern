import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Try to find user with this token in all tables
    let user: any = null;
    let userType: string = "";

    // Check Admin
    const admin = await prisma.admin.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gte: new Date(),
        },
      },
    });

    if (admin) {
      user = admin;
      userType = "admin";
    }

    // Check Teacher
    if (!user) {
      const teacher = await prisma.teacher.findFirst({
        where: {
          resetToken: token,
          resetTokenExpiry: {
            gte: new Date(),
          },
        },
      });

      if (teacher) {
        user = teacher;
        userType = "teacher";
      }
    }

    // Check Student
    if (!user) {
      const student = await prisma.student.findFirst({
        where: {
          resetToken: token,
          resetTokenExpiry: {
            gte: new Date(),
          },
        },
      });

      if (student) {
        user = student;
        userType = "student";
      }
    }

    // Check Parent
    if (!user) {
      const parent = await prisma.parent.findFirst({
        where: {
          resetToken: token,
          resetTokenExpiry: {
            gte: new Date(),
          },
        },
      });

      if (parent) {
        user = parent;
        userType = "parent";
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password and clear reset token
    switch (userType) {
      case "admin":
        await prisma.admin.update({
          where: { id: user.id },
          data: {
            password: hashedPassword,
            resetToken: null,
            resetTokenExpiry: null,
          },
        });
        break;
      case "teacher":
        await prisma.teacher.update({
          where: { id: user.id },
          data: {
            password: hashedPassword,
            resetToken: null,
            resetTokenExpiry: null,
          },
        });
        break;
      case "student":
        await prisma.student.update({
          where: { id: user.id },
          data: {
            password: hashedPassword,
            resetToken: null,
            resetTokenExpiry: null,
          },
        });
        break;
      case "parent":
        await prisma.parent.update({
          where: { id: user.id },
          data: {
            password: hashedPassword,
            resetToken: null,
            resetTokenExpiry: null,
          },
        });
        break;
    }

    return NextResponse.json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}

