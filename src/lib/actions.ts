"use server";

import { revalidatePath } from "next/cache";
import prisma from "./prisma";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import {
  StudentSchema,
  TeacherSchema,
  ClassSchema,
  SubjectSchema,
  ExamSchema,
  ParentSchema,
  LessonSchema,
  AssignmentSchema,
  ResultSchema,
  AttendanceSchema,
  EventSchema,
  AnnouncementSchema,
  FeeSchema,
  AdminSchema,
  TimetableSchema,
} from "./formValidationSchemas";

type ActionState = { success: boolean; error: boolean; message?: string };

// STUDENT ACTIONS
export const createStudent = async (
  currentState: ActionState,
  data: StudentSchema
): Promise<ActionState> => {
  try {
    const hashedPassword = await bcrypt.hash(data.password || "student123", 10);
    
    // Generate unique studentId
    const year = new Date().getFullYear();
    const lastStudent = await prisma.student.findFirst({
      where: { studentId: { startsWith: `STU-${year}-` } },
      orderBy: { createdAt: "desc" },
    });
    
    let nextNumber = 1;
    if (lastStudent) {
      const lastNumber = parseInt(lastStudent.studentId.split("-")[2]);
      nextNumber = lastNumber + 1;
    }
    
    const studentId = `STU-${year}-${String(nextNumber).padStart(3, "0")}`;

    await prisma.student.create({
      data: {
        username: data.username,
        studentId: studentId,
        password: hashedPassword,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        gradeId: data.gradeId,
        classId: data.classId,
        parentId: data.parentId,
      },
    });

    revalidatePath("/dashboard/students");
    return { success: true, error: false, message: "Student created successfully!" };
  } catch (err) {
    console.error(err);
    return { success: false, error: true, message: "Failed to create student!" };
  }
};

