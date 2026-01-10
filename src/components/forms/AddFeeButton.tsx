"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddFeeModal } from "@/components/forms/AddFeeModal";

interface AddFeeButtonProps {
  students: { id: string; name: string; surname: string }[];
}

export function AddFeeButton({ students }: AddFeeButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="w-4 h-4 mr-2" />
        Add Fee
      </Button>
      <AddFeeModal 
        open={open} 
        onOpenChange={setOpen}
        students={students}
      />
    </>
  );
}

