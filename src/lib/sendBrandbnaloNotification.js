/**
 * Sends order details to the brandbnalo.com API submission endpoint
 * @param {object} order - The order object
 * @param {string} paymentType - "COD" or "Razorpay"
 */
export async function sendBrandbnaloNotification(order, paymentType) {
  try {
    const shipping = order.shippingInfo || {};
    const products = order.products || [];
    const pricing = order.pricing || {};

    // 1. Gather all product names
    const productNames = products.map(p => p.productName).join(", ") || "No products";

    // 2. Format place / address
    const place = `${shipping.address || ""}, ${shipping.city || ""}, ${shipping.state || ""} - ${shipping.pinCode || ""}`;

    // 3. Format the detailed message listing
    const productDetailsText = products
      .map(
        (p) =>
          `• <b>Product:</b> ${p.productName}<br>` +
          `  - <b>Product ID:</b> ${p.productId || "N/A"}<br>` +
          `  - <b>Color:</b> ${p.color || "N/A"}<br>` +
          `  - <b>Quantity:</b> ${p.quantity}<br>` +
          `  - <b>Unit Price:</b> ₹${(p.price || 0).toLocaleString("en-IN")}<br>` +
          `  - <b>Total Price:</b> ₹${((p.price || 0) * (p.quantity || 1)).toLocaleString("en-IN")}`
      )
      .join("<br><br>");

    const totalAmount = pricing.total || (pricing.subtotal || 0) + (pricing.shippingCharge || 0);

    const message = 
      `<b>ORDER STATUS:</b> ${order.status || "Confirmed"}<br><br>` +
      `<b>PAYMENT METHOD:</b> ${paymentType}<br>` +
      `<b>PAYMENT STATUS:</b> ${order.paymentStatus || "Paid"}<br>` +
      `<b>SUBTOTAL:</b> ₹${(pricing.subtotal || 0).toLocaleString("en-IN")}<br>` +
      `<b>SHIPPING CHARGE:</b> ₹${(pricing.shippingCharge || 0).toLocaleString("en-IN")}<br>` +
      `<b>TOTAL PAID:</b> ₹${totalAmount.toLocaleString("en-IN")}<br><br>` +
      `<b>PRODUCT DETAILS:</b><br>${productDetailsText}`;

    // 4. Construct the payload
    const payload = {
      supplierToken: "7311164111",
      platform: "Website Contact Page",
      platformEmail: "deepa@mbtc.co.in",
      name: shipping.fullName || "N/A",
      phone: shipping.phone || "N/A",
      email: shipping.email || "N/A",
      product: productNames,
      place: place,
      message: message
    };

    // 5. Send POST request
    const response = await fetch("https://brandbnalo.com/api/form/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Brandbnalo notification failed:", errorText);
    }
  } catch (err) {
    console.error("Brandbnalo notification error:", err);
  }
}

/**
 * Sends contact form details to brandbnalo
 * @param {object} contact
 */
export async function sendBrandbnaloContactNotification(contact) {
  try {
    const message = 
      `<b>NEW CONTACT FORM SUBMISSION</b><br><br>` +
      `<b>COMPANY NAME:</b> ${contact.companyName || "N/A"}<br>` +
      `<b>MESSAGE:</b><br>${contact.message}`;

    const payload = {
      supplierToken: "7311164111",
      platform: "Website Contact Page",
      platformEmail: "deepa@mbtc.co.in",
      name: contact.fullName || "N/A",
      phone: contact.phone || "N/A",
      email: contact.email || "N/A",
      product: "Contact Form / General Enquiry",
      place: `${contact.city || ""}, ${contact.state || ""}`,
      message: message
    };

    const response = await fetch("https://brandbnalo.com/api/form/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error("Brandbnalo contact notification failed:", await response.text());
    }
  } catch (err) {
    console.error("Brandbnalo contact notification error:", err);
  }
}

/**
 * Sends corporate enquiry details to brandbnalo
 * @param {object} enquiry
 */
export async function sendBrandbnaloEnquiryNotification(enquiry) {
  try {
    const message = 
      `<b>NEW CORPORATE ENQUIRY SUBMISSION</b><br><br>` +
      `<b>COMPANY NAME:</b> ${enquiry.companyName || "N/A"}<br>` +
      `<b>NO. OF CHAIRS:</b> ${enquiry.quantity}<br>`;

    const payload = {
      supplierToken: "7311164111",
      platform: "Website Contact Page",
      platformEmail: "deepa@mbtc.co.in",
      name: enquiry.fullName || "N/A",
      phone: enquiry.phone || "N/A",
      email: enquiry.email || "N/A",
      product: "Corporate Enquiry (Bulk Order)",
      place: enquiry.location || "N/A",
      message: message
    };

    const response = await fetch("https://brandbnalo.com/api/form/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error("Brandbnalo enquiry notification failed:", await response.text());
    }
  } catch (err) {
    console.error("Brandbnalo enquiry notification error:", err);
  }
}
