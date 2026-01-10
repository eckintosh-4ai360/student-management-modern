import prisma from "./prisma";

// Cache for settings to avoid frequent database calls
let settingsCache: any = null;
let lastFetch = 0;
const CACHE_DURATION = 60000; // 1 minute

export async function getSystemSettings() {
  const now = Date.now();
  
  // Return cached settings if still valid
  if (settingsCache && (now - lastFetch) < CACHE_DURATION) {
    return settingsCache;
  }

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

  // Update cache
  settingsCache = settings;
  lastFetch = now;

  return settings;
}

// Clear cache when settings are updated
export function clearSettingsCache() {
  settingsCache = null;
  lastFetch = 0;
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

