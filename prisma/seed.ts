import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data to avoid conflicts
  await prisma.admin.deleteMany({});

  // Create Super Admin
  const hashedAdminPassword = await bcrypt.hash("admin123", 10);
  const superAdmin = await prisma.admin.create({
    data: {
      username: "superadmin",
      staffId: "STAFF-SA-001",
      password: hashedAdminPassword,
      name: "Super Admin",
      email: "superadmin@school.com",
      phone: "+1234567890",
      role: "SUPER_ADMIN",
    },
  });

  console.log("Super Admin created:", superAdmin);

  // Create Regular Admin
  const admin = await prisma.admin.create({
    data: {
      username: "admin",
      staffId: "STAFF-ADM-001",
      password: hashedAdminPassword,
      name: "Admin User",
      email: "admin@school.com",
      phone: "+1234567891",
      role: "ADMIN",
    },
  });

  console.log("Admin created:", admin);

  // Create or update Grades
  const grades = await Promise.all([
    prisma.grade.upsert({ where: { level: 1 }, update: {}, create: { level: 1 } }),
    prisma.grade.upsert({ where: { level: 2 }, update: {}, create: { level: 2 } }),
    prisma.grade.upsert({ where: { level: 3 }, update: {}, create: { level: 3 } }),
    prisma.grade.upsert({ where: { level: 4 }, update: {}, create: { level: 4 } }),
    prisma.grade.upsert({ where: { level: 5 }, update: {}, create: { level: 5 } }),
    prisma.grade.upsert({ where: { level: 6 }, update: {}, create: { level: 6 } }),
    prisma.grade.upsert({ where: { level: 7 }, update: {}, create: { level: 7 } }),
    prisma.grade.upsert({ where: { level: 8 }, update: {}, create: { level: 8 } }),
    prisma.grade.upsert({ where: { level: 9 }, update: {}, create: { level: 9 } }),
    prisma.grade.upsert({ where: { level: 10 }, update: {}, create: { level: 10 } }),
    prisma.grade.upsert({ where: { level: 11 }, update: {}, create: { level: 11 } }),
    prisma.grade.upsert({ where: { level: 12 }, update: {}, create: { level: 12 } }),
    prisma.grade.upsert({ where: { level: 13 }, update: {}, create: { level: 13 } }),
    prisma.grade.upsert({ where: { level: 14 }, update: {}, create: { level: 14 } }),
  ]);

  console.log("Grades created");

  // Create or update Subjects
  const subjects = await Promise.all([
    prisma.subject.upsert({ where: { name: "Mathematics" }, update: {}, create: { name: "Mathematics" } }),
    prisma.subject.upsert({ where: { name: "Science" }, update: {}, create: { name: "Science" } }),
    prisma.subject.upsert({ where: { name: "English" }, update: {}, create: { name: "English" } }),
    prisma.subject.upsert({ where: { name: "History" }, update: {}, create: { name: "History" } }),
    prisma.subject.upsert({ where: { name: "Geography" }, update: {}, create: { name: "Geography" } }),
  ]);

  console.log("Subjects created");

  // Create Teachers
  const hashedTeacherPassword = await bcrypt.hash("teacher123", 10);
  const teacher1 = await prisma.teacher.create({
    data: {
      username: "jdoe",
      staffId: "STAFF-TCH-001",
      password: hashedTeacherPassword,
      name: "John",
      surname: "Doe",
      email: "john.doe@school.com",
      phone: "1234567890",
      address: "123 Main St",
      bloodType: "A+",
      sex: "MALE",
      birthday: new Date("1985-05-15"),
      subjects: {
        connect: [{ id: subjects[0].id }, { id: subjects[1].id }],
      },
    },
  });

  const teacher2 = await prisma.teacher.create({
    data: {
      username: "jsmith",
      staffId: "STAFF-TCH-002",
      password: hashedTeacherPassword,
      name: "Jane",
      surname: "Smith",
      email: "jane.smith@school.com",
      phone: "0987654321",
      address: "456 Oak Ave",
      bloodType: "B+",
      sex: "FEMALE",
      birthday: new Date("1988-08-20"),
      subjects: {
        connect: [{ id: subjects[2].id }, { id: subjects[3].id }],
      },
    },
  });

  console.log("Teachers created");

  // Create Classes
  const class1 = await prisma.class.create({
    data: {
      name: "Class 1A",
      capacity: 30,
      gradeId: grades[0].id,
      supervisorId: teacher1.id,
    },
  });

  const class2 = await prisma.class.create({
    data: {
      name: "Class 2B",
      capacity: 28,
      gradeId: grades[1].id,
      supervisorId: teacher2.id,
    },
  });

  console.log("Classes created");

  // Create Parents
  const hashedParentPassword = await bcrypt.hash("parent123", 10);
  const parent1 = await prisma.parent.create({
    data: {
      username: "parent1",
      password: hashedParentPassword,
      name: "Michael",
      surname: "Johnson",
      email: "michael.j@email.com",
      phone: "5551234567",
      address: "789 Pine St",
    },
  });

  const parent2 = await prisma.parent.create({
    data: {
      username: "parent2",
      password: hashedParentPassword,
      name: "Sarah",
      surname: "Williams",
      email: "sarah.w@email.com",
      phone: "5559876543",
      address: "321 Elm St",
    },
  });

  console.log("Parents created");

  // Create Students
  const hashedStudentPassword = await bcrypt.hash("student123", 10);
  const student1 = await prisma.student.create({
    data: {
      username: "student1",
      studentId: "STU-2024-001",
      password: hashedStudentPassword,
      name: "Emily",
      surname: "Johnson",
      email: "emily.j@email.com",
      phone: "5551111111",
      address: "789 Pine St",
      bloodType: "O+",
      sex: "FEMALE",
      birthday: new Date("2015-03-12"),
      gradeId: grades[0].id,
      classId: class1.id,
      parentId: parent1.id,
    },
  });

  const student2 = await prisma.student.create({
    data: {
      username: "student2",
      studentId: "STU-2024-002",
      password: hashedStudentPassword,
      name: "David",
      surname: "Williams",
      email: "david.w@email.com",
      phone: "5552222222",
      address: "321 Elm St",
      bloodType: "A-",
      sex: "MALE",
      birthday: new Date("2014-07-25"),
      gradeId: grades[1].id,
      classId: class2.id,
      parentId: parent2.id,
    },
  });

  console.log("Students created");

  // Create Lessons
  const lesson1 = await prisma.lesson.create({
    data: {
      name: "Math 101",
      day: "MONDAY",
      startTime: new Date("2024-01-01T09:00:00"),
      endTime: new Date("2024-01-01T10:00:00"),
      subjectId: subjects[0].id,
      classId: class1.id,
      teacherId: teacher1.id,
    },
  });

  const lesson2 = await prisma.lesson.create({
    data: {
      name: "English Literature",
      day: "TUESDAY",
      startTime: new Date("2024-01-01T10:00:00"),
      endTime: new Date("2024-01-01T11:00:00"),
      subjectId: subjects[2].id,
      classId: class2.id,
      teacherId: teacher2.id,
    },
  });

  console.log("Lessons created");

  // Create Exams
  const exam1 = await prisma.exam.create({
    data: {
      title: "Math Midterm",
      startTime: new Date("2024-06-15T09:00:00"),
      endTime: new Date("2024-06-15T11:00:00"),
      lessonId: lesson1.id,
    },
  });

  console.log("Exams created");

  // Create Assignments
  const assignment1 = await prisma.assignment.create({
    data: {
      title: "Math Homework Chapter 1",
      startDate: new Date("2024-01-10"),
      dueDate: new Date("2024-01-17"),
      lessonId: lesson1.id,
    },
  });

  console.log("Assignments created");

  // Create Results
  await prisma.result.create({
    data: {
      score: 85,
      examId: exam1.id,
      studentId: student1.id,
    },
  });

  console.log("Results created");

  // Create Attendances
  await prisma.attendance.create({
    data: {
      date: new Date("2024-01-10"),
      present: true,
      studentId: student1.id,
      lessonId: lesson1.id,
    },
  });

  console.log("Attendances created");

  // Create Events
  await prisma.event.create({
    data: {
      title: "School Festival",
      description: "Annual school festival with various activities",
      startTime: new Date("2024-05-20T09:00:00"),
      endTime: new Date("2024-05-20T17:00:00"),
      classId: class1.id,
    },
  });

  console.log("Events created");

  // Create Announcements
  await prisma.announcement.create({
    data: {
      title: "Holiday Notice",
      description: "School will be closed for summer holidays",
      date: new Date("2024-07-01"),
      classId: class1.id,
    },
  });

  console.log("Announcements created");

  // Create System Settings
  await prisma.systemSettings.create({
    data: {
      schoolName: "Demo School",
      schoolShortName: "DS",
      schoolEmail: "info@demoschool.com",
      schoolPhone: "+1234567890",
      schoolAddress: "123 Education Street, Learning City",
      academicYear: "2024-2025",
      currency: "USD",
      timezone: "UTC",
      dateFormat: "MM/dd/yyyy",
    },
  });

  console.log("System settings created");

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

