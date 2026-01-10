import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { AddExamButton } from "@/components/forms/AddExamButton";
import { ExamTableRow } from "@/components/tables/ExamTableRow";

export default async function ExamsPage() {
  const [exams, lessons] = await Promise.all([
    prisma.exam.findMany({
      include: {
        lesson: {
          include: {
            subject: true,
            class: true,
            teacher: true,
          },
        },
        _count: {
          select: {
            results: true,
          },
        },
      },
      orderBy: { startTime: "desc" },
      take: 50,
    }),
    prisma.lesson.findMany({
      include: {
        subject: true,
        class: true,
      },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Exams</h1>
          <p className="text-gray-500 mt-1">Manage all exams in the system</p>
        </div>
        <AddExamButton lessons={lessons} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Exams</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Title</th>
                  <th className="text-left p-4 font-medium">Subject</th>
                  <th className="text-left p-4 font-medium">Class</th>
                  <th className="text-left p-4 font-medium">Teacher</th>
                  <th className="text-left p-4 font-medium">Date & Time</th>
                  <th className="text-left p-4 font-medium">Results</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam) => (
                  <ExamTableRow key={exam.id} exam={exam} />
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

