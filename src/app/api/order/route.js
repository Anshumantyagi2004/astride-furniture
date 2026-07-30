import { NextResponse } from "next/server";
import connectDB from "@/config/connectDB";
import Order from "@/models/order/Order";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { sendTelegramOrderNotification } from "@/lib/sendTelegramNotification";
import { sendBrandbnaloNotification } from "@/lib/sendBrandbnaloNotification";
import { sendWhatsappOrderNotification } from "@/lib/sendWhatsappNotification";
import { verifyAdmin } from "@/lib/verifyAdmin";

// Force Node.js runtime — mongoose and env vars (TELEGRAM_BOT_TOKEN) require Node runtime
export const runtime = "nodejs";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const order = await Order.create({ ...body, status: "Confirmed" });

    // Fire-and-forget Telegram notification — does NOT block the response
    sendTelegramOrderNotification(order.toObject ? order.toObject() : order, body.paymentMethod || "COD");
    sendBrandbnaloNotification(order.toObject ? order.toObject() : order, body.paymentMethod || "COD");
    sendWhatsappOrderNotification(order.toObject ? order.toObject() : order, body.paymentMethod || "COD");

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

    // Populate products.productId and its category to fetch the category name
    const orders = await Order.find()
      .populate({
        path: "products.productId",
        populate: {
          path: "category",
        },
      })
      .sort({
        createdAt: -1,
      });

    // Map orders to keep the exact same JSON structure, adding category name flat
    const formattedOrders = orders.map((order) => {
      const orderObj = order.toObject();
      orderObj.products = orderObj.products.map((p) => {
        let categoryName = p.category;
        if (p.productId && typeof p.productId === "object") {
          categoryName = p.productId.category?.name || categoryName;
          // Restore productId to its string representation to prevent breaking frontend code
          p.productId = p.productId._id.toString();
        }
        return {
          ...p,
          category: categoryName || "N/A",
        };
      });
      return orderObj;
    });

    const unreadCount = await Order.countDocuments({ isRead: { $ne: true } });

    return NextResponse.json({
      success: true,
      orders: formattedOrders,
      unreadCount,
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

export async function PATCH(req) {
  try {
    await connectDB();
    await Order.updateMany({ isRead: { $ne: true } }, { $set: { isRead: true } });
    return NextResponse.json({ success: true, message: "Orders marked as read" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// Add these at the bottom of src/app/api/order/route.js
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
    const body = await req.json();

    const updateData = {};
    if (body.status !== undefined) updateData.status = body.status;
    if (body.adminNote !== undefined) updateData.adminNote = body.adminNote;

    const order = await Order.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    return NextResponse.json({
      success: true,
      message: "Order updated successfully",
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
    if (!verifyAdmin(req)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

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