import prisma from "./prisma";

export async function getSystemSettings() {
  // Fetch fresh settings
  let settings = await prisma.systemSettings.findFirst();

  // If no settings exist, create default
  if (!settings) {
    settings = await prisma.systemSettings.create({
      data: {
        schoolName: "Student Management System",
        schoolShortName: "SMS",
        primaryColor: "#3b82f6",
        secondaryColor: "#8b5cf6",
        accentColor: "#ec4899",
      },
    });
  }

  return settings;
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

