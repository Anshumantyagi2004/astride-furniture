import { NextResponse } from "next/server";
import { sendWhatsappOrderNotification } from "@/lib/sendWhatsappNotification";

export const runtime = "nodejs";

export async function GET() {
  const mockOrder = {
    _id: `TEST_${Date.now()}`,
    shippingInfo: {
      fullName: "Simran Test User",
      phone: "9868552523",
      city: "New Delhi",
      state: "Delhi",
    },
    products: [
      {
        productName: "Ergofit Chair",
        color: "Black",
        quantity: 1,
      },
      {
        productName: "Octave Chair",
        color: "Red",
        quantity: 2,
      },
    ],
    pricing: {
      total: 5199,
    },
  };
  

  try {
    const result = await sendWhatsappOrderNotification(mockOrder, "COD");

    return NextResponse.json({
      success: true,
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