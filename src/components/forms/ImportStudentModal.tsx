"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Download, AlertCircle, CheckCircle2 } from "lucide-react";
import * as XLSX from "xlsx";
import Papa from "papaparse";

interface ImportStudentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parents: { id: string; name: string; surname: string }[];
  classes: { id: number; name: string }[];
  grades: { id: number; level: number }[];
}

interface StudentRow {
  username: string;
  password?: string;
  name: string;
  surname: string;
  email?: string;
  phone?: string;
  address: string;
  bloodType: string;
  sex: "MALE" | "FEMALE";
  birthday: string;
  parentFirstName?: string;
  parentLastName?: string;
  classId: string;
  gradeId: string;
  [key: string]: any;
}

interface ImportResult {
  successful: number;
  failed: number;
  errors: { row: number; message: string }[];
}

export function ImportStudentModal({ open, onOpenChange, parents, classes, grades }: ImportStudentModalProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<StudentRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string>("");
  const [step, setStep] = useState<"upload" | "preview" | "result">("upload");

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setError("");
    setFile(selectedFile);

    try {
      const fileType = selectedFile.name.split(".").pop()?.toLowerCase();
      let data: StudentRow[] = [];

      if (fileType === "xlsx" || fileType === "xls") {
        // Parse Excel file
        const buffer = await selectedFile.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        data = XLSX.utils.sheet_to_json(worksheet) as StudentRow[];
      } else if (fileType === "csv") {
        // Parse CSV file
        const text = await selectedFile.text();
        const result = Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: false,
        });
        data = result.data as StudentRow[];
      } else {
        setError("Please upload an Excel (.xlsx, .xls) or CSV (.csv) file");
        setFile(null);
        return;
      }

      if (data.length === 0) {
        setError("File is empty or has no valid data");
        setFile(null);
        return;
      }

      setPreview(data.slice(0, 5)); // Show first 5 rows for preview
      setStep("preview");
    } catch (err) {
      console.error("File parsing error:", err);
      setError("Failed to parse file. Please check the file format.");
      setFile(null);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setIsLoading(true);
    setError("");

    try {
      const fileType = file.name.split(".").pop()?.toLowerCase();
      let data: StudentRow[] = [];

      if (fileType === "xlsx" || fileType === "xls") {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        data = XLSX.utils.sheet_to_json(worksheet) as StudentRow[];
      } else if (fileType === "csv") {
        const text = await file.text();
        const result = Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: false,
        });
        data = result.data as StudentRow[];
      }

      // Send to API for processing
      const response = await fetch("/api/students/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ students: data }),
      });

      const importResult = await response.json();

      if (!response.ok) {
        setError(importResult.message || "Import failed");
        setIsLoading(false);
        return;
      }

      setResult(importResult);
      setStep("result");
      router.refresh();
    } catch (err) {
      console.error("Import error:", err);
      setError("Failed to import students. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadTemplate = () => {
    const templateData = [
      {
        username: "johndoe",
        password: "password123",
        name: "John",
        surname: "Doe",
        email: "john@example.com",
        phone: "123456789",
        address: "123 Main St",
        bloodType: "O+",
        sex: "MALE",
        birthday: "2008-05-15",
        parentFirstName: "Jane",
        parentLastName: "Doe",
        classId: `${classes[0]?.id || "1"}`,
        gradeId: `${grades[0]?.id || "1"}`,
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    XLSX.writeFile(workbook, "student-import-template.xlsx");
  };

  const handleReset = () => {
    setFile(null);
    setPreview([]);
    setResult(null);
    setError("");
    setStep("upload");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    handleReset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Students from File</DialogTitle>
          <DialogDescription>
            Upload an Excel or CSV file with student information to bulk import them into the system
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step 1: Upload */}
          {step === "upload" && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Drag and drop your file here, or click to select
                </p>
                <p className="text-xs text-gray-500 mb-4">Supported formats: Excel (.xlsx, .xls) or CSV (.csv)</p>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileSelect}
                  className="cursor-pointer"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-medium text-blue-900 mb-2">Required Columns:</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-blue-800">
                  <div>• username (unique)</div>
                  <div>• name (first name)</div>
                  <div>• surname (last name)</div>
                  <div>• email (optional)</div>
                  <div>• phone (optional)</div>
                  <div>• address</div>
                  <div>• bloodType</div>
                  <div>• sex (MALE/FEMALE)</div>
                  <div>• birthday (YYYY-MM-DD)</div>
                  <div>• parentFirstName (optional)</div>
                  <div>• parentLastName (optional)</div>
                  <div>• classId</div>
                  <div>• gradeId</div>
                </div>
              </div>

              <Button onClick={downloadTemplate} variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download Sample Template
              </Button>
            </div>
          )}

          {/* Step 2: Preview */}
          {step === "preview" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Preview (First 5 rows)</h3>
                <div className="overflow-x-auto border rounded-lg">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-2 py-2 text-left">Username</th>
                        <th className="px-2 py-2 text-left">Name</th>
                        <th className="px-2 py-2 text-left">Surname</th>
                        <th className="px-2 py-2 text-left">Email</th>
                        <th className="px-2 py-2 text-left">Class ID</th>
                        <th className="px-2 py-2 text-left">Grade ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {preview.map((row, idx) => (
                        <tr key={idx} className="border-t hover:bg-muted/50 transition-colors">
                          <td className="px-2 py-2">{row.username}</td>
                          <td className="px-2 py-2">{row.name}</td>
                          <td className="px-2 py-2">{row.surname}</td>
                          <td className="px-2 py-2">{row.email || "-"}</td>
                          <td className="px-2 py-2">{row.classId}</td>
                          <td className="px-2 py-2">{row.gradeId}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={handleReset} variant="outline" className="flex-1">
                  Back
                </Button>
                <Button onClick={handleImport} disabled={isLoading} className="flex-1">
                  {isLoading ? "Importing..." : "Import Students"}
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Result */}
          {step === "result" && result && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <p className="font-medium text-green-900">Successful</p>
                  </div>
                  <p className="text-2xl font-bold text-green-600">{result.successful}</p>
                </div>
                <div className={`border rounded-lg p-4 ${
                  result.failed > 0 
                    ? "bg-red-50 border-red-200" 
                    : "bg-green-50 border-green-200"
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {result.failed > 0 && <AlertCircle className="w-5 h-5 text-red-600" />}
                    <p className={`font-medium ${result.failed > 0 ? "text-red-900" : "text-green-900"}`}>
                      Failed
                    </p>
                  </div>
                  <p className={`text-2xl font-bold ${result.failed > 0 ? "text-red-600" : "text-green-600"}`}>
                    {result.failed}
                  </p>
                </div>
              </div>

              {result.errors.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-yellow-900 mb-2">Errors:</p>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {result.errors.map((err, idx) => (
                      <p key={idx} className="text-xs text-yellow-800">
                        Row {err.row}: {err.message}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              <Button onClick={handleClose} className="w-full">
                Close
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
