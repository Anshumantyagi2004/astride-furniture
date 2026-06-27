import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Logout just returns success - token is stored on client
    // Client should delete the token from sessionStorage/localStorage
    return NextResponse.json(
      { success: true, message: "Logged out successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, message: "Logout failed" },
      { status: 500 }
    );
  }
}
