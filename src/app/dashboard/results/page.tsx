import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ResultsPage() {
  const results = await prisma.result.findMany({
    include: {
      student: {
        include: {
          class: true,
        },
      },
      exam: {
        include: {
          lesson: {
            include: {
              subject: true,
            },
          },
        },
      },
      assignment: {
        include: {
          lesson: {
            include: {
              subject: true,
            },
          },
        },
      },
    },
    orderBy: { id: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Results</h1>
        <p className="text-muted-foreground mt-1">View all exam and assignment results</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Results ({results.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Student</th>
                  <th className="text-left p-4 font-medium">Class</th>
                  <th className="text-left p-4 font-medium">Subject</th>
                  <th className="text-left p-4 font-medium">Type</th>
                  <th className="text-left p-4 font-medium">Title</th>
                  <th className="text-left p-4 font-medium">Score</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr key={result.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="p-4">
                      <div className="font-medium">
                        {result.student.name} {result.student.surname}
                      </div>
                    </td>
                    <td className="p-4 text-sm">{result.student.class.name}</td>
                    <td className="p-4 text-sm">
                      {result.exam?.lesson.subject.name || result.assignment?.lesson.subject.name}
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded ${
                        result.exam ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                      }`}>
                        {result.exam ? "Exam" : "Assignment"}
                      </span>
                    </td>
                    <td className="p-4 text-sm">
                      {result.exam?.title || result.assignment?.title}
                    </td>
                    <td className="p-4">
                      <span className={`font-semibold ${
                        result.score >= 90 ? "text-green-600" :
                        result.score >= 70 ? "text-blue-600" :
                        result.score >= 50 ? "text-yellow-600" :
                        "text-red-600"
                      }`}>
                        {result.score}/100
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

