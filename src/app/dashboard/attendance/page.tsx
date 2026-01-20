import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { CheckCircle } from "lucide-react";

export default async function AttendancePage() {
  const attendances = await prisma.attendance.findMany({
    include: {
      student: {
        include: {
          class: true,
        },
      },
      lesson: {
        include: {
          subject: true,
        },
      },
    },
    orderBy: { date: "desc" },
    take: 100,
  });

  const stats = {
    present: attendances.filter(a => a.present).length,
    absent: attendances.filter(a => !a.present).length,
    total: attendances.length,
  };

  const attendanceRate = ((stats.present / stats.total) * 100).toFixed(1);

  // Calculate attendance statistics for the week
  const thisWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const thisWeekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
  const daysOfWeek = eachDayOfInterval({ start: thisWeekStart, end: thisWeekEnd });

  const studentsData = await prisma.student.findMany({
    include: {
      attendances: {
        where: {
          date: {
            gte: thisWeekStart,
            lte: thisWeekEnd,
          },
        },
      },
    },
  });

  const weeklyAttendance = daysOfWeek.map((day) => {
    const dayAttendances = studentsData.flatMap((s) =>
      s.attendances.filter(
        (a) => format(new Date(a.date), "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
      )
    );
    const present = dayAttendances.filter((a) => a.present).length;
    const absent = dayAttendances.filter((a) => !a.present).length;
    return {
      day: format(day, "EEE"),
      present,
      absent,
      total: present + absent,
    };
  });

  const totalAttendances = studentsData.reduce((sum, s) => sum + s.attendances.length, 0);
  const presentCount = studentsData.reduce(
    (sum, s) => sum + s.attendances.filter((a) => a.present).length,
    0
  );
  const weeklyAttendanceRate = totalAttendances > 0 ? (presentCount / totalAttendances) * 100 : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Attendance</h1>
        <p className="text-gray-500 mt-1">Track student attendance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Total Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Present</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.present}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Attendance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{attendanceRate}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance This Week Chart */}
      <Card className="hover:shadow-xl transition-shadow">
        <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
              Attendance This Week
            </span>
            <span className="text-2xl font-bold text-green-600">{weeklyAttendanceRate.toFixed(0)}%</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {weeklyAttendance.map((day, idx) => {
              const presentPercent = day.total > 0 ? (day.present / day.total) * 100 : 0;
              return (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{day.day}</span>
                    <span className="text-sm text-gray-600">
                      {day.present} / {day.total}
                    </span>
                  </div>
                  <div className="relative h-8 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center transition-all duration-500"
                      style={{ width: `${presentPercent}%` }}
                    >
                      {presentPercent > 20 && (
                        <span className="text-xs font-semibold text-white">
                          {presentPercent.toFixed(0)}%
                        </span>
                      )}
                    </div>
                    {presentPercent < 100 && (
                      <div
                        className="absolute inset-y-0 right-0 bg-gradient-to-r from-gray-400 to-gray-600 flex items-center justify-center"
                        style={{ width: `${100 - presentPercent}%` }}
                      >
                        {100 - presentPercent > 20 && (
                          <span className="text-xs font-semibold text-white">
                            {(100 - presentPercent).toFixed(0)}%
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
              <span className="text-sm">Present</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-500 rounded mr-2"></div>
              <span className="text-sm">Absent</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Date</th>
                  <th className="text-left p-4 font-medium">Student</th>
                  <th className="text-left p-4 font-medium">Class</th>
                  <th className="text-left p-4 font-medium">Subject</th>
                  <th className="text-left p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendances.map((attendance) => (
                  <tr key={attendance.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 text-sm">
                      {format(new Date(attendance.date), "MMM dd, yyyy")}
                    </td>
                    <td className="p-4">
                      {attendance.student.name} {attendance.student.surname}
                    </td>
                    <td className="p-4 text-sm">{attendance.student.class.name}</td>
                    <td className="p-4 text-sm">{attendance.lesson.subject.name}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded font-medium ${
                        attendance.present
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {attendance.present ? "Present" : "Absent"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

