"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { updateSystemSettings } from "@/lib/actions";

interface GeneralSettingsTabProps {
  settings: any;
}

export function GeneralSettingsTab({ settings }: GeneralSettingsTabProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await updateSystemSettings(formData);
      if (result.success) {
        setMessage(result.message || "Settings updated successfully!");
        toast.success("Settings updated!");
        window.dispatchEvent(new CustomEvent("settings-updated"));
        router.refresh();
      } else {
        setMessage(result.message || "Failed to update settings");
        toast.error(result.message || "Failed to update settings");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <input type="hidden" name="id" value={settings.id} />

      {/* Term/Semester Setup */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2 text-blue-600">Term/Semester Setup</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="currentTerm">Term (Semester)</Label>
            <Input
              id="currentTerm"
              name="currentTerm"
              defaultValue={settings.currentTerm}
              placeholder="First Term"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="academicYear">Academic Year</Label>
            <Input
              id="academicYear"
              name="academicYear"
              defaultValue={settings.academicYear}
              placeholder="2025/2026"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vacationDate">Vacation Date</Label>
            <Input
              id="vacationDate"
              name="vacationDate"
              type="date"
              defaultValue={settings.vacationDate ? new Date(settings.vacationDate).toISOString().split('T')[0] : ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reopeningDate">Reopening Date</Label>
            <Input
              id="reopeningDate"
              name="reopeningDate"
              type="date"
              defaultValue={settings.reopeningDate ? new Date(settings.reopeningDate).toISOString().split('T')[0] : ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="totalAttendanceDays">Total Attendance</Label>
            <Input
              id="totalAttendanceDays"
              name="totalAttendanceDays"
              type="number"
              defaultValue={settings.totalAttendanceDays}
              placeholder="68"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="studentIdInitials">Student ID Initials</Label>
            <Input
              id="studentIdInitials"
              name="studentIdInitials"
              defaultValue={settings.studentIdInitials}
              placeholder="CTS"
              maxLength={10}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Input
              id="timezone"
              name="timezone"
              defaultValue={settings.timezone}
              placeholder="UTC"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateFormat">Date Format</Label>
            <Input
              id="dateFormat"
              name="dateFormat"
              defaultValue={settings.dateFormat}
              placeholder="dd/MM/yyyy"
            />
          </div>
        </div>
      </div>

      {/* School Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2 text-blue-600">School Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="schoolName">School Name *</Label>
            <Input
              id="schoolName"
              name="schoolName"
              defaultValue={settings.schoolName}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="schoolShortName">Short Name *</Label>
            <Input
              id="schoolShortName"
              name="schoolShortName"
              defaultValue={settings.schoolShortName}
              required
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="schoolLogo">School Logo URL</Label>
            <Input
              id="schoolLogo"
              name="schoolLogo"
              type="url"
              defaultValue={settings.schoolLogo || ""}
              placeholder="/img/ECKINTOSH LOGO.png"
            />
            <p className="text-xs text-gray-500">
              Enter the URL or path to your school logo image
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="schoolEmail">School Email</Label>
            <Input
              id="schoolEmail"
              name="schoolEmail"
              type="email"
              defaultValue={settings.schoolEmail || ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="schoolPhone">School Phone</Label>
            <Input
              id="schoolPhone"
              name="schoolPhone"
              defaultValue={settings.schoolPhone || ""}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="schoolAddress">School Address</Label>
            <Input
              id="schoolAddress"
              name="schoolAddress"
              defaultValue={settings.schoolAddress || ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="schoolWebsite">School Website</Label>
            <Input
              id="schoolWebsite"
              name="schoolWebsite"
              type="url"
              defaultValue={settings.schoolWebsite || ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Input
              id="currency"
              name="currency"
              defaultValue={settings.currency}
            />
          </div>
        </div>
      </div>

      {/* Branding Colors */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2 text-blue-600">Branding Colors</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="primaryColor">Primary Color</Label>
            <div className="flex gap-2">
              <Input
                id="primaryColor"
                name="primaryColor"
                type="color"
                defaultValue={settings.primaryColor}
                className="w-20 h-10"
              />
              <Input
                type="text"
                defaultValue={settings.primaryColor}
                className="flex-1"
                readOnly
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="secondaryColor">Secondary Color</Label>
            <div className="flex gap-2">
              <Input
                id="secondaryColor"
                name="secondaryColor"
                type="color"
                defaultValue={settings.secondaryColor}
                className="w-20 h-10"
              />
              <Input
                type="text"
                defaultValue={settings.secondaryColor}
                className="flex-1"
                readOnly
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="accentColor">Accent Color</Label>
            <div className="flex gap-2">
              <Input
                id="accentColor"
                name="accentColor"
                type="color"
                defaultValue={settings.accentColor}
                className="w-20 h-10"
              />
              <Input
                type="text"
                defaultValue={settings.accentColor}
                className="flex-1"
                readOnly
              />
            </div>
          </div>
        </div>
      </div>

      {message && (
        <div
          className={`p-3 rounded ${
            message.includes("success")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending} size="lg" className="bg-blue-600 hover:bg-blue-700">
          {isPending ? "Updating..." : "Update Settings"}
        </Button>
      </div>
    </form>
  );
}
