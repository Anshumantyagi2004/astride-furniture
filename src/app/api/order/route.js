import { NextResponse } from "next/server";
import connectDB from "@/config/connectDB";
import Order from "@/models/order/Order";
import { sendTelegramOrderNotification } from "@/lib/sendTelegramNotification";

// Force Node.js runtime — mongoose and env vars (TELEGRAM_BOT_TOKEN) require Node runtime
export const runtime = "nodejs";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const order = await Order.create({ ...body, status: "Confirmed" });

    // Fire-and-forget Telegram notification — does NOT block the response
    sendTelegramOrderNotification(order.toObject ? order.toObject() : order, body.paymentMethod || "COD");

    return NextResponse.json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    const orders = await Order.find().sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}

// Add these at the bottom of src/app/api/order/route.js
export async function PUT(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const { status } = await req.json();
    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    return NextResponse.json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
export async function DELETE(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    await Order.findByIdAndDelete(id);
    return NextResponse.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}