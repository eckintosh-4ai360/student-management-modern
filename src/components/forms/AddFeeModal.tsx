"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { createFee } from "@/lib/actions";
import { feeSchema } from "@/lib/formValidationSchemas";

interface AddFeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  students: { id: string; name: string; surname: string }[];
}

export function AddFeeModal({ open, onOpenChange, students }: AddFeeModalProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string>("");
  const [dueDate, setDueDate] = useState<Date | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setMessage("");

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      amount: parseFloat(formData.get("amount") as string),
      dueDate: dueDate!,
      status: formData.get("status") as "PENDING" | "PAID" | "OVERDUE",
      description: formData.get("description") as string,
      studentId: formData.get("studentId") as string,
    };

    // Validate
    const validation = feeSchema.safeParse(data);
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
      const result = await createFee({ success: false, error: false }, validation.data);
      if (result.success) {
        setMessage(result.message || "Fee created successfully!");
        setTimeout(() => {
          onOpenChange(false);
          router.refresh();
        }, 1000);
      } else {
        setMessage(result.message || "Failed to create fee");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Fee/Bill</DialogTitle>
          <DialogDescription>Create a new fee or bill for a student</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="studentId">Student *</Label>
              <Select id="studentId" name="studentId" required>
                <option value="">Select Student</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} {student.surname}
                  </option>
                ))}
              </Select>
              {errors.studentId && <p className="text-red-500 text-xs">{errors.studentId}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" name="title" placeholder="e.g., Tuition Fee, Library Fee" required />
              {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($) *</Label>
              <Input 
                id="amount" 
                name="amount" 
                type="number" 
                step="0.01" 
                min="0"
                placeholder="0.00"
                required 
              />
              {errors.amount && <p className="text-red-500 text-xs">{errors.amount}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date *</Label>
              <DatePicker
                id="dueDate"
                name="dueDate"
                selected={dueDate}
                onChange={(date) => setDueDate(date)}
                placeholder="Select due date"
                required
                dateFormat="MM/dd/yyyy"
              />
              {errors.dueDate && <p className="text-red-500 text-xs">{errors.dueDate}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select id="status" name="status" required defaultValue="PENDING">
                <option value="PENDING">Pending</option>
                <option value="PAID">Paid</option>
                <option value="OVERDUE">Overdue</option>
              </Select>
              {errors.status && <p className="text-red-500 text-xs">{errors.status}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea 
                id="description" 
                name="description" 
                placeholder="Additional details about this fee..."
                rows={3}
              />
              {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
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
              {isPending ? "Creating..." : "Create Fee"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