export const updateStudent = async (
  currentState: ActionState,
  data: StudentSchema
): Promise<ActionState> => {
  if (!data.id) {
    return { success: false, error: true, message: "Student ID is required!" };
  }

  try {
    const updateData: any = {
      username: data.username,
      name: data.name,
      surname: data.surname,
      email: data.email || null,
      phone: data.phone || null,
      address: data.address,
      img: data.img || null,
      bloodType: data.bloodType,
      sex: data.sex,
      birthday: data.birthday,
      gradeId: data.gradeId,
      classId: data.classId,
      parentId: data.parentId,
    };

    if (data.password && data.password !== "") {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    await prisma.student.update({
      where: { id: data.id },
      data: updateData,
    });

    revalidatePath("/dashboard/students");
    return { success: true, error: false, message: "Student updated successfully!" };
  } catch (err) {
    console.error(err);
    return { success: false, error: true, message: "Failed to update student!" };
  }
};

export const deleteStudent = async (
  currentState: ActionState,
  data: FormData
): Promise<ActionState> => {
  const id = data.get("id") as string;

  try {
    await prisma.student.delete({
      where: { id },
    });

    revalidatePath("/dashboard/students");
    return { success: true, error: false, message: "Student deleted successfully!" };
  } catch (err) {
    console.error(err);
    return { success: false, error: true, message: "Failed to delete student!" };
  }
};

// TEACHER ACTIONS
export const createTeacher = async (
  currentState: ActionState,
  data: TeacherSchema
): Promise<ActionState> => {
  try {
    const hashedPassword = await bcrypt.hash(data.password || "teacher123", 10);
    
    // Generate unique staffId
    const lastTeacher = await prisma.teacher.findFirst({
      where: { staffId: { startsWith: "STAFF-TCH-" } },
      orderBy: { createdAt: "desc" },
    });
    
    let nextNumber = 1;
    if (lastTeacher) {
      const lastNumber = parseInt(lastTeacher.staffId.split("-")[2]);
      nextNumber = lastNumber + 1;
    }
    
    const staffId = `STAFF-TCH-${String(nextNumber).padStart(3, "0")}`;

    await prisma.teacher.create({
      data: {
        username: data.username,
        staffId: staffId,
        password: hashedPassword,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        subjects: {
          connect: data.subjects?.map((subjectId: string) => ({
            id: parseInt(subjectId),
          })),
        },
      },
    });

    revalidatePath("/dashboard/teachers");
    return { success: true, error: false, message: "Teacher created successfully!" };
  } catch (err) {
    console.error(err);
    return { success: false, error: true, message: "Failed to create teacher!" };
  }
};

export const updateTeacher = async (
  currentState: ActionState,
  data: TeacherSchema
): Promise<ActionState> => {
  if (!data.id) {
    return { success: false, error: true, message: "Teacher ID is required!" };
  }

  try {
    const updateData: any = {
      username: data.username,
      name: data.name,
      surname: data.surname,
      email: data.email || null,
      phone: data.phone || null,
      address: data.address,
      img: data.img || null,
      bloodType: data.bloodType,
      sex: data.sex,
      birthday: data.birthday,
      subjects: {
        set: data.subjects?.map((subjectId: string) => ({
          id: parseInt(subjectId),
        })),
      },
    };

    if (data.password && data.password !== "") {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    await prisma.teacher.update({
      where: { id: data.id },
      data: updateData,
    });

    revalidatePath("/dashboard/teachers");
    return { success: true, error: false, message: "Teacher updated successfully!" };
  } catch (err) {
    console.error(err);
    return { success: false, error: true, message: "Failed to update teacher!" };
  }
};

export const deleteTeacher = async (
  currentState: ActionState,
  data: FormData
): Promise<ActionState> => {
  const id = data.get("id") as string;

  try {
    await prisma.teacher.delete({
      where: { id },
    });

    revalidatePath("/dashboard/teachers");
    return { success: true, error: false, message: "Teacher deleted successfully!" };
  } catch (err) {
    console.error(err);
    return { success: false, error: true, message: "Failed to delete teacher!" };
  }
};

// CLASS ACTIONS
export const createClass = async (
  currentState: ActionState,
  data: ClassSchema
): Promise<ActionState> => {
  try {
    await prisma.class.create({
      data: {
        name: data.name,
        capacity: data.capacity,
        gradeId: data.gradeId,
        supervisorId: data.supervisorId || null,
      },
    });

    revalidatePath("/dashboard/classes");
    return { success: true, error: false, message: "Class created successfully!" };
  } catch (err) {
    console.error(err);
    return { success: false, error: true, message: "Failed to create class!" };
  }
};

export const updateClass = async (
  currentState: ActionState,
  data: ClassSchema
): Promise<ActionState> => {
  if (!data.id) {
    return { success: false, error: true, message: "Class ID is required!" };
  }

  try {
    await prisma.class.update({
      where: { id: data.id },
      data: {
        name: data.name,
        capacity: data.capacity,
        gradeId: data.gradeId,
        supervisorId: data.supervisorId || null,
      },
    });

    revalidatePath("/dashboard/classes");
    return { success: true, error: false, message: "Class updated successfully!" };
  } catch (err) {
    console.error(err);
    return { success: false, error: true, message: "Failed to update class!" };
  }
};

export const deleteClass = async (
  currentState: ActionState,
  data: FormData
): Promise<ActionState> => {
  const id = data.get("id") as string;

  try {
    await prisma.class.delete({
      where: { id: parseInt(id) },
    });

    revalidatePath("/dashboard/classes");
    return { success: true, error: false, message: "Class deleted successfully!" };
  } catch (err) {
    console.error(err);
    return { success: false, error: true, message: "Failed to delete class!" };
  }
};

// SUBJECT ACTIONS
export const createSubject = async (
  currentState: ActionState,
  data: SubjectSchema
): Promise<ActionState> => {
  try {
    await prisma.subject.create({
      data: {
        name: data.name,
        teachers: {
          connect: data.teachers.map((teacherId) => ({ id: teacherId })),
        },
      },
    });

    revalidatePath("/dashboard/subjects");
    return { success: true, error: false, message: "Subject created successfully!" };
  } catch (err) {
    console.error(err);
    return { success: false, error: true, message: "Failed to create subject!" };
  }
};

export const updateSubject = async (
  currentState: ActionState,
  data: SubjectSchema
): Promise<ActionState> => {
  if (!data.id) {
    return { success: false, error: true, message: "Subject ID is required!" };
  }

  try {
    await prisma.subject.update({
      where: { id: data.id },
      data: {
        name: data.name,
        teachers: {
          set: data.teachers.map((teacherId) => ({ id: teacherId })),
        },
      },
    });

    revalidatePath("/dashboard/subjects");
    return { success: true, error: false, message: "Subject updated successfully!" };
  } catch (err) {
    console.error(err);
    return { success: false, error: true, message: "Failed to update subject!" };
  }
};

export const deleteSubject = async (
  currentState: ActionState,
  data: FormData
): Promise<ActionState> => {
  const id = data.get("id") as string;

  try {
    await prisma.subject.delete({
      where: { id: parseInt(id) },
    });

    revalidatePath("/dashboard/subjects");
    return { success: true, error: false, message: "Subject deleted successfully!" };
  } catch (err) {
    console.error(err);
    return { success: false, error: true, message: "Failed to delete subject!" };
  }
};

// EXAM ACTIONS
export const createExam = async (
  currentState: ActionState,
  data: ExamSchema
): Promise<ActionState> => {
  try {
    await prisma.exam.create({
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        lessonId: data.lessonId,
      },
    });

    revalidatePath("/dashboard/exams");
    return { success: true, error: false, message: "Exam created successfully!" };
  } catch (err) {
    console.error(err);
    return { success: false, error: true, message: "Failed to create exam!" };
  }
};

export const updateExam = async (
  currentState: ActionState,
  data: ExamSchema
): Promise<ActionState> => {
  if (!data.id) {
    return { success: false, error: true, message: "Exam ID is required!" };
  }

  try {
    await prisma.exam.update({
      where: { id: data.id },
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        lessonId: data.lessonId,
      },
    });

    revalidatePath("/dashboard/exams");
    return { success: true, error: false, message: "Exam updated successfully!" };
  } catch (err) {
    console.error(err);
    return { success: false, error: true, message: "Failed to update exam!" };
  }
};

