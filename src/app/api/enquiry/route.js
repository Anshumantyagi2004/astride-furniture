import { NextResponse } from "next/server";
import connectDB from "@/config/connectDB";
import Enquiry from "@/models/enquiry/Enquiry";
import { verifyAdmin } from "@/lib/verifyAdmin";
import { sendTelegramCorporateEnquiryNotification } from "@/lib/sendTelegramNotification";
import { sendBrandbnaloEnquiryNotification } from "@/lib/sendBrandbnaloNotification";

// Handle POST request to submit a new corporate enquiry
export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { fullName, companyName, quantity, email, phone, location } = body;

    // Validate required fields
    if (!fullName || !quantity || !email || !location || !phone) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const enquiry = await Enquiry.create({
      fullName,
      companyName: companyName || "",
      quantity: Number(quantity),
      email,
      phone,
      location,
    });

    // Fire-and-forget Telegram notification — does NOT block response
    sendTelegramCorporateEnquiryNotification(enquiry.toObject ? enquiry.toObject() : enquiry);

    // Fire-and-forget Brandbnalo notification
    sendBrandbnaloEnquiryNotification(enquiry.toObject ? enquiry.toObject() : enquiry);

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

// Handle GET request to view enquiries (for admin dashboard)
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

// Handle PUT request to update enquiry status
export async function PUT(req) {
  try {
    if (!verifyAdmin(req)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const { status } = await req.json();

    const enquiry = await Enquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: "Enquiry status updated successfully",
      enquiry,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// Handle DELETE request to delete an enquiry
export async function DELETE(req) {
  try {
    if (!verifyAdmin(req)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    await Enquiry.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Enquiry deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
