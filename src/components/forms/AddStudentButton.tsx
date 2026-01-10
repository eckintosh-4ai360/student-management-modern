"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddStudentModal } from "@/components/forms/AddStudentModal";

interface AddStudentButtonProps {
  parents: { id: string; name: string; surname: string }[];
  classes: { id: number; name: string }[];
  grades: { id: number; level: number }[];
}

export function AddStudentButton({ parents, classes, grades }: AddStudentButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="w-4 h-4 mr-2" />
        Add Student
      </Button>
      <AddStudentModal 
        open={open} 
        onOpenChange={setOpen}
        parents={parents}
        classes={classes}
        grades={grades}
      />
    </>
  );
}

