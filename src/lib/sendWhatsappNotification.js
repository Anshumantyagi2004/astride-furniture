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
      "OWNER_WHATSAPP_NUMBER",
    ];

    for (const key of requiredEnv) {
      if (!process.env[key]) {
        throw new Error(`Missing environment variable: ${key}`);
      }
    }

    const shipping = order?.shippingInfo || {};
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

    const timeIST = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });

    const url = `${process.env.MYOPERATOR_BASE_URL}/chat/messages`;

    let rawPhone = String(shipping.phone || process.env.OWNER_WHATSAPP_NUMBER || "").replace(/\D/g, "");
    if (rawPhone.length > 10 && rawPhone.startsWith("91")) {
      rawPhone = rawPhone.slice(2);
    }
    const cleanPhone = rawPhone.slice(-10);

    const payload = {
      phone_number_id: process.env.MYOPERATOR_PHONE_NUMBER_ID,

      customer_country_code: "91",
      customer_number: cleanPhone,

      data: {
        type: "template",
        language: "en",
        context: {
          template_name: "notification_template",
          language: "en",

          body: {
            "1": shipping.fullName || "",
            "2": shipping.phone || "",
            "3": shipping.city || "",
            "4": shipping.state || "",
            "5": productSummary,
            "6": totalAmount.toString(),
            "7": paymentLabel,
            "8": String(order._id),
            "9": timeIST,
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
    console.log("Owner:", process.env.OWNER_WHATSAPP_NUMBER);
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