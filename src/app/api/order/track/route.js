import { NextResponse } from "next/server";
import connectDB from "@/config/connectDB";
import Order from "@/models/order/Order";

export const runtime = "nodejs";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const phone = searchParams.get("phone");

    if (!phone) {
      return NextResponse.json(
        { success: false, message: "Phone number is required" },
        { status: 400 }
      );
    }

    // Find all orders matching the shipping phone number, sorted by newest first
    const orders = await Order.find({ "shippingInfo.phone": phone }).sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Order tracking API error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
