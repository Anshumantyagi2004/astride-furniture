import { NextResponse } from "next/server";
import connectDB from "@/config/connectDB";
import User from "@/models/user/User";

export async function POST(req) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Get data from frontend
    const body = await req.json();

    const { name, email, password } = body;

    // Check if user already exists
    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User already exists",
        },
        {
          status: 400,
        }
      );
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
    });

    // Success response
    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",

        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
      {
        status: 201,
      }
    );

  } catch (error) {

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      {
        status: 500,
      }
    );

  }
}