import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";


import { Settings as SettingsIcon } from "lucide-react";
import { SettingsPageClient } from "@/components/settings/SettingsPageClient";

export default async function SettingsPage() {
  // Check if user is super admin
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin" || session.user.adminRole !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  // Get current settings
  let settings = await prisma.systemSettings.findFirst();

  // If no settings exist, create default
  if (!settings) {
    settings = await prisma.systemSettings.create({
      data: {
        schoolName: "Student Management System",
        schoolShortName: "ECKINTOSH",
      },
    });
  }

  // Get all users for permissions tab
  const [admins, teachers] = await Promise.all([
    prisma.admin.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        staffId: true,
        role: true,
      },
    }),
    prisma.teacher.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        surname: true,
        staffId: true,
      },
    }),
  ]);

  // Get all classes for migration tab
  const classes = await prisma.class.findMany({
    include: {
      grade: true,
      students: {
        select: {
          id: true,
          name: true,
          surname: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <SettingsIcon className="w-8 h-8 text-blue-600" />
            System Settings
          </h1>
          <p className="text-gray-500 mt-1">Configure your school's information and system preferences</p>
        </div>
      </div>

      <SettingsPageClient settings={settings} admins={admins} teachers={teachers} classes={classes} />
    </div>
  );
}
