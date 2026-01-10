"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ViewFeeModal } from "@/components/modals/ViewFeeModal";
import { EditFeeModal } from "@/components/forms/EditFeeModal";
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import { deleteFee } from "@/lib/actions";
import { Pencil, Trash2, Eye } from "lucide-react";

interface Fee {
  id: number;
  title: string;
  amount: number;
  dueDate: Date;
  status: string;
  description: string | null;
  studentId: string;
  student: {
    id: string;
    name: string;
    surname: string;
    class: { name: string };
    parent: { name: string; surname: string; phone: string };
  };
}

interface FeeActionsProps {
  fee: Fee;
  students: { id: string; name: string; surname: string; class: { name: string } }[];
}

export function FeeActions({ fee, students }: FeeActionsProps) {
  const router = useRouter();
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("id", fee.id.toString());
      await deleteFee({ success: false, error: false }, formData);
      setDeleteOpen(false);
      router.refresh();
    });
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setViewOpen(true)}
          className="flex items-center gap-1"
        >
          <Eye className="w-3 h-3" />
          View
        </Button>
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

      <ViewFeeModal open={viewOpen} onOpenChange={setViewOpen} fee={fee} />

      <EditFeeModal
        open={editOpen}
        onOpenChange={setEditOpen}
        fee={fee}
        students={students}
      />

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        title="Delete Fee"
        description={`Are you sure you want to delete this fee "${fee.title}"? This action cannot be undone.`}
        isDeleting={isPending}
      />
    </>
  );
}

