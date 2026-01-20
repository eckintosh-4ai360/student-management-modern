import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { studentSchema } from "@/lib/formValidationSchemas";

interface StudentImportRow {
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
}

interface ImportResult {
  successful: number;
  failed: number;
  errors: { row: number; message: string }[];
}

export async function POST(request: NextRequest) {
  try {
    const { students } = (await request.json()) as { students: StudentImportRow[] };

    if (!Array.isArray(students) || students.length === 0) {
      return NextResponse.json(
        { message: "No students data provided" },
        { status: 400 }
      );
    }

    const result: ImportResult = {
      successful: 0,
      failed: 0,
      errors: [],
    };

    // Get the current year for student ID generation
    const year = new Date().getFullYear();

    for (let i = 0; i < students.length; i++) {
      const rowNumber = i + 2; // +2 because header is row 1, data starts from row 2
      const student = students[i];

      try {
        // Validate required fields
        if (!student.username || !student.name || !student.surname || !student.address) {
          result.errors.push({
            row: rowNumber,
            message: "Missing required fields (username, name, surname, address)",
          });
          result.failed++;
          continue;
        }

        if (!student.bloodType || !student.sex || !student.birthday) {
          result.errors.push({
            row: rowNumber,
            message: "Missing required fields (bloodType, sex, birthday)",
          });
          result.failed++;
          continue;
        }

        if (!student.classId || !student.gradeId) {
          result.errors.push({
            row: rowNumber,
            message: "Missing required fields (classId, gradeId)",
          });
          result.failed++;
          continue;
        }

        // Validate sex field
        if (!["MALE", "FEMALE"].includes(student.sex)) {
          result.errors.push({
            row: rowNumber,
            message: "Sex must be 'MALE' or 'FEMALE'",
          });
          result.failed++;
          continue;
        }

        // Validate birthday format (YYYY-MM-DD)
        const birthdayDate = new Date(student.birthday);
        if (isNaN(birthdayDate.getTime())) {
          result.errors.push({
            row: rowNumber,
            message: "Invalid birthday format. Use YYYY-MM-DD",
          });
          result.failed++;
          continue;
        }

        // Check if username already exists
        const existingStudent = await prisma.student.findUnique({
          where: { username: student.username },
        });

        if (existingStudent) {
          result.errors.push({
            row: rowNumber,
            message: `Username '${student.username}' already exists`,
          });
          result.failed++;
          continue;
        }

        // Check if email is unique (if provided)
        if (student.email) {
          const existingEmail = await prisma.student.findUnique({
            where: { email: student.email },
          });

          if (existingEmail) {
            result.errors.push({
              row: rowNumber,
              message: `Email '${student.email}' already exists`,
            });
            result.failed++;
            continue;
          }
        }

        // Check if phone is unique (if provided)
        if (student.phone) {
          const existingPhone = await prisma.student.findUnique({
            where: { phone: student.phone },
          });

          if (existingPhone) {
            result.errors.push({
              row: rowNumber,
              message: `Phone '${student.phone}' already exists`,
            });
            result.failed++;
            continue;
          }
        }

        // Find or create parent based on names
        let parentId: string | undefined = undefined;
        if (student.parentFirstName && student.parentLastName) {
          // Try to find existing parent by name
          let parent = await prisma.parent.findFirst({
            where: {
              name: student.parentFirstName,
              surname: student.parentLastName,
            },
          });

          // If parent doesn't exist, create one
          if (!parent) {
            // Generate unique username for parent
            const baseUsername = `${student.parentFirstName.toLowerCase()}.${student.parentLastName.toLowerCase()}`;
            let username = baseUsername;
            let counter = 1;
            
            // Ensure username is unique
            while (await prisma.parent.findUnique({ where: { username } })) {
              username = `${baseUsername}${counter}`;
              counter++;
            }

            // Generate unique phone number (placeholder)
            const timestamp = Date.now().toString().slice(-8);
            const phone = `+1${timestamp}`;

            // Create parent with default password
            const defaultPassword = await bcrypt.hash("parent123", 10);
            parent = await prisma.parent.create({
              data: {
                username,
                password: defaultPassword,
                name: student.parentFirstName,
                surname: student.parentLastName,
                phone,
                address: student.address,
              },
            });
          }

          parentId = parent.id;
        }

        // Verify class exists
        const classRecord = await prisma.class.findUnique({
          where: { id: parseInt(student.classId) },
        });

        if (!classRecord) {
          result.errors.push({
            row: rowNumber,
            message: `Class with ID '${student.classId}' not found`,
          });
          result.failed++;
          continue;
        }

        // Verify grade exists
        const grade = await prisma.grade.findUnique({
          where: { id: parseInt(student.gradeId) },
        });

        if (!grade) {
          result.errors.push({
            row: rowNumber,
            message: `Grade with ID '${student.gradeId}' not found`,
          });
          result.failed++;
          continue;
        }

        // Generate student ID
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

        // Hash password
        const password = student.password || "student123";
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create student
        await prisma.student.create({
          data: {
            username: student.username,
            studentId: studentId,
            password: hashedPassword,
            name: student.name,
            surname: student.surname,
            email: student.email || null,
            phone: student.phone || null,
            address: student.address,
            bloodType: student.bloodType,
            sex: student.sex as "MALE" | "FEMALE",
            birthday: birthdayDate,
            parentId: parentId,
            classId: parseInt(student.classId),
            gradeId: parseInt(student.gradeId),
          },
        });

        result.successful++;
      } catch (error) {
        console.error(`Error processing row ${rowNumber}:`, error);
        result.errors.push({
          row: rowNumber,
          message: error instanceof Error ? error.message : "Unknown error occurred",
        });
        result.failed++;
      }
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json(
      { message: "Failed to process import request" },
      { status: 500 }
    );
  }
}
