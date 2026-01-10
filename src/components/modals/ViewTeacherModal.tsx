"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { X, User } from "lucide-react";
import Image from "next/image";

interface Teacher {
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
  subjects: { name: string }[];
}

interface ViewTeacherModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacher: Teacher | null;
}

export function ViewTeacherModal({ open, onOpenChange, teacher }: ViewTeacherModalProps) {
  if (!teacher) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Teacher Details</span>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Profile Picture */}
          <div className="flex justify-center">
            {teacher.img ? (
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200">
                <Image
                  src={teacher.img}
                  alt={`${teacher.name} ${teacher.surname}`}
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
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium">{teacher.name} {teacher.surname}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Username</p>
                <p className="font-medium">@{teacher.username}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Birthday</p>
                <p className="font-medium">{format(new Date(teacher.birthday), "MMMM dd, yyyy")}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className="font-medium">{teacher.sex}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Blood Type</p>
                <p className="font-medium">{teacher.bloodType}</p>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Contact Information</h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{teacher.email || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{teacher.phone || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">{teacher.address}</p>
              </div>
            </div>
          </div>

          {/* Subjects */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Subjects Teaching</h3>
            {teacher.subjects.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {teacher.subjects.map((subject, idx) => (
                  <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                    {subject.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No subjects assigned</p>
            )}
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

