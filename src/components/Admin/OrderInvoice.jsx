"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

// Helper function to convert numbers to Indian Rupee Words
const numberToWords = (num) => {
  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  const val = Math.round(Number(num) || 0);
  if (val === 0) return 'Zero Rupees Only';
  
  if (val.toString().length > 9) return 'Overflow';
  const n = ('000000000' + val).slice(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return '';
  let str = '';
  str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
  str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
  str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
  str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
  str += (n[5] != 0) ? ((str != '') ? 'And ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
  return str.trim() + ' Rupees Only';
};

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
        <p className="text-sm font-bold text-neutral-600">Generating Tax Invoice...</p>
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

  const invoiceNumber = `INV-${safeOrder._id?.toString().slice(-8).toUpperCase()}`;
  const orderDate = new Date(safeOrder.createdAt).toLocaleDateString('en-IN');
  const amountInWords = numberToWords(safeOrder.pricing.total);

  // Determine Tax Type (IGST for Inter-state, CGST/SGST for Intra-state)
  const isInterState = safeOrder.shippingInfo.state?.toLowerCase() !== 'delhi';
  const taxType = isInterState ? 'IGST' : 'CGST/SGST';

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
            <img src="/logo.webp" alt="Astride Furniture" className="brand-logo" />
          </div>
          <div className="doc-title">
            <h2>Tax Invoice</h2>
            <p>(Original for Recipient)</p>
          </div>
        </div>

        {/* Addresses & Meta Details */}
        <div className="details-grid">
          <div className="left-col">
            <div className="section">
              <strong>Sold By:</strong><br />
              MBTC INTRAFURNISH PRIVATE LIMITED (ASTRIDE®)<br />
              J-113 & 114, DSIIDC Industrial Area,<br />
              Sector 4, Bawana, New Delhi, Delhi - 110039<br />
            </div>
            <div className="section">
              <strong>PAN No:</strong> AAQCS4259Q<br />
              <strong>GST Registration No:</strong> 106AAQCS4259Q1ZE
            </div>
            <div className="section mt-large">
              <strong>Order Number:</strong> {safeOrder._id}<br />
              <strong>Order Date:</strong> {orderDate}
            </div>
          </div>

          <div className="right-col text-right">
            <div className="section">
              <strong>Billing Address:</strong><br />
              {safeOrder.shippingInfo.fullName}<br />
              {safeOrder.shippingInfo.billingAddress || safeOrder.shippingInfo.address}<br />
              {safeOrder.shippingInfo.city}, {safeOrder.shippingInfo.state} - {safeOrder.shippingInfo.pinCode}<br />
              {safeOrder.shippingInfo.phone} | {safeOrder.shippingInfo.email}
              {safeOrder.shippingInfo.gstNumber && (
                <><br /><strong>Buyer GSTIN:</strong> {safeOrder.shippingInfo.gstNumber}</>
              )}
            </div>
            <div className="section">
              <strong>Shipping Address:</strong><br />
              {safeOrder.shippingInfo.fullName}<br />
              {safeOrder.shippingInfo.address}<br />
              {safeOrder.shippingInfo.city}, {safeOrder.shippingInfo.state} - {safeOrder.shippingInfo.pinCode}
            </div>
            <div className="section mt-large">
              <strong>Invoice Number:</strong> {invoiceNumber}<br />
              <strong>Invoice Date:</strong> {orderDate}<br />
              <strong>Payment Mode:</strong> {safeOrder.paymentMethod}<br />
              <strong>Payment Status:</strong> {safeOrder.paymentStatus}
            </div>
          </div>
        </div>

        {/* Itemized Table */}
        <table className="invoice-table">
          <thead>
            <tr>
              <th>Sl.<br/>No</th>
              <th>Description</th>
              <th>Unit Price</th>
              <th>Qty</th>
              <th>Net<br/>Amount</th>
              <th>Tax<br/>Rate</th>
              <th>Tax<br/>Type</th>
              <th>Tax<br/>Amount</th>
              <th>Total<br/>Amount</th>
            </tr>
          </thead>
          <tbody>
            {safeOrder.products.map((item, index) => {
              // --- EXACT GST MATH LOGIC ---
              // 1. Original Price (Inclusive of GST)
              const inclusivePrice = item.price;
              
              // 2. Divide by 1.18 to get Base Unit Price (Exclusive of GST)
              const baseUnitPrice = inclusivePrice / 1.18;
              
              // 3. Subtract Base from Inclusive to find the exact Tax Amount per item
              const taxPerItem = inclusivePrice - baseUnitPrice;

              // 4. Multiply by Quantity for the table columns
              const netAmount = baseUnitPrice * item.quantity;
              const totalTaxAmount = taxPerItem * item.quantity;
              const totalAmount = inclusivePrice * item.quantity;

              return (
                <tr key={index}>
                  <td className="text-center">{index + 1}</td>
                  <td>
                    <strong>{item.productName}</strong> {item.color && `(Color: ${item.color})`}<br />
                    <span className="text-sm">HSN: 9401</span>
                  </td>
                  {/* Show Base Unit Price */}
                  <td className="text-right">₹{baseUnitPrice.toFixed(2)}</td>
                  <td className="text-center">{item.quantity}</td>
                  {/* Show Net Amount (Base * Qty) */}
                  <td className="text-right">₹{netAmount.toFixed(2)}</td>
                  <td className="text-center">18%</td>
                  <td className="text-center">{taxType}</td>
                  {/* Show Subtracted Tax Amount */}
                  <td className="text-right">₹{totalTaxAmount.toFixed(2)}</td>
                  {/* Show Final Inclusive Total */}
                  <td className="text-right">₹{totalAmount.toFixed(2)}</td>
                </tr>
              );
            })}
            
            {/* Shipping Row if applicable */}
            {safeOrder.pricing.shippingCharge > 0 && (
              <tr>
                <td className="text-center">{safeOrder.products.length + 1}</td>
                <td>Shipping Charges</td>
                <td className="text-right">₹{safeOrder.pricing.shippingCharge.toFixed(2)}</td>
                <td className="text-center">1</td>
                <td className="text-right">₹{safeOrder.pricing.shippingCharge.toFixed(2)}</td>
                <td className="text-center">-</td>
                <td className="text-center">-</td>
                <td className="text-right">₹0.00</td>
                <td className="text-right">₹{safeOrder.pricing.shippingCharge.toFixed(2)}</td>
              </tr>
            )}
          </tbody>
          
          {/* Footer Totals */}
          <tfoot>
            <tr className="total-row">
              <td colSpan="7" className="text-right pr-2"><strong>Total:</strong></td>
              <td className="text-right">
                 {/* Total Tax Calculation Loop */}
                 ₹{safeOrder.products.reduce((acc, item) => {
                    const base = item.price / 1.18;
                    const tax = item.price - base;
                    return acc + (tax * item.quantity);
                 }, 0).toFixed(2)}
              </td>
              <td className="text-right"><strong>₹{safeOrder.pricing.total.toFixed(2)}</strong></td>
            </tr>
          </tfoot>
        </table>

        {/* Amount in Words & Signatory */}
        <div className="invoice-footer">
          <div className="amount-words">
            <strong>Amount in Words:</strong><br />
            {amountInWords}
          </div>
          
          <div className="signatory">
            <strong>For MBTC INTRAFURNISH PRIVATE LIMITED:</strong>
            <div className="signature-space"></div>
            <strong>Authorized Signatory</strong>
          </div>
        </div>

      </div>

      {/* --- CSS Styles --- */}
      <style dangerouslySetInnerHTML={{__html: `
        .invoice-wrapper {
          background: #f3f4f6;
          padding: 20px;
          min-height: 100vh;
          font-family: Arial, sans-serif;
          color: #000;
        }
        .print-actions {
          text-align: center;
          margin-bottom: 20px;
        }
        .print-btn {
          background: #2563eb;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .print-btn:hover { background: #1d4ed8; }
        .invoice-container {
          max-width: 800px;
          margin: 0 auto;
          background: #fff;
          padding: 40px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2px solid #000;
          padding-bottom: 20px;
          margin-bottom: 20px;
        }
        .brand-logo { max-height: 40px; }
        .doc-title { text-align: right; }
        .doc-title h2 { margin: 0; font-size: 18px; text-transform: uppercase; }
        .doc-title p { margin: 2px 0 0; font-size: 14px; }
        
        .details-grid {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          line-height: 1.5;
          margin-bottom: 20px;
        }
        .left-col {
          width: 48%;
        }
        .right-col {
          width: 48%;
          max-width: 320px;
        }
        .section { margin-bottom: 10px; word-wrap: break-word; }
        .mt-large { margin-top: 25px; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        
        .invoice-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 11px;
          margin-bottom: 5px;
        }
        .invoice-table th, .invoice-table td {
          border: 1px solid #000;
          padding: 6px;
          vertical-align: top;
        }
        .invoice-table th {
          background-color: #f3f3f3;
          font-weight: bold;
        }
        .text-sm { font-size: 10px; color: #555; }
        
        .invoice-footer {
          border: 1px solid #000;
          border-top: none;
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          padding: 0;
        }
        .amount-words {
          padding: 10px;
          width: 60%;
          border-right: 1px solid #000;
        }
        .signatory {
          padding: 10px;
          width: 40%;
          text-align: right;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .signature-space { height: 60px; }
        .pr-2 { padding-right: 8px !important; }

        /* Print Specific CSS */
        @media print {
          @page { size: A4; margin: 10mm; }
          body { 
            background: #fff; 
            -webkit-print-color-adjust: exact; 
            print-color-adjust: exact; 
          }
          .invoice-wrapper {
            padding: 0;
            background: #fff;
          }
          .no-print { display: none !important; }
          .invoice-container {
            box-shadow: none;
            padding: 0;
            max-width: 100%;
          }
        }
      `}} />
    </div>
  );
};

export default OrderInvoice;
