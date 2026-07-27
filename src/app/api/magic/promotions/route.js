import { NextResponse } from "next/server";

/**
 * Razorpay Magic Checkout — Get Available Promotions/Coupons
 * 
 * Razorpay calls this to show available discount codes
 * to the customer inside the Magic Checkout popup.
 * 
 * Docs: https://razorpay.com/docs/magic-checkout/custom-ecommerce/promotions/
 */
export async function POST(req) {
  try {
    // You can fetch active coupons from your database here.
    // For now: returning empty array (no active promotions).

    return NextResponse.json({
      promotions: [],
      // Example of a coupon you can add later:
      // promotions: [
      //   {
      //     code: "ASTRIDE10",
      //     description: "10% off on all orders",
      //     type: "percentage",
      //     value: 10,
      //   }
      // ]
    });
  } catch (error) {
    console.error("Magic Checkout /promotions error:", error);
    return NextResponse.json(
      { promotions: [], error: "Failed to fetch promotions" },
      { status: 500 }
    );
  }
}
