"use client";

import { useEffect, useState, use } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Sidebar from "@/components/Admin/Sidebar";
import Link from "next/link";
import * as XLSX from "xlsx";
import { 
    ArrowLeft, 
    User, 
    Mail, 
    Phone, 
    MapPin, 
    Building, 
    Hash, 
    Calendar, 
    Loader2, 
    ChevronDown,
    Trash2,
    Download
} from "lucide-react";

export default function EnquiryDetailPage({ params }) {
    const resolvedParams = use(params);
    const id = resolvedParams?.id;

    const [enquiry, setEnquiry] = useState(null);
    const [loading, setLoading] = useState(true);

    const getEnquiryDetails = async () => {
        try {
            const { data } = await axios.get(`/api/enquiry?id=${id}`);
            if (data.success) {
                setEnquiry(data.enquiry);
            } else {
                toast.error(data.message || "Failed to load enquiry details");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load enquiry details");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            const { data } = await axios.put(`/api/enquiry?id=${id}`, { status: newStatus });
            if (data.success) {
                toast.success("Status updated successfully");
                setEnquiry(prev => ({ ...prev, status: newStatus }));
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to update status");
        }
    };

    useEffect(() => {
        if (id) {
            getEnquiryDetails();
        }
    }, [id]);

    return (
        <div className="min-h-screen bg-[#FDFBF7] flex">
            <Sidebar />

            <main className="flex-1 p-6 md:p-10 lg:p-12 text-neutral-800">
                <div className="max-w-[1000px] mx-auto">
                    
                    {/* Action Bar */}
                    <div className="flex items-center justify-between gap-4 mb-8">
                        <Link 
                            href="/admin/inquiries"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border-2 border-[#131313] text-sm font-bold text-[#131313] shadow-[3px_3px_0_#131313] hover:translate-y-[-1px] hover:shadow-[4px_4px_0_#131313] transition-all"
                        >
                            <ArrowLeft size={16} /> Back to Bulk Inquiries
                        </Link>

                        {enquiry && (
                            <button
                                type="button"
                                onClick={() => {
                                    const singleData = [{
                                        "Full Name": enquiry.fullName || "",
                                        "Company": enquiry.companyName || "N/A",
                                        "Chairs Quantity": enquiry.quantity || 0,
                                        "Email": enquiry.email || "",
                                        "Phone": enquiry.phone || "",
                                        "Location": enquiry.location || "N/A",
                                        "Status": enquiry.status || "pending",
                                        "Date Submitted": enquiry.createdAt ? new Date(enquiry.createdAt).toLocaleString() : "N/A",
                                    }];
                                    const ws = XLSX.utils.json_to_sheet(singleData);
                                    const wb = XLSX.utils.book_new();
                                    XLSX.utils.book_append_sheet(wb, ws, "Inquiry Details");
                                    XLSX.writeFile(wb, `Inquiry_${(enquiry.fullName || "details").replace(/\s+/g, "_")}.xlsx`);
                                    toast.success("Inquiry details downloaded as Excel!");
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-[#131313] rounded-xl text-xs font-black uppercase tracking-wider text-[#131313] shadow-[3px_3px_0_#131313] hover:translate-y-[-1px] hover:shadow-[4px_4px_0_#131313] transition-all cursor-pointer"
                            >
                                <Download size={15} className="text-[#8B5CF6]" />
                                Download Excel
                            </button>
                        )}
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 gap-4">
                            <Loader2 className="animate-spin text-[#8B5CF6]" size={36} />
                            <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Loading Inquiry Details...</span>
                        </div>
                    ) : !enquiry ? (
                        <div className="bg-white rounded-[28px] border-[2.5px] border-[#131313] p-16 text-center shadow-[6px_6px_0_#131313] max-w-xl mx-auto">
                            <h3 className="text-xl font-black text-[#131313] uppercase">Inquiry Not Found</h3>
                            <p className="text-sm text-neutral-500 font-medium mt-1">The requested inquiry record does not exist or was deleted.</p>
                        </div>
                    ) : (
                        <div className="bg-white border-[3px] border-[#131313] rounded-[32px] p-8 md:p-10 shadow-[8px_8px_0_#131313] space-y-8">
                            
                            {/* Header Row */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b-2 border-neutral-200">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl border-[3px] border-[#131313] bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center shrink-0 shadow-[3px_3px_0_#131313]">
                                        <User size={28} />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl md:text-3xl font-black text-[#131313] tracking-tight">
                                            {enquiry.fullName}
                                        </h1>
                                        <div className="flex items-center gap-2 text-sm text-neutral-500 font-semibold mt-1">
                                            <MapPin size={14} className="text-neutral-400" />
                                            <span>{enquiry.location || "N/A"}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Status Selector */}
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-black uppercase text-neutral-400">Status:</span>
                                    <select
                                        value={enquiry.status || "pending"}
                                        onChange={(e) => handleStatusChange(e.target.value)}
                                        className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border-[2.5px] border-[#131313] shadow-[2px_2px_0_#131313] outline-none bg-white cursor-pointer"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="contacted">Contacted</option>
                                        <option value="closed">Closed</option>
                                    </select>
                                </div>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                
                                <div className="p-5 rounded-2xl border-2 border-[#131313] bg-neutral-50/50 shadow-[3px_3px_0_#131313]">
                                    <span className="text-xs font-black text-neutral-400 uppercase tracking-wider block mb-2">Company Name</span>
                                    <div className="flex items-center gap-3 text-base font-bold text-[#131313]">
                                        <Building size={18} className="text-[#8B5CF6]" />
                                        <span>{enquiry.companyName || "N/A"}</span>
                                    </div>
                                </div>

                                <div className="p-5 rounded-2xl border-2 border-[#131313] bg-neutral-50/50 shadow-[3px_3px_0_#131313]">
                                    <span className="text-xs font-black text-neutral-400 uppercase tracking-wider block mb-2">Chairs Needed</span>
                                    <div className="flex items-center gap-3 text-base font-black text-[#131313]">
                                        <Hash size={18} className="text-[#8B5CF6]" />
                                        <span>{enquiry.quantity} Units</span>
                                    </div>
                                </div>

                                <div className="p-5 rounded-2xl border-2 border-[#131313] bg-neutral-50/50 shadow-[3px_3px_0_#131313]">
                                    <span className="text-xs font-black text-neutral-400 uppercase tracking-wider block mb-2">Email Address</span>
                                    <div className="flex items-center gap-3 text-base font-bold text-[#131313]">
                                        <Mail size={18} className="text-[#8B5CF6]" />
                                        <a href={`mailto:${enquiry.email}`} className="hover:underline">{enquiry.email}</a>
                                    </div>
                                </div>

                                <div className="p-5 rounded-2xl border-2 border-[#131313] bg-neutral-50/50 shadow-[3px_3px_0_#131313]">
                                    <span className="text-xs font-black text-neutral-400 uppercase tracking-wider block mb-2">Phone Number</span>
                                    <div className="flex items-center gap-3 text-base font-bold text-[#131313]">
                                        <Phone size={18} className="text-[#8B5CF6]" />
                                        <a href={`tel:${enquiry.phone}`} className="hover:underline">{enquiry.phone || "N/A"}</a>
                                    </div>
                                </div>

                            </div>

                            {/* Date info */}
                            <div className="pt-4 border-t-2 border-neutral-100 flex items-center gap-2 text-xs font-bold text-neutral-400">
                                <Calendar size={14} />
                                <span>Submitted on {enquiry.createdAt ? new Date(enquiry.createdAt).toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'short' }) : "N/A"}</span>
                            </div>

                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