export const deleteExam = async (
  currentState: ActionState,
  data: FormData
): Promise<ActionState> => {
  const id = data.get("id") as string;

  try {
    await prisma.exam.delete({
      where: { id: parseInt(id) },
    });

    revalidatePath("/dashboard/exams");
    return { success: true, error: false, message: "Exam deleted successfully!" };
  } catch (err) {
    console.error(err);
    return { success: false, error: true, message: "Failed to delete exam!" };
  }
};

// PARENT ACTIONS
export const createParent = async (
  currentState: ActionState,
  data: ParentSchema
): Promise<ActionState> => {
  try {
    const hashedPassword = await bcrypt.hash(data.password || "parent123", 10);

    await prisma.parent.create({
      data: {
        username: data.username,
        password: hashedPassword,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone,
        address: data.address,
        img: data.img || null,
      },
    });

    revalidatePath("/dashboard/parents");
    return { success: true, error: false, message: "Parent created successfully!" };
  } catch (err) {
    console.error(err);
    return { success: false, error: true, message: "Failed to create parent!" };
  }
};

export const updateParent = async (
  currentState: ActionState,
  data: ParentSchema
): Promise<ActionState> => {
  if (!data.id) {
    return { success: false, error: true, message: "Parent ID is required!" };
  }

  try {
    const updateData: any = {
      username: data.username,
      name: data.name,
      surname: data.surname,
      email: data.email || null,
      phone: data.phone,
      address: data.address,
      img: data.img || null,
    };

    if (data.password && data.password !== "") {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    await prisma.parent.update({
      where: { id: data.id },
      data: updateData,
    });

    revalidatePath("/dashboard/parents");
    return { success: true, error: false, message: "Parent updated successfully!" };
  } catch (err) {
    console.error(err);
    return { success: false, error: true, message: "Failed to update parent!" };
  }
};

export const deleteParent = async (
  currentState: ActionState,
  data: FormData
): Promise<ActionState> => {
  const id = data.get("id") as string;

  try {
    await prisma.parent.delete({
      where: { id },
    });

    revalidatePath("/dashboard/parents");
    return { success: true, error: false, message: "Parent deleted successfully!" };
  } catch (err) {
    console.error(err);
    return { success: false, error: true, message: "Failed to delete parent!" };
  }
};

// ANNOUNCEMENT ACTIONS
export const createAnnouncement = async (
  currentState: ActionState,
  data: AnnouncementSchema
): Promise<ActionState> => {
  try {
    await prisma.announcement.create({
      data: {
        title: data.title,
        description: data.description,
        date: data.date,
        classId: data.classId || null,
      },
    });

    revalidatePath("/dashboard/announcements");
    return { success: true, error: false, message: "Announcement created successfully!" };
  } catch (err) {
    console.error(err);
    return { success: false, error: true, message: "Failed to create announcement!" };
  }
};

export const updateAnnouncement = async (
  currentState: ActionState,
  data: AnnouncementSchema
): Promise<ActionState> => {
  if (!data.id) {
    return { success: false, error: true, message: "Announcement ID is required!" };
  }

  try {
    await prisma.announcement.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
        date: data.date,
        classId: data.classId || null,
      },
    });

    revalidatePath("/dashboard/announcements");
    return { success: true, error: false, message: "Announcement updated successfully!" };
  } catch (err) {
    console.error(err);
    return { success: false, error: true, message: "Failed to update announcement!" };
  }
};

export const deleteAnnouncement = async (
  currentState: ActionState,
  data: FormData
): Promise<ActionState> => {
  const id = data.get("id") as string;

  try {
    await prisma.announcement.delete({
      where: { id: parseInt(id) },
    });

    revalidatePath("/dashboard/announcements");
    return { success: true, error: false, message: "Announcement deleted successfully!" };
  } catch (err) {
    console.error(err);
    return { success: false, error: true, message: "Failed to delete announcement!" };
  }
};

