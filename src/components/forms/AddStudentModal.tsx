"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { createStudent } from "@/lib/actions";
import { studentSchema, StudentSchema } from "@/lib/formValidationSchemas";
import { Upload, X } from "lucide-react";
import Image from "next/image";

interface AddStudentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parents: { id: string; name: string; surname: string }[];
  classes: { id: number; name: string }[];
  grades: { id: number; level: number }[];
}

export function AddStudentModal({ open, onOpenChange, parents, classes, grades }: AddStudentModalProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string>("");
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setMessage("");

    const formData = new FormData(e.currentTarget);
    const data = {
      username: formData.get("username") as string,
      password: formData.get("password") as string,
      name: formData.get("name") as string,
      surname: formData.get("surname") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
      bloodType: formData.get("bloodType") as string,
      birthday: birthday!,
      sex: formData.get("sex") as "MALE" | "FEMALE",
      gradeId: parseInt(formData.get("gradeId") as string),
      classId: parseInt(formData.get("classId") as string),
      parentId: formData.get("parentId") as string,
      img: imagePreview || undefined,
    };

    // Validate
    const validation = studentSchema.safeParse(data);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    startTransition(async () => {
      const result = await createStudent({ success: false, error: false }, validation.data);
      if (result.success) {
        setMessage(result.message || "Student created successfully!");
        setTimeout(() => {
          onOpenChange(false);
          router.refresh();
        }, 1000);
      } else {
        setMessage(result.message || "Failed to create student");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
          <DialogDescription>Fill in the student information below</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Profile Picture Upload */}
            <div className="space-y-2 col-span-2">
              <Label htmlFor="img">Profile Picture</Label>
              <div className="flex items-center gap-4">
                {imagePreview ? (
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                    <Image
                      src={imagePreview}
                      alt="Profile preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    id="img"
                    name="img"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-1">Upload a profile picture (optional)</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username *</Label>
              <Input id="username" name="username" required />
              {errors.username && <p className="text-red-500 text-xs">{errors.username}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input id="password" name="password" type="password" placeholder="Leave empty for default" />
              {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">First Name *</Label>
              <Input id="name" name="name" required />
              {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="surname">Last Name *</Label>
              <Input id="surname" name="surname" required />
              {errors.surname && <p className="text-red-500 text-xs">{errors.surname}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" />
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" type="tel" />
              {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="address">Address *</Label>
              <Input id="address" name="address" required />
              {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bloodType">Blood Type *</Label>
              <Select id="bloodType" name="bloodType" required>
                <option value="">Select Blood Type</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </Select>
              {errors.bloodType && <p className="text-red-500 text-xs">{errors.bloodType}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthday">Birthday *</Label>
              <DatePicker
                id="birthday"
                name="birthday"
                selected={birthday}
                onChange={(date) => setBirthday(date)}
                placeholder="Select birthday"
                required
                maxDate={new Date()}
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
                dateFormat="MM/dd/yyyy"
              />
              {errors.birthday && <p className="text-red-500 text-xs">{errors.birthday}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sex">Sex *</Label>
              <Select id="sex" name="sex" required>
                <option value="">Select Sex</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </Select>
              {errors.sex && <p className="text-red-500 text-xs">{errors.sex}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gradeId">Grade *</Label>
              <Select id="gradeId" name="gradeId" required>
                <option value="">Select Grade</option>
                {grades.map((grade) => (
                  <option key={grade.id} value={grade.id}>
                    Grade {grade.level}
                  </option>
                ))}
              </Select>
              {errors.gradeId && <p className="text-red-500 text-xs">{errors.gradeId}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="classId">Class *</Label>
              <Select id="classId" name="classId" required>
                <option value="">Select Class</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </Select>
              {errors.classId && <p className="text-red-500 text-xs">{errors.classId}</p>}
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="parentId">Parent *</Label>
              <Select id="parentId" name="parentId" required>
                <option value="">Select Parent</option>
                {parents.map((parent) => (
                  <option key={parent.id} value={parent.id}>
                    {parent.name} {parent.surname}
                  </option>
                ))}
              </Select>
              {errors.parentId && <p className="text-red-500 text-xs">{errors.parentId}</p>}
            </div>
          </div>

          {message && (
            <div className={`p-3 rounded ${message.includes("success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {message}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Student"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

