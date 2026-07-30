import { NextResponse } from "next/server";
import { sendWhatsappOrderNotification } from "@/lib/sendWhatsappNotification";

export const runtime = "nodejs";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const phone = searchParams.get("phone") || "9868552523";

  const mockOrder = {
    _id: `TEST_${Date.now()}`,
    shippingInfo: {
      fullName: "Simran Demo Test",
      phone: phone,
      city: "New Delhi",
      state: "Delhi",
    },
    products: [
      {
        productName: "Flex Pro Office Chair with 3D Headrest",
        color: "BLACK",
        quantity: 1,
      },
    ],
    pricing: {
      total: 5199,
    },
  };

  try {
    const result = await sendWhatsappOrderNotification(mockOrder, "Razorpay");

    return NextResponse.json({
      success: true,
      message: `WhatsApp template sent to ${phone}`,
      result,
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: err.message,
      },
      { status: 500 }
    );
  }
}