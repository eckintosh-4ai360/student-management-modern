import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Landmark, Download, ArrowLeft, AlertCircle, CheckCircle, Calendar, FileText } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

// Sample exam regulations data
const examRules = [
  {
    id: 1,
    title: "Arrival and Entry",
    rules: [
      "Students must arrive at least 15 minutes before the exam start time",
      "Late arrivals (up to 30 minutes) may be admitted at the discretion of the supervisor",
      "No entry is permitted after 30 minutes from the start of the examination",
      "Valid student ID must be presented upon entry",
    ],
  },
  {
    id: 2,
    title: "Permitted Materials",
    rules: [
      "Only approved calculators are allowed (see approved calculator list)",
      "Pencils, pens, erasers, and rulers are permitted",
      "Formula sheets must be provided by the school (no personal notes)",
      "Water bottles must be clear and label-free",
    ],
  },
  {
    id: 3,
    title: "Prohibited Items",
    rules: [
      "Mobile phones and electronic devices (must be turned off and stored)",
      "Smart watches and fitness trackers",
      "Books, notes, or unauthorized reference materials",
      "Communication with other students during the exam",
    ],
  },
  {
    id: 4,
    title: "During the Examination",
    rules: [
      "Silence must be maintained at all times",
      "Raise your hand if you need assistance from a supervisor",
      "No student may leave during the first 30 minutes or last 15 minutes",
      "All answers must be written in the designated answer booklet",
    ],
  },
];

const importantDates = [
  {
    id: 1,
    event: "Mid-Term Examinations",
    dateRange: "March 15-22, 2024",
    status: "upcoming",
  },
  {
    id: 2,
    event: "Final Examinations",
    dateRange: "June 10-24, 2024",
    status: "upcoming",
  },
  {
    id: 3,
    event: "Exam Timetable Release",
    dateRange: "February 28, 2024",
    status: "completed",
  },
  {
    id: 4,
    event: "Special Accommodation Requests Deadline",
    dateRange: "March 1, 2024",
    status: "upcoming",
  },
];

const faqs = [
  {
    question: "What should I do if I feel unwell during an exam?",
    answer: "Raise your hand immediately to notify the exam supervisor. They will assist you and document the situation. You may be eligible for special consideration.",
  },
  {
    question: "Can I use a bathroom during the examination?",
    answer: "Yes, but you must be accompanied by a supervisor. You will not be given extra time for bathroom breaks, so plan accordingly.",
  },
  {
    question: "What happens if I'm caught cheating?",
    answer: "Academic dishonesty is taken very seriously. Penalties range from a zero on the exam to expulsion, depending on the severity of the violation.",
  },
  {
    question: "How do I request special accommodations?",
    answer: "Students requiring special accommodations (extra time, separate room, etc.) must submit a request through the Student Services office at least two weeks before the exam date.",
  },
];

const documents = [
  {
    id: 1,
    title: "Complete Examination Regulations",
    description: "Full official document outlining all examination policies and procedures",
    fileSize: "850 KB",
  },
  {
    id: 2,
    title: "Academic Integrity Policy",
    description: "Guidelines on academic honesty and consequences of violations",
    fileSize: "420 KB",
  },
  {
    id: 3,
    title: "Special Accommodations Form",
    description: "Application form for students requiring exam accommodations",
    fileSize: "180 KB",
  },
];

export default function ExamRegulationsPage() {
  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link href="/dashboard/lessons">
          <Button variant="ghost" size="sm" className="w-fit gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Lessons
          </Button>
        </Link>
        
        <div className="border-b pb-6 border-border/50">
          <div className="flex items-start gap-4">
            <div className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg">
              <Landmark className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-black tracking-tight text-foreground">Exam Regulations</h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Official rules and protocols for the upcoming examination period
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Important Dates */}
      <Card className="border-orange-200 dark:border-orange-900 bg-orange-50 dark:bg-orange-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-600" />
            Important Dates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {importantDates.map((date) => (
              <div key={date.id} className="flex items-center justify-between p-3 bg-background rounded-lg border">
                <div className="flex items-center gap-3">
                  {date.status === "completed" ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                  )}
                  <div>
                    <p className="font-semibold">{date.event}</p>
                    <p className="text-sm text-muted-foreground">{date.dateRange}</p>
                  </div>
                </div>
                <Badge variant={date.status === "completed" ? "secondary" : "default"}>
                  {date.status === "completed" ? "Completed" : "Upcoming"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Exam Rules */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Examination Rules & Procedures</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {examRules.map((section) => (
            <Card key={section.id} className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="bg-muted/10 border-b">
                <CardTitle className="text-lg">{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-2">
                  {section.rules.map((rule, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300">
              <CardContent className="pt-6">
                <h3 className="font-bold text-base mb-2 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  {faq.question}
                </h3>
                <p className="text-sm text-muted-foreground pl-7">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Downloadable Documents */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="w-6 h-6 text-orange-600" />
          Official Documents
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <Card key={doc.id} className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold">{doc.title}</CardTitle>
                <CardDescription className="text-sm">{doc.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium">{doc.fileSize}</span>
                  <Button size="sm" className="gap-2">
                    <Download className="w-3 h-3" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Warning Card */}
      <Card className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-100 mb-1">
                Academic Integrity Warning
              </h3>
              <p className="text-sm text-red-800 dark:text-red-200">
                All students are expected to maintain the highest standards of academic integrity. 
                Any form of cheating, plagiarism, or unauthorized collaboration will result in serious 
                consequences including potential expulsion. Familiarize yourself with the academic 
                integrity policy before taking any examination.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
