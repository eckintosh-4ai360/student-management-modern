import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Users, BookOpen, User } from "lucide-react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { EditClassModal } from "@/components/forms/EditClassModal";

export default async function ClassDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const classId = parseInt(id);

  if (isNaN(classId)) {
    notFound();
  }

  const classData = await prisma.class.findUnique({
    where: { id: classId },
    include: {
      grade: true,
      supervisor: true,
      students: {
        include: {
          parent: true,
        },
        orderBy: { name: "asc" },
      },
      lessons: {
        include: {
          subject: true,
          teacher: true,
        },
        orderBy: { day: "asc" },
      },
      _count: {
        select: {
          students: true,
          lessons: true,
          events: true,
          announcements: true,
        },
      },
    },
  });

  const [grades, teachers] = await Promise.all([
    prisma.grade.findMany({ select: { id: true, level: true } }),
    prisma.teacher.findMany({ select: { id: true, name: true, surname: true } }),
  ]);

  if (!classData) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/classes">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{classData.name}</h1>
            <p className="text-gray-500 mt-1">Grade {classData.grade.level} • Class Details</p>
          </div>
        </div>
        <EditClassModal 
          data={classData} 
          grades={grades} 
          teachers={teachers} 
        />
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Students</CardTitle>
            <Users className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {classData._count.students}/{classData.capacity}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {classData.capacity - classData._count.students} spots available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Lessons</CardTitle>
            <BookOpen className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classData._count.lessons}</div>
            <p className="text-xs text-gray-500 mt-1">Active lessons this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Events</CardTitle>
            <BookOpen className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classData._count.events}</div>
            <p className="text-xs text-gray-500 mt-1">Upcoming events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Announcements</CardTitle>
            <BookOpen className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classData._count.announcements}</div>
            <p className="text-xs text-gray-500 mt-1">Recent announcements</p>
          </CardContent>
        </Card>
      </div>

      {/* Supervisor Info */}
      {classData.supervisor && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Class Supervisor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white overflow-hidden">
                {classData.supervisor.img ? (
                  <Image
                    src={classData.supervisor.img}
                    alt={`${classData.supervisor.name} ${classData.supervisor.surname}`}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold">
                    {classData.supervisor.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <p className="font-semibold text-lg">
                  {classData.supervisor.name} {classData.supervisor.surname}
                </p>
                <p className="text-gray-500 text-sm">{classData.supervisor.email || "No email provided"}</p>
                <p className="text-gray-500 text-sm">{classData.supervisor.phone || "No phone provided"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Students List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Students ({classData.students.length})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Student</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Phone</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Parent</th>
                </tr>
              </thead>
              <tbody>
                {classData.students.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-500">
                      No students enrolled in this class yet
                    </td>
                  </tr>
                ) : (
                  classData.students.map((student) => (
                    <tr key={student.id} className="border-b hover:bg-muted/50 transition-colors transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white overflow-hidden">
                            {student.img ? (
                              <Image
                                src={student.img}
                                alt={`${student.name} ${student.surname}`}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-sm font-bold">
                                {student.name.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">
                              {student.name} {student.surname}
                            </p>
                            <p className="text-xs text-gray-500">{student.studentId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {student.email || "-"}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {student.phone || "-"}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {student.parent ? `${student.parent.name} ${student.parent.surname}` : "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Lessons Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Lessons Schedule ({classData.lessons.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Lesson</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Subject</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Teacher</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Day</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Time</th>
                </tr>
              </thead>
              <tbody>
                {classData.lessons.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">
                      No lessons scheduled for this class yet
                    </td>
                  </tr>
                ) : (
                  classData.lessons.map((lesson) => (
                    <tr key={lesson.id} className="border-b hover:bg-muted/50 transition-colors transition-colors">
                      <td className="py-3 px-4 font-medium">{lesson.name}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{lesson.subject.name}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {lesson.teacher.name} {lesson.teacher.surname}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {lesson.day.charAt(0) + lesson.day.slice(1).toLowerCase()}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(lesson.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - {new Date(lesson.endTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
