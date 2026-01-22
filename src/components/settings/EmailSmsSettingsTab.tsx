"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { updateSystemSettings } from "@/lib/actions";

interface EmailSmsSettingsTabProps {
  settings: any;
}

export function EmailSmsSettingsTab({ settings }: EmailSmsSettingsTabProps) {
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

      {/* Email Configuration */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2 text-blue-600">Email Configuration</h3>
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
              placeholder="Leave empty to keep current"
            />
          </div>
        </div>
      </div>

      {/* SMS Configuration */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2 text-blue-600">SMS Configuration</h3>
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
              placeholder="Leave empty to keep current"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smsSenderId">SMS Sender ID</Label>
            <Input
              id="smsSenderId"
              name="smsSenderId"
              defaultValue={settings.smsSenderId || ""}
              placeholder="SCH-MGT"
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
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending} size="lg" className="bg-blue-600 hover:bg-blue-700">
          {isPending ? "Updating..." : "Update Email & SMS"}
        </Button>
      </div>
    </form>
  );
}
