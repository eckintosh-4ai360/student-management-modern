import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { AddLessonButton } from "@/components/forms/AddLessonButton";

export default async function LessonsPage() {
  const [lessons, subjects, classes, teachers] = await Promise.all([
    prisma.lesson.findMany({
      include: {
        subject: true,
        class: true,
        teacher: true,
      },
      orderBy: { day: "asc" },
      take: 100,
    }),
    prisma.subject.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.class.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.teacher.findMany({
      select: { id: true, name: true, surname: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const groupedByDay = lessons.reduce((acc, lesson) => {
    if (!acc[lesson.day]) {
      acc[lesson.day] = [];
    }
    acc[lesson.day].push(lesson);
    return acc;
  }, {} as Record<string, typeof lessons>);

  const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Lessons</h1>
          <p className="text-gray-500 mt-1">View all scheduled lessons</p>
        </div>
        <AddLessonButton subjects={subjects} classes={classes} teachers={teachers} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {days.map((day) => (
          <Card key={day}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{day}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {groupedByDay[day]?.map((lesson) => (
                <div key={lesson.id} className="p-3 bg-gray-50 rounded-lg text-sm">
                  <div className="font-semibold text-primary">{lesson.name}</div>
                  <div className="text-xs text-gray-600 mt-1">{lesson.subject.name}</div>
                  <div className="text-xs text-gray-600">{lesson.class.name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {format(new Date(lesson.startTime), "HH:mm")} - {format(new Date(lesson.endTime), "HH:mm")}
                  </div>
                </div>
              )) || (
                <div className="text-sm text-gray-400 text-center py-4">No lessons</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

