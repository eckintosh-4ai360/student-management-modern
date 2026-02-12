import prisma from "./prisma";

const DEFAULT_SETTINGS = {
  schoolName: "Student Management System",
  schoolShortName: "SMS",
  primaryColor: "#3b82f6",
  secondaryColor: "#8b5cf6",
  accentColor: "#ec4899",
  academicYear: "2024-2025",
  currency: "USD",
  timezone: "UTC",
  dateFormat: "MM/dd/yyyy",
  currentTerm: "First Term",
  totalAttendanceDays: 0,
  studentIdInitials: "CTS",
};

export async function getSystemSettings() {
  try {
    // Fetch fresh settings
    let settings = await prisma.systemSettings.findFirst();

    // If no settings exist, create default
    if (!settings) {
      // Only try to create if we are not in a build environment to avoid unnecessary write attempts
      if (process.env.NEXT_PHASE !== 'phase-production-build') {
        try {
          settings = await prisma.systemSettings.create({
            data: DEFAULT_SETTINGS,
          });
        } catch (createError) {
          console.warn("Failed to create default settings in DB:", createError);
          return DEFAULT_SETTINGS;
        }
      } else {
        return DEFAULT_SETTINGS;
      }
    }

    return settings;
  } catch (error) {
    console.error("Failed to fetch system settings from database:", error);
    // Return default settings if database is unreachable during build or runtime
    return DEFAULT_SETTINGS;
  }
}

// Clear cache when settings are updated (no-op now)
export function clearSettingsCache() {
  // Manual cache removed for better real-time reflection
}

// Generate CSS variables from settings
export function generateThemeCSS(settings: any) {
  return `
    :root {
      --primary-color: ${settings.primaryColor};
      --secondary-color: ${settings.secondaryColor};
      --accent-color: ${settings.accentColor};
      --school-name: "${settings.schoolName}";
    }
  `;
}

