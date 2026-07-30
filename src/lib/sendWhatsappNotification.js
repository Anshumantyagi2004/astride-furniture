/**
 * Sends a WhatsApp order notification to the owner via MyOperator.
 * Template name: product_notification
 *
 * @param {Object} order - Order object from MongoDB
 * @param {String} paymentType - "COD" or "Razorpay"
 */
export async function sendWhatsappOrderNotification(order, paymentType) {
  try {
    // Validate required environment variables
    const requiredEnv = [
      "MYOPERATOR_BASE_URL",
      "MYOPERATOR_AUTHENTICATION",
      "MYOPERATOR_PHONE_NUMBER_ID",
    ];

    for (const key of requiredEnv) {
      if (!process.env[key]) {
        throw new Error(`Missing environment variable: ${key}`);
      }
    }

    const shipping = order?.shippingInfo || order?.shippingAddress || {};
    const products = order?.products || [];
    const pricing = order?.pricing || {};

    const totalAmount =
      pricing.total ??
      ((pricing.subtotal || 0) + (pricing.shippingCharge || 0));

    const productSummary =
      products.length > 0
        ? products
          .map(
            (p, i) =>
              `${i + 1}. ${p.productName || "Product"}${p.color ? ` (${p.color})` : ""
              } x${p.quantity || 1}`
          )
          .join("; ")
        : "No Products";

    const paymentLabel =
      paymentType === "COD"
        ? "Cash on Delivery (COD)"
        : "Online Payment (Razorpay)";

    const url = `${process.env.MYOPERATOR_BASE_URL}/chat/messages`;

    // Clean customer phone number (extract last 10 digits)
    const rawPhone = shipping.phone || shipping.contactNumber || "";
    const customerPhone = String(rawPhone).replace(/\D/g, "").slice(-10);

    if (!customerPhone || customerPhone.length !== 10) {
      throw new Error(`Invalid customer phone number: ${rawPhone}`);
    }

    const customerName = shipping.fullName || shipping.name || "Customer";
    const city = shipping.city || "";
    const state = shipping.state || "";

    const payload = {
      phone_number_id: process.env.MYOPERATOR_PHONE_NUMBER_ID,

      customer_country_code: "91",
      customer_number: customerPhone,

      data: {
        type: "template",
        language: "en",
        context: {
          template_name: "customer_notification",
          language: "en",

          body: {
            "1": customerName,
            "2": rawPhone,
            "3": city,
            "4": state,
            "5": productSummary,
            "6": totalAmount.toString(),
            "7": paymentLabel,
            "8": String(order._id),
          },
        },
      },

      reply_to: null,
      myop_ref_id: String(order._id),

      trail: {
        name: null,
      },
    };

    console.log("========== MYOPERATOR REQUEST ==========");
    console.log("URL:", url);
    console.log("Phone Number ID:", process.env.MYOPERATOR_PHONE_NUMBER_ID);
    console.log("Customer Phone:", customerPhone);
    console.log("Payload:", JSON.stringify(payload, null, 2));
    console.log({
      key: process.env.MYOPERATOR_AUTHENTICATION,
      company: process.env.MYOPERATOR_COMPANY_ID,
    });
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.MYOPERATOR_AUTHENTICATION}`,
        "X-MYOP-COMPANY-ID": process.env.MYOPERATOR_COMPANY_ID,
      },
      body: JSON.stringify(payload),
    });
    const responseText = await response.text();
    console.log(responseText);
    console.log("========== MYOPERATOR RESPONSE ==========");
    console.log("MYOPERATOR_PHONE_NUMBER_ID", process.env.MYOPERATOR_PHONE_NUMBER_ID);
    console.log("Status:", response.status);
    console.log("Body:", responseText);

    let responseData = {};

    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { raw: responseText };
    }

    if (!response.ok) {
      throw new Error(
        responseData.message ||
        `MyOperator API failed with status ${response.status}`
      );
    }

    console.log("WhatsApp notification sent successfully.");

    return responseData;
  } catch (error) {
    console.error("WhatsApp notification error:", error);
    throw error;
  }
}