import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, GraduationCap, BookOpen, Calendar, DollarSign, AlertCircle, 
  TrendingUp, CheckCircle, XCircle, Award, MessageSquare, FileText,
  Activity, BarChart3, UserCheck, Clock,
  Banknote
} from "lucide-react";
import prisma from "@/lib/prisma";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, subDays } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { getSystemSettings } from "@/lib/settings";
import EnrollmentChart from "@/components/EnrollmentChart";
import { RefreshButton } from "@/components/RefreshButton";

export default async function DashboardPage() {
  let session;
  
  try {
    session = await getServerSession(authOptions);
  } catch (error: any) {
    console.error("Session error:", error);
    if (error?.message?.includes("decryption") || 
        error?.message?.includes("JWT") || 
        error?.code === "ERR_JWE_DECRYPTION_FAILED" ||
        error?.name === "JWEDecryptionFailed") {
      console.log("JWT decryption error - redirecting to clear-session");
      redirect("/clear-session");
    }
    redirect("/login");
  }

  if (!session || !session.user) {
    redirect("/login");
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

  // Calculate attendance statistics for display on stat cards
  const totalAttendances = studentsData.reduce((sum, s) => sum + s.attendances.length, 0);
  const presentCount = studentsData.reduce(
    (sum, s) => sum + s.attendances.filter((a) => a.present).length,
    0
  );
  const attendanceRate = totalAttendances > 0 ? (presentCount / totalAttendances) * 100 : 0;

  // Gender distribution
  const maleCount = studentsData.filter((s) => s.sex === "MALE").length;
  const femaleCount = studentsData.filter((s) => s.sex === "FEMALE").length;

  // Fetch student fees if user is a student
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

  // Admin/Teacher Dashboard
  if (userRole === "admin" || userRole === "teacher") {
    return (
      <div className="space-y-6">
        {/* Welcome Header */}
        <div 
          className="text-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl"
          style={{
            background: `linear-gradient(to right, ${systemSettings.primaryColor}, ${systemSettings.secondaryColor})`
          }}
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">
                Hello {session?.user?.name}
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-blue-100 mb-2">
                You are logged in as a {userRole === "admin" ? "Administrator" : "Teacher"}
              </p>
              <p className="text-blue-100 text-sm sm:text-base md:text-lg mb-3 sm:mb-4">
                Here's what's happening in your school today.
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full flex items-center text-xs sm:text-sm">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  <span className="whitespace-nowrap">{format(new Date(), "MMM dd, yyyy")}</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full flex items-center text-xs sm:text-sm">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  <span className="whitespace-nowrap">Academic Year {systemSettings.academicYear}</span>
                </div>
              </div>
            </div>
            <RefreshButton />
          </div>
        </div>

        {/* Main Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/dashboard/students">
            <Card className="border-l-4 border-l-blue-500 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Students
              </CardTitle>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-blue-600">{totalStudents}</div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                Active enrollments
              </p>
            </CardContent>
          </Card>
          </Link>

          <Link href="/dashboard/teachers">
            <Card className="border-l-4 border-l-green-500 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Staff
              </CardTitle>
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-600">{totalTeachers}</div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center">
                <UserCheck className="w-3 h-3 mr-1 text-green-500" />
                Teaching staff
              </p>
            </CardContent>
          </Card>
          </Link>

          <Link href="/dashboard/parents">
            <Card className="border-l-4 border-l-purple-500 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Parents
              </CardTitle>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-purple-600">{totalParents}</div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center">
                <Users className="w-3 h-3 mr-1 text-purple-500" />
                Registered parents
              </p>
            </CardContent>
          </Card>
          </Link>

          <Link href="/dashboard/attendance">
            <Card className="border-l-4 border-l-orange-500 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Attendance This Week
              </CardTitle>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-xl shadow-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-orange-600">{attendanceRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                Present this week
              </p>
            </CardContent>
          </Card>
          </Link>
        </div>

        {/* Charts and Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Students by Gender Chart */}
          <Card className="hover:shadow-xl transition-shadow">
            <CardHeader className="bg-muted/10 border-b">
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                Students by Gender
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center justify-center h-64">
                <div className="relative w-64 h-64">
                  <svg viewBox="0 0 100 100" className="transform -rotate-90">
                    {/* Female segment */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#ec4899"
                      strokeWidth="20"
                      strokeDasharray={`${(femaleCount / totalStudents) * 251.2} 251.2`}
                      strokeDashoffset="0"
                    />
                    {/* Male segment */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="20"
                      strokeDasharray={`${(maleCount / totalStudents) * 251.2} 251.2`}
                      strokeDashoffset={`-${(femaleCount / totalStudents) * 251.2}`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{totalStudents}</div>
                      <div className="text-sm text-muted-foreground">Total</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="flex items-center justify-center p-4 bg-primary/10 rounded-lg">
                  <div className="w-4 h-4 bg-muted/300 rounded-full mr-2"></div>
                  <div>
                    <p className="text-sm font-semibold">Male</p>
                    <p className="text-2xl font-bold text-blue-600">{maleCount}</p>
                  </div>
                </div>
                <div className="flex items-center justify-center p-4 bg-accent/10 rounded-lg">
                  <div className="w-4 h-4 bg-muted/300 rounded-full mr-2"></div>
                  <div>
                    <p className="text-sm font-semibold">Female</p>
                    <p className="text-2xl font-bold text-pink-600">{femaleCount}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Class Enrollment Chart */}
          <Card className="hover:shadow-xl transition-shadow">
            <CardHeader className="bg-muted/10 border-b">
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
                Enrollment Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div style={{ height: '300px' }}>
                <EnrollmentChart classes={classesEnrollment} />
              </div>
              <div className="mt-6 pt-4 border-t">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/20 p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground font-medium">Total Classes</p>
                    <p className="text-2xl font-bold text-purple-600 mt-1">{classesEnrollment.length}</p>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground font-medium">Total Enrolled</p>
                    <p className="text-2xl font-bold text-indigo-600 mt-1">{totalStudents}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notice Board and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Announcements */}
          <Card className="hover:shadow-xl transition-shadow">
            <CardHeader className="bg-muted/10 border-b">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-yellow-600" />
                  Notice Board
                </span>
                <Link href="/dashboard/announcements">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {recentAnnouncements.slice(0, 4).map((announcement) => (
                  <div
                    key={announcement.id}
                    className="p-4 rounded-lg bg-muted/20 border border-border hover:bg-muted/30 transition-all shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-lg">{announcement.title}</h4>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(announcement.date), "MMM dd")}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{announcement.description}</p>
                    {announcement.class && (
                      <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        {announcement.class.name}
                      </span>
                    )}
                  </div>
                ))}
                {recentAnnouncements.length === 0 && (
                  <p className="text-muted-foreground text-center py-8">No announcements yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="hover:shadow-xl transition-shadow">
            <CardHeader className="bg-muted/10 border-b">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-purple-600" />
                  Upcoming Events
                </span>
                <Link href="/dashboard/events">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {recentEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-4 rounded-lg bg-muted/30 border border-border hover:bg-muted/40 transition-all shadow-sm"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex flex-col items-center justify-center text-white">
                        <span className="text-2xl font-bold">
                          {format(new Date(event.startTime), "dd")}
                        </span>
                        <span className="text-xs">
                          {format(new Date(event.startTime), "MMM")}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{event.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{event.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(event.startTime), "h:mm a")} -{" "}
                            {format(new Date(event.endTime), "h:mm a")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {recentEvents.length === 0 && (
                  <p className="text-muted-foreground text-center py-8">No upcoming events</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Add Section */}
        <Card className="bg-muted/20 border-2 border-dashed border-border hover:shadow-xl transition-shadow">
          <CardContent className="pt-6">
            <h3 className="text-xl font-bold mb-6 text-center">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <Link href="/dashboard/students">
                <Button variant="outline" className="h-24 w-full flex flex-col items-center justify-center hover:bg-muted/50 hover:border-blue-300 transition-all">
                  <GraduationCap className="w-8 h-8 mb-2 text-blue-600" />
                  <span className="text-sm font-medium">Add Student</span>
                </Button>
              </Link>
              <Link href="/dashboard/teachers">
                <Button variant="outline" className="h-24 w-full flex flex-col items-center justify-center hover:bg-muted/50 hover:border-green-300 transition-all">
                  <Users className="w-8 h-8 mb-2 text-green-600" />
                  <span className="text-sm font-medium">Add Teacher</span>
                </Button>
              </Link>
              <Link href="/dashboard/classes">
                <Button variant="outline" className="h-24 w-full flex flex-col items-center justify-center hover:bg-muted/50 hover:border-purple-300 transition-all">
                  <BookOpen className="w-8 h-8 mb-2 text-purple-600" />
                  <span className="text-sm font-medium">Add Class</span>
                </Button>
              </Link>
              <Link href="/dashboard/events">
                <Button variant="outline" className="h-24 w-full flex flex-col items-center justify-center hover:bg-muted/50 hover:border-orange-300 transition-all">
                  <Calendar className="w-8 h-8 mb-2 text-orange-600" />
                  <span className="text-sm font-medium">Add Event</span>
                </Button>
              </Link>
              <Link href="/dashboard/announcements">
                <Button variant="outline" className="h-24 w-full flex flex-col items-center justify-center hover:bg-muted/50 hover:border-yellow-300 transition-all">
                  <MessageSquare className="w-8 h-8 mb-2 text-yellow-600" />
                  <span className="text-sm font-medium">Add Notice</span>
                </Button>
              </Link>
              <Link href="/dashboard/fees">
                <Button variant="outline" className="h-24 w-full flex flex-col items-center justify-center hover:bg-muted/50 hover:border-pink-300 transition-all">
                  <Banknote className="w-8 h-8 mb-2 text-pink-600" />
                  <span className="text-sm font-medium">Add Fee</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Student Dashboard
  if (userRole === "student" && studentData) {
    const feeStats = studentFees ? {
      total: studentFees.reduce((sum, fee) => sum + fee.amount, 0),
      pending: studentFees.filter(f => f.status === "PENDING").length,
      overdue: studentFees.filter(f => f.status === "OVERDUE").length,
    } : null;

    const studentAttendanceRate = studentData.attendances.length > 0
      ? (studentData.attendances.filter(a => a.present).length / studentData.attendances.length) * 100
      : 0;

    const averageScore = studentData.results.length > 0
      ? studentData.results.reduce((sum, r) => sum + r.score, 0) / studentData.results.length
      : 0;

    return (
      <div className="space-y-6">
        {/* Student Welcome Header */}
        <div 
          className="text-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl"
          style={{
            background: `linear-gradient(to right, ${systemSettings.primaryColor}, ${systemSettings.secondaryColor})`
          }}
        >
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
            Welcome back, {session?.user?.name}!
          </h1>
          <p className="text-blue-100 text-sm sm:text-base md:text-lg mb-3 sm:mb-4">
            Grade {studentData.grade.level} • {studentData.class.name}
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full flex items-center text-xs sm:text-sm">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
              <span className="whitespace-nowrap">{format(new Date(), "MMM dd, yyyy")}</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full flex items-center text-xs sm:text-sm">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
              <span className="whitespace-nowrap">Academic Year {systemSettings.academicYear}</span>
            </div>
          </div>
        </div>

        {/* Student Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-green-500 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                Attendance Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-600">{studentAttendanceRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground mt-1">{studentData.attendances.filter(a => a.present).length} of {studentData.attendances.length}</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-blue-500" />
                Average Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-blue-600">{averageScore.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground mt-1">{studentData.results.length} assessments</p>
            </CardContent>
          </Card>

          <Link href="/dashboard/fees?status=PENDING" className="block">
            <Card className="border-l-4 border-l-orange-500 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2 text-orange-500" />
                  Pending Payments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-orange-600">{feeStats?.pending} Bills</div>
                <p className="text-xs text-muted-foreground mt-1">${(feeStats?.total || 0).toFixed(2)} total</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/fees?status=OVERDUE" className="block">
            <Card className="border-l-4 border-l-red-500 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2 text-red-500" />
                  Overdue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-red-600">{feeStats?.overdue} Bills</div>
                <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Fees */}
          {studentFees && studentFees.length > 0 && (
            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader className="bg-muted/10 border-b">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Banknote className="w-5 h-5 mr-2 text-orange-600" />
                    My Fees & Bills
                  </span>
                  <Link href="/dashboard/fees">
                    <Button variant="outline" size="sm">View All</Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {studentFees.map((fee) => (
                    <div
                      key={fee.id}
                      className={`p-4 rounded-lg border ${
                        fee.status === "PAID"
                          ? "bg-green-50 border-green-200"
                          : fee.status === "OVERDUE"
                          ? "bg-red-50 border-red-200"
                          : "bg-muted/30 border-orange-200"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{fee.title}</p>
                          <p className="text-sm text-muted-foreground">
                            Due: {format(new Date(fee.dueDate), "MMM dd, yyyy")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">GH₵{fee.amount.toFixed(2)}</p>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              fee.status === "PAID"
                                ? "bg-green-100 text-green-700"
                                : fee.status === "OVERDUE"
                                ? "bg-red-100 text-red-700"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {fee.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Grades */}
          <Card className="hover:shadow-xl transition-shadow">
            <CardHeader className="bg-muted/10 border-b">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Award className="w-5 h-5 mr-2 text-purple-600" />
                  Recent Grades
                </span>
                <Link href="/dashboard/results">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {studentData.results.map((result) => {
                  const subjectName = result.exam?.lesson.subject.name || result.assignment?.lesson.subject.name;
                  const title = result.exam?.title || result.assignment?.title;
                  const scoreColor = result.score >= 80 ? "text-green-600" : result.score >= 60 ? "text-blue-600" : "text-red-600";
                  
                  return (
                    <div
                      key={result.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border"
                    >
                      <div>
                        <p className="font-semibold">{title}</p>
                        <p className="text-sm text-muted-foreground">{subjectName}</p>
                      </div>
                      <div className={`text-2xl font-bold ${scoreColor}`}>
                        {result.score}%
                      </div>
                    </div>
                  );
                })}
                {studentData.results.length === 0 && (
                  <p className="text-muted-foreground text-center py-8">No grades yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="hover:shadow-xl transition-shadow lg:col-span-2">
            <CardHeader className="bg-muted/10 border-b">
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentEvents.slice(0, 4).map((event) => (
                  <div
                    key={event.id}
                    className="p-4 rounded-lg bg-muted/20 border border-border"
                  >
                    <div className="flex items-start space-x-3">
                      <Calendar className="w-5 h-5 text-blue-500 mt-1" />
                      <div>
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {format(new Date(event.startTime), "MMM dd, h:mm a")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {recentEvents.length === 0 && (
                  <p className="text-muted-foreground text-center py-8 col-span-2">No upcoming events</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Default fallback
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome back, {session?.user?.name}!</h1>
      <p className="text-muted-foreground">Your dashboard is loading...</p>
    </div>
  );
}
