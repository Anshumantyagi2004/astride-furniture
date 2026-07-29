import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/config/connectDB";
import Order from "@/models/order/Order";
import { sendTelegramOrderNotification } from "@/lib/sendTelegramNotification";
import { sendBrandbnaloNotification } from "@/lib/sendBrandbnaloNotification";
import { sendWhatsappOrderNotification } from "@/lib/sendWhatsappNotification";

// Force Node.js runtime — crypto and mongoose are incompatible with Edge runtime
export const runtime = "nodejs";

// Helper function to pick the first valid non-empty string across multiple sources
const pick = (...vals) => {
  for (const v of vals) {
    if (v && typeof v === "string" && v.trim().length > 0) {
      return v.trim();
    }
  }
  return "";
};

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
            const sa = cd.shipping_address || cd.billing_address || {};
            magicShippingInfo = {
              fullName: sa.name || cd.name || "",
              email: cd.email || "",
              phone: cd.contact || "",
              address: [sa.line1, sa.line2, sa.street1, sa.street2].filter(Boolean).join(", "),
              city: sa.city || "",
              state: sa.state || "",
              pinCode: sa.zipcode || sa.pin_code || sa.pincode || "",
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

    const rzpAuthHeader = Buffer.from(
      `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
    ).toString("base64");

    // Fallback for Magic Checkout platform signatures: query Razorpay Payments API directly
    if (!isSignatureValid && razorpay_payment_id) {
      try {
        const pRes = await fetch(`https://api.razorpay.com/v1/payments/${razorpay_payment_id}`, {
          headers: { Authorization: `Basic ${rzpAuthHeader}` },
          cache: "no-store",
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
    // MAGIC CHECKOUT DUAL FETCH: Order API + Payment API
    // =========================================================
    let rzpOrderData = null;
    let rzpPaymentData = null;

    try {
      const [orderRes, paymentRes] = await Promise.allSettled([
        fetch(`https://api.razorpay.com/v1/orders/${razorpay_order_id}`, {
          headers: { Authorization: `Basic ${rzpAuthHeader}` },
          cache: "no-store",
        }),
        fetch(`https://api.razorpay.com/v1/payments/${razorpay_payment_id}`, {
          headers: { Authorization: `Basic ${rzpAuthHeader}` },
          cache: "no-store",
        }),
      ]);

      if (orderRes.status === "fulfilled" && orderRes.value.ok) {
        rzpOrderData = await orderRes.value.json();
      }

      if (paymentRes.status === "fulfilled" && paymentRes.value.ok) {
        rzpPaymentData = await paymentRes.value.json();
      }
    } catch (fetchErr) {
      console.error("Failed to fetch Razorpay details:", fetchErr);
    }

    // Extract Order API candidate data
    const cd = rzpOrderData?.customer_details || {};
    const sa = cd.shipping_address || cd.billing_address || {};
    const notes = rzpOrderData?.notes || {};

    const orderApiInfo = {
      fullName: sa.name || cd.name || notes.fullName || notes.name || "",
      email: cd.email || notes.email || "",
      phone: cd.contact || notes.phone || "",
      address: [sa.line1, sa.line2, sa.street1, sa.street2].filter(Boolean).join(", "),
      city: sa.city || "",
      state: sa.state || "",
      pinCode: sa.zipcode || sa.pin_code || sa.pincode || "",
    };

    // Extract Payment API candidate data
    const paymentApiInfo = {
      fullName: rzpPaymentData?.card?.name || rzpPaymentData?.vpa || "",
      email: rzpPaymentData?.email || "",
      phone: rzpPaymentData?.contact || "",
    };

    // Extract Frontend candidate data
    const frontendInfo = orderData?.shippingInfo || {};

    // Multi-source fallback merge strategy:
    // Order API -> Payment API -> Frontend Data -> Notes -> Defaults
    const finalShippingInfo = {
      fullName: pick(orderApiInfo.fullName, paymentApiInfo.fullName, frontendInfo.fullName, "Valued Customer"),
      email: pick(orderApiInfo.email, paymentApiInfo.email, frontendInfo.email),
      phone: pick(orderApiInfo.phone, paymentApiInfo.phone, frontendInfo.phone),
      address: pick(orderApiInfo.address, frontendInfo.address, frontendInfo.billingAddress, "Address provided on Checkout"),
      city: pick(orderApiInfo.city, frontendInfo.city),
      state: pick(orderApiInfo.state, frontendInfo.stateName, frontendInfo.state),
      pinCode: pick(orderApiInfo.pinCode, frontendInfo.pinCode),
      customMessage: pick(frontendInfo.customMessage),
      billingAddress: pick(frontendInfo.billingAddress, orderApiInfo.address),
      gstNumber: pick(frontendInfo.gstNumber),
    };

    // Idempotent order creation: Check if order with this razorpayOrderId already exists
    let finalOrder = await Order.findOne({ razorpayOrderId: razorpay_order_id });

    if (!finalOrder) {
      finalOrder = await Order.create({
        ...orderData,
        shippingInfo: finalShippingInfo,
        paymentMethod: "Razorpay",
        paymentStatus: "Paid",
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: "Confirmed",
      });

      // Fire-and-forget notifications only for newly created orders
      sendTelegramOrderNotification(finalOrder.toObject ? finalOrder.toObject() : finalOrder, "Razorpay");
      sendBrandbnaloNotification(finalOrder.toObject ? finalOrder.toObject() : finalOrder, "Razorpay");
      sendWhatsappOrderNotification(finalOrder.toObject ? finalOrder.toObject() : finalOrder, "Razorpay");
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified and order processed successfully",
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

/*
// =====================================================================
// PREVIOUS IMPLEMENTATION (KEPT FOR REFERENCE)
// =====================================================================
//
// let magicShippingInfo = null;
// let paymentContactInfo = null;
// try {
//   const rzpAuthHeader = Buffer.from(
//     `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
//   ).toString("base64");
//
//   // 1. Fetch Order (for Magic Checkout customer_details)
//   const rzpOrderRes = await fetch(
//     `https://api.razorpay.com/v1/orders/${razorpay_order_id}`,
//     {
//       headers: {
//         Authorization: `Basic ${rzpAuthHeader}`,
//         "Content-Type": "application/json",
//       },
//       cache: "no-store"
//     }
//   );
//
//   if (rzpOrderRes.ok) {
//     const rzpOrder = await rzpOrderRes.json();
//     const cd = rzpOrder?.customer_details;
//     if (cd) {
//       const sa = cd.shipping_address || {};
//       magicShippingInfo = {
//         fullName: sa.name || cd.name || "",
//         email: cd.email || "",
//         phone: cd.contact || "",
//         address: [sa.line1, sa.line2].filter(Boolean).join(", "),
//         city: sa.city || "",
//         state: sa.state || "",
//         pinCode: sa.zipcode || "",
//       };
//     }
//   }
//
//   // 2. Fetch Payment (Fallback for contact & email if standard checkout was used)
//   if (razorpay_payment_id) {
//     const rzpPaymentRes = await fetch(
//       `https://api.razorpay.com/v1/payments/${razorpay_payment_id}`,
//       {
//         headers: { Authorization: `Basic ${rzpAuthHeader}` },
//         cache: "no-store"
//       }
//     );
//     if (rzpPaymentRes.ok) {
//       const pData = await rzpPaymentRes.json();
//       paymentContactInfo = {
//         email: pData.email || "",
//         phone: pData.contact || "",
//       };
//     }
//   }
// } catch (fetchErr) {
//   console.error("Failed to fetch Razorpay details:", fetchErr);
// }
//
// // Merge strategy: Prioritize Magic Checkout -> Frontend Data -> Payment Data
// const frontendData = orderData?.shippingInfo || {};
// const magicData = magicShippingInfo || {};
// const paymentData = paymentContactInfo || {};
//
// const finalShippingInfo = {
//   fullName: magicData.fullName || frontendData.fullName || "",
//   email: magicData.email || frontendData.email || paymentData.email || "",
//   phone: magicData.phone || frontendData.phone || paymentData.phone || "",
//   address: magicData.address || frontendData.address || "",
//   city: magicData.city || frontendData.city || "",
//   state: magicData.state || frontendData.stateName || frontendData.state || "",
//   pinCode: magicData.pinCode || frontendData.pinCode || "",
//   customMessage: frontendData.customMessage || "",
//   billingAddress: frontendData.billingAddress || "",
//   gstNumber: frontendData.gstNumber || "",
// };
//
// const finalOrder = await Order.create({
//   ...orderData,
//   shippingInfo: finalShippingInfo,
//   paymentMethod: "Razorpay",
//   paymentStatus: "Paid",
//   razorpayOrderId: razorpay_order_id,
//   razorpayPaymentId: razorpay_payment_id,
//   status: "Confirmed",
// });
// =====================================================================
*/


