import { NextResponse } from "next/server";
import { sendWhatsappOrderNotification } from "@/lib/sendWhatsappNotification";

export const runtime = "nodejs";

export async function GET() {
  try {
    const mockOrder = {
      _id: `TEST_ORD_${Date.now().toString().slice(-6)}`,
      shippingInfo: {
        fullName: "Simran Test User",
        phone: "9868552523",
        city: "New Delhi",
        state: "Delhi",
      },
      products: [
        { productName: "Ergofit Chair", color: "Black", quantity: 1 },
        { productName: "Octave Chair", color: "Red", quantity: 2 },
      ],
      pricing: {
        total: 5199,
      },
    };

    console.log("Triggering test WhatsApp notification...");
    await sendWhatsappOrderNotification(mockOrder, "COD");

    return NextResponse.json({
      success: true,
      message: "Test WhatsApp notification executed! Check terminal logs and your WhatsApp phone.",
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
