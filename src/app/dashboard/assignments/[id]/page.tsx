import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  Calendar, Clock, Users, BookOpen, FileText, 
  CheckCircle, XCircle, Plus, Edit, Upload 
} from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AddQuestionButton } from "@/components/forms/AddQuestionButton";
import { StudentAssignmentTaking } from "@/components/forms/StudentAssignmentTaking";

export default async function AssignmentViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as any)?.role || "student";
  const userId = (session?.user as any)?.id;

  const assignment = await prisma.assignment.findUnique({
    where: { id: parseInt(id) },
    include: {
      lesson: {
        include: {
          subject: true,
          class: true,
          teacher: true,
        },
      },
      questions: {
        include: {
          options: true,
          answers: userRole === "student" && userId ? {
            where: { studentId: userId },
          } : false,
        },
        orderBy: { createdAt: "asc" },
      },
      results: {
        include: {
          student: true,
        },
      },
    },
  });

  if (!assignment) {
    notFound();
  }

  const isOverdue = new Date(assignment.dueDate) < new Date();
  const totalPoints = assignment.questions.reduce((sum, q) => sum + q.points, 0);
  
  // Get student's existing answers if student
  const existingAnswers = userRole === "student" && userId 
    ? assignment.questions.flatMap(q => 
        q.answers.map((a: any) => ({
          questionId: q.id,
          answerText: a.answerText,
          selectedOptionId: a.selectedOptionId,
          isCorrect: a.isCorrect,
          pointsEarned: a.pointsEarned,
        }))
      )
    : [];

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-8 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">{assignment.title}</h1>
            <p className="text-purple-100 text-lg mb-4">
              {assignment.lesson.subject.name} • {assignment.lesson.class.name}
            </p>
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Due: {format(new Date(assignment.dueDate), "MMM dd, yyyy")}</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span className={isOverdue ? "text-red-200" : ""}>
                  {isOverdue ? "Overdue" : "Upcoming"}
                </span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                <span>{assignment.questions.length} Questions</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span>{totalPoints} Points</span>
              </div>
            </div>
          </div>
          <Link href="/dashboard/assignments">
            <Button variant="secondary" className="bg-white text-purple-600 hover:bg-purple-50">
              Back to Assignments
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500 hover:shadow-xl transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Users className="w-4 h-4 mr-2 text-blue-500" />
              Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-blue-600">{assignment.results.length}</div>
            <p className="text-xs text-gray-500 mt-1">Student submissions</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-xl transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <FileText className="w-4 h-4 mr-2 text-green-500" />
              Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-600">{assignment.questions.length}</div>
            <p className="text-xs text-gray-500 mt-1">Total questions</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 hover:shadow-xl transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-orange-500" />
              Total Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-orange-600">{totalPoints}</div>
            <p className="text-xs text-gray-500 mt-1">Maximum score</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 hover:shadow-xl transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <BookOpen className="w-4 h-4 mr-2 text-purple-500" />
              Teacher
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-purple-600">
              {assignment.lesson.teacher.name} {assignment.lesson.teacher.surname}
            </div>
            <p className="text-xs text-gray-500 mt-1">Assignment creator</p>
          </CardContent>
        </Card>
      </div>

      {/* Questions Section */}
      {userRole === "student" ? (
        // Student view - taking assignment
        assignment.questions.length > 0 ? (
          <StudentAssignmentTaking
            assignmentId={assignment.id}
            questions={assignment.questions.map(q => ({
              id: q.id,
              questionType: q.questionType,
              questionText: q.questionText,
              points: q.points,
              fileUrl: q.fileUrl,
              fileType: q.fileType,
              options: q.options,
            }))}
            studentId={userId}
            existingAnswers={existingAnswers}
          />
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No questions available yet</p>
              <p className="text-gray-400 text-sm mt-2">
                Your teacher hasn't added questions to this assignment
              </p>
            </CardContent>
          </Card>
        )
      ) : (
        // Teacher view - managing questions
        <Card>
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center text-lg">
                <FileText className="w-6 h-6 mr-3 text-purple-600" />
                Assignment Questions
              </CardTitle>
              {userRole === "teacher" && (
                <AddQuestionButton assignmentId={assignment.id} />
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {assignment.questions.length > 0 ? (
              <div className="space-y-6">
                {assignment.questions.map((question, index) => (
                  <div
                    key={question.id}
                    className="p-6 rounded-xl border-2 border-gray-200 hover:border-purple-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start flex-1">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center font-bold mr-4 flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                question.questionType === "THEORY"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {question.questionType === "THEORY" ? "Theory" : "Multiple Choice"}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                              {question.points} Points
                            </span>
                          </div>
                          <p className="text-gray-900 text-lg font-medium mb-3">{question.questionText}</p>
                          
                          {/* File attachment */}
                          {question.fileUrl && (
                            <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center">
                              <Upload className="w-4 h-4 text-gray-600 mr-2" />
                              <span className="text-sm text-gray-700">Attachment: </span>
                              <a 
                                href={question.fileUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline ml-2"
                              >
                                View {question.fileType?.toUpperCase()} file
                              </a>
                            </div>
                          )}

                          {/* Multiple choice options */}
                          {question.questionType === "MULTIPLE_CHOICE" && question.options.length > 0 && (
                            <div className="space-y-2 mt-4">
                              {question.options.map((option, optIndex) => (
                                <div
                                  key={option.id}
                                  className={`p-3 rounded-lg border-2 flex items-center ${
                                    option.isCorrect
                                      ? "bg-green-50 border-green-300"
                                      : "bg-white border-gray-200"
                                  }`}
                                >
                                  <div className="w-6 h-6 rounded-full border-2 border-gray-400 flex items-center justify-center mr-3 flex-shrink-0">
                                    <span className="text-sm font-semibold">
                                      {String.fromCharCode(65 + optIndex)}
                                    </span>
                                  </div>
                                  <span className="text-gray-800">{option.optionText}</span>
                                  {option.isCorrect && (
                                    <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">No questions added yet</p>
                <p className="text-gray-400 text-sm">
                  Click "Add Question" to start building this assignment
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Submissions Section */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
          <CardTitle className="flex items-center text-lg">
            <Users className="w-6 h-6 mr-3 text-blue-600" />
            Student Submissions ({assignment.results.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {assignment.results.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left p-4 font-semibold text-gray-700">Student</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Score</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Grade</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {assignment.results.map((result) => {
                    const percentage = totalPoints > 0 ? (result.score / totalPoints) * 100 : 0;
                    return (
                      <tr key={result.id} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center font-semibold mr-3">
                              {result.student.name.charAt(0)}{result.student.surname.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium">{result.student.name} {result.student.surname}</p>
                              <p className="text-sm text-gray-500">@{result.student.username}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-lg font-bold">{result.score}</span>
                          <span className="text-sm text-gray-500">/{totalPoints}</span>
                        </td>
                        <td className="p-4">
                          <span className={`text-lg font-bold ${
                            percentage >= 80 ? "text-green-600" :
                            percentage >= 60 ? "text-blue-600" :
                            percentage >= 40 ? "text-orange-600" : "text-red-600"
                          }`}>
                            {percentage.toFixed(1)}%
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                            Submitted
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No submissions yet</p>
              <p className="text-gray-400 text-sm mt-2">
                Students haven't submitted this assignment
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

