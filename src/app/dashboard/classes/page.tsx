import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AddClassButton } from "@/components/forms/AddClassButton";
import { SearchBar } from "@/components/ui/search-bar";
import { FilterSelect } from "@/components/ui/filter-select";
import { ClassActions } from "@/components/tables/ClassActions";

export default async function ClassesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; gradeId?: string }>;
}) {
  const params = await searchParams;
  const search = params.search || "";
  const gradeId = params.gradeId || "";

  const where: any = {};

  if (search) {
    where.name = { contains: search };
  }

  if (gradeId) {
    where.gradeId = parseInt(gradeId);
  }

  const [classes, grades, teachers] = await Promise.all([
    prisma.class.findMany({
      where,
      include: {
        grade: true,
        supervisor: true,
        _count: {
          select: {
            students: true,
            lessons: true,
          },
        },
      },
      orderBy: { name: "asc" },
    }),
    prisma.grade.findMany({
      select: { id: true, level: true },
      orderBy: { level: "asc" },
    }),
    prisma.teacher.findMany({
      select: { id: true, name: true, surname: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Classes</h1>
          <p className="text-gray-500 mt-1">Manage all classes in the system</p>
        </div>
        <AddClassButton grades={grades} teachers={teachers} />
      </div>

      <div className="flex items-center gap-4">
        <SearchBar placeholder="Search classes by name..." />
        <FilterSelect
          options={grades.map((g) => ({ label: `Grade ${g.level}`, value: g.id.toString() }))}
          paramName="gradeId"
          placeholder="All Grades"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((classItem) => (
          <Card key={classItem.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{classItem.name}</span>
                <span className="text-sm font-normal text-gray-500">
                  Grade {classItem.grade.level}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Students:</span>
                <span className="font-medium">
                  {classItem._count.students}/{classItem.capacity}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Lessons:</span>
                <span className="font-medium">{classItem._count.lessons}</span>
              </div>
              {classItem.supervisor && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Supervisor:</span>
                  <span className="font-medium">
                    {classItem.supervisor.name} {classItem.supervisor.surname}
                  </span>
                </div>
              )}
              <div className="pt-3 flex gap-2">
                <Link href={`/dashboard/classes/${classItem.id}`} className="flex-1">
                  <Button variant="outline" className="w-full" size="sm">
                    View Details
                  </Button>
                </Link>
                <ClassActions classData={classItem} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

