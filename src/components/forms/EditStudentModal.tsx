"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { updateStudent } from "@/lib/actions";
import { studentSchema } from "@/lib/formValidationSchemas";
import { Upload, X } from "lucide-react";
import Image from "next/image";

interface EditStudentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: {
    id: string;
    username: string;
    name: string;
    surname: string;
    email: string | null;
    phone: string | null;
    address: string;
    bloodType: string;
    sex: string;
    birthday: Date;
    img?: string | null;
    class: { id: number; name: string };
    grade: { id: number; level: number };
    parent: { id: string; name?: string; surname?: string; phone?: string } | null;
  };
  grades: { id: number; level: number }[];
  classes: { id: number; name: string; gradeId: number }[];
  parents: { id: string; name: string; surname: string }[];
}

export function EditStudentModal({ open, onOpenChange, student, grades, classes, parents }: EditStudentModalProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string>("");
  const [birthday, setBirthday] = useState<Date | null>(new Date(student.birthday));
  const [selectedGrade, setSelectedGrade] = useState(student.grade.id.toString());
  const [selectedClass, setSelectedClass] = useState(student.class.id.toString());
  const [imagePreview, setImagePreview] = useState<string | null>(student.img || null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setImagePreview(student.img || null);
      setImageFile(null);
      setErrors({});
      setMessage("");
      setBirthday(new Date(student.birthday));
      setSelectedGrade(student.grade.id.toString());
      setSelectedClass(student.class.id.toString());
    }
  }, [open, student]);

  // Filter classes by selected grade - handle both numeric and string IDs
  const selectedGradeInt = parseInt(selectedGrade);
  const filteredClasses = classes.filter(cls => {
    // Handle cases where gradeId might be string or number
    const clsGradeId = typeof cls.gradeId === 'string' ? parseInt(cls.gradeId) : cls.gradeId;
    return clsGradeId === selectedGradeInt;
  });

  // If no filtered classes, show all classes (fallback)
  const displayClasses = filteredClasses.length > 0 ? filteredClasses : classes;

  // Update selectedClass when grade changes
  const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newGradeId = e.target.value;
    setSelectedGrade(newGradeId);
    
    // Find classes for new grade
    const newGradeInt = parseInt(newGradeId);
    const newFilteredClasses = classes.filter(cls => {
      const clsGradeId = typeof cls.gradeId === 'string' ? parseInt(cls.gradeId) : cls.gradeId;
      return clsGradeId === newGradeInt;
    });
    
    // Set first class of new grade, or keep current if none found
    if (newFilteredClasses.length > 0) {
      setSelectedClass(newFilteredClasses[0].id.toString());
    }
  };

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
    let imagePath: string | undefined = student.img || undefined;

    // Upload image if a new one was selected
    if (imageFile) {
      const uploadFormData = new FormData();
      uploadFormData.append("file", imageFile);

      try {
        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          setMessage("Failed to upload image: " + (errorData.error || "Unknown error"));
          return;
        }

        const uploadResult = await uploadResponse.json();
        if (uploadResult.success) {
          imagePath = uploadResult.path;
        }
      } catch (error) {
        console.error("Image upload error:", error);
        setMessage("Failed to upload image");
        return;
      }
    }

    const data = {
      id: student.id,
      username: formData.get("username") as string,
      name: formData.get("name") as string,
      surname: formData.get("surname") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
      bloodType: formData.get("bloodType") as string,
      sex: ((formData.get("sex") as string) || "MALE").toUpperCase() as "MALE" | "FEMALE",
      birthday: birthday!,
      gradeId: parseInt(formData.get("gradeId") as string),
      classId: parseInt(formData.get("classId") as string),
      parentId: formData.get("parentId") as string,
      password: formData.get("password") as string || undefined,
      img: imagePath,
    };

    const validation = studentSchema.safeParse(data);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    startTransition(async () => {
      const result = await updateStudent({ success: false, error: false }, validation.data);
      if (result.success) {
        setMessage(result.message || "Student updated successfully!");
        setTimeout(() => {
          onOpenChange(false);
          router.refresh();
        }, 1000);
      } else {
        setMessage(result.message || "Failed to update student");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Student</DialogTitle>
          <DialogDescription>Update student information</DialogDescription>
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
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
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
                  <p className="text-xs text-gray-500 mt-1">Upload a new profile picture (optional)</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username *</Label>
              <Input id="username" name="username" defaultValue={student.username} required />
              {errors.username && <p className="text-red-500 text-xs">{errors.username}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password (leave empty to keep current)</Label>
              <Input id="password" name="password" type="password" />
              {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">First Name *</Label>
              <Input id="name" name="name" defaultValue={student.name} required />
              {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="surname">Last Name *</Label>
              <Input id="surname" name="surname" defaultValue={student.surname} required />
              {errors.surname && <p className="text-red-500 text-xs">{errors.surname}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" defaultValue={student.email || ""} />
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" defaultValue={student.phone || ""} />
              {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="address">Address *</Label>
              <Input id="address" name="address" defaultValue={student.address} required />
              {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthday">Birthday *</Label>
              <DatePicker
                id="birthday"
                selected={birthday}
                onChange={(date) => setBirthday(date)}
                required
              />
              {errors.birthday && <p className="text-red-500 text-xs">{errors.birthday}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sex">Gender *</Label>
              <Select id="sex" name="sex" defaultValue={student.sex?.toUpperCase() || "MALE"} required>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </Select>
              {errors.sex && <p className="text-red-500 text-xs">{errors.sex}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bloodType">Blood Type *</Label>
              <Select id="bloodType" name="bloodType" defaultValue={student.bloodType} required>
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
              <Label htmlFor="gradeId">Grade *</Label>
              <Select 
                id="gradeId" 
                name="gradeId" 
                value={selectedGrade}
                onChange={handleGradeChange}
                required
              >
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
              <Select 
                id="classId" 
                name="classId" 
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                required
              >
                {displayClasses.length > 0 ? (
                  displayClasses.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))
                ) : (
                  <option disabled>No classes available</option>
                )}
              </Select>
              {errors.classId && <p className="text-red-500 text-xs">{errors.classId}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentId">Parent *</Label>
              <Select id="parentId" name="parentId" defaultValue={student.parent?.id || ""} required>
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
              {isPending ? "Updating..." : "Update Student"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

