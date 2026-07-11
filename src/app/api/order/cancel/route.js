import { NextResponse } from "next/server";
import connectDB from "@/config/connectDB";
import Order from "@/models/order/Order";
import { sendTelegramCancelNotification } from "@/lib/sendTelegramNotification";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { orderId, phone } = body;

    if (!orderId || !phone) {
      return NextResponse.json(
        { success: false, message: "Order ID and Phone number are required" },
        { status: 400 }
      );
    }

    // Find the order that matches both the ID and the shipping phone number
    const order = await Order.findOne({ 
      _id: orderId, 
      "shippingInfo.phone": phone 
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found or verification failed" },
        { status: 404 }
      );
    }

    // Prevent cancellation if the order is already dispatched/completed/cancelled
    const nonCancellableStatuses = [
      "Dispatched", 
      "Shipped", 
      "Out for Delivery", 
      "Delivered", 
      "Cancelled", 
      "Return Requested", 
      "Return Approved", 
      "Return Rejected", 
      "Refund Initiated", 
      "Refunded"
    ];

    if (nonCancellableStatuses.includes(order.status)) {
      return NextResponse.json(
        { success: false, message: `Cannot cancel an order that is ${order.status}` },
        { status: 400 }
      );
    }

    // Update status to "Cancelled"
    order.status = "Cancelled";
    order.cancelledByUser = true;
    await order.save();

    // Fire-and-forget Telegram alert — does NOT block the response
    sendTelegramCancelNotification(order.toObject ? order.toObject() : order);

    return NextResponse.json({
      success: true,
      message: "Order cancelled successfully"
    });
  } catch (error) {
    console.error("Cancel Order API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to cancel order" },
      { status: 500 }
    );
  }
}
