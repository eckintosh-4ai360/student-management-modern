"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { updateSystemSettings } from "@/lib/actions";

interface SettingsFormProps {
  settings: {
    id: number;
    schoolName: string;
    schoolShortName: string;
    schoolLogo: string | null;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    schoolEmail: string | null;
    schoolPhone: string | null;
    schoolAddress: string | null;
    schoolWebsite: string | null;
    emailHost: string | null;
    emailPort: number | null;
    emailUser: string | null;
    emailPassword: string | null;
    smsApiKey: string | null;
    smsApiSecret: string | null;
    smsSenderId: string | null;
    academicYear: string;
    currency: string;
    timezone: string;
    dateFormat: string;
  };
}

export function SettingsForm({ settings }: SettingsFormProps) {
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

      {/* School Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">School Information</h3>
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
              Enter the URL or path to your school logo image (e.g., /img/logo.png)
            </p>
            {settings.schoolLogo && (
              <div className="mt-2">
                <p className="text-xs text-gray-600 mb-1">Current Logo:</p>
                <img 
                  src={settings.schoolLogo} 
                  alt="School Logo Preview" 
                  className="w-16 h-16 object-contain border rounded p-2"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
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
            <Label htmlFor="academicYear">Academic Year</Label>
            <Input
              id="academicYear"
              name="academicYear"
              defaultValue={settings.academicYear}
            />
          </div>
        </div>
      </div>

      {/* Branding Colors */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Branding Colors</h3>
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
                onChange={(e) => {
                  const colorInput = document.getElementById("primaryColor") as HTMLInputElement;
                  if (colorInput) colorInput.value = e.target.value;
                }}
                className="flex-1"
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
                onChange={(e) => {
                  const colorInput = document.getElementById("secondaryColor") as HTMLInputElement;
                  if (colorInput) colorInput.value = e.target.value;
                }}
                className="flex-1"
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
                onChange={(e) => {
                  const colorInput = document.getElementById("accentColor") as HTMLInputElement;
                  if (colorInput) colorInput.value = e.target.value;
                }}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Email Configuration */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Email Configuration</h3>
        <p className="text-sm text-gray-600">Configure SMTP settings for sending emails</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="emailHost">SMTP Host</Label>
            <Input
              id="emailHost"
              name="emailHost"
              defaultValue={settings.emailHost || ""}
              placeholder="smtp.gmail.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emailPort">SMTP Port</Label>
            <Input
              id="emailPort"
              name="emailPort"
              type="number"
              defaultValue={settings.emailPort || ""}
              placeholder="587"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emailUser">Email Username</Label>
            <Input
              id="emailUser"
              name="emailUser"
              type="email"
              defaultValue={settings.emailUser || ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emailPassword">Email Password</Label>
            <Input
              id="emailPassword"
              name="emailPassword"
              type="password"
              defaultValue={settings.emailPassword || ""}
              placeholder="Leave empty to keep current"
            />
          </div>
        </div>
      </div>

      {/* SMS Configuration */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">SMS Configuration (Optional)</h3>
        <p className="text-sm text-gray-600">Configure SMS API for sending text messages</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="smsApiKey">SMS API Key</Label>
            <Input
              id="smsApiKey"
              name="smsApiKey"
              defaultValue={settings.smsApiKey || ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smsApiSecret">SMS API Secret</Label>
            <Input
              id="smsApiSecret"
              name="smsApiSecret"
              type="password"
              defaultValue={settings.smsApiSecret || ""}
              placeholder="Leave empty to keep current"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smsSenderId">SMS Sender ID</Label>
            <Input
              id="smsSenderId"
              name="smsSenderId"
              defaultValue={settings.smsSenderId || ""}
            />
          </div>
        </div>
      </div>

      {/* System Preferences */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">System Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Input
              id="currency"
              name="currency"
              defaultValue={settings.currency}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Input
              id="timezone"
              name="timezone"
              defaultValue={settings.timezone}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateFormat">Date Format</Label>
            <Input
              id="dateFormat"
              name="dateFormat"
              defaultValue={settings.dateFormat}
            />
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
        <Button type="submit" disabled={isPending} size="lg">
          {isPending ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </form>
  );
}

