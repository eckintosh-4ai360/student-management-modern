"use server";

import { revalidatePath } from "next/cache";
import prisma from "./prisma";
import { TimetableSchema } from "./formValidationSchemas";

type ActionState = { success: boolean; error: boolean; message?: string };

export const createTimetable = async (
  currentState: ActionState,
  data: TimetableSchema
): Promise<ActionState> => {
  try {
    await prisma.timetable.create({
      data: {
        title: data.title,
        semester: data.semester,
        academicYear: data.academicYear,
        fileUrl: data.fileUrl,
        fileType: data.fileType,
        uploadedBy: "Admin", // For now
      },
    });

    revalidatePath("/dashboard/lessons");
    return { success: true, error: false, message: "Timetable posted successfully!" };
  } catch (err) {
    console.error(err);
    return { success: false, error: true, message: "Failed to post timetable!" };
  }
};

export const deleteTimetable = async (
  currentState: ActionState,
  data: FormData
): Promise<ActionState> => {
  const id = data.get("id") as string;

  try {
    await prisma.timetable.delete({
      where: { id: parseInt(id) },
    });

    revalidatePath("/dashboard/lessons");
    return { success: true, error: false, message: "Timetable deleted successfully!" };
  } catch (err) {
    console.error(err);
    return { success: false, error: true, message: "Failed to delete timetable!" };
  }
};
