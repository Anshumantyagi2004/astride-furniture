import { NextResponse } from "next/server";

/**
 * Razorpay Magic Checkout — Apply Promotion/Coupon
 * 
 * Razorpay calls this when a customer tries to apply a coupon code.
 * You validate the code and return the discount amount.
 * 
 * Docs: https://razorpay.com/docs/magic-checkout/custom-ecommerce/promotions/
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const { code, cart_amount } = body;

    // Add your own coupon validation logic here.
    // Example: check if code matches a coupon in your database.

    // For now: reject all codes (no active coupons)
    return NextResponse.json({
      valid: false,
      message: "Invalid or expired coupon code.",
    });

    // Example of a working coupon response:
    // if (code === "ASTRIDE10") {
    //   const discount = Math.round(cart_amount * 0.10);
    //   return NextResponse.json({
    //     valid: true,
    //     code: code,
    //     discount_amount: discount,
    //     message: "10% discount applied!",
    //   });
    // }

  } catch (error) {
    console.error("Magic Checkout /apply-promotion error:", error);
    return NextResponse.json(
      { valid: false, message: "Failed to validate coupon" },
      { status: 500 }
    );
  }
}
