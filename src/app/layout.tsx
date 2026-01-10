import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SessionProvider from "@/components/SessionProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { getSystemSettings } from "@/lib/settings";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSystemSettings();
  
  return {
    title: settings.schoolName,
    description: `${settings.schoolName} - Modern student management system with comprehensive features`,
    viewport: "width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes",
    themeColor: settings.primaryColor,
    manifest: "/manifest.json",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: settings.schoolShortName,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeProvider />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <SessionProvider>
          {children}
          <ToastContainer position="top-right" autoClose={3000} />
        </SessionProvider>
      </body>
    </html>
  );
}
