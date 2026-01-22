"use client";

import { useState, useTransition } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, Users } from "lucide-react";

interface MigrateClassTabProps {
  classes: any[];
}

export function MigrateClassTab({ classes }: MigrateClassTabProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [sourceClassId, setSourceClassId] = useState("");
  const [targetClassId, setTargetClassId] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const sourceClass = classes.find((c) => c.id === parseInt(sourceClassId));
  const targetClass = classes.find((c) => c.id === parseInt(targetClassId));

  const handleMigrate = () => {
    if (!sourceClassId || !targetClassId) {
      toast.error("Please select both source and target classes");
      return;
    }

    if (sourceClassId === targetClassId) {
      toast.error("Source and target classes cannot be the same");
      return;
    }

    setShowConfirmation(true);
  };

  const confirmMigration = () => {
    startTransition(async () => {
      try {
        // TODO: Implement migrateStudentsToClass action
        const response = await fetch("/api/classes/migrate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sourceClassId: parseInt(sourceClassId),
            targetClassId: parseInt(targetClassId),
          }),
        });

        const result = await response.json();

        if (response.ok) {
          toast.success(`Successfully migrated ${sourceClass?.students.length} students to ${targetClass?.name}`);
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select source class...</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name} (Grade {cls.grade.level}) - {cls.students.length} students
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-center">
          <ArrowRight className="w-8 h-8 text-blue-600" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetClass">Target Class</Label>
          <select
            id="targetClass"
            value={targetClassId}
            onChange={(e) => setTargetClassId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 mb-2">Migration Preview</h4>
              <p className="text-sm text-blue-800 mb-3">
                You are about to migrate <strong>{sourceClass.students.length} students</strong> from{" "}
                <strong>{sourceClass.name}</strong> to <strong>{targetClass.name}</strong>.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4" />
                  <span className="font-medium">Students to migrate:</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto">
                  {sourceClass.students.map((student: any) => (
                    <div key={student.id} className="text-xs bg-white px-2 py-1 rounded border">
                      {student.name} {student.surname}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Warning Message */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-yellow-900 mb-1">Important Notice</h4>
            <p className="text-sm text-yellow-800">
              This action will move all students from the source class to the target class. This operation is typically
              performed at the end of an academic term or year. Please ensure you have selected the correct classes before
              proceeding.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t">
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
          disabled={!sourceClassId || !targetClassId || isPending}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Migrate Students
        </Button>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4 text-red-600">Confirm Migration</h3>
            <p className="text-gray-700 mb-6">
              Are you absolutely sure you want to migrate <strong>{sourceClass?.students.length} students</strong> from{" "}
              <strong>{sourceClass?.name}</strong> to <strong>{targetClass?.name}</strong>?
            </p>
            <p className="text-sm text-gray-600 mb-6">This action cannot be easily undone.</p>
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
                className="bg-red-600 hover:bg-red-700"
              >
                {isPending ? "Migrating..." : "Yes, Migrate"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
