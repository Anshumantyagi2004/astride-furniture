import { NextResponse } from "next/server";

/**
 * Razorpay Magic Checkout — Shipping Serviceability Endpoint
 * 
 * Razorpay calls this endpoint to check if delivery is available
 * to a given pincode, and to fetch the shipping fee.
 * 
 * Docs: https://razorpay.com/docs/magic-checkout/custom-ecommerce/shipping/
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const { zipcode } = body;

    // You can add your own pincode-based logic here.
    // For now: free shipping is available everywhere across India.

    return NextResponse.json({
      serviceable: true,
      cod: false,           // Set to true if you want to offer COD via Magic Checkout
      shipping_fee: 0,      // Free shipping
      cod_fee: 0,
    });
  } catch (error) {
    console.error("Magic Checkout /shipping error:", error);
    return NextResponse.json(
      { serviceable: false, error: "Failed to check serviceability" },
      { status: 500 }
    );
  }
}