export const createAssignmentQuestion = async (
  currentState: ActionState,
  formData: FormData
): Promise<ActionState> => {
  try {
    const assignmentId = parseInt(formData.get("assignmentId") as string);
    const questionType = formData.get("questionType") as string;
    const questionText = formData.get("questionText") as string;
    const points = parseInt(formData.get("points") as string);
    const file = formData.get("file") as File | null;
    const optionsJson = formData.get("options") as string;

    // Handle file upload (in a real app, you'd upload to cloud storage)
    let fileUrl = null;
    let fileType = null;
    if (file && file.size > 0) {
      // For now, we'll store the filename
      // In production, upload to cloud storage (AWS S3, Cloudinary, etc.)
      fileUrl = `/uploads/${Date.now()}-${file.name}`;
      fileType = file.type.split("/")[1];
    }

    // Create the question
    const question = await prisma.assignmentQuestion.create({
      data: {
        assignmentId,
        questionType: questionType as any,
        questionText,
        points,
        fileUrl,
        fileType,
      },
    });

    // Create options if multiple choice
    if (questionType === "MULTIPLE_CHOICE" && optionsJson) {
      const options = JSON.parse(optionsJson);
      await prisma.questionOption.createMany({
        data: options.map((opt: any) => ({
          questionId: question.id,
          optionText: opt.text,
          isCorrect: opt.isCorrect,
        })),
      });
    }

    revalidatePath(`/dashboard/assignments/${assignmentId}`);
    return { success: true, error: false, message: "Question added successfully!" };
  } catch (err) {
    console.error(err);
    return { success: false, error: true, message: "Failed to add question!" };
  }
};

// SUBMIT STUDENT ANSWERS
export const submitStudentAnswers = async (
  formData: FormData
): Promise<ActionState> => {
  try {
    const assignmentId = parseInt(formData.get("assignmentId") as string);
    const studentId = formData.get("studentId") as string;
    const answersJson = formData.get("answers") as string;
    const answers = JSON.parse(answersJson);

    // Get all questions for this assignment
    const questions = await prisma.assignmentQuestion.findMany({
      where: { assignmentId },
      include: { options: true },
    });

    let totalScore = 0;

    // Process each answer
    for (const question of questions) {
      const answer = answers[question.id];
      if (!answer) continue;

      let isCorrect: boolean | null = null;
      let pointsEarned = 0;
      let answerText: string | null = null;
      let selectedOptionId: number | null = null;

      if (question.questionType === "MULTIPLE_CHOICE") {
        // Check if selected option is correct
        selectedOptionId = answer.value;
        const selectedOption = question.options.find((opt: any) => opt.id === selectedOptionId);
        isCorrect = selectedOption?.isCorrect || false;
        pointsEarned = isCorrect ? question.points : 0;
        totalScore += pointsEarned;
      } else if (question.questionType === "THEORY") {
        // Theory questions need manual grading, so set to null
        answerText = answer.value;
        isCorrect = null;
        pointsEarned = 0;
      }

      // Save or update the answer
      await prisma.studentAnswer.upsert({
        where: {
          studentId_questionId: {
            studentId,
            questionId: question.id,
          },
        },
        update: {
          answerText,
          selectedOptionId,
          isCorrect,
          pointsEarned,
        },
        create: {
          studentId,
          questionId: question.id,
          answerText,
          selectedOptionId,
          isCorrect,
          pointsEarned,
        },
      });
    }

    // Create or update Result entry for the submission
    await prisma.result.upsert({
      where: {
        assignmentId_studentId: {
          assignmentId,
          studentId,
        },
      },
      update: {
        score: totalScore,
      },
      create: {
        score: totalScore,
        assignmentId,
        studentId,
      },
    });

    revalidatePath(`/dashboard/assignments/${assignmentId}`);
    return { success: true, error: false, message: "Assignment submitted successfully!" };
  } catch (err) {
    console.error(err);
    return { success: false, error: true, message: "Failed to submit assignment!" };
  }
};

// SEND MESSAGE
export const sendMessage = async (
  formData: FormData
): Promise<ActionState> => {
  try {
    const senderId = formData.get("senderId") as string;
    const senderType = formData.get("senderType") as string;
    const receiverId = formData.get("receiverId") as string;
    const receiverType = formData.get("receiverType") as string;
    const subject = formData.get("subject") as string;
    const content = formData.get("content") as string;

    await prisma.message.create({
      data: {
        senderId,
        senderType: senderType as any,
        receiverId,
        receiverType: receiverType as any,
        subject,
        content,
      },
    });

    revalidatePath("/dashboard/messages");
    return { success: true, error: false, message: "Message sent successfully!" };
  } catch (err) {
    console.error(err);
    return { success: false, error: true, message: "Failed to send message!" };
  }
};

