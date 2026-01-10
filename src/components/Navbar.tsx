"use client";

import { useSession, signOut } from "next-auth/react";
import { Bell, Search, User, Settings, LogOut, ChevronDown, Menu } from "lucide-react";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { EditProfileModal } from "./forms/EditProfileModal";
import { useSidebar } from "@/contexts/SidebarContext";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const { toggle } = useSidebar();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  // Fetch unread message count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await fetch("/api/messages/unread-count");
        const data = await response.json();
        setUnreadCount(data.count);
      } catch (error) {
        console.error("Failed to fetch unread count:", error);
      }
    };

    if (session) {
      fetchUnreadCount();
      // Refresh every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [session]);

  // Fetch user data for profile editing
  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user) return;
      
      try {
        const response = await fetch("/api/user/profile");
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    if (session) {
      fetchUserData();
    }
  }, [session]);

  const handleNotificationClick = () => {
    router.push("/dashboard/messages");
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  const handleEditProfile = () => {
    setShowUserMenu(false);
    setShowEditProfile(true);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowUserMenu(false);
    if (showUserMenu) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showUserMenu]);

  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center space-x-4 flex-1">
        {/* Hamburger Menu Button */}
        <button
          onClick={toggle}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>

        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Notification Bell */}
        <button 
          onClick={handleNotificationClick}
          className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ""}`}
        >
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            </>
          )}
        </button>
        
        {/* User Menu */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowUserMenu(!showUserMenu);
            }}
            className="flex items-center space-x-3 hover:bg-gray-100 rounded-lg p-2 transition-colors"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
              {session?.user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-gray-900">
                {session?.user?.name}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {(session?.user as any)?.role || "User"}
              </p>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showUserMenu ? "rotate-180" : ""}`} />
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">
                  {session?.user?.name}
                </p>
                <p className="text-xs text-gray-500">
                  @{(session?.user as any)?.username}
                </p>
              </div>

              <button
                onClick={handleEditProfile}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <User className="w-4 h-4 mr-3 text-gray-500" />
                Edit Profile
              </button>

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  router.push("/dashboard");
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <Settings className="w-4 h-4 mr-3 text-gray-500" />
                Settings
              </button>

              <div className="border-t border-gray-100 my-2"></div>

              <button
                onClick={handleSignOut}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {userData && showEditProfile && (
        <EditProfileModal
          isOpen={showEditProfile}
          onClose={() => setShowEditProfile(false)}
          userData={userData}
        />
      )}
    </header>
  );
}
