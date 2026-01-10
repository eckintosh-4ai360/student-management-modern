"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Plus, Trash2, Upload, FileText, Image as ImageIcon, File } from "lucide-react";
import { createAssignmentQuestion } from "@/lib/actions";

interface AddQuestionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignmentId: number;
}

interface Option {
  text: string;
  isCorrect: boolean;
}

export function AddQuestionModal({ open, onOpenChange, assignmentId }: AddQuestionModalProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string>("");
  const [questionType, setQuestionType] = useState<"THEORY" | "MULTIPLE_CHOICE">("THEORY");
  const [questionText, setQuestionText] = useState("");
  const [points, setPoints] = useState("10");
  const [options, setOptions] = useState<Option[]>([
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ]);
  const [file, setFile] = useState<File | null>(null);

  const addOption = () => {
    setOptions([...options, { text: "", isCorrect: false }]);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, field: "text" | "isCorrect", value: string | boolean) => {
    const newOptions = [...options];
    if (field === "isCorrect" && value === true) {
      // Only one correct answer allowed
      newOptions.forEach((opt, i) => {
        opt.isCorrect = i === index;
      });
    } else {
      newOptions[index][field] = value as never;
    }
    setOptions(newOptions);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/gif"
      ];
      
      if (validTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
      } else {
        setMessage("Please upload a valid file (PDF, Word, or Image)");
        e.target.value = "";
      }
    }
  };

  const resetForm = () => {
    setQuestionText("");
    setPoints("10");
    setQuestionType("THEORY");
    setOptions([
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ]);
    setFile(null);
    setMessage("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    // Validation
    if (!questionText.trim()) {
      setMessage("Please enter a question");
      return;
    }

    if (questionType === "MULTIPLE_CHOICE") {
      const filledOptions = options.filter(opt => opt.text.trim());
      if (filledOptions.length < 2) {
        setMessage("Please provide at least 2 options for multiple choice");
        return;
      }
      
      const hasCorrect = options.some(opt => opt.isCorrect && opt.text.trim());
      if (!hasCorrect) {
        setMessage("Please mark one option as correct");
        return;
      }
    }

    const formData = new FormData();
    formData.append("assignmentId", assignmentId.toString());
    formData.append("questionType", questionType);
    formData.append("questionText", questionText);
    formData.append("points", points);
    
    if (file) {
      formData.append("file", file);
    }

    if (questionType === "MULTIPLE_CHOICE") {
      const validOptions = options.filter(opt => opt.text.trim());
      formData.append("options", JSON.stringify(validOptions));
    }

    startTransition(async () => {
      const result = await createAssignmentQuestion({ success: false, error: false }, formData);
      if (result.success) {
        setMessage(result.message || "Question added successfully!");
        resetForm();
        setTimeout(() => {
          onOpenChange(false);
          router.refresh();
        }, 1000);
      } else {
        setMessage(result.message || "Failed to add question");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) resetForm();
      onOpenChange(isOpen);
    }}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Question to Assignment</DialogTitle>
          <DialogDescription>Create a theory or multiple choice question</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Question Type */}
          <div className="space-y-2">
            <Label htmlFor="questionType">Question Type *</Label>
            <Select
              id="questionType"
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value as "THEORY" | "MULTIPLE_CHOICE")}
            >
              <option value="THEORY">Theory (Text Answer)</option>
              <option value="MULTIPLE_CHOICE">Multiple Choice</option>
            </Select>
            <p className="text-xs text-gray-500">
              {questionType === "THEORY" 
                ? "Students will write a text answer"
                : "Students will select one correct option"}
            </p>
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <Label htmlFor="questionText">Question *</Label>
            <Textarea
              id="questionText"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Enter your question here..."
              rows={4}
              required
            />
          </div>

          {/* Points */}
          <div className="space-y-2">
            <Label htmlFor="points">Points *</Label>
            <Input
              id="points"
              type="number"
              min="1"
              max="100"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              required
            />
            <p className="text-xs text-gray-500">Points awarded for correct answer</p>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="file">Attachment (Optional)</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-purple-400 transition-colors">
              <div className="flex flex-col items-center">
                <Upload className="w-12 h-12 text-gray-400 mb-3" />
                <label
                  htmlFor="file"
                  className="cursor-pointer text-sm text-blue-600 hover:text-blue-700 font-medium mb-2"
                >
                  Click to upload or drag and drop
                </label>
                <p className="text-xs text-gray-500">PDF, Word, or Image files (Max 10MB)</p>
                <Input
                  id="file"
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
              {file && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 flex items-center justify-between">
                  <div className="flex items-center">
                    {file.type.startsWith("image/") ? (
                      <ImageIcon className="w-5 h-5 text-blue-600 mr-2" />
                    ) : file.type.includes("pdf") ? (
                      <FileText className="w-5 h-5 text-red-600 mr-2" />
                    ) : (
                      <File className="w-5 h-5 text-blue-600 mr-2" />
                    )}
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setFile(null)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Multiple Choice Options */}
          {questionType === "MULTIPLE_CHOICE" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Answer Options *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOption}
                  className="flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Add Option
                </Button>
              </div>
              <div className="space-y-3">
                {options.map((option, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 ${
                      option.isCorrect
                        ? "border-green-400 bg-green-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex items-center gap-2 flex-1">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <Input
                          value={option.text}
                          onChange={(e) => updateOption(index, "text", e.target.value)}
                          placeholder={`Option ${String.fromCharCode(65 + index)}`}
                          className="flex-1"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="correctOption"
                            checked={option.isCorrect}
                            onChange={() => updateOption(index, "isCorrect", true)}
                            className="w-4 h-4 text-green-600 mr-2"
                          />
                          <span className="text-sm text-gray-600">Correct</span>
                        </label>
                        {options.length > 2 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeOption(index)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500">
                Mark one option as correct. Students will select the correct answer.
              </p>
            </div>
          )}

          {message && (
            <div
              className={`p-4 rounded-lg ${
                message.includes("success")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="bg-purple-600 hover:bg-purple-700">
              {isPending ? "Adding..." : "Add Question"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