// MARK MESSAGE AS READ
export const markMessageAsRead = async (
  messageId: number
): Promise<ActionState> => {
  try {
    await prisma.message.update({
      where: { id: messageId },
      data: { read: true },
    });

    revalidatePath("/dashboard/messages");
    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true, message: "Failed to mark message as read!" };
  }
};

// TOGGLE MESSAGE STARRED
export const toggleMessageStarred = async (
  messageId: number,
  starred: boolean
): Promise<ActionState> => {
  try {
    await prisma.message.update({
      where: { id: messageId },
      data: { starred },
    });

    revalidatePath("/dashboard/messages");
    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true, message: "Failed to update message!" };
  }
};

// UPDATE USER PROFILE
export const updateUserProfile = async (
  formData: FormData
): Promise<ActionState> => {
  try {
    const userId = formData.get("userId") as string;
    const userType = formData.get("userType") as string;
    const name = formData.get("name") as string;
    const surname = formData.get("surname") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const profileImage = formData.get("profileImage") as File | null;

    // Prepare update data
    const updateData: any = {
      name,
      surname,
      email: email || null,
      phone: phone || null,
    };

    // Admin doesn't have surname in schema
    if (userType === "ADMIN") {
      delete updateData.surname;
    }

    // Handle image upload if provided
    if (profileImage) {
      try {
        const bytes = await profileImage.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Create unique filename
        const timestamp = Date.now();
        const filename = `${userId}-${timestamp}-${profileImage.name}`;
        const uploadDir = path.join(process.cwd(), "public/uploads");
        
        // Ensure upload directory exists
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        const filepath = path.join(uploadDir, filename);
        fs.writeFileSync(filepath, buffer);
        
        // Store relative path in database
        updateData.img = `/uploads/${filename}`;
      } catch (imageError) {
        console.error("Image upload error:", imageError);
        return { success: false, error: true, message: "Failed to upload image" };
      }
    }

    // If password change is requested, verify current password and hash new one
    if (currentPassword && newPassword) {
      let currentUser: any = null;

      // Fetch user based on type
      if (userType === "STUDENT") {
        currentUser = await prisma.student.findUnique({ where: { id: userId } });
      } else if (userType === "TEACHER") {
        currentUser = await prisma.teacher.findUnique({ where: { id: userId } });
      } else if (userType === "PARENT") {
        currentUser = await prisma.parent.findUnique({ where: { id: userId } });
      } else if (userType === "ADMIN") {
        currentUser = await prisma.admin.findUnique({ where: { id: userId } });
      }

      if (!currentUser) {
        return { success: false, error: true, message: "User not found!" };
      }

      // Verify current password
      const isPasswordValid = await bcrypt.compare(currentPassword, currentUser.password);
      if (!isPasswordValid) {
        return { success: false, error: true, message: "Current password is incorrect!" };
      }

      // Hash new password
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    // Update user based on type
    if (userType === "STUDENT") {
      await prisma.student.update({
        where: { id: userId },
        data: updateData,
      });
    } else if (userType === "TEACHER") {
      await prisma.teacher.update({
        where: { id: userId },
        data: updateData,
      });
    } else if (userType === "PARENT") {
      await prisma.parent.update({
        where: { id: userId },
        data: updateData,
      });
    } else if (userType === "ADMIN") {
      await prisma.admin.update({
        where: { id: userId },
        data: updateData,
      });
    }

    revalidatePath("/dashboard");
    return { success: true, error: false, message: "Profile updated successfully!" };
  } catch (err) {
    console.error(err);
    return { success: false, error: true, message: "Failed to update profile!" };
  }
};

// FEE ACTIONS
export const createFee = async (
  currentState: ActionState,
  data: FeeSchema
): Promise<ActionState> => {
  try {
    await prisma.fee.create({
      data: {
        title: data.title,
        amount: data.amount,
        dueDate: data.dueDate,
        status: data.status,
        description: data.description || null,
        studentId: data.studentId,
      },
    });

    revalidatePath("/dashboard/fees");
    return { success: true, error: false, message: "Fee created successfully!" };
  } catch (err) {
    console.error(err);
    return { success: false, error: true, message: "Failed to create fee!" };
  }
};

export const updateFee = async (
  currentState: ActionState,
  data: FeeSchema
): Promise<ActionState> => {
  if (!data.id) {
    return { success: false, error: true, message: "Fee ID is required!" };
  }

  try {
    await prisma.fee.update({
      where: { id: data.id },
      data: {
        title: data.title,
        amount: data.amount,
        dueDate: data.dueDate,
        status: data.status,
        description: data.description || null,
        studentId: data.studentId,
      },
    });

    revalidatePath("/dashboard/fees");
    return { success: true, error: false, message: "Fee updated successfully!" };
  } catch (err) {
    console.error(err);
    return { success: false, error: true, message: "Failed to update fee!" };
  }
};

export const deleteFee = async (
  currentState: ActionState,
  data: FormData
): Promise<ActionState> => {
  const id = data.get("id") as string;

  try {
    await prisma.fee.delete({
      where: { id: parseInt(id) },
    });

    revalidatePath("/dashboard/fees");
    return { success: true, error: false, message: "Fee deleted successfully!" };
  } catch (err) {
    console.error(err);
    return { success: false, error: true, message: "Failed to delete fee!" };
  }
};

// LESSON ACTIONS
export const createLesson = async (
  currentState: ActionState,
  data: LessonSchema
): Promise<ActionState> => {
  try {
    await prisma.lesson.create({
      data: {
        name: data.name,
        day: data.day,
        startTime: data.startTime,
        endTime: data.endTime,
        subjectId: data.subjectId,
        classId: data.classId,
        teacherId: data.teacherId,
      },
    });

    revalidatePath("/dashboard/lessons");
    return { success: true, error: false, message: "Lesson created successfully!" };
  } catch (err) {
    console.error(err);
    return { success: false, error: true, message: "Failed to create lesson!" };
  }
};

export const updateLesson = async (
  currentState: ActionState,
  data: LessonSchema
): Promise<ActionState> => {
  if (!data.id) {
    return { success: false, error: true, message: "Lesson ID is required!" };
  }

  try {
    await prisma.lesson.update({
      where: { id: data.id },
      data: {
        name: data.name,
        day: data.day,
        startTime: data.startTime,
        endTime: data.endTime,
        subjectId: data.subjectId,
        classId: data.classId,
        teacherId: data.teacherId,
      },
    });

    revalidatePath("/dashboard/lessons");
    return { success: true, error: false, message: "Lesson updated successfully!" };
  } catch (err) {
    console.error(err);
    return { success: false, error: true, message: "Failed to update lesson!" };
  }
};

export const deleteLesson = async (
  currentState: ActionState,
  data: FormData
): Promise<ActionState> => {
  const id = data.get("id") as string;

  try {
    await prisma.lesson.delete({
      where: { id: parseInt(id) },
    });

    revalidatePath("/dashboard/lessons");
    return { success: true, error: false, message: "Lesson deleted successfully!" };
  } catch (err) {
    console.error(err);
    return { success: false, error: true, message: "Failed to delete lesson!" };
  }
};

// ASSIGNMENT ACTIONS
export const createAssignment = async (
  currentState: ActionState,
  data: AssignmentSchema
): Promise<ActionState> => {
  try {
    await prisma.assignment.create({
      data: {
        title: data.title,
        startDate: data.startDate,
        dueDate: data.dueDate,
        lessonId: data.lessonId,
      },
    });

    revalidatePath("/dashboard/assignments");
    return { success: true, error: false, message: "Assignment created successfully!" };
  } catch (err) {
    console.error(err);
    return { success: false, error: true, message: "Failed to create assignment!" };
  }
};

export const updateAssignment = async (
  currentState: ActionState,
  data: AssignmentSchema
): Promise<ActionState> => {
  if (!data.id) {
    return { success: false, error: true, message: "Assignment ID is required!" };
  }

  try {
    await prisma.assignment.update({
      where: { id: data.id },
      data: {
        title: data.title,
        startDate: data.startDate,
        dueDate: data.dueDate,
        lessonId: data.lessonId,
      },
    });

    revalidatePath("/dashboard/assignments");
    return { success: true, error: false, message: "Assignment updated successfully!" };
  } catch (err) {
    console.error(err);
    return { success: false, error: true, message: "Failed to update assignment!" };
  }
};

export const deleteAssignment = async (
  currentState: ActionState,
  data: FormData
): Promise<ActionState> => {
  const id = data.get("id") as string;

  try {
    await prisma.assignment.delete({
      where: { id: parseInt(id) },
    });

    revalidatePath("/dashboard/assignments");
    return { success: true, error: false, message: "Assignment deleted successfully!" };
  } catch (err) {
    console.error(err);
    return { success: false, error: true, message: "Failed to delete assignment!" };
  }
};

// EVENT ACTIONS
export const createEvent = async (
  currentState: ActionState,
  data: EventSchema
): Promise<ActionState> => {
  try {
    await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        startTime: data.startTime,
        endTime: data.endTime,
        classId: data.classId || null,
      },
    });

    revalidatePath("/dashboard/events");
    return { success: true, error: false, message: "Event created successfully!" };
  } catch (err) {
    console.error(err);
    return { success: false, error: true, message: "Failed to create event!" };
  }
};

