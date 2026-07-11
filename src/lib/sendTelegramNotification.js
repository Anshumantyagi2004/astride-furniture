const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

/**
 * Sends a formatted order notification to Telegram.
 * @param {object} order - The order object from MongoDB (or raw order data)
 * @param {string} paymentType - "COD" or "Razorpay"
 */
function escapeHTML(str) {
  if (!str) return "N/A";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function sendTelegramOrderNotification(order, paymentType) {
  try {
    const shipping = order.shippingInfo || {};
    const products = order.products || [];
    const pricing = order.pricing || {};

    const productLines = products
      .map(
        (p, i) =>
          `  ${i + 1}. ${escapeHTML(p.productName || "Unknown Product")}` +
          `\n     • Qty: ${p.quantity}` +
          `\n     • Price: ₹${(p.price || 0).toLocaleString("en-IN")}` +
          (p.color ? `\n     • Color: ${escapeHTML(p.color)}` : "")
      )
      .join("\n\n");

    const totalAmount = pricing.total || (pricing.subtotal || 0) + (pricing.shippingCharge || 0);

    const paymentEmoji = paymentType === "COD" ? "💵" : "💳";
    const paymentLabel =
      paymentType === "COD" ? "Cash on Delivery (COD)" : "Razorpay (Online Payment)";

    const message =
      `🛒 <b>NEW ORDER RECEIVED — ASTRIDE FURNITURE</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `👤 <b>Customer Details</b>\n` +
      `• Name: ${escapeHTML(shipping.fullName)}\n` +
      `• Email: ${escapeHTML(shipping.email)}\n` +
      `• Phone: ${escapeHTML(shipping.phone)}\n\n` +
      `📦 <b>Shipping Address</b>\n` +
      `• Address: ${escapeHTML(shipping.address)}\n` +
      `• City: ${escapeHTML(shipping.city)}\n` +
      `• State: ${escapeHTML(shipping.state)}\n` +
      `• PIN Code: ${escapeHTML(shipping.pinCode)}\n\n` +
      `🪑 <b>Ordered Products (${products.length})</b>\n` +
      `${productLines || "  No products"}\n\n` +
      `💰 <b>Pricing Breakdown</b>\n` +
      `• Subtotal: ₹${(pricing.subtotal || 0).toLocaleString("en-IN")}\n` +
      `• Shipping: ₹${(pricing.shippingCharge || 49).toLocaleString("en-IN")}\n` +
      `• <b>Total: ₹${totalAmount.toLocaleString("en-IN")}</b>\n\n` +
      `${paymentEmoji} <b>Payment Method:</b> ${escapeHTML(paymentLabel)}\n` +
      (order.razorpayPaymentId
        ? `• Razorpay Payment ID: <code>${escapeHTML(order.razorpayPaymentId)}</code>\n`
        : "") +
      (order._id ? `• Order ID: <code>${escapeHTML(order._id)}</code>\n` : "") +
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
          parse_mode: "HTML",
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

/**
 * Sends a cancellation alert to Telegram when a user cancels their order.
 * @param {object} order - The order object from MongoDB
 */
export async function sendTelegramCancelNotification(order) {
  try {
    const shipping = order.shippingInfo || {};
    const pricing = order.pricing || {};
    const products = order.products || [];

    const productLines = products
      .map(
        (p, i) =>
          `  ${i + 1}. ${escapeHTML(p.productName || "Unknown Product")}` +
          `\n     • Qty: ${p.quantity}` +
          `\n     • Price: \u20b9${(p.price || 0).toLocaleString("en-IN")}` +
          (p.color ? `\n     • Color: ${escapeHTML(p.color)}` : "")
      )
      .join("\n\n");

    const message =
      `\u{1F6AB} <b>ORDER CANCELLED BY USER \u2014 ASTRIDE FURNITURE</b>\n` +
      `\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\n` +
      `\u{1F464} <b>Customer Details</b>\n` +
      `\u2022 Name: ${escapeHTML(shipping.fullName)}\n` +
      `\u2022 Phone: ${escapeHTML(shipping.phone)}\n` +
      `\u2022 Email: ${escapeHTML(shipping.email)}\n\n` +
      `\u{1FA91} <b>Cancelled Products (${products.length})</b>\n` +
      `${productLines || "  No products"}\n\n` +
      `\u{1F4B0} <b>Order Value</b>\n` +
      `\u2022 Subtotal: \u20b9${(pricing.subtotal || 0).toLocaleString("en-IN")}\n` +
      `\u2022 <b>Total: \u20b9${(pricing.total || 0).toLocaleString("en-IN")}</b>\n\n` +
      (order._id ? `\u{1F4CB} Order ID: <code>${escapeHTML(String(order._id))}</code>\n` : "") +
      `\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n` +
      `\u{1F550} ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST`;

    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: "HTML",
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("Telegram cancel notification failed:", err);
    }
  } catch (err) {
    // Never throw — notification failures must not break order flow
    console.error("Telegram cancel notification error:", err);
  }
}
