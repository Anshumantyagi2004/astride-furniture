import { NextResponse } from "next/server";

// Force Node.js runtime — Mongoose and custom env logic work best in Node runtime
export const runtime = "nodejs";

export async function POST(req) {
  console.log("🟡 /api/create-order HIT —", new Date().toISOString());
  try {
    const { amount, currency = "INR" } = await req.json();
    console.log("📦 Amount received (paise):", amount);

    if (!amount || amount < 100) {
      return NextResponse.json(
        { success: false, message: "Amount must be at least 100 paise (₹1)" },
        { status: 400 }
      );
    }

    // Initialize Razorpay variables
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Debug: log env var presence
    console.log("Razorpay Key ID:", keyId ? `${keyId.slice(0, 10)}...` : "UNDEFINED ❌");
    console.log("Razorpay Key Secret:", keySecret ? "SET ✅" : "UNDEFINED ❌");

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { success: false, message: "Razorpay credentials are not configured. Check .env.local file." },
        { status: 500 }
      );
    }

    const receipt = `receipt_order_${Date.now()}`;

    // Call Razorpay API using native fetch to avoid package bundling issues/compilation hangs
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: amount,
        currency: currency,
        receipt: receipt,
      }),
    });

    const razorpayOrder = await response.json();

    if (!response.ok) {
      throw new Error(razorpayOrder.error?.description || "Failed to create order in Razorpay");
    }

    return NextResponse.json({
      success: true,
      order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (error) {
    console.error("Razorpay order creation error DETAILS:", error?.message);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}