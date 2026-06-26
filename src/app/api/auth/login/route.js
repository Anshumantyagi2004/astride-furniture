import { NextResponse } from "next/server";
import connectDB from "@/config/connectDB";
import User from "@/models/user/User";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Get data from frontend
    const body = await req.json();

    const { email, password } = body;

    // Find user by email
    const user = await User.findOne({
      email,
    });

    // User not found
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    // Check password
    if (user.password !== password) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid password",
        },
        {
          status: 400,
        }
      );
    }

    // Create JWT Token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      "astride-secret-key",
      {
        expiresIn: "7d",
      }
    );

    // Login Success
    return NextResponse.json(
      {
        success: true,
        message: "Login successful",

        token,

        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone || "",
        },
      },
      {
        status: 200,
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