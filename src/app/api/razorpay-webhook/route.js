import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/config/connectDB";
import Order from "@/models/order/Order";
import { sendTelegramOrderNotification } from "@/lib/sendTelegramNotification";
import { sendBrandbnaloNotification } from "@/lib/sendBrandbnaloNotification";
import { sendWhatsappOrderNotification } from "@/lib/sendWhatsappNotification";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!secret) {
      console.error("RAZORPAY_WEBHOOK_SECRET is not set in environment variables");
      return NextResponse.json({ success: false, message: "Webhook secret unconfigured" }, { status: 500 });
    }

    // Verify Razorpay HMAC-SHA256 Webhook Signature
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.error("Invalid Razorpay Webhook Signature");
      return NextResponse.json({ success: false, message: "Invalid signature" }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;

    // Handle order.paid or payment.captured events from Magic Checkout
    if (event === "order.paid" || event === "payment.captured" || event === "payment.authorized") {
      await connectDB();

      const paymentEntity = payload.payload?.payment?.entity || {};
      const orderEntity = payload.payload?.order?.entity || {};

      const razorpayOrderId = orderEntity.id || paymentEntity.order_id;
      const razorpayPaymentId = paymentEntity.id;

      if (!razorpayOrderId) {
        return NextResponse.json({ success: true, message: "No order ID in payload" });
      }

      // Extract shipping address and customer contact details from Magic Checkout payload
      const shippingAddressObj =
        paymentEntity.shipping_address ||
        orderEntity.customer_details?.shipping_address ||
        paymentEntity.notes?.shipping_address ||
        {};

      const customerDetails = orderEntity.customer_details || {};

      const fullName =
        shippingAddressObj.name ||
        customerDetails.name ||
        paymentEntity.notes?.fullName ||
        paymentEntity.notes?.name ||
        paymentEntity.card?.name ||
        "Valued Customer";

      const email =
        customerDetails.email ||
        paymentEntity.email ||
        paymentEntity.notes?.email ||
        "";

      const phone =
        customerDetails.contact ||
        paymentEntity.contact ||
        paymentEntity.notes?.phone ||
        "";

      const addressLines = [
        shippingAddressObj.line1,
        shippingAddressObj.line2,
        shippingAddressObj.street1,
        shippingAddressObj.street2,
      ]
        .filter(Boolean)
        .join(", ");

      const address = addressLines || paymentEntity.notes?.address || "Address provided via Magic Checkout";
      const city = shippingAddressObj.city || paymentEntity.notes?.city || "";
      const state = shippingAddressObj.state || paymentEntity.notes?.state || "";
      const pinCode = shippingAddressObj.zipcode || shippingAddressObj.pincode || shippingAddressObj.pin_code || paymentEntity.notes?.pinCode || "";

      const updatedShippingInfo = {
        fullName,
        email,
        phone,
        address,
        city,
        state,
        pinCode,
        customMessage: paymentEntity.notes?.customMessage || "",
        billingAddress: paymentEntity.notes?.billingAddress || address,
        gstNumber: paymentEntity.notes?.gstNumber || "",
      };

      let existingOrder = await Order.findOne({ razorpayOrderId });

      if (existingOrder) {
        existingOrder.shippingInfo = updatedShippingInfo;
        if (razorpayPaymentId) existingOrder.razorpayPaymentId = razorpayPaymentId;
        existingOrder.paymentStatus = "Paid";
        existingOrder.status = "Confirmed";
        await existingOrder.save();
        console.log(`Successfully updated Magic Checkout customer data for Order ${razorpayOrderId}`);

        // Fire notifications with full customer details
        sendTelegramOrderNotification(existingOrder.toObject ? existingOrder.toObject() : existingOrder, "Razorpay");
        sendBrandbnaloNotification(existingOrder.toObject ? existingOrder.toObject() : existingOrder, "Razorpay");
        sendWhatsappOrderNotification(existingOrder.toObject ? existingOrder.toObject() : existingOrder, "Razorpay");
      } else {
        console.log(`Order with razorpayOrderId ${razorpayOrderId} not found via webhook sync.`);
      }
    }

    return NextResponse.json({ success: true, message: "Webhook processed" });
  } catch (error) {
    console.error("Razorpay webhook error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
