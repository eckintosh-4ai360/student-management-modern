"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { timetableSchema, TimetableSchema } from "@/lib/formValidationSchemas";
import { createTimetable } from "@/lib/timetableActions";
import { useEffect, useState, useActionState } from "react";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface AddTimetableModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function AddTimetableModal({ open, setOpen }: AddTimetableModalProps) {
  const [state, formAction] = useActionState(createTimetable, {
    success: false,
    error: false,
    message: "",
  });

  const form = useForm<TimetableSchema>({
    resolver: zodResolver(timetableSchema),
    defaultValues: {
      title: "",
      semester: "First Semester",
      academicYear: "2024-2025",
      fileUrl: "",
      fileType: "PDF",
    },
  });

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      setOpen(false);
      form.reset();
    } else if (state.error) {
      toast.error(state.message);
    }
  }, [state, setOpen, form]);

  const onSubmit = (data: TimetableSchema) => {
    formAction(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Post New Timetable</DialogTitle>
          <DialogDescription>
            Fill in the details to upload a new semester timetable.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timetable Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. BSc Computer Science Level 100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="semester"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Semester</FormLabel>
                    <FormControl>
                      <Select {...field}>
                        <option value="First Semester">First Semester</option>
                        <option value="Second Semester">Second Semester</option>
                        <option value="Third Semester">Third Semester (Summer)</option>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="academicYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Academic Year</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 2024-2025" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="fileUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>File Link (URL)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/timetable.pdf" {...field} />
                  </FormControl>
                  <div className="text-[10px] text-muted-foreground">
                    Paste the link to the PDF or image file.
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fileType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>File Format</FormLabel>
                  <FormControl>
                    <Select {...field}>
                      <option value="PDF">PDF Document</option>
                      <option value="IMAGE">Image (JPG/PNG)</option>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-6">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Post Timetable
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
