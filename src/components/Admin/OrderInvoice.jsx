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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="invoice-wrapper">
      {/* Action Button - Hidden during printing */}
      <div className="no-print print-actions">
        <button onClick={handlePrint} className="print-btn">
          🖨️ Download / Print Invoice
        </button>
      </div>

      {/* A4 Printable Area */}
      <div className="invoice-container">
        
        {/* Header Section */}
        <div className="header">
          <div className="logo-container">
            {/* Update path to your actual logo if needed */}
            <img src="/logo.webp" alt="Astride" className="brand-logo" />
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
            {safeOrder.shippingInfo.gstNumber && (
              <p style={{ marginTop: '6px', fontWeight: 'bold' }}>
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
        .invoice-wrapper {
          background: #525252; /* Dark background outside paper */
          padding: 40px 20px;
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
          max-width: 850px;
          margin: 0 auto;
          background: #fff;
          padding: 50px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        /* Header */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 40px;
        }
        .brand-logo { 
          max-height: 50px; 
        }
        .doc-meta p {
          margin: 4px 0;
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
          margin-bottom: 40px;
        }
        .address-block {
          width: 48%;
        }
        .address-block h3 {
          font-size: 13px;
          margin-bottom: 15px;
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
          margin-bottom: 20px;
        }
        .items-header {
          display: flex;
          border-top: 2px solid #000;
          border-bottom: 1px solid #000;
          padding: 10px 0;
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
          padding: 20px 0;
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
          width: 80px;
          height: 80px;
          object-fit: contain;
          background: #f8f9fa;
        }
        .product-details strong {
          display: block;
          margin-bottom: 5px;
          line-height: 1.4;
        }
        .text-gray { color: #666; font-size: 12px; }
        .strikethrough { text-decoration: line-through; color: #888; font-size: 11px; }

        /* Summary */
        .summary-section {
          display: flex;
          justify-content: space-between;
          padding-top: 10px;
          margin-bottom: 40px;
          border-bottom: 2px solid #000;
          padding-bottom: 20px;
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
          margin-bottom: 10px;
          color: #333;
        }
        .bold-total {
          font-weight: bold;
          font-size: 14px;
          color: #000;
          margin-top: 15px;
        }
        .mt-2 { margin-top: 10px; }

        /* Footer */
        .footer-section {
          text-align: center;
          font-size: 12px;
          color: #555;
        }
        .footer-text { margin-bottom: 20px; }
        .phone-number { 
          font-size: 24px; 
          color: #000; 
          margin: 15px 0; 
        }
        .website-link { 
          font-size: 14px; 
          color: #000; 
          margin-bottom: 10px;
        }
        .social-icons {
          font-size: 12px;
          font-weight: bold;
        }

        /* Print Settings */
        @media print {
          @page { size: A4; margin: 0; }
          body { 
            background: #fff; 
            -webkit-print-color-adjust: exact; 
            print-color-adjust: exact; 
          }
          .invoice-wrapper { padding: 0; background: transparent; }
          .no-print { display: none !important; }
          .invoice-container { box-shadow: none; padding: 15mm; max-width: 100%; }
        }
      `}} />
    </div>
  );
};

export default OrderInvoice;