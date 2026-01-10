import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SettingsForm } from "@/components/forms/SettingsForm";
import { Settings as SettingsIcon } from "lucide-react";

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
        schoolShortName: "SMS",
      },
    });
  }

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

      <Card>
        <CardHeader>
          <CardTitle>School Information & Branding</CardTitle>
          <CardDescription>
            Customize your school's name, contact information, and branding colors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsForm settings={settings} />
        </CardContent>
      </Card>
    </div>
  );
}

