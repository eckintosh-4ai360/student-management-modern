"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { createClass } from "@/lib/actions";
import { classSchema } from "@/lib/formValidationSchemas";

interface AddClassModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  grades: { id: number; level: number }[];
  teachers: { id: string; name: string; surname: string }[];
}

export function AddClassModal({ open, onOpenChange, grades, teachers }: AddClassModalProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setMessage("");

    const formData = new FormData(e.currentTarget);
    const supervisorId = formData.get("supervisorId") as string;
    
    const data = {
      name: formData.get("name") as string,
      capacity: parseInt(formData.get("capacity") as string),
      gradeId: parseInt(formData.get("gradeId") as string),
      supervisorId: supervisorId === "" ? undefined : supervisorId,
    };

    // Validate
    const validation = classSchema.safeParse(data);
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
      const result = await createClass({ success: false, error: false }, validation.data);
      if (result.success) {
        setMessage(result.message || "Class created successfully!");
        setTimeout(() => {
          onOpenChange(false);
          router.refresh();
        }, 1000);
      } else {
        setMessage(result.message || "Failed to create class");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Class</DialogTitle>
          <DialogDescription>Fill in the class information below</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Class Name *</Label>
              <Input id="name" name="name" placeholder="e.g., 1A, 2B" required />
              {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity *</Label>
              <Input id="capacity" name="capacity" type="number" min="1" required />
              {errors.capacity && <p className="text-red-500 text-xs">{errors.capacity}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gradeId">Grade *</Label>
              <Select id="gradeId" name="gradeId" required>
                <option value="">Select Grade</option>
                {grades.map((grade) => (
                  <option key={grade.id} value={grade.id}>
                    Grade {grade.level}
                  </option>
                ))}
              </Select>
              {errors.gradeId && <p className="text-red-500 text-xs">{errors.gradeId}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="supervisorId">Supervisor (Optional)</Label>
              <Select id="supervisorId" name="supervisorId">
                <option value="">No Supervisor</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name} {teacher.surname}
                  </option>
                ))}
              </Select>
              {errors.supervisorId && <p className="text-red-500 text-xs">{errors.supervisorId}</p>}
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
              {isPending ? "Creating..." : "Create Class"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

