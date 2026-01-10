import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { emailOrUsername } = await request.json();

    if (!emailOrUsername) {
      return NextResponse.json(
        { error: "Email or username is required" },
        { status: 400 }
      );
    }

    // Try to find user in all tables
    let user: any = null;
    let userType: string = "";
    let name: string = "";

    // Check Admin
    const admin = await prisma.admin.findFirst({
      where: {
        OR: [
          { email: emailOrUsername },
          { username: emailOrUsername },
          { staffId: emailOrUsername },
        ],
      },
    });

    if (admin) {
      user = admin;
      userType = "admin";
      name = admin.name;
    }

    // Check Teacher
    if (!user) {
      const teacher = await prisma.teacher.findFirst({
        where: {
          OR: [
            { email: emailOrUsername },
            { username: emailOrUsername },
            { staffId: emailOrUsername },
          ],
        },
      });

      if (teacher) {
        user = teacher;
        userType = "teacher";
        name = `${teacher.name} ${teacher.surname}`;
      }
    }

    // Check Student
    if (!user) {
      const student = await prisma.student.findFirst({
        where: {
          OR: [
            { email: emailOrUsername },
            { username: emailOrUsername },
            { studentId: emailOrUsername },
          ],
        },
      });

      if (student) {
        user = student;
        userType = "student";
        name = `${student.name} ${student.surname}`;
      }
    }

    // Check Parent
    if (!user) {
      const parent = await prisma.parent.findFirst({
        where: {
          OR: [
            { email: emailOrUsername },
            { username: emailOrUsername },
          ],
        },
      });

      if (parent) {
        user = parent;
        userType = "parent";
        name = `${parent.name} ${parent.surname}`;
      }
    }

    if (!user || !user.email) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({
        message: "If an account with that email exists, a password reset link has been sent.",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Update user with reset token
    switch (userType) {
      case "admin":
        await prisma.admin.update({
          where: { id: user.id },
          data: { resetToken, resetTokenExpiry },
        });
        break;
      case "teacher":
        await prisma.teacher.update({
          where: { id: user.id },
          data: { resetToken, resetTokenExpiry },
        });
        break;
      case "student":
        await prisma.student.update({
          where: { id: user.id },
          data: { resetToken, resetTokenExpiry },
        });
        break;
      case "parent":
        await prisma.parent.update({
          where: { id: user.id },
          data: { resetToken, resetTokenExpiry },
        });
        break;
    }

    // Send email
    await sendPasswordResetEmail(user.email, name, resetToken);

    return NextResponse.json({
      message: "If an account with that email exists, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}

