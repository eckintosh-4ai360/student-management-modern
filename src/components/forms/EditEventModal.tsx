"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { updateEvent } from "@/lib/actions";
import { eventSchema } from "@/lib/formValidationSchemas";

interface EditEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classes: { id: number; name: string }[];
  event: {
    id: number;
    title: string;
    description: string;
    startTime: Date;
    endTime: Date;
    classId: number | null;
  };
}

export function EditEventModal({ open, onOpenChange, classes, event }: EditEventModalProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string>("");
  const [startTime, setStartTime] = useState<Date | null>(new Date(event.startTime));
  const [endTime, setEndTime] = useState<Date | null>(new Date(event.endTime));

  useEffect(() => {
    if (open) {
      setStartTime(new Date(event.startTime));
      setEndTime(new Date(event.endTime));
      setErrors({});
      setMessage("");
    }
  }, [open, event]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setMessage("");

    const formData = new FormData(e.currentTarget);
    const classId = formData.get("classId") as string;
    
    const data = {
      id: event.id,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      startTime: startTime!,
      endTime: endTime!,
      classId: classId === "" ? undefined : parseInt(classId),
    };

    // Validate
    const validation = eventSchema.safeParse(data);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    startTransition(async () => {
      const result = await updateEvent({ success: false, error: false }, validation.data);
      if (result.success) {
        setMessage(result.message || "Event updated successfully!");
        setTimeout(() => {
          onOpenChange(false);
          router.refresh();
        }, 1000);
      } else {
        setMessage(result.message || "Failed to update event");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
          <DialogDescription>Update school event details</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input 
                id="title" 
                name="title" 
                defaultValue={event.title}
                placeholder="e.g., School Festival" 
                required 
              />
              {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea 
                id="description" 
                name="description" 
                placeholder="Event details..." 
                rows={3}
                defaultValue={event.description}
                required 
              />
              {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="startTime">Start Date & Time *</Label>
              <DatePicker
                id="startTime"
                name="startTime"
                selected={startTime}
                onChange={(date) => setStartTime(date)}
                placeholder="Select date and time"
                required
                dateFormat="MM/dd/yyyy HH:mm"
                showTimeSelect
                timeIntervals={15}
              />
              {errors.startTime && <p className="text-red-500 text-xs">{errors.startTime}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Date & Time *</Label>
              <DatePicker
                id="endTime"
                name="endTime"
                selected={endTime}
                onChange={(date) => setEndTime(date)}
                placeholder="Select date and time"
                required
                dateFormat="MM/dd/yyyy HH:mm"
                showTimeSelect
                timeIntervals={15}
              />
              {errors.endTime && <p className="text-red-500 text-xs">{errors.endTime}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="classId">Target Class (Optional)</Label>
              <Select id="classId" name="classId" defaultValue={event.classId?.toString() || ""}>
                <option value="">All Classes</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </Select>
              <p className="text-xs text-gray-500">Leave empty for school-wide event</p>
              {errors.classId && <p className="text-red-500 text-xs">{errors.classId}</p>}
            </div>
          </div>

          {message && (
            <div className={`p-3 rounded ${message.includes("success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {message}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Updating..." : "Update Event"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