export const updateEvent = async (
  currentState: ActionState,
  data: EventSchema
): Promise<ActionState> => {
  if (!data.id) {
    return { success: false, error: true, message: "Event ID is required!" };
  }

  try {
    await prisma.event.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
        startTime: data.startTime,
        endTime: data.endTime,
        classId: data.classId || null,
      },
    });

    revalidatePath("/dashboard/events");
    return { success: true, error: false, message: "Event updated successfully!" };
  } catch (err) {
    console.error(err);
    return { success: false, error: true, message: "Failed to update event!" };
  }
};

export const deleteEvent = async (
  currentState: ActionState,
  data: FormData
): Promise<ActionState> => {
  const id = data.get("id") as string;
  try {
    await prisma.event.delete({
      where: { id: parseInt(id) },
    });

    revalidatePath("/dashboard/events");
    return { success: true, error: false, message: "Event deleted successfully!" };
  } catch (err) {
    console.error(err);
    return { success: false, error: true, message: "Failed to delete event!" };
  }
};

// ADMIN ACTIONS
export const createAdmin = async (
  currentState: ActionState,
  data: AdminSchema
): Promise<ActionState> => {
  try {
    const hashedPassword = await bcrypt.hash(data.password || "admin123", 10);
    
    // Generate unique staffId
    const lastAdmin = await prisma.admin.findFirst({
      where: { staffId: { startsWith: "STAFF-ADM-" } },
      orderBy: { createdAt: "desc" },
    });
    
    let nextNumber = 1;
    if (lastAdmin) {
      const lastNumber = parseInt(lastAdmin.staffId.split("-")[2]);
      nextNumber = lastNumber + 1;
    }
    
    const staffId = `STAFF-ADM-${String(nextNumber).padStart(3, "0")}`;

    let imagePath = data.img || null;

    // Handle base64 image upload if provided
    if (data.img && data.img.startsWith("data:image/")) {
      try {
        const base64Data = data.img.split(",")[1];
        const buffer = Buffer.from(base64Data, "base64");
        
        // Extract extension from data URL
        const mimeType = data.img.split(";")[0].split(":")[1];
        const extension = mimeType.split("/")[1];
        
        // Create unique filename using username
        const filename = `admin-${data.username}-${Date.now()}.${extension}`;
        const uploadDir = path.join(process.cwd(), "public/uploads");
        
        // Ensure upload directory exists
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        const filepath = path.join(uploadDir, filename);
        fs.writeFileSync(filepath, buffer);
        
        // Store relative path in database
        imagePath = `/uploads/${filename}`;
      } catch (imageError) {
        console.error("Admin image upload error:", imageError);
        // We can continue without the image rather than failing the whole creation
      }
    }

    await prisma.admin.create({
      data: {
        username: data.username,
        staffId: staffId,
        password: hashedPassword,
        name: data.name,
        email: data.email || null,
        img: imagePath,
        role: data.role,
      },
    });

    revalidatePath("/dashboard/admins");
    return { success: true, error: false, message: "Admin created successfully!" };
  } catch (err) {
    console.error(err);
    return { success: false, error: true, message: "Failed to create admin!" };
  }
};

