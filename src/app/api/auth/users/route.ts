import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user/User";

export async function GET() {
  try {
    await connectDB();

    const users = await User.find({})
      .select("name email phone")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      totalUsers: users.length,
      users,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}