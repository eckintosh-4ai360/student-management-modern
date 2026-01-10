import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { AddAssignmentButton } from "@/components/forms/AddAssignmentButton";
import Link from "next/link";

export default async function AssignmentsPage() {
  const [assignments, lessons] = await Promise.all([
    prisma.assignment.findMany({
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
      orderBy: { dueDate: "desc" },
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
          <h1 className="text-3xl font-bold">Assignments</h1>
          <p className="text-gray-500 mt-1">Manage all assignments</p>
        </div>
        <AddAssignmentButton lessons={lessons} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Assignments</CardTitle>
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
                  <th className="text-left p-4 font-medium">Due Date</th>
                  <th className="text-left p-4 font-medium">Submissions</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((assignment) => (
                  <tr key={assignment.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">{assignment.title}</td>
                    <td className="p-4 text-sm">{assignment.lesson.subject.name}</td>
                    <td className="p-4 text-sm">{assignment.lesson.class.name}</td>
                    <td className="p-4 text-sm">
                      {assignment.lesson.teacher.name} {assignment.lesson.teacher.surname}
                    </td>
                    <td className="p-4 text-sm">
                      <div>{format(new Date(assignment.dueDate), "MMM dd, yyyy")}</div>
                      <div className={`text-xs ${
                        new Date(assignment.dueDate) < new Date()
                          ? "text-red-600"
                          : "text-gray-500"
                      }`}>
                        {new Date(assignment.dueDate) < new Date() ? "Overdue" : "Upcoming"}
                      </div>
                    </td>
                    <td className="p-4 text-sm">{assignment._count.results} submitted</td>
                    <td className="p-4">
                      <Link href={`/dashboard/assignments/${assignment.id}`}>
                        <Button variant="outline" size="sm">View</Button>
                      </Link>
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

