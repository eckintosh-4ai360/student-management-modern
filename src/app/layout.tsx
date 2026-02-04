import type { Metadata, Viewport } from "next";
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
    manifest: "/manifest.json",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: settings.schoolShortName,
    },
  };
}

export async function generateViewport(): Promise<Viewport> {
  const settings = await getSystemSettings();
  
  return {
    width: "device-width",
     initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    themeColor: settings.primaryColor,
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSystemSettings();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider settings={settings}>
          <SessionProvider>
            {children}
            <div id="datepicker-portal" className="relative z-[9999]" />
            <ToastContainer position="top-right" autoClose={3000} />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
