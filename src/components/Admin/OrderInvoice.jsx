"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

const OrderInvoice = () => {
  const params = useParams();
  const orderId = params?.id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  useEffect(() => {
    if (!orderId) return;
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/api/order');
        if (data.success && data.orders) {
          const found = data.orders.find(o => o._id === orderId);
          if (found) {
            setOrder(found);
            const invNum = found._id?.toString().slice(-6).toUpperCase() || "ORDER";
            document.title = `Invoice_${invNum}`;
          } else {
            setError("Order not found");
          }
        }
      } catch (err) {
        console.error("Failed to load order for invoice:", err);
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();

    return () => {
      document.title = "Admin Dashboard | Astride Furniture";
    };
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-100 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-4 border-neutral-300 border-t-neutral-900 rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-neutral-600">Generating Invoice...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-neutral-100 flex flex-col items-center justify-center p-4">
        <p className="text-red-600 font-bold mb-4">{error || "Order not found"}</p>
        <button onClick={() => window.close()} className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-sm">Close</button>
      </div>
    );
  }

  // Fallback defaults
  const safeOrder = {
    ...order,
    products: order.products || [],
    shippingInfo: order.shippingInfo || {},
    pricing: order.pricing || { subtotal: 0, shippingCharge: 0, total: 0 }
  };

  // Formatting variables
  const invoiceNumber = `#${safeOrder._id?.toString().slice(-6).toUpperCase()}`;
  const orderDate = new Date(safeOrder.createdAt).toLocaleDateString('en-GB'); // DD/MM/YYYY
  const paymentMethod = safeOrder.paymentMethod || "Razorpay secure";
  const shippingMethod = safeOrder.pricing.shippingCharge > 0 ? "Standard Delivery" : "Free Standard Delivery";

  // Calculations exactly matching Image 1's summary
  const subtotalInclusive = safeOrder.products.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalExclTax = subtotalInclusive / 1.18;
  const salesTax = subtotalInclusive - totalExclTax;
  const shipping = safeOrder.pricing.shippingCharge || 0;
  const finalTotal = subtotalInclusive + shipping;

  const handlePrint = async () => {
    setIsGeneratingPdf(true);
    try {
      const element = document.querySelector(".invoice-container");
      if (!element) {
        window.print();
        setIsGeneratingPdf(false);
        return;
      }

      // Pre-fetch all product images and convert to base64 data URLs
      // This bypasses CORS tainted canvas restrictions entirely
      const imgElements = element.querySelectorAll("img");
      await Promise.all(
        Array.from(imgElements).map(async (img) => {
          try {
            const response = await fetch(img.src, { mode: "cors" });
            if (response.ok) {
              const blob = await response.blob();
              const dataUrl = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(blob);
              });
              img.src = dataUrl;
            }
          } catch {
            // If fetch fails, keep original src — image will render as placeholder
          }
        })
      );

      const html2pdf = (await import("html2pdf.js")).default;
      const invNum = safeOrder._id?.toString().slice(-6).toUpperCase() || "ORDER";

      // A4 portrait content width: 210mm - 2*10mm margin = 190mm = ~718px at 96dpi
      // We use 680px as the safe capture width to prevent any right-side clipping
      const CAPTURE_WIDTH = 680;

      const options = {
        margin: [10, 10, 10, 10],
        filename: `Invoice_${invNum}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: "#ffffff",
          windowWidth: CAPTURE_WIDTH,
          onclone: (clonedDoc) => {
            // Remove all external stylesheets (Tailwind etc. that contain lab()/oklch())
            clonedDoc.querySelectorAll('link[rel="stylesheet"]').forEach((link) => link.remove());

            // Sanitize any inline <style> tags
            clonedDoc.querySelectorAll("style").forEach((style) => {
              if (style.textContent) {
                style.textContent = style.textContent
                  .replace(/lab\([^)]+\)/gi, "transparent")
                  .replace(/oklch\([^)]+\)/gi, "transparent")
                  .replace(/oklab\([^)]+\)/gi, "transparent")
                  .replace(/color\([^)]+\)/gi, "transparent");
              }
            });

            // Pin container width to capture width
            const container = clonedDoc.querySelector(".invoice-container");
            if (container) {
              container.style.width = `${CAPTURE_WIDTH}px`;
              container.style.maxWidth = `${CAPTURE_WIDTH}px`;
              container.style.padding = "20px 22px";
              container.style.boxSizing = "border-box";
              container.style.margin = "0";
              container.style.backgroundColor = "#ffffff";
              container.style.color = "#1a1a1a";
            }
          }
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
      };

      await html2pdf().set(options).from(element).save();
    } catch (err) {
      console.error("html2pdf error, falling back to window.print():", err);
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="invoice-wrapper">
      {/* Action Button - Hidden during printing */}
      <div className="no-print print-actions">
        <button onClick={handlePrint} disabled={isGeneratingPdf} className="print-btn">
          {isGeneratingPdf ? "⏳ Generating PDF..." : "📥 Download PDF Invoice"}
        </button>
      </div>

      {/* A4 Printable Area */}
      <div className="invoice-container">
        
        {/* Header Section */}
        <div className="header">
          <div className="logo-container">
            {/* Update path to your actual logo if needed */}
            <img src="/logo.webp" alt="Astride" className="brand-logo" crossOrigin="anonymous" />
          </div>
          <div className="doc-meta">
            <p><strong>INVOICE NO.</strong> {invoiceNumber}</p>
            <p><strong>ORDER DATE</strong> {orderDate}</p>
            <p><strong>PAYMENT</strong> {paymentMethod}</p>
            <p><strong>SHIPPING</strong> {shippingMethod}</p>
          </div>
        </div>

        {/* Addresses Section */}
        <div className="address-section">
          <div className="address-block">
            <h3>BILL TO</h3>
            <p>{safeOrder.shippingInfo.fullName}</p>
            {safeOrder.shippingInfo.billingAddress ? (
              <p>{safeOrder.shippingInfo.billingAddress}</p>
            ) : (
              <>
                <p>{safeOrder.shippingInfo.address}</p>
                <p>{safeOrder.shippingInfo.city}, {safeOrder.shippingInfo.state} - {safeOrder.shippingInfo.pinCode}</p>
              </>
            )}
            <p>Tel. {safeOrder.shippingInfo.phone}</p>
            {safeOrder.shippingInfo.companyName && (
              <p style={{ marginTop: '6px', fontWeight: 'bold' }}>
                Company: {safeOrder.shippingInfo.companyName}
              </p>
            )}
            {safeOrder.shippingInfo.gstNumber && (
              <p style={{ marginTop: safeOrder.shippingInfo.companyName ? '2px' : '6px', fontWeight: 'bold' }}>
                GSTIN: {safeOrder.shippingInfo.gstNumber}
              </p>
            )}
          </div>
          <div className="address-block">
            <h3>SHIP TO</h3>
            <p>{safeOrder.shippingInfo.fullName}</p>
            <p>{safeOrder.shippingInfo.address}</p>
            <p>{safeOrder.shippingInfo.city}, {safeOrder.shippingInfo.state} - {safeOrder.shippingInfo.pinCode}</p>
          </div>
        </div>

        {/* Items Section */}
        <div className="items-section">
          <div className="items-header">
            <div className="col-desc">ITEM DESCRIPTION</div>
            <div className="col-qty">QTY</div>
            <div className="col-tax">TAX</div>
            <div className="col-price">PRICE</div>
            <div className="col-total">TOTAL</div>
          </div>

          <div className="items-body">
            {safeOrder.products.map((item, index) => {
              const itemTotal = item.price * item.quantity;
              const productImage = item.image || item.imgUrl || (typeof item.productId === 'object' ? (item.productId?.images?.[0]?.url || item.productId?.image) : null) || "/placeholder.webp";

              return (
                <div className="item-row" key={index}>
                  <div className="col-desc flex-desc">
                    <img 
                      src={productImage} 
                      alt={item.productName || "Product"} 
                      className="product-image" 
                      crossOrigin="anonymous"
                    />
                    <div className="product-details">
                      <strong>{item.productName}</strong>
                      <p className="text-gray" style={{ fontSize: '11px', marginTop: '3px' }}>
                        Color Variant: <span style={{ fontWeight: '600', color: '#111' }}>{item.color || item.colorName || item.colorVariant || item.variant || "Standard"}</span>
                      </p>
                    </div>
                  </div>
                  <div className="col-qty">x {item.quantity}</div>
                  <div className="col-tax">18.0%</div>
                  <div className="col-price">
                    Rs. {item.price.toFixed(2)}
                  </div>
                  <div className="col-total">Rs. {itemTotal.toFixed(2)}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary Section */}
        <div className="summary-section">
          <div className="notes-block">
            <strong>NOTES</strong>
            <p className="text-gray mt-2">
              {safeOrder.shippingInfo?.customMessage || safeOrder.adminNote || "N/A"}
            </p> 
          </div>
          <div className="totals-block">
             <div className="total-line">
                <span>Subtotal</span>
                <span>Rs. {subtotalInclusive.toFixed(2)}</span>
             </div>
             <div className="total-line">
                <span>Shipping</span>
                <span>Rs. {shipping.toFixed(2)}</span>
             </div>
             <div className="total-line">
                <span>Total excl. Tax</span>
                <span>Rs. {totalExclTax.toFixed(2)}</span>
             </div>
             <div className="total-line">
                <span>Sales Tax</span>
                <span>Rs. {salesTax.toFixed(2)}</span>
             </div>
             <div className="total-line bold-total">
                <span>TOTAL</span>
                <span>RS. {finalTotal.toFixed(2)}</span>
             </div>
             <div className="total-line mt-2">
                <span>Paid</span>
                <span>Rs. {finalTotal.toFixed(2)}</span>
             </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="footer-section">
           <p className="footer-text">If you have any questions, please do get in contact.</p>
           <h2 className="phone-number">📞 73111-64111</h2>
           <p className="website-link">
             <a href="https://astride.in" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#000' }}>
               <strong>astride.in</strong>
             </a>
           </p>
           <div className="social-icons">
             <a href="https://www.facebook.com/Astride.furniture" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>Facebook</a>
             {' • '}
             <a href="https://www.instagram.com/astride.furniture" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>Instagram</a>
             {' • '}
             <a href="https://www.linkedin.com/company/astride-furniture" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>LinkedIn</a>
           </div>
        </div>

      </div>

      {/* --- CSS Styles --- */}
      <style dangerouslySetInnerHTML={{__html: `
        .invoice-wrapper, .invoice-wrapper * {
          box-sizing: border-box;
        }
        .invoice-wrapper {
          background: #fff;
          padding: 20px;
          min-height: 100vh;
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          color: #1a1a1a;
        }
        .print-actions {
          text-align: center;
          margin-bottom: 20px;
        }
        .print-btn {
          background: #000;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          font-size: 16px;
          cursor: pointer;
        }
        
        .invoice-container {
          width: 100%;
          max-width: 750px;
          margin: 0 auto;
          background: #fff;
          padding: 25px 30px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        /* Header */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 25px;
        }
        .brand-logo { 
          max-height: 45px; 
        }
        .doc-meta p {
          margin: 3px 0;
          font-size: 13px;
          text-align: left;
        }
        .doc-meta strong {
          display: inline-block;
          width: 100px; /* Aligns the labels */
        }

        /* Addresses */
        .address-section {
          display: flex;
          justify-content: space-between;
          margin-bottom: 25px;
        }
        .address-block {
          width: 48%;
        }
        .address-block h3 {
          font-size: 13px;
          margin-bottom: 10px;
          text-transform: uppercase;
          border-bottom: 1px solid #e0e0e0;
          padding-bottom: 5px;
        }
        .address-block p {
          margin: 3px 0;
          font-size: 13px;
          color: #333;
        }

        /* Items Grid */
        .items-section {
          margin-bottom: 15px;
        }
        .items-header {
          display: flex;
          border-top: 2px solid #000;
          border-bottom: 1px solid #000;
          padding: 8px 0;
          font-weight: bold;
          font-size: 12px;
        }
        
        /* Column Widths */
        .col-desc { flex: 2; padding-right: 20px; }
        .col-qty { flex: 0.5; text-align: center; }
        .col-tax { flex: 0.5; text-align: center; }
        .col-price { flex: 1; text-align: right; }
        .col-total { flex: 1; text-align: right; }

        .item-row {
          display: flex;
          padding: 12px 0;
          border-bottom: 1px solid #e0e0e0;
          align-items: center;
          font-size: 13px;
        }
        .flex-desc {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .product-image {
          width: 70px;
          height: 70px;
          object-fit: contain;
          background: #f8f9fa;
        }
        .product-details strong {
          display: block;
          margin-bottom: 3px;
          line-height: 1.4;
        }
        .text-gray { color: #666; font-size: 12px; }
        .strikethrough { text-decoration: line-through; color: #888; font-size: 11px; }

        /* Summary */
        .summary-section {
          display: flex;
          justify-content: space-between;
          padding-top: 10px;
          margin-bottom: 25px;
          border-bottom: 2px solid #000;
          padding-bottom: 15px;
        }
        .notes-block {
          width: 45%;
          font-size: 13px;
        }
        .totals-block {
          width: 50%;
          font-size: 13px;
        }
        .total-line {
          display: flex;
          justify-content: space-between;
          margin-bottom: 6px;
          color: #333;
        }
        .bold-total {
          font-weight: bold;
          font-size: 14px;
          color: #000;
          margin-top: 10px;
        }
        .mt-2 { margin-top: 8px; }

        /* Footer */
        .footer-section {
          text-align: center;
          font-size: 12px;
          color: #555;
          margin-top: 10px;
        }
        .footer-text { margin-bottom: 8px; }
        .phone-number { 
          font-size: 20px; 
          color: #000; 
          margin: 8px 0; 
        }
        .website-link { 
          font-size: 13px; 
          color: #000; 
          margin-bottom: 6px;
        }
        .social-icons {
          font-size: 12px;
          font-weight: bold;
        }

        /* Print Settings */
        @media print {
          @page { 
            size: A4 portrait; 
            margin: 15mm; 
          }
          html, body { 
            background: #fff !important; 
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important; 
          }
          .invoice-wrapper { 
            padding: 0 !important; 
            margin: 0 !important;
            background: #fff !important;
            width: 100% !important;
            min-height: auto !important;
          }
          .no-print { display: none !important; }
          .invoice-container { 
            box-shadow: none !important; 
            padding: 0 !important; 
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            border: none !important;
            background: #fff !important;
          }
          .product-image {
            width: 70px !important;
            height: 70px !important;
            flex-shrink: 0 !important;
          }
        }
      `}} />
    </div>
  );
};

export default OrderInvoice;