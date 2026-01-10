import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AddTeacherButton } from "@/components/forms/AddTeacherButton";
import { SearchBar } from "@/components/ui/search-bar";
import { FilterSelect } from "@/components/ui/filter-select";
import { TeacherTableRow } from "@/components/tables/TeacherTableRow";

export default async function TeachersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; subjectId?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const pageSize = 10;
  const search = params.search || "";
  const subjectId = params.subjectId || "";

  const where: any = {};

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { surname: { contains: search } },
      { username: { contains: search } },
      { email: { contains: search } },
    ];
  }

  if (subjectId) {
    where.subjects = {
      some: {
        id: parseInt(subjectId),
      },
    };
  }

  const [teachers, total, subjects] = await Promise.all([
    prisma.teacher.findMany({
      where,
      include: {
        subjects: true,
        _count: {
          select: {
            lessons: true,
            classes: true,
          },
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.teacher.count({ where }),
    prisma.subject.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Teachers</h1>
          <p className="text-gray-500 mt-1">Manage all teachers in the system</p>
        </div>
        <AddTeacherButton subjects={subjects} />
      </div>

      <div className="flex items-center gap-4">
        <SearchBar placeholder="Search teachers by name, username, or email..." />
        <FilterSelect
          options={subjects.map((s) => ({ label: s.name, value: s.id.toString() }))}
          paramName="subjectId"
          placeholder="All Subjects"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Teachers ({total})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Teacher</th>
                  <th className="text-left p-4 font-medium">Subjects</th>
                  <th className="text-left p-4 font-medium">Classes</th>
                  <th className="text-left p-4 font-medium">Lessons</th>
                  <th className="text-left p-4 font-medium">Contact</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((teacher) => (
                  <TeacherTableRow 
                    key={teacher.id} 
                    teacher={{
                      ...teacher,
                      subjects: teacher.subjects.map(s => ({ id: s.id, name: s.name })),
                      _count: teacher._count,
                    }}
                    allSubjects={subjects}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </p>
              <div className="flex items-center space-x-2">
                {page > 1 && (
                  <Link href={`/dashboard/teachers?page=${page - 1}`}>
                    <Button variant="outline" size="sm">Previous</Button>
                  </Link>
                )}
                {page < totalPages && (
                  <Link href={`/dashboard/teachers?page=${page + 1}`}>
                    <Button variant="outline" size="sm">Next</Button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

