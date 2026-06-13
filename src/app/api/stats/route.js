import { NextResponse } from "next/server";
import connectDB from "@/config/connectDB";
import Product from "@/models/Product"; // Adjust path if needed
import Order from "@/models/order/Order"; // Adjust path if needed
import User from "@/models/user/User"; // Adjust path if needed
import Enquiry from "@/models/enquiry/Enquiry";
import Contact from "@/models/contact/Contact";

export async function GET() {
  try {
    await connectDB();

    // Fetch counts and recent items in parallel
    const [
      productsCount,
      ordersCount,
      usersCount,
      inquiriesCount,
      contactsCount,
      recentInquiries,
      recentContacts,
    ] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments(),
      Enquiry.countDocuments(),
      Contact.countDocuments(),
      Enquiry.find().sort({ createdAt: -1 }).limit(5),
      Contact.find().sort({ createdAt: -1 }).limit(5),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        products: productsCount,
        orders: ordersCount,
        users: usersCount,
        inquiries: inquiriesCount,
        contacts: contactsCount,
      },
      recentInquiries,
      recentContacts,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
