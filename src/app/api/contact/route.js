import { NextResponse } from "next/server";
import connectDB from "@/config/connectDB";
import Contact from "@/models/contact/Contact";
import { verifyAdmin } from "@/lib/verifyAdmin";
import { sendTelegramContactNotification } from "@/lib/sendTelegramNotification";
import { sendBrandbnaloContactNotification } from "@/lib/sendBrandbnaloNotification";

// 1. Submit a Contact Form (POST)
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { fullName, email, companyName, phone, state, city, message } = body;

    if (!fullName || !email || !state || !city || !message) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const contact = await Contact.create({
      fullName,
      email,
      companyName: companyName || "",
      phone: phone || "",
      state,
      city,
      message,
    });

    // Fire-and-forget Telegram notification — does NOT block response
    sendTelegramContactNotification(contact.toObject ? contact.toObject() : contact);
    
    // Fire-and-forget Brandbnalo notification
    sendBrandbnaloContactNotification(contact.toObject ? contact.toObject() : contact);

    return NextResponse.json({
      success: true,
      message: "Message sent successfully!",
      contact,
    });
  } catch (error) {
    console.error("Contact Form submission error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// 2. Fetch all Messages (GET)
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const contact = await Contact.findById(id);
      if (!contact) {
        return NextResponse.json(
          { success: false, message: "Contact not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        contact,
      });
    }

    const contacts = await Contact.find().sort({ createdAt: -1 });
    const unreadCount = await Contact.countDocuments({ isRead: { $ne: true } });

    return NextResponse.json({
      success: true,
      contacts,
      unreadCount,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH() {
  try {
    await connectDB();
    await Contact.updateMany({ isRead: { $ne: true } }, { $set: { isRead: true } });
    return NextResponse.json({ success: true, message: "Contacts marked as read" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// 3. Update status (PUT)
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

    const contact = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: "Contact status updated successfully",
      contact,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// 4. Delete message (DELETE)
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

    await Contact.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
