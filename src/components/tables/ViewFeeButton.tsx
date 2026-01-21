"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ViewFeeModal } from "@/components/modals/ViewFeeModal";

interface Fee {
  id: number;
  title: string;
  amount: number;
  dueDate: Date;
  status: string;
  description: string | null;
  student: {
    name: string;
    surname: string;
    class: { name: string };
    parent: { name: string; surname: string; phone: string } | null;
  };
}

interface ViewFeeButtonProps {
  fee: Fee;
}

export function ViewFeeButton({ fee }: ViewFeeButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        View
      </Button>
      <ViewFeeModal open={open} onOpenChange={setOpen} fee={fee} />
    </>
  );
}

