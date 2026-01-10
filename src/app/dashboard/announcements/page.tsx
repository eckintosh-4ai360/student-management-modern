import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar } from "lucide-react";
import { format } from "date-fns";
import { AddAnnouncementButton } from "@/components/forms/AddAnnouncementButton";
import { AnnouncementActions } from "@/components/tables/AnnouncementActions";
import { SearchBar } from "@/components/ui/search-bar";
import { FilterSelect } from "@/components/ui/filter-select";

export default async function AnnouncementsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; classId?: string }>;
}) {
  const params = await searchParams;
  const search = params.search || "";
  const classId = params.classId || "";

  const where: any = {};

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
    ];
  }

  if (classId) {
    where.classId = parseInt(classId);
  }

  const [announcements, classes] = await Promise.all([
    prisma.announcement.findMany({
      where,
      include: {
        class: true,
      },
      orderBy: { date: "desc" },
      take: 50,
    }),
    prisma.class.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Announcements</h1>
          <p className="text-gray-500 mt-1">View all school announcements</p>
        </div>
        <AddAnnouncementButton classes={classes} />
      </div>

      <div className="flex items-center gap-4">
        <SearchBar placeholder="Search announcements by title or description..." />
        <FilterSelect
          options={classes.map((c) => ({ label: c.name, value: c.id.toString() }))}
          paramName="classId"
          placeholder="All Classes"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {announcements.map((announcement) => (
          <Card key={announcement.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold">{announcement.title}</h3>
                    {announcement.class && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {announcement.class.name}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-3">{announcement.description}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    {format(new Date(announcement.date), "MMMM dd, yyyy")}
                  </div>
                </div>
                <AnnouncementActions announcement={announcement} classes={classes} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

