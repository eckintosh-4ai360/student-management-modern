"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  FileText,
  MessageSquare,
  Edit2,
  BarChart3,
  Zap,
  Send as SendIcon,
} from "lucide-react";
import { format } from "date-fns";

interface Student {
  id: string;
  name: string;
  surname: string;
  othername?: string | null;
  grade: { level: number };
}

interface Class {
  id: number;
  name: string;
  students: Student[];
}

interface AttendanceClientProps {
  classes: Class[];
  currentDate?: string;
}

export function AttendanceClient({
  classes,
  currentDate = format(new Date(), "MM/dd/yyyy"),
}: AttendanceClientProps) {
  const [selectedClassId, setSelectedClassId] = useState<number>(
    classes.length > 0 ? classes[0].id : 0
  );
  const [startDate, setStartDate] = useState(currentDate);
  const [endDate, setEndDate] = useState(currentDate);
  const [attendanceMarks, setAttendanceMarks] = useState<Record<string, boolean>>({});
  const [isPending, startTransition] = useTransition();

  const selectedClass = classes.find((c) => c.id === selectedClassId);
  const markedCount = Object.values(attendanceMarks).length;
  const isSubmitted = markedCount === 0;

  const handleToggleAttendance = (studentId: string) => {
    setAttendanceMarks((prev) => {
      const updated = { ...prev };
      if (updated[studentId]) {
        delete updated[studentId];
      } else {
        updated[studentId] = true;
      }
      return updated;
    });
  };

  const handleSubmitAttendance = () => {
    startTransition(async () => {
      try {
        const attendanceData = {
          classId: selectedClassId,
          date: new Date(startDate),
          attendances: Object.entries(attendanceMarks).map(([studentId, present]) => ({
            studentId,
            present,
          })),
        };

        const response = await fetch("/api/attendance/mark", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(attendanceData),
        });

        if (response.ok) {
          setAttendanceMarks({});
          alert("Attendance submitted successfully!");
        }
      } catch (error) {
        console.error("Error submitting attendance:", error);
      }
    });
  };

  const handleGenerateReport = () => {
    // Generate CSV report
    if (!selectedClass) return;

    const headers = ["S/N", "LASTNAME", "FIRSTNAME", "OTHERNAME", "LEVEL", "GENDER"];
    const rows = selectedClass.students.map((student, idx) => [
      idx + 1,
      student.surname,
      student.name,
      student.othername || "",
      `BASIC ${student.grade.level}`,
      "", // Gender would need to be added to student model
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance-report-${format(new Date(startDate), "yyyy-MM-dd")}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          STUDENTS DAILY ATTENDANCE – (MARK CLASS REGISTER HERE)
        </h1>
      </div>

      {/* Class Selector Buttons */}
      <div className="flex flex-wrap gap-3">
        {classes.map((cls) => (
          <button
            key={cls.id}
            onClick={() => {
              setSelectedClassId(cls.id);
              setAttendanceMarks({});
            }}
            className={`px-4 py-2 rounded-full font-semibold transition-all ${
              selectedClassId === cls.id
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-indigo-500 text-white hover:bg-indigo-600"
            }`}
          >
            {cls.name}
          </button>
        ))}
      </div>

      {/* Action Buttons Row */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Left side action buttons */}
        <Button
          variant="outline"
          size="sm"
          className="bg-blue-600 text-white hover:bg-blue-700 border-0"
        >
          JHS 1
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="bg-blue-600 text-white hover:bg-blue-700 border-0"
        >
          JHS 2
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="bg-blue-600 text-white hover:bg-blue-700 border-0"
        >
          JHS 3
        </Button>

        <Button
          size="sm"
          className="bg-yellow-400 text-black hover:bg-yellow-500"
          onClick={handleGenerateReport}
        >
          <FileText className="w-4 h-4 mr-2" />
          Gen. Report
        </Button>

        <Button size="sm" className="bg-red-600 text-white hover:bg-red-700">
          <MessageSquare className="w-4 h-4 mr-2" />
          Send SMS
        </Button>

        <Button size="sm" className="bg-green-600 text-white hover:bg-green-700">
          <Edit2 className="w-4 h-4 mr-2" />
          Edit Attendance
        </Button>

        {/* Right side info */}
        <div className="ml-auto flex items-center gap-3">
          <span className="text-orange-600 font-semibold">
            LEVEL: {selectedClass?.name || "N/A"}
          </span>
          <Button size="sm" className="bg-yellow-600 text-white hover:bg-yellow-700">
            <BarChart3 className="w-4 h-4 mr-2" />
            Summary
          </Button>
        </div>
      </div>

      {/* Date Range and Generate */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="mm/dd/yyyy"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-32"
              />
              <span className="text-gray-500">to</span>
              <input
                type="text"
                placeholder="mm/dd/yyyy"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-32"
              />
            </div>

            <Button className="bg-teal-600 text-white hover:bg-teal-700">
              <Zap className="w-4 h-4 mr-2" />
              Generate
            </Button>

            <div className="ml-auto flex items-center gap-3">
              <span className="text-gray-700 font-semibold">
                Today's Attendance:{" "}
                <span className={isSubmitted ? "text-red-600" : "text-green-600"}>
                  {isSubmitted ? "Unmarked" : `${markedCount} marked`}
                </span>
              </span>
              <Button
                className="bg-purple-600 text-white hover:bg-purple-700"
                onClick={handleSubmitAttendance}
                disabled={isSubmitted || isPending}
              >
                {isPending ? "Submitting..." : "SUBMIT ATTENDANCE"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-300">
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">S/N</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">LASTNAME</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">FIRSTNAME</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">OTHERNAME</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">LEVEL</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">GENDER</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">
                    PRESENT
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedClass?.students.map((student, idx) => (
                  <tr key={student.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-700">{idx + 1}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">
                      {student.surname.toUpperCase()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {student.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {student.othername || ""}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      BASIC {student.grade.level}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {/* Add gender field when available */}
                      -
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={attendanceMarks[student.id] || false}
                        onChange={() => handleToggleAttendance(student.id)}
                        className="w-5 h-5 cursor-pointer"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!selectedClass?.students || selectedClass.students.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No students found in this class.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
