"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye, Calendar, Upload } from "lucide-react";
import { format } from "date-fns";

interface Timetable {
  id: number;
  title: string;
  semester: string;
  academicYear: string;
  fileUrl: string;
  fileType: string;
  updatedAt: Date;
}

import { AddTimetableButton } from "./forms/AddTimetableButton";

interface Timetable {
  id: number;
  title: string;
  semester: string;
  academicYear: string;
  fileUrl: string;
  fileType: string;
  updatedAt: Date;
}

interface TimetableDisplayProps {
  timetables: Timetable[];
  isAdmin: boolean;
}

export function TimetableDisplay({ timetables, isAdmin }: TimetableDisplayProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="text-primary w-6 h-6" />
            Official Semester Timetables
          </h2>
          <p className="text-muted-foreground">Access the official schedules for the current academic session</p>
        </div>
        {isAdmin && <AddTimetableButton />}
      </div>

      {timetables.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {timetables.map((item) => (
            <Card key={item.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-primary/10">
              <CardHeader className="bg-muted/30 pb-4">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-background rounded border border-border shadow-sm">
                    {item.fileType}
                  </span>
                </div>
                <CardTitle className="mt-4 text-xl">{item.title}</CardTitle>
                <CardDescription className="font-medium text-primary/80">
                  {item.semester} • {item.academicYear}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-6">
                  <span>Updated: {format(new Date(item.updatedAt), "MMM dd, yyyy")}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <a 
                    href={item.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </a>
                  <a 
                    href={item.fileUrl} 
                    download
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3 gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-2 py-12 flex flex-col items-center justify-center text-center">
          <div className="p-4 bg-muted/50 rounded-full mb-4">
            <FileText className="w-12 h-12 text-muted-foreground/30" />
          </div>
          <CardTitle className="text-muted-foreground">No timetables posted yet</CardTitle>
          <CardDescription className="mb-6">
            {isAdmin 
              ? "The administration has not posted any official timetables yet." 
              : "The administration has not posted any official timetables yet."}
          </CardDescription>
          {isAdmin && <AddTimetableButton />}
        </Card>
      )}
    </div>
  );
}
