import { NextResponse } from "next/server";
import connectDB from "@/config/connectDB";
import Order from "@/models/order/Order";

export const runtime = "nodejs";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    if (!id || id.length !== 24) {
      return NextResponse.json({ success: false, message: "Invalid order ID" }, { status: 400 });
    }

    const order = await Order.findById(id).select("shippingInfo status createdAt").lean();

    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order });
  } catch (err) {
    console.error("Error fetching order by ID:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