export const updateAdmin = async (
  currentState: ActionState,
  data: AdminSchema
): Promise<ActionState> => {
  if (!data.id) {
    return { success: false, error: true, message: "Admin ID is required!" };
  }

  try {
    let imagePath = data.img || null;

    // Handle base64 image upload if provided
    if (data.img && data.img.startsWith("data:image/")) {
      try {
        const base64Data = data.img.split(",")[1];
        const buffer = Buffer.from(base64Data, "base64");
        
        // Extract extension from data URL
        const mimeType = data.img.split(";")[0].split(":")[1];
        const extension = mimeType.split("/")[1];
        
        // Create unique filename
        const filename = `admin-${data.id}-${Date.now()}.${extension}`;
        const uploadDir = path.join(process.cwd(), "public/uploads");
        
        // Ensure upload directory exists
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        const filepath = path.join(uploadDir, filename);
        fs.writeFileSync(filepath, buffer);
        
        // Store relative path in database
        imagePath = `/uploads/${filename}`;
      } catch (imageError) {
        console.error("Admin image upload error:", imageError);
        return { success: false, error: true, message: "Failed to upload image" };
      }
    }

    const updateData: any = {
      username: data.username,
      name: data.name,
      email: data.email || null,
      img: imagePath,
      role: data.role,
    };

    if (data.password && data.password !== "") {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    await prisma.admin.update({
      where: { id: data.id },
      data: updateData,
    });

    revalidatePath("/dashboard/admins");
    return { success: true, error: false, message: "Admin updated successfully!" };
  } catch (err) {
    console.error(err);
    return { success: false, error: true, message: "Failed to update admin!" };
  }
};

export const deleteAdmin = async (
  currentState: ActionState,
  data: FormData
): Promise<ActionState> => {
  const id = data.get("id") as string;

  try {
    await prisma.admin.delete({
      where: { id },
    });

    revalidatePath("/dashboard/admins");
    return { success: true, error: false, message: "Admin deleted successfully!" };
  } catch (err) {
    console.error(err);
    return { success: false, error: true, message: "Failed to delete admin!" };
  }
};

// BEHAVIOR ACTIONS
export const createBehavior = async (
  currentState: ActionState,
  data: any
): Promise<ActionState> => {
  try {
    await prisma.behavior.create({
      data: {
        studentId: data.studentId,
        title: data.title,
        description: data.description,
        type: data.type,
        severity: data.severity,
        date: new Date(data.date),
        reportedBy: data.reportedBy,
        actionTaken: data.actionTaken || null,
      },
    });

    revalidatePath("/dashboard/behavior");
    return { success: true, error: false, message: "Behavior record created successfully!" };
  } catch (err) {
    console.error(err);
    return { success: false, error: true, message: "Failed to create behavior record!" };
  }
};

export const updateBehavior = async (
  currentState: ActionState,
  data: any
): Promise<ActionState> => {
  if (!data.id) {
    return { success: false, error: true, message: "Behavior ID is required!" };
  }

  try {
    await prisma.behavior.update({
      where: { id: data.id },
      data: {
        studentId: data.studentId,
        title: data.title,
        description: data.description,
        type: data.type,
        severity: data.severity,
        date: new Date(data.date),
        reportedBy: data.reportedBy,
        actionTaken: data.actionTaken || null,
      },
    });

    revalidatePath("/dashboard/behavior");
    return { success: true, error: false, message: "Behavior record updated successfully!" };
  } catch (err) {
    console.error(err);
    return { success: false, error: true, message: "Failed to update behavior record!" };
  }
};

export const deleteBehavior = async (
  currentState: ActionState,
  data: FormData
): Promise<ActionState> => {
  const id = data.get("id") as string;

  try {
    await prisma.behavior.delete({
      where: { id: parseInt(id) },
    });

    revalidatePath("/dashboard/behavior");
    return { success: true, error: false, message: "Behavior record archived successfully!" };
  } catch (err) {
    console.error(err);
    return { success: false, error: true, message: "Failed to archive behavior record!" };
  }
};

// SYSTEM SETTINGS ACTIONS
export const updateSystemSettings = async (
  data: FormData
): Promise<ActionState> => {
  const id = data.get("id") as string;

  try {
    const updateData: any = {};
    
    const fields = [
      "schoolName", "schoolShortName", "schoolLogo", "schoolEmail", "schoolPhone",
      "schoolAddress", "schoolWebsite", "primaryColor", "secondaryColor", "accentColor",
      "emailHost", "emailUser", "smsApiKey", "smsSenderId", "academicYear",
      "currency", "timezone", "dateFormat", "currentTerm", "studentIdInitials"
    ];

    fields.forEach(field => {
      const value = data.get(field);
      if (value !== null) {
        updateData[field] = value as string || null;
      }
    });

    if (data.get("emailPort")) {
      updateData.emailPort = parseInt(data.get("emailPort") as string);
    }

    if (data.get("totalAttendanceDays")) {
      updateData.totalAttendanceDays = parseInt(data.get("totalAttendanceDays") as string);
    }

    if (data.get("vacationDate")) {
      updateData.vacationDate = new Date(data.get("vacationDate") as string);
    }

    if (data.get("reopeningDate")) {
      updateData.reopeningDate = new Date(data.get("reopeningDate") as string);
    }

    // Only update sensitive fields if provided
    const emailPassword = data.get("emailPassword") as string;
    if (emailPassword && emailPassword !== "") {
      updateData.emailPassword = emailPassword;
    }

    const smsApiSecret = data.get("smsApiSecret") as string;
    if (smsApiSecret && smsApiSecret !== "") {
      updateData.smsApiSecret = smsApiSecret;
    }

    await prisma.systemSettings.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    // Clear settings cache
    const { clearSettingsCache } = await import("./settings");
    clearSettingsCache();

    // Revalidate all pages that use system settings
    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");
    revalidatePath("/login");
    revalidatePath("/");
    // Revalidate all dashboard subpages
    revalidatePath("/dashboard/students");
    revalidatePath("/dashboard/teachers");
    revalidatePath("/dashboard/parents");
    revalidatePath("/dashboard/classes");
    revalidatePath("/dashboard/attendance");
    revalidatePath("/dashboard/fees");
    
    return { success: true, error: false, message: "Settings updated successfully!" };
  } catch (err) {
    console.error(err);
    return { success: false, error: true, message: "Failed to update settings!" };
  }
};