"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSubject } from "@/lib/actions";
import { subjectSchema } from "@/lib/formValidationSchemas";

interface AddSubjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teachers: { id: string; name: string; surname: string }[];
}

export function AddSubjectModal({ open, onOpenChange, teachers }: AddSubjectModalProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string>("");
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setMessage("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      teachers: selectedTeachers,
    };

    // Validate
    const validation = subjectSchema.safeParse(data);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    startTransition(async () => {
      const result = await createSubject({ success: false, error: false }, validation.data);
      if (result.success) {
        setMessage(result.message || "Subject created successfully!");
        setTimeout(() => {
          onOpenChange(false);
          router.refresh();
        }, 1000);
      } else {
        setMessage(result.message || "Failed to create subject");
      }
    });
  };

  const toggleTeacher = (teacherId: string) => {
    setSelectedTeachers(prev => 
      prev.includes(teacherId) 
        ? prev.filter(id => id !== teacherId)
        : [...prev, teacherId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Subject</DialogTitle>
          <DialogDescription>Fill in the subject information below</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Subject Name *</Label>
              <Input id="name" name="name" placeholder="e.g., Mathematics, Science" required />
              {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label>Assign Teachers</Label>
              <div className="border rounded-md p-3 max-h-48 overflow-y-auto">
                {teachers.length === 0 ? (
                  <p className="text-sm text-gray-500">No teachers available</p>
                ) : (
                  teachers.map((teacher) => (
                    <label key={teacher.id} className="flex items-center space-x-2 py-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTeachers.includes(teacher.id)}
                        onChange={() => toggleTeacher(teacher.id)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{teacher.name} {teacher.surname}</span>
                    </label>
                  ))
                )}
              </div>
              {errors.teachers && <p className="text-red-500 text-xs">{errors.teachers}</p>}
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
              {isPending ? "Creating..." : "Create Subject"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

