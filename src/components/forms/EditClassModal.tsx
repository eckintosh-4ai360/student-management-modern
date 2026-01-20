"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { classSchema, ClassSchema } from "@/lib/formValidationSchemas";
import { updateClass } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Edit } from "lucide-react";

interface EditClassModalProps {
  data: {
    id: number;
    name: string;
    capacity: number;
    gradeId: number;
    supervisorId?: string | null;
  };
  grades: { id: number; level: number }[];
  teachers: { id: string; name: string; surname: string }[];
}

export const EditClassModal = ({
  data,
  grades,
  teachers,
}: EditClassModalProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const form = useForm<ClassSchema>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      id: data.id,
      name: data.name,
      capacity: data.capacity,
      gradeId: data.gradeId,
      supervisorId: data.supervisorId || undefined,
    },
  });

  useEffect(() => {
     if (open) {
        form.reset({
            id: data.id,
            name: data.name,
            capacity: data.capacity,
            gradeId: data.gradeId,
            supervisorId: data.supervisorId || undefined,
        });
     }
  }, [open, data, form]);

  const onSubmit = async (values: ClassSchema) => {
    try {
      const result = await updateClass({ success: false, error: false }, values);
      if (result.success) {
        toast.success("Class updated successfully!");
        setOpen(false);
        router.refresh();
      } else {
        toast.error("Fixed error!");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <>
    <Button variant="outline" onClick={() => setOpen(true)}>
      <Edit className="w-4 h-4 mr-2" />
      Edit Class
    </Button>
    
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Class</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Class 1A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="30"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gradeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grade</FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      value={field.value?.toString()}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    >
                      <option value="">Select a grade</option>
                      {grades.map((grade) => (
                        <option key={grade.id} value={grade.id}>
                          Grade {grade.level}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="supervisorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supervisor (Optional)</FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                          const val = e.target.value;
                          field.onChange(val === "null" || val === "" ? null : val);
                      }}
                    >
                      <option value="">Select a supervisor</option>
                      <option value="null">None</option>
                      {teachers.map((teacher) => (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.name} {teacher.surname}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
    </>
  );
};
