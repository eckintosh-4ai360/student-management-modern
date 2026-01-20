"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { X } from "lucide-react";

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

interface ViewFeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fee: Fee | null;
}

export function ViewFeeModal({ open, onOpenChange, fee }: ViewFeeModalProps) {
  if (!fee) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Fee Details</span>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-3">Fee Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Title</p>
                <p className="font-medium">{fee.title}</p>
              </div>
              {fee.description && (
                <div>
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="font-medium">{fee.description}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="font-bold text-lg">GH₵{fee.amount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Due Date</p>
                <p className="font-medium">{format(new Date(fee.dueDate), "MMMM dd, yyyy")}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span
                  className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                    fee.status === "PAID"
                      ? "bg-green-100 text-green-700"
                      : fee.status === "OVERDUE"
                      ? "bg-red-100 text-red-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {fee.status}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">Student Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Student Name</p>
                <p className="font-medium">{fee.student.name} {fee.student.surname}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Class</p>
                <p className="font-medium">{fee.student.class.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Parent/Guardian</p>
                <p className="font-medium">{fee.student.parent?.name || "No Parent"} {fee.student.parent?.surname || ""}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Parent Phone</p>
                <p className="font-medium">{fee.student.parent?.phone || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

