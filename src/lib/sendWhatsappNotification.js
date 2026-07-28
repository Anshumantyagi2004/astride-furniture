/**
 * Sends a WhatsApp order notification to the owner via MyOperator.
 * Template name: product_notification
 * @param {object} order - The order object from MongoDB
 * @param {string} paymentType - "COD" or "Razorpay"
 */
export async function sendWhatsappOrderNotification(order, paymentType) {
  try {
    const shipping = order.shippingInfo || {};
    const products = order.products || [];
    const pricing = order.pricing || {};

    const totalAmount = pricing.total || ((pricing.subtotal || 0) + (pricing.shippingCharge || 0));

    const productSummary = products
      .map((p, i) => `${i + 1}. ${p.productName || "Product"}${p.color ? ` (${p.color})` : ""} x${p.quantity}`)
      .join("; ");

    const paymentLabel = paymentType === "COD" ? "Cash on Delivery (COD)" : "Online Payment (Razorpay)";
    const timeIST = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    const url = `${process.env.MYOPERATOR_BASE_URL || "https://publicapi.myoperator.co"}/chat/messages`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.MYOPERATOR_AUTHENTICATION, // Updated header
      },
      body: JSON.stringify({
        phone_number_id: process.env.MYOPERATOR_PHONE_NUMBER_ID,
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: process.env.OWNER_WHATSAPP_NUMBER,
        type: "template",
        template: {
          name: "product_notification",
          language: { code: "en" },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: shipping.fullName || "N/A" },
                { type: "text", text: shipping.phone || "N/A" },
                { type: "text", text: shipping.city || "N/A" },
                { type: "text", text: shipping.state || "N/A" },
                { type: "text", text: productSummary || "N/A" },
                { type: "text", text: totalAmount.toLocaleString("en-IN") },
                { type: "text", text: paymentLabel },
                { type: "text", text: String(order._id || "N/A") },
                { type: "text", text: timeIST },
              ],
            },
          ],
        },
      }),
    });

    const resData = await response.json();
    console.log("MyOperator Response:", resData);

  } catch (err) {
    console.error("WhatsApp notification error:", err);
  }
}