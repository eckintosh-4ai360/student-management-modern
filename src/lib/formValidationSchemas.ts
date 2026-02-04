import { z } from "zod";

export const subjectSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: "Subject name is required!" }),
  teachers: z.array(z.string()),
});

export type SubjectSchema = z.infer<typeof subjectSchema>;

export const classSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: "Class name is required!" }),
  capacity: z.number().min(1, { message: "Capacity is required!" }),
  gradeId: z.number().min(1, { message: "Grade is required!" }),
  supervisorId: z.string().optional(),
});

export type ClassSchema = z.infer<typeof classSchema>;

export const teacherSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .optional()
    .or(z.literal("")),
  name: z.string().min(1, { message: "First name is required!" }),
  surname: z.string().min(1, { message: "Last name is required!" }),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
  address: z.string(),
  img: z.string().optional(),
  bloodType: z.string().min(1, { message: "Blood Type is required!" }),
  birthday: z.date({ message: "Birthday is required!" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
  subjects: z.array(z.string()).optional(),
});

export type TeacherSchema = z.infer<typeof teacherSchema>;

export const studentSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .optional()
    .or(z.literal("")),
  name: z.string().min(1, { message: "First name is required!" }),
  surname: z.string().min(1, { message: "Last name is required!" }),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
  address: z.string(),
  img: z.string().optional(),
  bloodType: z.string().min(1, { message: "Blood Type is required!" }),
  birthday: z.date({ message: "Birthday is required!" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
  gradeId: z.number().min(1, { message: "Grade is required!" }),
  classId: z.number().min(1, { message: "Class is required!" }),
  parentId: z.string().min(1, { message: "Parent Id is required!" }),
});

export type StudentSchema = z.infer<typeof studentSchema>;

export const examSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, { message: "Title is required!" }),
  startTime: z.date({ message: "Start time is required!" }),
  endTime: z.date({ message: "End time is required!" }),
  lessonId: z.number({ message: "Lesson is required!" }),
});

export type ExamSchema = z.infer<typeof examSchema>;

export const parentSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .optional()
    .or(z.literal("")),
  name: z.string().min(1, { message: "First name is required!" }),
  surname: z.string().min(1, { message: "Last name is required!" }),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .optional()
    .or(z.literal("")),
  phone: z.string().min(1, { message: "Phone is required!" }),
  address: z.string().min(1, { message: "Address is required!" }),
});

export type ParentSchema = z.infer<typeof parentSchema>;

export const lessonSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: "Lesson name is required!" }),
  day: z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"], {
    message: "Day is required!",
  }),
  startTime: z.date({ message: "Start time is required!" }),
  endTime: z.date({ message: "End time is required!" }),
  subjectId: z.number({ message: "Subject is required!" }),
  classId: z.number({ message: "Class is required!" }),
  teacherId: z.string().min(1, { message: "Teacher is required!" }),
});

export type LessonSchema = z.infer<typeof lessonSchema>;

export const assignmentSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, { message: "Title is required!" }),
  startDate: z.date({ message: "Start date is required!" }),
  dueDate: z.date({ message: "Due date is required!" }),
  lessonId: z.number({ message: "Lesson is required!" }),
});

export type AssignmentSchema = z.infer<typeof assignmentSchema>;

export const resultSchema = z.object({
  id: z.number().optional(),
  score: z.number().min(0).max(100, { message: "Score must be between 0 and 100!" }),
  examId: z.number().optional(),
  assignmentId: z.number().optional(),
  studentId: z.string().min(1, { message: "Student is required!" }),
});

export type ResultSchema = z.infer<typeof resultSchema>;

export const attendanceSchema = z.object({
  id: z.number().optional(),
  date: z.date({ message: "Date is required!" }),
  present: z.boolean(),
  studentId: z.string().min(1, { message: "Student is required!" }),
  lessonId: z.number({ message: "Lesson is required!" }),
});

export type AttendanceSchema = z.infer<typeof attendanceSchema>;

export const eventSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, { message: "Title is required!" }),
  description: z.string().min(1, { message: "Description is required!" }),
  startTime: z.date({ message: "Start time is required!" }),
  endTime: z.date({ message: "End time is required!" }),
  classId: z.number().optional(),
});

export type EventSchema = z.infer<typeof eventSchema>;

export const announcementSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, { message: "Title is required!" }),
  description: z.string().min(1, { message: "Description is required!" }),
  date: z.date({ message: "Date is required!" }),
  classId: z.number().optional(),
});

export type AnnouncementSchema = z.infer<typeof announcementSchema>;

export const feeSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, { message: "Title is required!" }),
  amount: z.number().min(0, { message: "Amount must be positive!" }),
  dueDate: z.date({ message: "Due date is required!" }),
  status: z.enum(["PENDING", "PAID", "OVERDUE"], { message: "Status is required!" }),
  description: z.string().optional(),
  studentId: z.string().min(1, { message: "Student is required!" }),
});

export type FeeSchema = z.infer<typeof feeSchema>;

export const adminSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .optional()
    .or(z.literal("")),
  name: z.string().min(1, { message: "Name is required!" }),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .optional()
    .or(z.literal("")),
  img: z.string().optional(),
  role: z.enum(["SUPER_ADMIN", "ADMIN"], { message: "Role is required!" }),
});

export type AdminSchema = z.infer<typeof adminSchema>;

export const timetableSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, { message: "Title is required!" }),
  semester: z.string().min(1, { message: "Semester is required!" }),
  academicYear: z.string().min(1, { message: "Academic Year is required!" }),
  fileUrl: z.string().min(1, { message: "File URL is required!" }),
  fileType: z.enum(["PDF", "IMAGE"], { message: "File type is required!" }),
});

export type TimetableSchema = z.infer<typeof timetableSchema>;

