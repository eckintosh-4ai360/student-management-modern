"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, TrendingUp, AlertCircle, CheckCircle, Filter, Download } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AddBehaviorModal } from "@/components/forms/AddBehaviorModal";
import { BehaviorDeleteButton } from "@/components/BehaviorDeleteButton";
import { ExportBehaviorReport } from "@/components/ExportBehaviorReport";

interface BehaviorRecord {
  id: number;
  title: string;
  description: string;
  type: string;
  severity: string;
  date: Date;
  reportedBy: string;
  actionTaken: string | null;
  student: {
    id: string;
    name: string;
    surname: string;
    class: { name: string };
    grade: { level: number };
  };
}

interface Student {
  id: string;
  name: string;
  surname: string;
}

interface BehaviorPageClientProps {
  behaviors: BehaviorRecord[];
  students: Student[];
  stats: {
    total: number;
    positive: number;
    negative: number;
    neutral: number;
    critical: number;
  };
}

export function BehaviorPageClient({
  behaviors,
  students,
  stats,
}: BehaviorPageClientProps) {
  const [openModal, setOpenModal] = useState(false);
  const [filteredType, setFilteredType] = useState<string | null>(null);

  const filteredBehaviors = filteredType
    ? behaviors.filter((b) => b.type === filteredType)
    : behaviors;

  return (
    <div className="space-y-6">
      {/* Modal */}
      <AddBehaviorModal
        open={openModal}
        onOpenChange={setOpenModal}
        students={students}
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Behavior & Discipline</h1>
            <p className="text-indigo-100 text-lg">
              Track student conduct, interventions, and achievements
            </p>
          </div>
          <Button
            className="bg-white text-indigo-600 hover:bg-indigo-50 px-6 py-6 text-lg"
            onClick={() => setOpenModal(true)}
          >
            <Award className="w-5 h-5 mr-2" />
            Add Record
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card
          className="border-l-4 border-l-blue-500 hover:shadow-xl transition-all duration-300 cursor-pointer"
          onClick={() => setFilteredType(null)}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-blue-600">{stats.total}</div>
            <p className="text-xs text-gray-500 mt-1">All behavior entries</p>
          </CardContent>
        </Card>

        <Card
          className="border-l-4 border-l-green-500 hover:shadow-xl transition-all duration-300 cursor-pointer"
          onClick={() => setFilteredType("POSITIVE")}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
              Positive
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-600">{stats.positive}</div>
            <p className="text-xs text-gray-500 mt-1">Good behavior</p>
          </CardContent>
        </Card>

        <Card
          className="border-l-4 border-l-red-500 hover:shadow-xl transition-all duration-300 cursor-pointer"
          onClick={() => setFilteredType("NEGATIVE")}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 text-red-500" />
              Negative
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-red-600">{stats.negative}</div>
            <p className="text-xs text-gray-500 mt-1">Incidents reported</p>
          </CardContent>
        </Card>

        <Card
          className="border-l-4 border-l-gray-500 hover:shadow-xl transition-all duration-300 cursor-pointer"
          onClick={() => setFilteredType("NEUTRAL")}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Neutral
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-gray-600">{stats.neutral}</div>
            <p className="text-xs text-gray-500 mt-1">General notes</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 text-orange-500" />
              Critical
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-orange-600">{stats.critical}</div>
            <p className="text-xs text-gray-500 mt-1">Urgent cases</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4 flex-wrap">
            <Filter className="w-5 h-5 text-gray-400" />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilteredType(null)}
              className={filteredType === null ? "bg-blue-100 text-blue-700 border-blue-300" : ""}
            >
              All Types
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilteredType("POSITIVE")}
              className={
                filteredType === "POSITIVE"
                  ? "bg-green-100 text-green-700 border-green-300"
                  : "text-green-600 border-green-300 hover:bg-green-50"
              }
            >
              Positive ({stats.positive})
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilteredType("NEGATIVE")}
              className={
                filteredType === "NEGATIVE"
                  ? "bg-red-100 text-red-700 border-red-300"
                  : "text-red-600 border-red-300 hover:bg-red-50"
              }
            >
              Negative ({stats.negative})
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilteredType("NEUTRAL")}
              className={
                filteredType === "NEUTRAL"
                  ? "bg-gray-100 text-gray-700 border-gray-300"
                  : "text-gray-600 border-gray-300"
              }
            >
              Neutral ({stats.neutral})
            </Button>
            <div className="ml-auto">
              <ExportBehaviorReport behaviors={filteredBehaviors} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Behavior Records */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center text-lg">
              <Award className="w-6 h-6 mr-3 text-indigo-600" />
              Behavior Case(s) Open
            </span>
            <span className="text-sm font-normal text-gray-600">
              {filteredBehaviors.length} Record(s)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {filteredBehaviors.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left p-4 font-semibold text-gray-700">Referral ID</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Student(s) Involved</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Date of Incident</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Incident</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Type</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Severity</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBehaviors.map((behavior) => (
                    <tr key={behavior.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <span className="font-mono text-sm bg-gray-100 px-3 py-1 rounded">
                          REF{behavior.id}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center font-semibold mr-3">
                            {behavior.student.name.charAt(0)}
                            {behavior.student.surname.charAt(0)}
                          </div>
                          <div>
                            <Link
                              href={`/dashboard/students/${behavior.student.id}`}
                              className="font-medium hover:text-blue-600 transition-colors"
                            >
                              {behavior.student.name} {behavior.student.surname}
                            </Link>
                            <p className="text-sm text-gray-500">
                              {behavior.student.class.name} • Grade{" "}
                              {behavior.student.grade.level}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {format(new Date(behavior.date), "MMM dd, yyyy")}
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{behavior.title}</p>
                          <p className="text-sm text-gray-600 line-clamp-1">
                            {behavior.description}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Reported by: {behavior.reportedBy}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            behavior.type === "POSITIVE"
                              ? "bg-green-100 text-green-700"
                              : behavior.type === "NEGATIVE"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {behavior.type === "POSITIVE" && (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          )}
                          {behavior.type === "NEGATIVE" && (
                            <AlertCircle className="w-3 h-3 mr-1" />
                          )}
                          {behavior.type}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            behavior.severity === "CRITICAL"
                              ? "bg-red-100 text-red-700 ring-2 ring-red-300"
                              : behavior.severity === "HIGH"
                              ? "bg-orange-100 text-orange-700"
                              : behavior.severity === "MEDIUM"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {behavior.severity}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                          {behavior.actionTaken ? "Resolved" : "Open"}
                        </span>
                      </td>
                      <td className="p-4">
                        <BehaviorDeleteButton behaviorId={behavior.id} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16">
              <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No behavior records found</p>
              <p className="text-gray-400 text-sm mt-2">
                Start tracking student conduct and achievements
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Taken Summary */}
      {behaviors.some((b) => b.actionTaken) && (
        <Card>
          <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50">
            <CardTitle className="flex items-center text-lg">
              <TrendingUp className="w-5 h-5 mr-2 text-teal-600" />
              Recent Actions & Interventions
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {behaviors
                .filter((b) => b.actionTaken)
                .slice(0, 5)
                .map((behavior) => (
                  <div
                    key={behavior.id}
                    className="p-4 rounded-lg bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-mono text-sm bg-white px-2 py-1 rounded">
                            REF{behavior.id}
                          </span>
                          <span className="font-semibold">
                            {behavior.student.name} {behavior.student.surname}
                          </span>
                          <span className="text-sm text-gray-600">
                            • {behavior.title}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">
                          <span className="font-semibold">Action Taken:</span>{" "}
                          {behavior.actionTaken}
                        </p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(behavior.date), "MMM dd, yyyy")} • By{" "}
                          {behavior.reportedBy}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
