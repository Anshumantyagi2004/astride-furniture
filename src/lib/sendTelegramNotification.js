const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

/**
 * Sends a formatted order notification to Telegram.
 * @param {object} order - The order object from MongoDB (or raw order data)
 * @param {string} paymentType - "COD" or "Razorpay"
 */
export async function sendTelegramOrderNotification(order, paymentType) {
  try {
    const shipping = order.shippingInfo || {};
    const products = order.products || [];
    const pricing = order.pricing || {};

    const productLines = products
      .map(
        (p, i) =>
          `  ${i + 1}. ${p.productName || "Unknown Product"}` +
          `\n     • Qty: ${p.quantity}` +
          `\n     • Price: ₹${(p.price || 0).toLocaleString("en-IN")}` +
          (p.color ? `\n     • Color: ${p.color}` : "")
      )
      .join("\n\n");

    const totalAmount = pricing.total || (pricing.subtotal || 0) + (pricing.shippingCharge || 0);

    const paymentEmoji = paymentType === "COD" ? "💵" : "💳";
    const paymentLabel =
      paymentType === "COD" ? "Cash on Delivery (COD)" : "Razorpay (Online Payment)";

    const message =
      `🛒 *NEW ORDER RECEIVED — ASTRIDE FURNITURE*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `👤 *Customer Details*\n` +
      `• Name: ${shipping.fullName || "N/A"}\n` +
      `• Email: ${shipping.email || "N/A"}\n` +
      `• Phone: ${shipping.phone || "N/A"}\n\n` +
      `📦 *Shipping Address*\n` +
      `• Address: ${shipping.address || "N/A"}\n` +
      `• City: ${shipping.city || "N/A"}\n` +
      `• State: ${shipping.state || "N/A"}\n` +
      `• PIN Code: ${shipping.pinCode || "N/A"}\n\n` +
      `🪑 *Ordered Products (${products.length})*\n` +
      `${productLines || "  No products"}\n\n` +
      `💰 *Pricing Breakdown*\n` +
      `• Subtotal: ₹${(pricing.subtotal || 0).toLocaleString("en-IN")}\n` +
      `• Shipping: ₹${(pricing.shippingCharge || 49).toLocaleString("en-IN")}\n` +
      `• *Total: ₹${totalAmount.toLocaleString("en-IN")}*\n\n` +
      `${paymentEmoji} *Payment Method:* ${paymentLabel}\n` +
      (order.razorpayPaymentId
        ? `• Razorpay Payment ID: \`${order.razorpayPaymentId}\`\n`
        : "") +
      (order._id ? `• Order ID: \`${order._id}\`\n` : "") +
      `\n━━━━━━━━━━━━━━━━━━━━━━\n` +
      `🕐 ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST`;

    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: "Markdown",
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("Telegram notification failed:", err);
    }
  } catch (err) {
    // Never throw — notification failures must not break order flow
    console.error("Telegram notification error:", err);
  }
}
