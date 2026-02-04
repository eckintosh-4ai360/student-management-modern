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
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-extrabold text-blue-600 border-b pb-4">
            {exam.title}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-4">
          {/* Column 1: Core Details */}
          <div className="lg:col-span-1 space-y-4 border-r pr-6 border-border/50">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center">
              <BookOpen className="w-4 h-4 mr-2 text-blue-600" />
              Academic Details
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-muted/10 rounded-lg border border-border/50">
                <p className="text-xs text-muted-foreground">Subject</p>
                <p className="font-semibold">{exam.lesson.subject.name}</p>
              </div>
              <div className="p-3 bg-muted/10 rounded-lg border border-border/50">
                <p className="text-xs text-muted-foreground">Class</p>
                <p className="font-semibold">{exam.lesson.class.name}</p>
              </div>
              <div className="p-3 bg-muted/10 rounded-lg border border-border/50">
                <p className="text-xs text-muted-foreground">Teacher</p>
                <p className="font-semibold">{exam.lesson.teacher.name} {exam.lesson.teacher.surname}</p>
              </div>
            </div>
          </div>

          {/* Column 2: Schedule */}
          <div className="lg:col-span-1 space-y-4 border-r pr-6 border-border/50">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-indigo-600" />
              Schedule
            </h3>
            <div className="p-4 bg-muted/20 rounded-xl border border-border/50 space-y-4">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Date</span>
                <span className="font-bold">{format(new Date(exam.startTime), "EEEE, MMM dd, yyyy")}</span>
              </div>
              <div className="flex flex-col border-t border-border/30 pt-3">
                <span className="text-xs text-muted-foreground">Time Window</span>
                <span className="font-bold flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {format(new Date(exam.startTime), "HH:mm")} - {format(new Date(exam.endTime), "HH:mm")}
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-border/30 pt-3">
                <span className="text-xs text-muted-foreground">Duration</span>
                <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-500 text-xs font-bold rounded">
                  {Math.round((new Date(exam.endTime).getTime() - new Date(exam.startTime).getTime()) / 60000)} MIN
                </span>
              </div>
            </div>
          </div>

          {/* Column 3: Stats & Misc */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center">
                <Users className="w-4 h-4 mr-2 text-orange-600" />
                Participation
              </h3>
              <div className="p-4 bg-orange-500/5 rounded-xl border border-orange-500/20 text-center">
                <p className="text-3xl font-black text-orange-600">{exam._count.results}</p>
                <p className="text-xs text-muted-foreground font-medium uppercase mt-1">Results Submitted</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Internal Note</h3>
              <div className="p-3 bg-muted/10 rounded-lg border border-border/50 italic text-sm text-muted-foreground">
                Lesson reference: {exam.lesson.name}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

