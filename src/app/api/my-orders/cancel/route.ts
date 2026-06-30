import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/order/Order";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    await connectDB();

    // 1. Check if user is logged in (verify token)
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, message: "No token provided" }, { status: 401 });
    }

    const token = authHeader.slice(7);
    let decoded: any;
    try {
      decoded = jwt.verify(token, "astride-secret-key");
    } catch (error) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    // 2. Get order ID from the request
    const body = await req.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ success: false, message: "Order ID is required" }, { status: 400 });
    }

    // 3. Find the exact order in the database
    const order = await Order.findOne({ _id: orderId, userId: decoded.userId });
    
    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    // 4. Verify the admin hasn't already marked it as dispatched/shipped
    const nonCancellableStatuses = ["Dispatched", "Shipped", "Out for Delivery", "Delivered", "Cancelled"];
    if (nonCancellableStatuses.includes(order.status)) {
      return NextResponse.json({ success: false, message: `Cannot cancel an order that is ${order.status}` }, { status: 400 });
    }

    // 5. Update the order status to "Cancelled" and save
    order.status = "Cancelled";
    await order.save();

    return NextResponse.json({ success: true, message: "Order cancelled successfully" });
  } catch (error) {
    console.error("Cancel Order Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
