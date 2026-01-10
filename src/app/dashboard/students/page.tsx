import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AddStudentButton } from "@/components/forms/AddStudentButton";
import { SearchBar } from "@/components/ui/search-bar";
import { FilterSelect } from "@/components/ui/filter-select";
import { StudentTableRow } from "@/components/tables/StudentTableRow";

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; gradeId?: string; classId?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const pageSize = 10;
  const search = params.search || "";
  const gradeId = params.gradeId || "";
  const classId = params.classId || "";

  const where: any = {};

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { surname: { contains: search } },
      { username: { contains: search } },
      { email: { contains: search } },
    ];
  }

  if (gradeId) {
    where.gradeId = parseInt(gradeId);
  }

  if (classId) {
    where.classId = parseInt(classId);
  }

  const [students, total, parents, classes, grades] = await Promise.all([
    prisma.student.findMany({
      where,
      include: {
        class: true,
        grade: true,
        parent: true,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.student.count({ where }),
    prisma.parent.findMany({
      select: { id: true, name: true, surname: true },
      orderBy: { name: "asc" },
    }),
    prisma.class.findMany({
      select: { id: true, name: true, gradeId: true },
      orderBy: { name: "asc" },
    }),
    prisma.grade.findMany({
      select: { id: true, level: true },
      orderBy: { level: "asc" },
    }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Students</h1>
          <p className="text-gray-500 mt-1">Manage all students in the system</p>
        </div>
        <AddStudentButton parents={parents} classes={classes} grades={grades} />
      </div>

      <div className="flex items-center gap-4">
        <SearchBar placeholder="Search students by name, username, or email..." />
        <FilterSelect
          options={grades.map((g) => ({ label: `Grade ${g.level}`, value: g.id.toString() }))}
          paramName="gradeId"
          placeholder="All Grades"
        />
        <FilterSelect
          options={classes.map((c) => ({ label: c.name, value: c.id.toString() }))}
          paramName="classId"
          placeholder="All Classes"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Students ({total})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Student</th>
                  <th className="text-left p-4 font-medium">ID</th>
                  <th className="text-left p-4 font-medium">Class</th>
                  <th className="text-left p-4 font-medium">Grade</th>
                  <th className="text-left p-4 font-medium">Parent</th>
                  <th className="text-left p-4 font-medium">Contact</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <StudentTableRow 
                    key={student.id} 
                    student={student} 
                    grades={grades}
                    classes={classes}
                    parents={parents}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-600">
                Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, total)} of {total} students
              </p>
              <div className="flex items-center space-x-2">
                {page > 1 && (
                  <Link href={`/dashboard/students?page=${page - 1}`}>
                    <Button variant="outline" size="sm">Previous</Button>
                  </Link>
                )}
                <span className="text-sm">Page {page} of {totalPages}</span>
                {page < totalPages && (
                  <Link href={`/dashboard/students?page=${page + 1}`}>
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

