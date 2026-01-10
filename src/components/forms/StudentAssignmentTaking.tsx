"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { submitStudentAnswers } from "@/lib/actions";
import { CheckCircle, FileText, Image, FileSpreadsheet } from "lucide-react";
import { useRouter } from "next/navigation";

type Question = {
  id: number;
  questionType: "THEORY" | "MULTIPLE_CHOICE";
  questionText: string;
  points: number;
  fileUrl: string | null;
  fileType: string | null;
  options: {
    id: number;
    optionText: string;
    isCorrect: boolean;
  }[];
};

type Props = {
  assignmentId: number;
  questions: Question[];
  studentId: string;
  existingAnswers?: {
    questionId: number;
    answerText?: string | null;
    selectedOptionId?: number | null;
    isCorrect?: boolean | null;
    pointsEarned: number;
  }[];
};

export function StudentAssignmentTaking({ 
  assignmentId, 
  questions, 
  studentId,
  existingAnswers = []
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [answers, setAnswers] = useState<Record<number, { type: "text" | "option"; value: string | number }>>(
    () => {
      const initial: Record<number, { type: "text" | "option"; value: string | number }> = {};
      existingAnswers.forEach(ans => {
        if (ans.answerText) {
          initial[ans.questionId] = { type: "text", value: ans.answerText };
        } else if (ans.selectedOptionId) {
          initial[ans.questionId] = { type: "option", value: ans.selectedOptionId };
        }
      });
      return initial;
    }
  );
  const [submitted, setSubmitted] = useState(existingAnswers.length > 0);
  const router = useRouter();

  const handleOptionSelect = (questionId: number, optionId: number) => {
    if (submitted) return;
    setAnswers(prev => ({
      ...prev,
      [questionId]: { type: "option", value: optionId }
    }));
  };

  const handleTextAnswer = (questionId: number, text: string) => {
    if (submitted) return;
    setAnswers(prev => ({
      ...prev,
      [questionId]: { type: "text", value: text }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    startTransition(async () => {
      const formData = new FormData();
      formData.append("assignmentId", assignmentId.toString());
      formData.append("studentId", studentId);
      formData.append("answers", JSON.stringify(answers));
      
      const result = await submitStudentAnswers(formData);
      if (result.success) {
        setSubmitted(true);
        router.refresh();
      }
    });
  };

  const getFileIcon = (fileType: string | null) => {
    if (!fileType) return <FileText className="w-5 h-5" />;
    if (fileType.includes("image")) return <Image className="w-5 h-5" />;
    if (fileType.includes("pdf")) return <FileText className="w-5 h-5" />;
    return <FileSpreadsheet className="w-5 h-5" />;
  };

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
  const earnedPoints = existingAnswers.reduce((sum, ans) => sum + ans.pointsEarned, 0);

  if (submitted) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Assignment Submitted!</h3>
          <p className="text-gray-600 mb-4">Your answers have been recorded</p>
          <div className="inline-block bg-blue-50 border border-blue-200 rounded-lg px-6 py-3">
            <p className="text-sm text-gray-600">Your Score</p>
            <p className="text-3xl font-bold text-blue-600">{earnedPoints} / {totalPoints}</p>
            <p className="text-sm text-gray-500">{((earnedPoints / totalPoints) * 100).toFixed(1)}%</p>
          </div>
        </div>

        <div className="space-y-6 mt-8">
          {questions.map((question, index) => {
            const existingAnswer = existingAnswers.find(a => a.questionId === question.id);
            const isCorrect = existingAnswer?.isCorrect;
            
            return (
              <div key={question.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                        {index + 1}
                      </span>
                      <span className={`text-xs font-medium px-2 py-1 rounded ${
                        question.questionType === "THEORY" 
                          ? "bg-purple-100 text-purple-700" 
                          : "bg-blue-100 text-blue-700"
                      }`}>
                        {question.questionType === "THEORY" ? "Theory" : "Multiple Choice"}
                      </span>
                      <span className="text-sm text-gray-500">{question.points} points</span>
                    </div>
                    <p className="text-gray-800 text-lg">{question.questionText}</p>
                  </div>
                  {isCorrect !== null && (
                    <div className={`ml-4 px-3 py-1 rounded-full text-sm font-medium ${
                      isCorrect 
                        ? "bg-green-100 text-green-700" 
                        : "bg-red-100 text-red-700"
                    }`}>
                      {isCorrect ? `✓ Correct (+${existingAnswer.pointsEarned})` : "✗ Incorrect"}
                    </div>
                  )}
                </div>

                {question.fileUrl && (
                  <div className="mb-4">
                    <a
                      href={question.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
                    >
                      {getFileIcon(question.fileType)}
                      <span>View attachment</span>
                    </a>
                  </div>
                )}

                {question.questionType === "MULTIPLE_CHOICE" && (
                  <div className="space-y-2 mt-4">
                    {question.options.map((option, optIndex) => {
                      const isSelected = existingAnswer?.selectedOptionId === option.id;
                      const showCorrect = submitted && option.isCorrect;
                      
                      return (
                        <div
                          key={option.id}
                          className={`p-3 rounded-lg border-2 flex items-center ${
                            showCorrect
                              ? "bg-green-50 border-green-300"
                              : isSelected && !option.isCorrect
                              ? "bg-red-50 border-red-300"
                              : isSelected
                              ? "bg-blue-50 border-blue-300"
                              : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 flex-shrink-0 ${
                            isSelected ? "border-blue-500 bg-blue-500" : "border-gray-400"
                          }`}>
                            {isSelected ? (
                              <div className="w-3 h-3 rounded-full bg-white" />
                            ) : (
                              <span className="text-sm font-semibold">
                                {String.fromCharCode(65 + optIndex)}
                              </span>
                            )}
                          </div>
                          <span className="text-gray-800 flex-1">{option.optionText}</span>
                          {showCorrect && (
                            <CheckCircle className="w-5 h-5 text-green-600 ml-2" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {question.questionType === "THEORY" && existingAnswer?.answerText && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-2">Your Answer:</p>
                    <p className="text-gray-800 whitespace-pre-wrap">{existingAnswer.answerText}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {questions.map((question, index) => (
        <div key={question.id} className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                  {index + 1}
                </span>
                <span className={`text-xs font-medium px-2 py-1 rounded ${
                  question.questionType === "THEORY" 
                    ? "bg-purple-100 text-purple-700" 
                    : "bg-blue-100 text-blue-700"
                }`}>
                  {question.questionType === "THEORY" ? "Theory" : "Multiple Choice"}
                </span>
                <span className="text-sm text-gray-500">{question.points} points</span>
              </div>
              <p className="text-gray-800 text-lg">{question.questionText}</p>
            </div>
          </div>

          {question.fileUrl && (
            <div className="mb-4">
              <a
                href={question.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
              >
                {getFileIcon(question.fileType)}
                <span>View attachment</span>
              </a>
            </div>
          )}

          {question.questionType === "MULTIPLE_CHOICE" && (
            <div className="space-y-2 mt-4">
              {question.options.map((option, optIndex) => {
                const isSelected = answers[question.id]?.value === option.id;
                
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleOptionSelect(question.id, option.id)}
                    className={`w-full p-3 rounded-lg border-2 flex items-center transition-colors ${
                      isSelected
                        ? "bg-blue-50 border-blue-500"
                        : "bg-white border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 flex-shrink-0 ${
                      isSelected ? "border-blue-500 bg-blue-500" : "border-gray-400"
                    }`}>
                      {isSelected ? (
                        <div className="w-3 h-3 rounded-full bg-white" />
                      ) : (
                        <span className="text-sm font-semibold">
                          {String.fromCharCode(65 + optIndex)}
                        </span>
                      )}
                    </div>
                    <span className="text-gray-800 text-left">{option.optionText}</span>
                  </button>
                );
              })}
            </div>
          )}

          {question.questionType === "THEORY" && (
            <div className="mt-4">
              <textarea
                value={(answers[question.id]?.value as string) || ""}
                onChange={(e) => handleTextAnswer(question.id, e.target.value)}
                placeholder="Type your answer here..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[150px]"
                required
              />
            </div>
          )}
        </div>
      ))}

      <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-6">
        <div>
          <p className="text-sm text-gray-600">Total Questions</p>
          <p className="text-2xl font-bold text-gray-900">{questions.length}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Total Points</p>
          <p className="text-2xl font-bold text-gray-900">{totalPoints}</p>
        </div>
        <Button 
          type="submit" 
          disabled={isPending || Object.keys(answers).length !== questions.length}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
        >
          {isPending ? "Submitting..." : "Submit Assignment"}
        </Button>
      </div>
    </form>
  );
}

