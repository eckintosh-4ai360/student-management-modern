import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

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

