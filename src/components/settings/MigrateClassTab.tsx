"use client";

import { useState, useTransition, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, Users, Check, Square, CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface MigrateClassTabProps {
  classes: any[];
}

export function MigrateClassTab({ classes }: MigrateClassTabProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [sourceClassId, setSourceClassId] = useState("");
  const [targetClassId, setTargetClassId] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);

  const sourceClass = classes.find((c) => c.id === parseInt(sourceClassId));
  const targetClass = classes.find((c) => c.id === parseInt(targetClassId));

  // Initialize selected students when source class changes
  useEffect(() => {
    if (sourceClass) {
      setSelectedStudentIds(sourceClass.students.map((s: any) => s.id));
    } else {
      setSelectedStudentIds([]);
    }
  }, [sourceClass]);

  const toggleStudent = (studentId: number) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const selectAll = () => {
    if (sourceClass) {
      setSelectedStudentIds(sourceClass.students.map((s: any) => s.id));
    }
  };

  const deselectAll = () => {
    setSelectedStudentIds([]);
  };

  const handleMigrate = () => {
    if (!sourceClassId || !targetClassId) {
      toast.error("Please select both source and target classes");
      return;
    }

    if (sourceClassId === targetClassId) {
      toast.error("Source and target classes cannot be the same");
      return;
    }

    if (selectedStudentIds.length === 0) {
      toast.error("Please select at least one student to migrate");
      return;
    }

    setShowConfirmation(true);
  };

  const confirmMigration = () => {
    startTransition(async () => {
      try {
        const response = await fetch("/api/classes/migrate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sourceClassId: parseInt(sourceClassId),
            targetClassId: parseInt(targetClassId),
            studentIds: selectedStudentIds, // Pass the selected student IDs
          }),
        });

        const result = await response.json();

        if (response.ok) {
          toast.success(`Successfully migrated ${selectedStudentIds.length} students to ${targetClass?.name}`);
          setSourceClassId("");
          setTargetClassId("");
          setShowConfirmation(false);
          router.refresh();
        } else {
          toast.error(result.error || "Failed to migrate students");
        }
      } catch (error) {
        console.error("Migration error:", error);
        toast.error("An error occurred during migration");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Class Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div className="space-y-2">
          <Label htmlFor="sourceClass">Source Class</Label>
          <select
            id="sourceClass"
            value={sourceClassId}
            onChange={(e) => setSourceClassId(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
          >
            <option value="">Select source class...</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name} (Grade {cls.grade.level}) - {cls.students.length} students
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-center pb-1">
          <ArrowRight className="w-8 h-8 text-primary" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetClass">Target Class</Label>
          <select
            id="targetClass"
            value={targetClassId}
            onChange={(e) => setTargetClassId(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
          >
            <option value="">Select target class...</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name} (Grade {cls.grade.level})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Migration Preview */}
      {sourceClass && targetClass && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-5">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <AlertCircle className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-lg text-foreground mb-1">Migration Preview</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Select the students you want to migrate to <strong>{targetClass.name}</strong>. 
                Unselected students will remain in <strong>{sourceClass.name}</strong>.
              </p>
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Users className="w-4 h-4 text-primary" />
                  <span>{selectedStudentIds.length} of {sourceClass.students.length} students selected</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={selectAll} className="text-xs h-8">
                    Select All
                  </Button>
                  <Button variant="ghost" size="sm" onClick={deselectAll} className="text-xs h-8 text-destructive hover:text-destructive">
                    Deselect All
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {sourceClass.students.map((student: any) => {
                  const isSelected = selectedStudentIds.includes(student.id);
                  return (
                    <button
                      key={student.id}
                      onClick={() => toggleStudent(student.id)}
                      className={cn(
                        "flex items-center gap-2 text-xs px-3 py-2 rounded-md border transition-all duration-200 text-left",
                        isSelected 
                          ? "bg-primary/10 border-primary text-primary font-medium" 
                          : "bg-card border-input text-muted-foreground hover:border-primary/50"
                      )}
                    >
                      {isSelected ? (
                        <CheckSquare className="w-3.5 h-3.5" />
                      ) : (
                        <Square className="w-3.5 h-3.5" />
                      )}
                      <span className="truncate">{student.name} {student.surname}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Warning Message */}
      <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
          <div>
            <h4 className="font-semibold text-destructive mb-1">Important Notice</h4>
            <p className="text-sm text-muted-foreground">
              Students not selected will be "repeated" and remain in their current class. 
              Please ensure you have selected the correct students before proceeding.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setSourceClassId("");
            setTargetClassId("");
            setShowConfirmation(false);
          }}
        >
          Reset
        </Button>
        <Button
          type="button"
          onClick={handleMigrate}
          disabled={!sourceClassId || !targetClassId || selectedStudentIds.length === 0 || isPending}
          className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[140px]"
        >
          {isPending ? "Processing..." : "Migrate selected"}
        </Button>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in duration-200">
            <h3 className="text-xl font-bold mb-2 text-destructive">Confirm Migration</h3>
            <p className="text-foreground mb-4">
              Are you sure you want to migrate <strong>{selectedStudentIds.length} students</strong> to <strong>{targetClass?.name}</strong>?
            </p>
            <div className="bg-muted p-3 rounded-lg mb-6 text-sm">
              <p className="text-muted-foreground">
                {sourceClass?.students.length! - selectedStudentIds.length} students will remain in {sourceClass?.name}.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowConfirmation(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={confirmMigration}
                disabled={isPending}
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              >
                {isPending ? "Migrating..." : "Confirm Migration"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
