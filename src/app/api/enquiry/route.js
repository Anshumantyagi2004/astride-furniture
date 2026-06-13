import { NextResponse } from "next/server";
import connectDB from "@/config/connectDB";
import Enquiry from "@/models/enquiry/Enquiry";

// Handle POST request to submit a new corporate enquiry
export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { fullName, companyName, quantity, email, phone, location } = body;

    // Validate required fields
    if (!fullName || !companyName || !quantity || !email || !location) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const enquiry = await Enquiry.create({
      fullName,
      companyName,
      quantity: Number(quantity),
      email,
      phone: phone || "",
      location,
    });

    return NextResponse.json({
      success: true,
      message: "Enquiry submitted successfully",
      enquiry,
    });
  } catch (error) {
    console.error("Enquiry submission error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// Optional: Handle GET request to view enquiries (for admin dashboard)
export async function GET() {
  try {
    await connectDB();

    const enquiries = await Enquiry.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      enquiries,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
