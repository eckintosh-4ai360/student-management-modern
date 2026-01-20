"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { ViewExamModal } from "@/components/modals/ViewExamModal";
import { EditExamModal } from "@/components/forms/EditExamModal";
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import { deleteExam } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Eye, Trash2 } from "lucide-react";

interface Exam {
  id: number;
  title: string;
  startTime: Date;
  endTime: Date;
  lesson: {
    id: number;
    name: string;
    subject: {
      name: string;
    };
    class: {
      name: string;
    };
    teacher: {
      id: string; // Added ID for permission check
      name: string;
      surname: string;
    };
  };
  _count: {
    results: number;
  };
}

interface ExamTableRowProps {
  exam: Exam;
  role: string;
  userId: string;
  lessons: { id: number; name: string }[];
}

export function ExamTableRow({ exam, role, userId, lessons }: ExamTableRowProps) {
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const canEdit = role === "admin" || (role === "teacher" && userId === exam.lesson.teacher.id);

  const handleDelete = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("id", exam.id.toString());
      await deleteExam({ success: false, error: false }, formData);
      setDeleteOpen(false);
      router.refresh();
    });
  };

  return (
    <>
      <tr className="border-b hover:bg-gray-50">
        <td className="p-4 font-medium">{exam.title}</td>
        <td className="p-4 text-sm">{exam.lesson.subject.name}</td>
        <td className="p-4 text-sm">{exam.lesson.class.name}</td>
        <td className="p-4 text-sm">
          {exam.lesson.teacher.name} {exam.lesson.teacher.surname}
        </td>
        <td className="p-4 text-sm">
          <div>{format(new Date(exam.startTime), "MMM dd, yyyy")}</div>
          <div className="text-xs text-gray-500">
            {format(new Date(exam.startTime), "HH:mm")} - {format(new Date(exam.endTime), "HH:mm")}
          </div>
        </td>
        <td className="p-4 text-sm">{exam._count.results} students</td>
        <td className="p-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setViewOpen(true)}
            className="flex items-center gap-1"
          >
            <Eye className="w-3 h-3" />
            View
          </Button>

          {canEdit && (
             <>
             <EditExamModal data={{
                id: exam.id,
                title: exam.title,
                startTime: exam.startTime,
                endTime: exam.endTime,
                lessonId: exam.lesson.id || 0, // Should exist
             }} lessons={lessons} />
             
             <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => setDeleteOpen(true)}
                className="flex items-center gap-1 ml-2"
              >
                <Trash2 className="w-3 h-3" />
                Delete
              </Button>
             </>
          )}
        </td>
      </tr>

      <ViewExamModal 
        open={viewOpen}
        onOpenChange={setViewOpen}
        exam={exam}
      />
      
      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        title="Delete Exam"
        description={`Are you sure you want to delete ${exam.title}? This action cannot be undone.`}
        isDeleting={isPending}
      />
    </>
  );
}

