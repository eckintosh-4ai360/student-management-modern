"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddQuestionModal } from "./AddQuestionModal";

interface AddQuestionButtonProps {
  assignmentId: number;
}

export function AddQuestionButton({ assignmentId }: AddQuestionButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Question
      </Button>

      <AddQuestionModal
        open={open}
        onOpenChange={setOpen}
        assignmentId={assignmentId}
      />
    </>
  );
}

