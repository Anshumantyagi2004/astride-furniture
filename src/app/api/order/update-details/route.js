import { NextResponse } from "next/server";
import connectDB from "@/config/connectDB";
import Order from "@/models/order/Order";

export const runtime = "nodejs";

export async function PATCH(req) {
  try {
    await connectDB();
    const { orderId, billingAddress, customMessage, gstNumber } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "Order ID is required" },
        { status: 400 }
      );
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        $set: {
          "shippingInfo.billingAddress": billingAddress || "",
          "shippingInfo.customMessage": customMessage || "",
          "shippingInfo.gstNumber": gstNumber || "",
        },
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: "Order details updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Failed to update order details:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update details" },
      { status: 500 }
    );
  }
}
