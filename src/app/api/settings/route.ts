import { NextResponse } from "next/server";
import { getSystemSettings } from "@/lib/settings";

export async function GET() {
  try {
    const settings = await getSystemSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";

