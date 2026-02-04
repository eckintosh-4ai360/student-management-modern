"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [schoolName, setSchoolName] = useState("Student Management System");

  useEffect(() => {
    // Fetch school settings for branding
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.schoolName) setSchoolName(data.schoolName);
      })
      .catch(() => {
        // Use defaults if fetch fails
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid credentials!");
        setLoading(false);
      } else if (result?.ok) {
        toast.success("Login successful!");
        // Use router.push with refresh for proper navigation
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error("An error occurred. Please try again.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-3 sm:p-4 md:p-6">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-1 pb-4">
          <img 
            src="/img/ECKINTOSH LOGO.png" 
            alt="logo" 
            className="w-12 h-12 sm:w-14 sm:h-14 mx-auto my-3 sm:my-4" 
          />
          <CardTitle className="text-2xl sm:text-3xl font-bold text-center text-foreground">
            {schoolName}
          </CardTitle>
          <CardDescription className="text-center text-sm sm:text-base">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-foreground">
                Username, Staff ID, or Student ID
              </label>
              <Input
                id="username"
                type="text"
                placeholder="Enter username or ID"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
                className="h-11 text-base"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <Link 
                  href="/forgot-password" 
                  className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="h-11 text-base pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full h-11 text-base font-semibold"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <div className="mt-6 p-4 bg-muted rounded-lg border border-border">
            <p className="text-xs font-semibold text-foreground mb-2 text-center">Demo Credentials:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div className="bg-card p-2 rounded border border-border">
                <p className="font-medium">Super Admin</p>
                <p>superadmin / admin123</p>
                <p className="text-[10px] text-gray-500">ID: STAFF-SA-001</p>
              </div>
              <div className="bg-white p-2 rounded border">
                <p className="font-medium">Admin</p>
                <p>admin / admin123</p>
                <p className="text-[10px] text-gray-500">ID: STAFF-ADM-001</p>
              </div>
              <div className="bg-white p-2 rounded border">
                <p className="font-medium">Teacher</p>
                <p>jdoe / teacher123</p>
                <p className="text-[10px] text-gray-500">ID: STAFF-TCH-001</p>
              </div>
              <div className="bg-white p-2 rounded border">
                <p className="font-medium">Student</p>
                <p>student1 / student123</p>
                <p className="text-[10px] text-gray-500">ID: STU-2024-001</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
