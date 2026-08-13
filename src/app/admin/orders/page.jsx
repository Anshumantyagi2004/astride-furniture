"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Sidebar from "@/components/Admin/Sidebar";
import {
    User,
    MapPin,
    Phone,
    Mail,
    Calendar,
    CreditCard,
    Trash2,
    ShoppingBag,
    Loader2,
    MessageSquare,
    ExternalLink,
    Printer,
    Building,
    List
} from "lucide-react";

export default function Page() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [adminNoteInputs, setAdminNoteInputs] = useState({});
    const [savingNoteId, setSavingNoteId] = useState(null);

    const handleAddBullet = (orderId, currentNote) => {
        const text = adminNoteInputs[orderId] !== undefined ? adminNoteInputs[orderId] : (currentNote || "");
        const newText = text ? `${text}\n• ` : "• ";
        setAdminNoteInputs({ ...adminNoteInputs, [orderId]: newText });
    };

    const handleSaveAdminNote = async (orderId) => {
        const note = adminNoteInputs[orderId];
        if (note === undefined || note === null) {
            toast.error("Please enter a note");
            return;
        }
        try {
            setSavingNoteId(orderId);
            const { data } = await axios.put(`/api/order?id=${orderId}`, { adminNote: note });
            if (data.success) {
                toast.success("Admin note saved!");
                setOrders(orders.map(o => o._id === orderId ? { ...o, adminNote: note } : o));
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to save note");
        } finally {
            setSavingNoteId(null);
        }
    };

    const getOrders = async () => {
        try {
            const { data } = await axios.get("/api/order");
            if (data.success) {
                setOrders(data.orders);
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
            setTimeout(() => {
                if (window.location.hash) {
                    const el = document.querySelector(window.location.hash);
                    if (el) {
                        el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                }
            }, 300);
        }
    };

    const handleDeleteOrder = async (id) => {
        if (!confirm("Are you sure you want to delete this order?")) return;

        try {
            setDeletingId(id);
            const { data } = await axios.delete(`/api/order?id=${id}`);
            if (data.success) {
                toast.success("Order deleted successfully");
                setOrders(orders.filter(order => order._id !== id));
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to delete order");
        } finally {
            setDeletingId(null);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const { data } = await axios.put(`/api/order?id=${id}`, { status: newStatus });
            if (data.success) {
                toast.success("Order status updated successfully");
                setOrders(orders.map(order =>
                    order._id === id ? { ...order, status: newStatus } : order
                ));
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to update status");
        }
    };

    useEffect(() => {
        getOrders();
    }, []);

    return (
        <div className="min-h-screen bg-[#F9FAFB] flex font-sans">
            <Sidebar />

            <main className="flex-1 p-6 md:p-10 lg:p-12 text-neutral-800">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-extrabold text-black tracking-tight uppercase" style={{ fontFamily: "'Inter', sans-serif" }}>
                                Orders Management
                            </h1>
                            <p className="text-base text-neutral-500 font-medium mt-2">
                                View, monitor, and delete store orders.
                            </p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-4">
                            <Loader2 className="animate-spin text-black" size={40} />
                            <span className="text-base font-bold text-neutral-500 uppercase tracking-widest">Fetching Orders...</span>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="bg-white rounded-3xl border border-neutral-100 p-20 text-center shadow-sm flex flex-col items-center justify-center">
                            <ShoppingBag className="text-neutral-300 mb-6" size={64} />
                            <h3 className="text-2xl font-bold text-neutral-900 mb-2">No Orders Yet</h3>
                            <p className="text-base text-neutral-400 font-medium">When customers place orders, they will show up here.</p>
                        </div>
                    ) : (
                        <div className="space-y-10">
                            {orders.map((order) => (
                                <div
                                    key={order._id}
                                    id={`order-${order._id}`}
                                    className="bg-white border border-neutral-150 rounded-3xl shadow-[0_25px_50px_rgba(0,0,0,0.03)] overflow-hidden transition-all hover:shadow-[0_25px_50px_rgba(0,0,0,0.06)] scroll-mt-6"
                                >
                                    {/* Order Card Header */}
                                    <div className="border-b border-neutral-100 bg-neutral-50/50 px-8 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                                                <span className="text-base font-bold text-neutral-500 uppercase tracking-wider">
                                                    Order ID: <span className="text-neutral-900 select-all font-mono font-extrabold text-lg">{order._id}</span>
                                                </span>
                                            </div>

                                            {order.razorpayOrderId && (
                                                <div className="text-xs text-neutral-500 font-medium">
                                                    Razorpay Order ID: <span className="font-mono font-bold text-neutral-900 select-all">{order.razorpayOrderId}</span>
                                                </div>
                                            )}
                                            {order.razorpayPaymentId && (
                                                <div className="text-xs text-neutral-500 font-medium">
                                                    Razorpay Payment ID: <span className="font-mono font-bold text-neutral-900 select-all">{order.razorpayPaymentId}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Admin Custom Note in Header Middle Space */}
                                        <div className="flex-1 max-w-xl min-w-[350px] my-1 sm:my-0 flex flex-col p-4 bg-white border border-neutral-200/70 rounded-2xl shadow-sm">
                                            <div className="flex items-center gap-4 mb-2.5">
                                                <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">
                                                    Admin Note
                                                </label>
                                            </div>
                                            <div className="flex items-start gap-2.5">
                                                <textarea 
                                                    rows={Math.max(2, (adminNoteInputs[order._id] !== undefined ? adminNoteInputs[order._id] : (order.adminNote || "")).split('\n').length)}
                                                    placeholder="Type note here..."
                                                    value={adminNoteInputs[order._id] !== undefined ? adminNoteInputs[order._id] : (order.adminNote || "")}
                                                    onChange={(e) => setAdminNoteInputs({ ...adminNoteInputs, [order._id]: e.target.value })}
                                                    className="min-h-[44px] max-h-32 flex-1 bg-neutral-50 focus:bg-white border border-neutral-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-neutral-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all shadow-sm resize-y leading-relaxed placeholder:text-neutral-400"
                                                />
                                                <div className="flex flex-col gap-2.5 shrink-0">
                                                    <button 
                                                        type="button"
                                                        onClick={() => handleSaveAdminNote(order._id)}
                                                        disabled={savingNoteId === order._id}
                                                        className="h-[44px] px-5 bg-black hover:bg-neutral-800 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50 shadow-sm flex items-center justify-center gap-1.5 w-full"
                                                    >
                                                        {savingNoteId === order._id ? (
                                                            <Loader2 className="animate-spin" size={16} />
                                                        ) : null}
                                                        <span>{savingNoteId === order._id ? "Saving..." : "Save Note"}</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleAddBullet(order._id, adminNoteInputs[order._id] !== undefined ? adminNoteInputs[order._id] : (order.adminNote || ""))}
                                                        className="text-[11px] flex items-center justify-center gap-1 font-bold text-neutral-500 hover:text-black uppercase tracking-wider transition-colors w-full py-1.5 hover:bg-neutral-100 rounded-lg"
                                                    >
                                                        <List size={12} strokeWidth={2.5} />
                                                        <span>Point</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-4 items-center self-start sm:self-center">
                                            <div className="flex items-center gap-2 text-sm text-neutral-600 font-semibold">
                                                <Calendar size={16} className="text-neutral-400" />
                                                <span>{new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })} at {new Date(order.createdAt).toLocaleTimeString()}</span>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <a
                                                    href={`/admin/orders/${order._id}/invoice`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="h-11 px-4 min-w-[120px] flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-sm font-bold transition-all border border-blue-200 shadow-sm"
                                                >
                                                    <Printer size={16} />
                                                    <span>Invoice</span>
                                                </a>

                                                <a
                                                    href={`/track-order${order.shippingInfo?.phone ? `?phone=${order.shippingInfo.phone.replace(/\D/g, '').slice(-10)}` : ''}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="h-11 px-4 min-w-[120px] flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold transition-all shadow-sm"
                                                >
                                                    <ExternalLink size={16} />
                                                    <span>Track Order</span>
                                                </a>

                                                <button
                                                    type="button"
                                                    disabled={deletingId === order._id}
                                                    onClick={() => handleDeleteOrder(order._id)}
                                                    className="h-11 px-4 min-w-[120px] flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                                                >
                                                    {deletingId === order._id ? (
                                                        <Loader2 className="animate-spin" size={16} />
                                                    ) : (
                                                        <Trash2 size={16} />
                                                    )}
                                                    <span>Delete Order</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {order.cancelledByUser && (
                                        <div className="bg-red-50 border-b border-red-100 px-8 py-3 text-red-700 text-sm font-bold flex items-center gap-2">
                                            <span>⚠️ Cancelled by the user</span>
                                        </div>
                                    )}

                                    {/* Order Card Content Grid */}
                                    <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-10">

                                        {/* Customer Shipping Details */}
                                        <div className="lg:col-span-5 space-y-6">
                                            <h3 className="text-lg font-black text-neutral-400 uppercase tracking-widest mb-4 border-b border-neutral-100 pb-2">
                                                Shipping Details
                                            </h3>

                                            <div className="space-y-5">
                                                <div className="flex items-start gap-4">
                                                    <User size={22} className="text-neutral-400 mt-1 shrink-0" />
                                                    <div>
                                                        <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider block mb-0.5">Customer Name</span>
                                                        <p className="text-lg font-bold text-neutral-900 leading-tight">{order.shippingInfo?.fullName}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-4">
                                                    <Mail size={22} className="text-neutral-400 mt-1 shrink-0" />
                                                    <div>
                                                        <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider block mb-0.5">Email Address</span>
                                                        <p className="text-lg font-medium text-neutral-700 leading-tight select-all">{order.shippingInfo?.email}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-4">
                                                    <Phone size={22} className="text-neutral-400 mt-1 shrink-0" />
                                                    <div>
                                                        <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider block mb-0.5">Contact Number</span>
                                                        <p className="text-lg font-bold text-neutral-900 leading-tight select-all">{order.shippingInfo?.phone}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-4">
                                                    <MapPin size={22} className="text-neutral-400 mt-1 shrink-0" />
                                                    <div>
                                                        <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider block mb-0.5">Shipping Address</span>
                                                        <p className="text-lg font-medium text-neutral-700 leading-relaxed">
                                                            {order.shippingInfo?.address}, {order.shippingInfo?.city}, {order.shippingInfo?.state} - <span className="font-bold text-neutral-900">{order.shippingInfo?.pinCode}</span>
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-4">
                                                    <CreditCard size={22} className="text-neutral-400 mt-1 shrink-0" />
                                                    <div>
                                                        <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider block mb-0.5">Billing Address</span>
                                                        <p className="text-lg font-medium text-neutral-700 leading-relaxed select-all">
                                                            {order.shippingInfo?.billingAddress ? order.shippingInfo.billingAddress : `${order.shippingInfo?.address}, ${order.shippingInfo?.city}, ${order.shippingInfo?.state} - ${order.shippingInfo?.pinCode}`}
                                                        </p>
                                                    </div>
                                                </div>

                                                {order.shippingInfo?.companyName && (
                                                    <div className="flex items-start gap-4 p-3 bg-purple-50/80 border border-purple-200/80 rounded-xl mb-2">
                                                        <Building size={22} className="text-purple-600 mt-0.5 shrink-0" />
                                                        <div>
                                                            <span className="text-xs text-purple-700 font-bold uppercase tracking-wider block mb-0.5">Company Name</span>
                                                            <p className="text-base font-extrabold text-purple-950 tracking-wide select-all">
                                                                {order.shippingInfo.companyName}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {order.shippingInfo?.gstNumber && (
                                                    <div className="flex items-start gap-4 p-3 bg-blue-50/80 border border-blue-200/80 rounded-xl">
                                                        <CreditCard size={22} className="text-blue-600 mt-0.5 shrink-0" />
                                                        <div>
                                                            <span className="text-xs text-blue-700 font-bold uppercase tracking-wider block mb-0.5">Customer GSTIN</span>
                                                            <p className="text-base font-extrabold text-blue-950 font-mono tracking-wide select-all">
                                                                {order.shippingInfo.gstNumber}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {order.shippingInfo?.customMessage && (
                                                    <div className="flex items-start gap-4 p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-xl mt-2">
                                                        <MessageSquare size={22} className="text-amber-600 mt-0.5 shrink-0" />
                                                        <div>
                                                            <span className="text-xs text-amber-700 font-bold uppercase tracking-wider block mb-0.5">Custom Order Note</span>
                                                            <p className="text-base font-semibold text-neutral-900 leading-relaxed select-all">
                                                                "{order.shippingInfo.customMessage}"
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Send / Update Admin Reply - only if customer is registered */}
                                                {order.userId ? (
                                                    <div className="mt-4 pt-3 border-t border-neutral-100 space-y-2">
                                                        <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">
                                                            Send Message / Reply to Customer
                                                        </label>
                                                        {order.adminNote && (
                                                            <div className="bg-emerald-50/80 border border-emerald-200/80 p-3 rounded-xl mb-2 text-xs font-medium text-emerald-900">
                                                                <span className="font-bold block mb-0.5 text-emerald-700">Sent Admin Message:</span>
                                                                "{order.adminNote}"
                                                            </div>
                                                        )}
                                                        <div className="flex gap-2">
                                                            <input 
                                                                type="text" 
                                                                placeholder="Type message to display in customer's account..."
                                                                value={adminNoteInputs[order._id] !== undefined ? adminNoteInputs[order._id] : (order.adminNote || "")}
                                                                onChange={(e) => setAdminNoteInputs({ ...adminNoteInputs, [order._id]: e.target.value })}
                                                                className="flex-1 bg-white border border-neutral-200 rounded-xl px-3.5 py-2 text-sm text-neutral-900 focus:outline-none focus:border-black transition-all"
                                                            />
                                                            <button 
                                                                type="button"
                                                                onClick={() => handleSaveAdminNote(order._id)}
                                                                disabled={savingNoteId === order._id}
                                                                className="bg-black hover:bg-neutral-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50 shrink-0"
                                                            >
                                                                {savingNoteId === order._id ? "Sending..." : "Send Message"}
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="mt-4 pt-3 border-t border-neutral-100">
                                                        <span className="inline-block px-3 py-1 bg-neutral-100 border border-neutral-200 rounded-lg text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                                                            Guest Checkout — Account Messaging Disabled
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Pricing Summary */}
                                        <div className="lg:col-span-3 space-y-6 lg:border-l lg:border-neutral-100 lg:pl-10">
                                            <h3 className="text-lg font-black text-neutral-400 uppercase tracking-widest mb-4 border-b border-neutral-100 pb-2">
                                                Pricing & Payment
                                            </h3>

                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center text-base font-semibold text-neutral-600">
                                                    <span>Subtotal</span>
                                                    <span className="font-bold text-neutral-900 text-lg">₹{order.pricing?.subtotal?.toLocaleString()}</span>
                                                </div>

                                                <div className="flex justify-between items-center text-base font-semibold text-neutral-600">
                                                    <span>Shipping Charge</span>
                                                    <span className="font-bold text-neutral-900 text-lg">₹{order.pricing?.shippingCharge?.toLocaleString()}</span>
                                                </div>

                                                <hr className="border-neutral-150 my-3" />

                                                <div className="flex justify-between items-end">
                                                    <span className="text-base font-bold text-neutral-950">Total Paid</span>
                                                    <span className="text-2xl font-black text-black">₹{order.pricing?.total?.toLocaleString()}</span>
                                                </div>

                                                <div className="pt-4 space-y-4">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <div className="inline-flex items-center gap-2 bg-neutral-100 px-4 py-2 rounded-xl border border-neutral-200 w-fit">
                                                            <CreditCard size={16} className="text-neutral-600" />
                                                            <span className="text-xs font-black text-neutral-700 uppercase tracking-wider">Method: {order.paymentMethod || "COD"}</span>
                                                        </div>
                                                    </div>

                                                    <div className="pt-2 border-t border-neutral-100">
                                                        <label className="text-xs text-neutral-400 font-bold uppercase tracking-wider block mb-2">Order Status</label>
                                                        <select
                                                            value={order.status || "Pending"}
                                                            onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                                            className="w-full bg-white border border-neutral-200 text-sm font-bold rounded-xl px-3.5 py-2.5 text-neutral-800 focus:outline-none focus:ring-2 focus:ring-black cursor-pointer shadow-sm"
                                                        >
                                                            <option value="Pending" disabled={order.cancelledByUser}>Pending</option>
                                                            <option value="Confirmed" disabled={order.cancelledByUser}>Confirmed</option>
                                                            <option value="Processing / Packing" disabled={order.cancelledByUser}>Processing / Packing</option>
                                                            <option value="Dispatched" disabled={order.cancelledByUser}>Dispatched</option>
                                                            <option value="Out for Delivery" disabled={order.cancelledByUser}>Out for Delivery</option>
                                                            <option value="Delivered" disabled={order.cancelledByUser}>Delivered</option>
                                                            <option value="Cancelled">Cancelled</option>
                                                            <option disabled>──────────</option>
                                                            <option value="Return Requested" disabled={order.cancelledByUser}>Return Requested</option>
                                                            <option value="Return Approved" disabled={order.cancelledByUser}>Return Approved</option>
                                                            <option value="Return Rejected" disabled={order.cancelledByUser}>Return Rejected</option>
                                                            <option disabled>──────────</option>
                                                            <option value="Refund Initiated">Refund Initiated</option>
                                                            <option value="Refunded">Refunded</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Products List Rows */}
                                        <div className="lg:col-span-4 lg:border-l lg:border-neutral-100 lg:pl-10 space-y-6">
                                            <h3 className="text-lg font-black text-neutral-400 uppercase tracking-widest mb-4 border-b border-neutral-100 pb-2">
                                                Ordered Items ({order.products?.length || 0})
                                            </h3>

                                            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-neutral-200">
                                                {order.products?.map((product, index) => (
                                                    <div
                                                        key={product._id || product.productId}
                                                        className="flex items-start gap-4 bg-neutral-50 p-4 rounded-2xl border border-neutral-100"
                                                    >
                                                        <div className="relative w-20 h-20 bg-white rounded-xl overflow-hidden shrink-0 border border-neutral-150 flex items-center justify-center">
                                                            <img
                                                                src={product.image}
                                                                alt=""
                                                                className="w-16 h-16 object-contain p-0.5 mix-blend-multiply"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0 space-y-1">
                                                            <h4 className="text-lg font-extrabold text-neutral-950 leading-snug break-words">
                                                                <span className="text-blue-900 mr-1.5">{index + 1}.</span>{product.productName}
                                                            </h4>
                                                            <p className="text-xs text-neutral-400 font-mono break-all">
                                                                ID: <span className="select-all font-semibold text-neutral-600">{product.productId || product._id}</span>
                                                            </p>
                                                            {product.color && (
                                                                <p className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">
                                                                    Color: <span className="text-neutral-800">{product.color}</span>
                                                                </p>
                                                            )}
                                                            {product.category && (
                                                                <p className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">
                                                                    Category: <span className="text-neutral-800">{product.category}</span>
                                                                </p>
                                                            )}
                                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 border-t border-neutral-100 mt-1">
                                                                <span className="text-sm text-neutral-500 font-medium">Qty: <span className="font-bold text-neutral-800">{product.quantity}</span></span>
                                                                <span className="text-xs text-neutral-300">•</span>
                                                                <span className="text-sm text-neutral-500 font-medium">Unit: <span className="font-bold text-neutral-800">₹{product.price?.toLocaleString()}</span></span>
                                                            </div>
                                                            <div className="pt-1">
                                                                <span className="text-sm font-bold text-neutral-900">
                                                                    Total Price: <span className="text-neutral-950 font-black">₹{((product.price || 0) * (product.quantity || 1)).toLocaleString()}</span>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}