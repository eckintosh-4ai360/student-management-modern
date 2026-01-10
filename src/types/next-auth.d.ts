import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      role: "admin" | "teacher" | "student" | "parent";
      adminRole?: "SUPER_ADMIN" | "ADMIN";
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    username: string;
    role: "admin" | "teacher" | "student" | "parent";
    adminRole?: "SUPER_ADMIN" | "ADMIN";
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: "admin" | "teacher" | "student" | "parent";
    username: string;
    adminRole?: "SUPER_ADMIN" | "ADMIN";
  }
}

