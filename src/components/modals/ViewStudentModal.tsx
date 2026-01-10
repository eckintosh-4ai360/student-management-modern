"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { X, User } from "lucide-react";
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
  class: { name: string };
  grade: { level: number };
  parent: { name: string; surname: string; phone: string };
}

interface ViewStudentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | null;
}

export function ViewStudentModal({ open, onOpenChange, student }: ViewStudentModalProps) {
  if (!student) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Student Details</span>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Picture */}
          <div className="flex justify-center">
            {student.img ? (
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200">
                <Image
                  src={student.img}
                  alt={`${student.name} ${student.surname}`}
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center border-4 border-gray-200">
                <User className="w-16 h-16 text-primary" />
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium">{student.name} {student.surname}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Username</p>
                <p className="font-medium">@{student.username}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Birthday</p>
                <p className="font-medium">{format(new Date(student.birthday), "MMMM dd, yyyy")}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className="font-medium">{student.sex}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Blood Type</p>
                <p className="font-medium">{student.bloodType}</p>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Contact Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{student.email || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{student.phone || "Not provided"}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">{student.address}</p>
              </div>
            </div>
          </div>

          {/* Academic Info */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Academic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Class</p>
                <p className="font-medium">{student.class.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Grade</p>
                <p className="font-medium">Grade {student.grade.level}</p>
              </div>
            </div>
          </div>

          {/* Parent Info */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Parent/Guardian</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Parent Name</p>
                <p className="font-medium">{student.parent.name} {student.parent.surname}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Parent Phone</p>
                <p className="font-medium">{student.parent.phone}</p>
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

