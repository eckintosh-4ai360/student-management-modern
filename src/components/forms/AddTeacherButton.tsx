"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddTeacherModal } from "@/components/forms/AddTeacherModal";

interface AddTeacherButtonProps {
  subjects: { id: number; name: string }[];
}

export function AddTeacherButton({ subjects }: AddTeacherButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="w-4 h-4 mr-2" />
        Add Teacher
      </Button>
      <AddTeacherModal 
        open={open} 
        onOpenChange={setOpen}
        subjects={subjects}
      />
    </>
  );
}

