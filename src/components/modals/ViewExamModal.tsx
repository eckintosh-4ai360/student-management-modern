"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Calendar, Clock, BookOpen, Users, GraduationCap, User } from "lucide-react";

interface Exam {
  id: number;
  title: string;
  startTime: Date;
  endTime: Date;
  lesson: {
    name: string;
    subject: {
      name: string;
    };
    class: {
      name: string;
    };
    teacher: {
      name: string;
      surname: string;
    };
  };
  _count: {
    results: number;
  };
}

interface ViewExamModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exam: Exam;
}

export function ViewExamModal({ open, onOpenChange, exam }: ViewExamModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-600">
            {exam.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Exam Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-700">Subject</span>
              </div>
              <p className="text-lg font-medium">{exam.lesson.subject.name}</p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-gray-700">Class</span>
              </div>
              <p className="text-lg font-medium">{exam.lesson.class.name}</p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-gray-700">Teacher</span>
              </div>
              <p className="text-lg font-medium">
                {exam.lesson.teacher.name} {exam.lesson.teacher.surname}
              </p>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-orange-600" />
                <span className="font-semibold text-gray-700">Results Submitted</span>
              </div>
              <p className="text-lg font-medium">{exam._count.results} students</p>
            </div>
          </div>

          {/* Date and Time */}
          <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-200">
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              Schedule
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{format(new Date(exam.startTime), "EEEE, MMMM dd, yyyy")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Time:
                </span>
                <span className="font-medium">
                  {format(new Date(exam.startTime), "HH:mm")} - {format(new Date(exam.endTime), "HH:mm")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">
                  {Math.round((new Date(exam.endTime).getTime() - new Date(exam.startTime).getTime()) / 60000)} minutes
                </span>
              </div>
            </div>
          </div>

          {/* Lesson Info */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-700 mb-2">Lesson</h3>
            <p className="text-gray-600">{exam.lesson.name}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

