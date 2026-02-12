"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ViewStudentModal } from "@/components/modals/ViewStudentModal";
import { EditStudentModal } from "@/components/forms/EditStudentModal";
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import { deleteStudent } from "@/lib/actions";
import { Pencil, Trash2, Eye, User } from "lucide-react";
import Image from "next/image";

interface Student {
  id: string;
  username: string;
  name: string;
  surname: string;
  email: string | null;
  phone: string | null;
  address: string;
  bloodType: string;
  sex: string;
  birthday: Date;
  img?: string | null;
  class: { id: number; name: string };
  grade: { id: number; level: number };
  parent: { id: string; name?: string; surname?: string; phone?: string } | null;
}

interface StudentTableRowProps {
  student: Student;
  grades: { id: number; level: number }[];
  classes: { id: number; name: string; gradeId: number }[];
  parents: { id: string; name: string; surname: string }[];
}

export function StudentTableRow({ student, grades, classes, parents }: StudentTableRowProps) {
  const router = useRouter();
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("id", student.id);
      await deleteStudent({ success: false, error: false }, formData);
      setDeleteOpen(false);
      router.refresh();
    });
  };

  return (
    <>
      <tr className="border-b transition-colors hover:bg-muted/50">
        <td className="p-4">
          <div className="flex items-center space-x-3">
            {student.img ? (
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200">
                <Image
                  src={student.img}
                  alt={`${student.name} ${student.surname}`}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">
                  {student.name.charAt(0)}{student.surname.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <p className="font-medium">{student.name} {student.surname}</p>
              <p className="text-sm text-muted-foreground">@{student.username}</p>
            </div>
          </div>
        </td>
        <td className="p-4 text-sm text-muted-foreground">{student.id.slice(0, 8)}</td>
        <td className="p-4 text-sm">{student.class.name}</td>
        <td className="p-4 text-sm">Grade {student.grade.level}</td>
        <td className="p-4 text-sm">{student.parent?.name} {student.parent?.surname}</td>
        <td className="p-4 text-sm">{student.email || student.phone || "-"}</td>
        <td className="p-4">
          <div className="flex items-center gap-2">
            <Link href={`/dashboard/students/${student.id}`}>
              <Button 
                variant="default" 
                size="sm" 
                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700"
              >
                <User className="w-3 h-3" />
                Profile
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setEditOpen(true)}
              className="flex items-center gap-1"
            >
              <Pencil className="w-3 h-3" />
              Edit
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => setDeleteOpen(true)}
              className="flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              Delete
            </Button>
          </div>
        </td>
      </tr>

      <ViewStudentModal 
        open={viewOpen}
        onOpenChange={setViewOpen}
        student={student}
      />

      <EditStudentModal
        open={editOpen}
        onOpenChange={setEditOpen}
        student={student}
        grades={grades}
        classes={classes}
        parents={parents}
      />

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        title="Delete Student"
        description={`Are you sure you want to delete ${student.name} ${student.surname}? This action cannot be undone.`}
        isDeleting={isPending}
      />
    </>
  );
}
