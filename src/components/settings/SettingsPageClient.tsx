"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Users, ArrowRightLeft } from "lucide-react";
import { GeneralSettingsTab } from "./GeneralSettingsTab";
import { UserPermissionsTab } from "./UserPermissionsTab";
import { MigrateClassTab } from "./MigrateClassTab";
import { EmailSmsSettingsTab } from "./EmailSmsSettingsTab";
import { Mail } from "lucide-react";

interface SettingsPageClientProps {
  settings: any;
  admins: any[];
  teachers: any[];
  classes: any[];
}

export function SettingsPageClient({ settings, admins, teachers, classes }: SettingsPageClientProps) {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 lg:w-[800px]">
        <TabsTrigger value="general" className="flex items-center gap-2">
          <Settings className="w-4 h-4" />
          <span className="hidden sm:inline">General</span>
        </TabsTrigger>
        <TabsTrigger value="email-sms" className="flex items-center gap-2">
          <Mail className="w-4 h-4" />
          <span className="hidden sm:inline">Email & SMS</span>
        </TabsTrigger>
        <TabsTrigger value="permissions" className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span className="hidden sm:inline">User Permissions</span>
        </TabsTrigger>
        <TabsTrigger value="migrate" className="flex items-center gap-2">
          <ArrowRightLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Migrate Class</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>
              Configure school information, term/semester, and branding
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GeneralSettingsTab settings={settings} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="email-sms">
        <Card>
          <CardHeader>
            <CardTitle>Email & SMS Configuration</CardTitle>
            <CardDescription>
              Configure SMTP and SMS gateway for system notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EmailSmsSettingsTab settings={settings} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="permissions">
        <Card>
          <CardHeader>
            <CardTitle>User Permissions</CardTitle>
            <CardDescription>
              Manage role-based access controls for staff members
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserPermissionsTab admins={admins} teachers={teachers} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="migrate">
        <Card>
          <CardHeader>
            <CardTitle>Migrate Class</CardTitle>
            <CardDescription>
              Promote students to the next class at the end of term/semester
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MigrateClassTab classes={classes} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
