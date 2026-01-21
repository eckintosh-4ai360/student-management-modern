import prisma from "@/lib/prisma";
import { AttendanceClient } from "@/components/AttendanceClient";
import { format } from "date-fns";

export default async function AttendancePage() {
  const classes = await prisma.class.findMany({
    include: {
      students: {
        include: {
          grade: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  // Format classes for client component
  const formattedClasses = classes.map((cls) => ({
    id: cls.id,
    name: cls.name,
    students: cls.students.map((student) => ({
      id: student.id,
      name: student.name,
      surname: student.surname,
      othername: student.img, // Using img field as othername temporarily
      grade: student.grade,
    })),
  }));

  return (
    <AttendanceClient
      classes={formattedClasses}
      currentDate={format(new Date(), "MM/dd/yyyy")}
    />
  );
}
