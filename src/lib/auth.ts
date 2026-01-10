import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "./prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        // Check in Admin table (username or staffId)
        const admin = await prisma.admin.findFirst({
          where: {
            OR: [
              { username: credentials.username },
              { staffId: credentials.username },
            ],
          },
        });

        if (admin && await bcrypt.compare(credentials.password, admin.password)) {
          return {
            id: admin.id,
            username: admin.username,
            name: admin.name,
            role: "admin",
            adminRole: admin.role, // SUPER_ADMIN or ADMIN
          };
        }

        // Check in Teacher table (username or staffId)
        const teacher = await prisma.teacher.findFirst({
          where: {
            OR: [
              { username: credentials.username },
              { staffId: credentials.username },
            ],
          },
        });

        if (teacher && await bcrypt.compare(credentials.password, teacher.password)) {
          return {
            id: teacher.id,
            username: teacher.username,
            name: teacher.name + " " + teacher.surname,
            role: "teacher",
          };
        }

        // Check in Student table (username or studentId)
        const student = await prisma.student.findFirst({
          where: {
            OR: [
              { username: credentials.username },
              { studentId: credentials.username },
            ],
          },
        });

        if (student && await bcrypt.compare(credentials.password, student.password)) {
          return {
            id: student.id,
            username: student.username,
            name: student.name + " " + student.surname,
            role: "student",
          };
        }

        // Check in Parent table
        const parent = await prisma.parent.findUnique({
          where: { username: credentials.username },
        });

        if (parent && await bcrypt.compare(credentials.password, parent.password)) {
          return {
            id: parent.id,
            username: parent.username,
            name: parent.name + " " + parent.surname,
            role: "parent",
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.username = (user as any).username;
        token.adminRole = (user as any).adminRole;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.sub;
        (session.user as any).username = token.username;
        (session.user as any).adminRole = token.adminRole;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

