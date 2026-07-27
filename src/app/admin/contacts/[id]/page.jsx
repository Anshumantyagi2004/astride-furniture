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
    MessageSquare, 
    Calendar, 
    Loader2,
    Download
} from "lucide-react";

export default function ContactDetailPage({ params }) {
    const resolvedParams = use(params);
    const id = resolvedParams?.id;

    const [contact, setContact] = useState(null);
    const [loading, setLoading] = useState(true);

    const getContactDetails = async () => {
        try {
            const { data } = await axios.get(`/api/contact?id=${id}`);
            if (data.success) {
                setContact(data.contact);
            } else {
                toast.error(data.message || "Failed to load message details");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load message details");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            const { data } = await axios.put(`/api/contact?id=${id}`, { status: newStatus });
            if (data.success) {
                toast.success("Status updated successfully");
                setContact(prev => ({ ...prev, status: newStatus }));
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to update status");
        }
    };

    useEffect(() => {
        if (id) {
            getContactDetails();
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
                            href="/admin/contacts"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border-2 border-[#131313] text-sm font-bold text-[#131313] shadow-[3px_3px_0_#131313] hover:translate-y-[-1px] hover:shadow-[4px_4px_0_#131313] transition-all"
                        >
                            <ArrowLeft size={16} /> Back to Contacts
                        </Link>

                        {contact && (
                            <button
                                type="button"
                                onClick={() => {
                                    const singleData = [{
                                        "Full Name": contact.fullName || "",
                                        "Email": contact.email || "",
                                        "Phone": contact.phone || "",
                                        "Company": contact.companyName || "N/A",
                                        "Location": `${contact.city || ""}, ${contact.state || ""}`.trim().replace(/^,|,$/g, "") || "N/A",
                                        "Message": contact.message || "",
                                        "Status": contact.status || "pending",
                                        "Date Submitted": contact.createdAt ? new Date(contact.createdAt).toLocaleString() : "N/A",
                                    }];
                                    const ws = XLSX.utils.json_to_sheet(singleData);
                                    const wb = XLSX.utils.book_new();
                                    XLSX.utils.book_append_sheet(wb, ws, "Contact Details");
                                    XLSX.writeFile(wb, `Contact_${(contact.fullName || "details").replace(/\s+/g, "_")}.xlsx`);
                                    toast.success("Contact details downloaded as Excel!");
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
                            <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Loading Contact Details...</span>
                        </div>
                    ) : !contact ? (
                        <div className="bg-white rounded-[28px] border-[2.5px] border-[#131313] p-16 text-center shadow-[6px_6px_0_#131313] max-w-xl mx-auto">
                            <h3 className="text-xl font-black text-[#131313] uppercase">Contact Not Found</h3>
                            <p className="text-sm text-neutral-500 font-medium mt-1">The requested message record does not exist or was deleted.</p>
                        </div>
                    ) : (
                        <div className="bg-white border-[3px] border-[#131313] rounded-[32px] p-8 md:p-10 shadow-[8px_8px_0_#131313] space-y-8">
                            
                            {/* Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b-2 border-neutral-200">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl border-[3px] border-[#131313] bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center shrink-0 shadow-[3px_3px_0_#131313]">
                                        <User size={28} />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl md:text-3xl font-black text-[#131313] tracking-tight">
                                            {contact.fullName}
                                        </h1>
                                        <div className="flex items-center gap-2 text-sm text-neutral-500 font-semibold mt-1">
                                            <MapPin size={14} className="text-neutral-400" />
                                            <span>{`${contact.city || ""}, ${contact.state || ""}`.trim().replace(/^,|,$/g, "") || "N/A"}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Status Selector */}
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-black uppercase text-neutral-400">Status:</span>
                                    <select
                                        value={contact.status || "pending"}
                                        onChange={(e) => handleStatusChange(e.target.value)}
                                        className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border-[2.5px] border-[#131313] shadow-[2px_2px_0_#131313] outline-none bg-white cursor-pointer"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="contacted">Contacted</option>
                                        <option value="closed">Closed</option>
                                    </select>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                
                                <div className="p-5 rounded-2xl border-2 border-[#131313] bg-neutral-50/50 shadow-[3px_3px_0_#131313]">
                                    <span className="text-xs font-black text-neutral-400 uppercase tracking-wider block mb-2">Company Name</span>
                                    <div className="flex items-center gap-3 text-base font-bold text-[#131313]">
                                        <Building size={18} className="text-[#8B5CF6]" />
                                        <span>{contact.companyName || "N/A"}</span>
                                    </div>
                                </div>

                                <div className="p-5 rounded-2xl border-2 border-[#131313] bg-neutral-50/50 shadow-[3px_3px_0_#131313]">
                                    <span className="text-xs font-black text-neutral-400 uppercase tracking-wider block mb-2">Email Address</span>
                                    <div className="flex items-center gap-3 text-base font-bold text-[#131313]">
                                        <Mail size={18} className="text-[#8B5CF6]" />
                                        <a href={`mailto:${contact.email}`} className="hover:underline">{contact.email}</a>
                                    </div>
                                </div>

                                <div className="p-5 rounded-2xl border-2 border-[#131313] bg-neutral-50/50 shadow-[3px_3px_0_#131313] md:col-span-2">
                                    <span className="text-xs font-black text-neutral-400 uppercase tracking-wider block mb-2">Phone Number</span>
                                    <div className="flex items-center gap-3 text-base font-bold text-[#131313]">
                                        <Phone size={18} className="text-[#8B5CF6]" />
                                        <a href={`tel:${contact.phone}`} className="hover:underline">{contact.phone || "N/A"}</a>
                                    </div>
                                </div>

                            </div>

                            {/* Full Message Box */}
                            <div className="p-7 rounded-2xl border-[2.5px] border-[#131313] bg-[#FAF8F5] shadow-[4px_4px_0_#131313] space-y-3">
                                <span className="text-sm font-black text-[#8B5CF6] uppercase tracking-wider block">Customer Message</span>
                                <p className="text-lg md:text-xl text-[#131313] font-bold leading-relaxed whitespace-pre-wrap">
                                    {contact.message}
                                </p>
                            </div>

                            {/* Date info */}
                            <div className="pt-4 border-t-2 border-neutral-100 flex items-center gap-2 text-xs font-bold text-neutral-400">
                                <Calendar size={14} />
                                <span>Submitted on {contact.createdAt ? new Date(contact.createdAt).toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'short' }) : "N/A"}</span>
                            </div>

                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
