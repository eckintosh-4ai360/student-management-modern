"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { subjectSchema, SubjectSchema } from "@/lib/formValidationSchemas";
import { updateSubject } from "@/lib/actions";
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
import { useEffect, useState } from "react";
import { Edit } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface EditSubjectModalProps {
  data: {
    id: number;
    name: string;
    teachers: { id: string; name: string; surname: string }[];
  };
  teachers: { id: string; name: string; surname: string }[];
}

export const EditSubjectModal = ({
  data,
  teachers,
}: EditSubjectModalProps) => {
  const [open, setOpen] = useState(false);
  // Default to empty array if no matches
  const initialTeachers = data.teachers ? data.teachers.map((t) => t.id) : [];
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>(initialTeachers);
  const router = useRouter();

  const form = useForm<SubjectSchema>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      id: data.id,
      name: data.name,
      teachers: initialTeachers,
    },
  });

  useEffect(() => {
    if (open) {
      const currentTeachers = data.teachers ? data.teachers.map((t) => t.id) : [];
      form.reset({
        id: data.id,
        name: data.name,
        teachers: currentTeachers,
      });
      setSelectedTeachers(currentTeachers);
    }
  }, [open, data, form]);

  const onSubmit = async (values: SubjectSchema) => {
    try {
      // Ensure we send the selected teachers
      const result = await updateSubject(
        { success: false, error: false },
        { ...values, teachers: selectedTeachers }
      );
      if (result.success) {
        toast.success("Subject updated successfully!");
        setOpen(false);
        router.refresh();
      } else {
        toast.error("Something went wrong!");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const handleTeacherToggle = (teacherId: string) => {
    const updatedTeachers = selectedTeachers.includes(teacherId)
        ? selectedTeachers.filter((id) => id !== teacherId)
        : [...selectedTeachers, teacherId];
    
    setSelectedTeachers(updatedTeachers);
    form.setValue("teachers", updatedTeachers, { shouldValidate: true });
  };

  return (
    <>
    <Button 
      variant="outline" 
      size="sm" 
      onClick={() => setOpen(true)}
      className="flex items-center gap-1"
    >
      <Edit className="w-3 h-3" />
      Edit
    </Button>
    
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Subject</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Mathematics" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Assign Teachers</FormLabel>
              <div className="border rounded-md p-3 max-h-48 overflow-y-auto space-y-2">
                {teachers.map((teacher) => (
                  <div key={teacher.id} className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedTeachers.includes(teacher.id)}
                      onCheckedChange={() => handleTeacherToggle(teacher.id)}
                    />
                    <label
                      htmlFor={`teacher-${teacher.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {teacher.name} {teacher.surname}
                    </label>
                  </div>
                ))}
            </div>
             {form.formState.errors.teachers && (
                  <p className="text-sm font-medium text-red-500">{form.formState.errors.teachers.message}</p>
             )}
            </div>

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
