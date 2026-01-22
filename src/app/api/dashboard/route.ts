import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getSystemSettings } from "@/lib/settings";
import { subDays } from "date-fns";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session?.user as any)?.role || "student";
    const username = (session?.user as any)?.username;

    // Fetch system settings for colors
    const systemSettings = await getSystemSettings();

    // Fetch comprehensive statistics
    const [
      totalStudents,
      totalTeachers,
      totalParents,
      totalClasses,
      studentsData,
      recentEvents,
      recentAnnouncements,
      classesEnrollment,
    ] = await Promise.all([
      prisma.student.count(),
      prisma.teacher.count(),
      prisma.parent.count(),
      prisma.class.count(),
      prisma.student.findMany({
        include: {
          attendances: {
            where: {
              date: {
                gte: subDays(new Date(), 30),
              },
            },
          },
        },
      }),
      prisma.event.findMany({
        where: {
          startTime: {
            gte: new Date(),
          },
        },
        include: {
          class: true,
        },
        orderBy: {
          startTime: "asc",
        },
        take: 3,
      }),
      prisma.announcement.findMany({
        include: {
          class: true,
        },
        orderBy: {
          date: "desc",
        },
        take: 5,
      }),
      prisma.class.findMany({
        include: {
          students: true,
          grade: true,
        },
        orderBy: {
          name: "asc",
        },
      }),
    ]);

    // Calculate attendance statistics
    const totalAttendances = studentsData.reduce((sum, s) => sum + s.attendances.length, 0);
    const presentCount = studentsData.reduce(
      (sum, s) => sum + s.attendances.filter((a) => a.present).length,
      0
    );
    const attendanceRate = totalAttendances > 0 ? (presentCount / totalAttendances) * 100 : 0;

    // Gender distribution
    const maleCount = studentsData.filter((s) => s.sex === "MALE").length;
    const femaleCount = studentsData.filter((s) => s.sex === "FEMALE").length;

    // Fetch student data if user is a student
    let studentFees = null;
    let studentData = null;
    if (userRole === "student" && username) {
      studentData = await prisma.student.findUnique({
        where: { username },
        include: {
          fees: {
            orderBy: { dueDate: "asc" },
            take: 5,
          },
          attendances: {
            orderBy: { date: "desc" },
            take: 10,
          },
          results: {
            include: {
              exam: { include: { lesson: { include: { subject: true } } } },
              assignment: { include: { lesson: { include: { subject: true } } } },
            },
            orderBy: { id: "desc" },
            take: 5,
          },
          class: true,
          grade: true,
        },
      });
      studentFees = studentData?.fees || [];
    }

    return NextResponse.json({
      systemSettings,
      totalStudents,
      totalTeachers,
      totalParents,
      totalClasses,
      attendanceRate,
      maleCount,
      femaleCount,
      recentEvents,
      recentAnnouncements,
      classesEnrollment,
      studentData,
      studentFees,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
