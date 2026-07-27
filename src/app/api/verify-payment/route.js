import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/config/connectDB";
import Order from "@/models/order/Order";
import { sendTelegramOrderNotification } from "@/lib/sendTelegramNotification";
import { sendBrandbnaloNotification } from "@/lib/sendBrandbnaloNotification";

// Force Node.js runtime — crypto and mongoose are incompatible with Edge runtime
export const runtime = "nodejs";

export async function POST(req) {
  try {
    await connectDB();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData, // contains the user details, products, pricing, etc.
      onlyFetchDetails, // flag to just fetch details without verifying signature
    } = await req.json();

    if (onlyFetchDetails) {
      let magicShippingInfo = null;
      try {
        const rzpAuthHeader = Buffer.from(
          `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
        ).toString("base64");

        const rzpOrderRes = await fetch(
          `https://api.razorpay.com/v1/orders/${razorpay_order_id}`,
          {
            headers: {
              Authorization: `Basic ${rzpAuthHeader}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (rzpOrderRes.ok) {
          const rzpOrder = await rzpOrderRes.json();
          const cd = rzpOrder?.customer_details;
          if (cd) {
            const sa = cd.shipping_address || {};
            magicShippingInfo = {
              fullName: sa.name || cd.name || "",
              email: cd.email || "",
              phone: cd.contact || "",
              address: [sa.line1, sa.line2].filter(Boolean).join(", "),
              city: sa.city || "",
              state: sa.state || "",
              pinCode: sa.zipcode || "",
            };
          }
        }
      } catch (fetchErr) {
        console.error("Failed to fetch Razorpay order details:", fetchErr);
      }
      return NextResponse.json({ success: true, shippingInfo: magicShippingInfo });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, message: "Missing required verification parameters" },
        { status: 400 }
      );
    }

    // Verify signature using HMAC-SHA256
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(sign.toString())
      .digest("hex");

    let isSignatureValid = razorpay_signature === expectedSign;

    // Fallback for Magic Checkout platform signatures: query Razorpay Payments API directly
    if (!isSignatureValid && razorpay_payment_id) {
      try {
        const rzpAuthHeader = Buffer.from(
          `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
        ).toString("base64");

        const pRes = await fetch(`https://api.razorpay.com/v1/payments/${razorpay_payment_id}`, {
          headers: { Authorization: `Basic ${rzpAuthHeader}` }
        });
        if (pRes.ok) {
          const pData = await pRes.json();
          if (pData.status === "captured" || pData.status === "authorized") {
            isSignatureValid = true;
          }
        }
      } catch (err) {
        console.error("Direct payment verification fallback error:", err);
      }
    }

    if (!isSignatureValid) {
      return NextResponse.json(
        { success: false, message: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // =========================================================
    // MAGIC CHECKOUT: Fetch address from Razorpay Orders API
    // Razorpay Magic Checkout does NOT send address in callback.
    // We must fetch the order to get customer_details.
    // =========================================================
    let magicShippingInfo = null;
    try {
      const rzpAuthHeader = Buffer.from(
        `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
      ).toString("base64");

      const rzpOrderRes = await fetch(
        `https://api.razorpay.com/v1/orders/${razorpay_order_id}`,
        {
          headers: {
            Authorization: `Basic ${rzpAuthHeader}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (rzpOrderRes.ok) {
        const rzpOrder = await rzpOrderRes.json();
        const cd = rzpOrder?.customer_details;
        if (cd) {
          const sa = cd.shipping_address || {};
          magicShippingInfo = {
            fullName: sa.name || cd.name || "",
            email: cd.email || "",
            phone: cd.contact || "",
            address: [sa.line1, sa.line2].filter(Boolean).join(", "),
            city: sa.city || "",
            state: sa.state || "",
            pinCode: sa.zipcode || "",
          };
        }
      }
    } catch (fetchErr) {
      console.error("Failed to fetch Razorpay order for Magic Checkout address:", fetchErr);
    }

    // Merge: Magic Checkout address takes priority for address details, but preserve customMessage & billingAddress from orderData if provided
    const baseShipping = magicShippingInfo || orderData?.shippingInfo || {};
    const finalShippingInfo = {
      ...baseShipping,
      customMessage: orderData?.shippingInfo?.customMessage || baseShipping.customMessage || "",
      billingAddress: orderData?.shippingInfo?.billingAddress || baseShipping.billingAddress || "",
    };

    // Save verified order into database
    const finalOrder = await Order.create({
      ...orderData,
      shippingInfo: finalShippingInfo,
      paymentMethod: "Razorpay",
      paymentStatus: "Paid",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      status: "Confirmed",
    });

    // Fire-and-forget Telegram notification — does NOT block the response
    sendTelegramOrderNotification(finalOrder.toObject ? finalOrder.toObject() : finalOrder, "Razorpay");
    sendBrandbnaloNotification(finalOrder.toObject ? finalOrder.toObject() : finalOrder, "Razorpay");

    return NextResponse.json({
      success: true,
      message: "Payment verified and order created successfully",
      order: finalOrder,
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Verification failed" },
      { status: 500 }
    );
  }
}
