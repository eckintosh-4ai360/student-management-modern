"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ViewExamModal } from "@/components/modals/ViewExamModal";
import { format } from "date-fns";
import { Eye } from "lucide-react";

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

interface ExamTableRowProps {
  exam: Exam;
}

export function ExamTableRow({ exam }: ExamTableRowProps) {
  const [viewOpen, setViewOpen] = useState(false);

  return (
    <>
      <tr className="border-b hover:bg-gray-50">
        <td className="p-4 font-medium">{exam.title}</td>
        <td className="p-4 text-sm">{exam.lesson.subject.name}</td>
        <td className="p-4 text-sm">{exam.lesson.class.name}</td>
        <td className="p-4 text-sm">
          {exam.lesson.teacher.name} {exam.lesson.teacher.surname}
        </td>
        <td className="p-4 text-sm">
          <div>{format(new Date(exam.startTime), "MMM dd, yyyy")}</div>
          <div className="text-xs text-gray-500">
            {format(new Date(exam.startTime), "HH:mm")} - {format(new Date(exam.endTime), "HH:mm")}
          </div>
        </td>
        <td className="p-4 text-sm">{exam._count.results} students</td>
        <td className="p-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setViewOpen(true)}
            className="flex items-center gap-1"
          >
            <Eye className="w-3 h-3" />
            View
          </Button>
        </td>
      </tr>

      <ViewExamModal 
        open={viewOpen}
        onOpenChange={setViewOpen}
        exam={exam}
      />
    </>
  );
}

