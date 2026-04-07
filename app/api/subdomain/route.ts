import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { subdomain } = await request.json();

    if (!subdomain) {
      return NextResponse.json({ error: "Subdomain is required" }, { status: 400 });
    }

    if (!/^[a-zA-Z0-9-]+$/.test(subdomain)) {
      return NextResponse.json({ error: "Invalid subdomain format" }, { status: 400 });
    }

    const cookieStore = await cookies();

    cookieStore.set("subdomain", subdomain, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 60 * 60,
    });

    return NextResponse.json({
      success: true,
      subdomain,
    });
  } catch (error) {
    console.error("Error setting subdomain:", error);
    return NextResponse.json({ error: "Failed to set subdomain" }, { status: 500 });
  }
}
