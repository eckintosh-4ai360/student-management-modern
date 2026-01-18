"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  Home, Users, GraduationCap, BookOpen, Calendar, 
  FileText, ClipboardList, Bell, LogOut, Settings,
  BarChart3, UserCircle, Banknote, Award, MessageSquare,
  ShieldCheck, X
} from "lucide-react";
import { Button } from "./ui/button";
import { useSidebar } from "@/contexts/SidebarContext";

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    href: "/dashboard",
    roles: ["admin", "teacher", "student", "parent"],
  },
  {
    title: "Admins",
    icon: ShieldCheck,
    href: "/dashboard/admins",
    roles: ["admin"],
    adminOnly: true, // Only for SUPER_ADMIN
  },
  {
    title: "Students",
    icon: GraduationCap,
    href: "/dashboard/students",
    roles: ["admin", "teacher"],
  },
  {
    title: "Teachers",
    icon: Users,
    href: "/dashboard/teachers",
    roles: ["admin"],
  },
  {
    title: "Parents",
    icon: UserCircle,
    href: "/dashboard/parents",
    roles: ["admin"],
  },
  {
    title: "Classes",
    icon: Users,
    href: "/dashboard/classes",
    roles: ["admin"],
  },
  {
    title: "Subjects",
    icon: BookOpen,
    href: "/dashboard/subjects",
    roles: ["admin"],
  },
  {
    title: "Lessons",
    icon: FileText,
    href: "/dashboard/lessons",
    roles: ["admin", "teacher"],
  },
  {
    title: "Exams",
    icon: ClipboardList,
    href: "/dashboard/exams",
    roles: ["admin", "teacher", "student"],
  },
  {
    title: "Assignments",
    icon: FileText,
    href: "/dashboard/assignments",
    roles: ["admin", "teacher", "student"],
  },
  {
    title: "Results",
    icon: BarChart3,
    href: "/dashboard/results",
    roles: ["admin", "teacher", "student"],
  },
  {
    title: "Attendance",
    icon: Calendar,
    href: "/dashboard/attendance",
    roles: ["admin", "teacher", "student"],
  },
  {
    title: "Events",
    icon: Calendar,
    href: "/dashboard/events",
    roles: ["admin", "teacher", "student", "parent"],
  },
  {
    title: "Announcements",
    icon: Bell,
    href: "/dashboard/announcements",
    roles: ["admin", "teacher", "student", "parent"],
  },
  {
    title: "Behavior",
    icon: Award,
    href: "/dashboard/behavior",
    roles: ["admin", "teacher"],
  },
  {
    title: "Messages",
    icon: MessageSquare,
    href: "/dashboard/messages",
    roles: ["admin", "teacher", "student", "parent"],
  },
  {
    title: "Fees & Bills",
    icon: Banknote,
    href: "/dashboard/fees",
    roles: ["admin", "parent"],
  },
  {
    title: "My Fees",
    icon: Banknote,
    href: "/dashboard/fees",
    roles: ["student"],
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
    roles: ["admin"],
    adminOnly: true, // Only for SUPER_ADMIN
  },
];

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { isOpen, close } = useSidebar();
  const userRole = (session?.user as any)?.role || "student";
  const adminRole = (session?.user as any)?.adminRole;
  const [schoolName, setSchoolName] = useState("SMS");
  const [schoolFullName, setSchoolFullName] = useState("Student Management");
  const [schoolLogo, setSchoolLogo] = useState("/img/ECKINTOSH LOGO.png");
  const [primaryColor, setPrimaryColor] = useState("#3b82f6");
  const [secondaryColor, setSecondaryColor] = useState("#8b5cf6");

  useEffect(() => {
    // Fetch school settings for branding
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.schoolShortName) setSchoolName(data.schoolShortName);
        if (data.schoolName) setSchoolFullName(data.schoolName);
        if (data.schoolLogo) setSchoolLogo(data.schoolLogo);
        if (data.primaryColor) setPrimaryColor(data.primaryColor);
        if (data.secondaryColor) setSecondaryColor(data.secondaryColor);
      })
      .catch(() => {
        // Use defaults if fetch fails
      });
  }, []);

  const filteredMenuItems = menuItems.filter((item) => {
    // Check if user role matches
    if (!item.roles.includes(userRole)) return false;
    
    // If item requires super admin, check adminRole
    if ((item as any).adminOnly && adminRole !== "SUPER_ADMIN") return false;
    
    return true;
  });

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={close}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 h-screen bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={schoolLogo} 
              alt="School Logo" 
              className="w-10 h-10 object-contain rounded"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/img/ECKINTOSH LOGO.png";
              }}
            />
            <div>
              <h1 className="text-xl font-bold" style={{ color: primaryColor }}>{schoolName}</h1>
              <p className="text-xs" style={{ color: secondaryColor }}>{schoolFullName}</p>
            </div>
          </div>
          {/* Close button for mobile */}
          <button
            onClick={close}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => {
                      // Close sidebar on mobile after clicking a link
                      if (window.innerWidth < 1024) {
                        close();
                      }
                    }}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "text-white"
                        : "hover:bg-gray-100"
                    }`}
                    style={
                      isActive
                        ? {
                            backgroundColor: primaryColor,
                          }
                        : {}
                    }
                  >
                    <Icon 
                      className="w-5 h-5" 
                      style={{ color: isActive ? "white" : primaryColor }}
                    />
                    <span style={{ color: isActive ? "white" : secondaryColor }}>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t">
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium">{session?.user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{userRole}</p>
          </div>
          <Button
            onClick={() => signOut({ callbackUrl: "/login" })}
            variant="destructive"
            className="w-full"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </>
  );
}

