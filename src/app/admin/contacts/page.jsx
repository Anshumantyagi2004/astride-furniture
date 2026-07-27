"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Sidebar from "@/components/Admin/Sidebar";
import Link from "next/link";
import { Plus_Jakarta_Sans } from "next/font/google";
import * as XLSX from "xlsx";
import { 
    Mail, 
    User, 
    Phone, 
    MapPin, 
    Building, 
    MessageSquare, 
    Calendar,
    Loader2,
    Trash2,
    ChevronDown,
    ExternalLink,
    Download
} from "lucide-react";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

export default function Page() {
    const [contacts, setContacts] = useState([]);
    const [totalContacts, setTotalContacts] = useState(0);
    const [loading, setLoading] = useState(true);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const dropdownRef = useRef(null);

    const getContacts = async () => {
        try {
            const { data } = await axios.get("/api/contact");
            if (data.success) {
                setContacts(data.contacts || []);
                setTotalContacts(data.contacts?.length || 0);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load contacts list");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            const { data } = await axios.put(`/api/contact?id=${id}`, { status: newStatus });
            if (data.success) {
                toast.success("Contact status updated successfully");
                setContacts(contacts.map(item => item._id === id ? { ...item, status: newStatus } : item));
                setActiveDropdown(null);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to update status");
        }
    };

    const handleDeleteContact = async (id) => {
        if (!confirm("Are you sure you want to delete this message record?")) return;
        try {
            const { data } = await axios.delete(`/api/contact?id=${id}`);
            if (data.success) {
                toast.success("Message deleted successfully");
                setContacts(contacts.filter(item => item._id !== id));
                setTotalContacts(prev => Math.max(0, prev - 1));
                setActiveDropdown(null);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete message");
        }
    };

    useEffect(() => {
        getContacts();

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setActiveDropdown(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className={`min-h-screen bg-[#FDFBF7] flex ${sans.className}`}>
            <Sidebar />

            <main className="flex-1 p-6 md:p-10 lg:p-12 text-neutral-800">
                <div className="max-w-[1440px] mx-auto">
                    
                    {/* Header Row */}
                    <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-[#131313] tracking-tight uppercase">
                                Contacts Management
                            </h1>
                            <p className="text-sm md:text-base text-neutral-500 font-medium mt-1">
                                Monitor and respond to all submitted customer messages.
                            </p>
                        </div>

                        {/* Right side stats & Export button */}
                        <div className="flex flex-wrap items-center gap-4">
                            <button
                                type="button"
                                onClick={() => {
                                    if (contacts.length === 0) return toast.error("No contacts available to export");
                                    const formatted = contacts.map((c, index) => ({
                                        "S.No": index + 1,
                                        "Full Name": c.fullName || "",
                                        "Email": c.email || "",
                                        "Phone": c.phone || "",
                                        "Company": c.companyName || "N/A",
                                        "Location": `${c.city || ""}, ${c.state || ""}`.trim().replace(/^,|,$/g, "") || "N/A",
                                        "Message": c.message || "",
                                        "Status": c.status || "pending",
                                        "Date Submitted": c.createdAt ? new Date(c.createdAt).toLocaleString() : "N/A",
                                    }));
                                    const ws = XLSX.utils.json_to_sheet(formatted);
                                    const wb = XLSX.utils.book_new();
                                    XLSX.utils.book_append_sheet(wb, ws, "Contacts");
                                    XLSX.writeFile(wb, `Contacts_Report_${Date.now()}.xlsx`);
                                    toast.success("Excel file downloaded!");
                                }}
                                className="flex items-center gap-2 px-4 py-3 bg-white border-[2.5px] border-[#131313] rounded-[20px] font-black text-xs uppercase tracking-wider text-[#131313] shadow-[4px_4px_0_#131313] hover:translate-y-[-1px] hover:shadow-[5px_5px_0_#131313] transition-all cursor-pointer"
                            >
                                <Download size={16} className="text-[#8B5CF6]" />
                                Export Excel
                            </button>

                            {/* Counter Stats Container */}
                            <div className="bg-white border-[2.5px] border-[#131313] rounded-[24px] p-5 shadow-[4px_4px_0_#131313] flex items-center gap-4 min-w-[220px] shrink-0">
                                <div className="w-12 h-12 rounded-xl bg-[#8B5CF6] border-2 border-[#131313] flex items-center justify-center text-white shadow-[2px_2px_0_#131313]">
                                    <MessageSquare size={20} />
                                </div>
                                <div>
                                    <span className="text-[10px] text-neutral-400 font-black uppercase tracking-wider block mb-0.5">Total Messages</span>
                                    <span className="text-3xl font-black text-[#131313] leading-none">{totalContacts}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 gap-4">
                            <Loader2 className="animate-spin text-[#8B5CF6]" size={36} />
                            <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Loading Messages...</span>
                        </div>
                    ) : contacts.length === 0 ? (
                        <div className="bg-white rounded-[28px] border-[2.5px] border-[#131313] p-16 text-center shadow-[6px_6px_0_#131313] flex flex-col items-center justify-center max-w-2xl mx-auto mt-10">
                            <MessageSquare className="text-neutral-400 mb-4" size={48} />
                            <h3 className="text-2xl font-black text-[#131313] uppercase tracking-tight">No Messages Yet</h3>
                            <p className="text-sm text-neutral-500 font-medium mt-1">When visitors submit the contact form, their messages will list up here.</p>
                        </div>
                    ) : (
                        /* Completely Static Neo-Brutalist Layout Container */
                        <div className="bg-white border-[3px] border-[#131313] rounded-[32px] shadow-[8px_8px_0_#131313] overflow-visible w-full">
                            <div className="w-full">
                                <table className="w-full text-left border-collapse table-fixed">
                                    <thead>
                                        <tr className="bg-neutral-50/70 border-b-[3px] border-[#131313]">
                                            <th className="px-5 py-5 text-[11px] font-black text-neutral-400 uppercase tracking-wider w-[5%] text-center">#</th>
                                            <th className="px-6 py-5 text-[11px] font-black text-neutral-400 uppercase tracking-wider w-[22%]">Sender & Location</th>
                                            <th className="px-6 py-5 text-[11px] font-black text-neutral-400 uppercase tracking-wider w-[13%]">Company</th>
                                            <th className="px-6 py-5 text-[11px] font-black text-neutral-400 uppercase tracking-wider w-[20%]">Contact Details</th>
                                            <th className="px-6 py-5 text-[11px] font-black text-neutral-400 uppercase tracking-wider w-[18%]">Message</th>
                                            <th className="px-6 py-5 text-[11px] font-black text-neutral-400 uppercase tracking-wider w-[11%]">Date</th>
                                            <th className="px-6 py-5 text-[11px] font-black text-neutral-400 uppercase tracking-wider w-[11%]">Status</th>
                                            <th className="px-6 py-5 text-[11px] font-black text-neutral-400 uppercase tracking-wider text-center w-[8%]">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y-[2px] divide-[#131313]">
                                        {contacts.map((contact, index) => (
                                            <tr key={contact._id} className="hover:bg-neutral-50/40 transition-colors">
                                                
                                                {/* Mention index 1st */}
                                                <td className="px-5 py-5 text-center text-sm font-black text-[#131313] font-mono border-r-[2px] border-neutral-100 bg-neutral-50/30">
                                                    {index + 1}.
                                                </td>

                                                {/* Client Name & Location */}
                                                <td className="px-6 py-5">
                                                    <Link 
                                                        href={`/admin/contacts/${contact._id}`}
                                                        className="flex items-center gap-3 group hover:opacity-80 transition-all cursor-pointer"
                                                    >
                                                        <div className="w-9 h-9 rounded-full border-[2px] border-[#131313] bg-neutral-100 flex items-center justify-center text-neutral-600 shrink-0 shadow-[1.5px_1.5px_0_#131313] group-hover:bg-[#8B5CF6] group-hover:text-white transition-colors">
                                                            <User size={15} />
                                                        </div>
                                                        <div className="overflow-hidden">
                                                            <p className="text-[15px] font-bold text-[#131313] leading-tight truncate group-hover:text-[#8B5CF6] group-hover:underline flex items-center gap-1.5">
                                                                {contact.fullName}
                                                                <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#8B5CF6] shrink-0" />
                                                            </p>
                                                            <span className="text-xs text-neutral-400 font-semibold flex items-center gap-1 mt-1 capitalize truncate">
                                                                <MapPin size={11} className="text-neutral-400 shrink-0" />
                                                                {`${contact.city || ""}, ${contact.state || ""}`.trim().replace(/^,|,$/g, "") || "unknown"}
                                                            </span>
                                                        </div>
                                                    </Link>
                                                </td>

                                                {/* Company */}
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2 text-[14px] font-bold text-neutral-700">
                                                        <Building size={14} className="text-neutral-400 shrink-0" />
                                                        <span className="truncate">{contact.companyName || "—"}</span>
                                                    </div>
                                                </td>

                                                {/* Contact Details */}
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col gap-1 text-[13px] font-semibold text-neutral-600 overflow-hidden">
                                                        <span className="flex items-center gap-2 hover:text-[#8B5CF6] transition-colors select-all truncate">
                                                            <Mail size={13} className="text-neutral-400 shrink-0" />
                                                            {contact.email}
                                                        </span>
                                                        {contact.phone && (
                                                            <span className="flex items-center gap-2 hover:text-[#8B5CF6] transition-colors select-all truncate">
                                                                <Phone size={13} className="text-neutral-400 shrink-0" />
                                                                {contact.phone}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Message */}
                                                <td className="px-6 py-5 relative group overflow-visible">
                                                    <p className="text-[13px] text-neutral-700 font-medium leading-relaxed break-words line-clamp-3">
                                                        {contact.message}
                                                    </p>
                                                    {/* Custom Tooltip on Hover */}
                                                    <div className="absolute left-1/2 top-full mt-2 -translate-x-1/2 hidden group-hover:block min-w-[280px] max-w-[360px] bg-[#131313] text-white p-3.5 rounded-2xl shadow-[4px_4px_0_#8B5CF6] border-2 border-[#131313] z-50 pointer-events-none transition-all duration-200">
                                                        <p className="text-[12px] font-bold leading-relaxed break-words whitespace-pre-wrap">{contact.message}</p>
                                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-b-[#131313]" />
                                                    </div>
                                                </td>

                                                {/* Timeline Timestamp */}
                                                <td className="px-6 py-5 text-[13px] text-neutral-500 font-bold">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar size={13} className="text-neutral-400 shrink-0" />
                                                        <span>
                                                            {contact.createdAt ? new Date(contact.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' }) : "—"}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Status Controlled Action Dropdown */}
                                                <td className="px-6 py-5 overflow-visible">
                                                    <div className="relative inline-block text-left" ref={activeDropdown === contact._id ? dropdownRef : null}>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setActiveDropdown(activeDropdown === contact._id ? null : contact._id);
                                                            }}
                                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider border-[2.5px] border-[#131313] transition-all cursor-pointer outline-none shadow-[2px_2px_0_#131313] hover:translate-y-[-1px] hover:shadow-[3px_3px_0_#131313] ${
                                                                (contact.status || "pending") === "contacted"
                                                                    ? "bg-[#EFF6FF] text-blue-600"
                                                                    : (contact.status || "pending") === "closed"
                                                                    ? "bg-[#ECFDF5] text-green-600"
                                                                    : "bg-[#FFFBEB] text-amber-600"
                                                            }`}
                                                        >
                                                            <span>{contact.status || "pending"}</span>
                                                            <ChevronDown size={12} className="opacity-80 shrink-0" />
                                                        </button>

                                                        {activeDropdown === contact._id && (
                                                            <div className="absolute left-0 mt-2 w-36 rounded-xl bg-white border-2 border-[#131313] shadow-[4px_4px_0_#131313] py-1.5 z-50 overflow-hidden">
                                                                <button
                                                                    onClick={() => handleStatusChange(contact._id, "pending")}
                                                                    className="w-full text-left px-4 py-2 text-[11px] font-black uppercase tracking-wider text-amber-600 hover:bg-[#FFFBEB] transition-colors"
                                                                >
                                                                    Pending
                                                                </button>
                                                                <button
                                                                    onClick={() => handleStatusChange(contact._id, "contacted")}
                                                                    className="w-full text-left px-4 py-2 text-[11px] font-black uppercase tracking-wider text-blue-600 hover:bg-[#EFF6FF] transition-colors"
                                                                >
                                                                    Contacted
                                                                </button>
                                                                <button
                                                                    onClick={() => handleStatusChange(contact._id, "closed")}
                                                                    className="w-full text-left px-4 py-2 text-[11px] font-black uppercase tracking-wider text-green-600 hover:bg-[#ECFDF5] transition-colors"
                                                                >
                                                                    Closed
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Destructive Actions */}
                                                <td className="px-6 py-5 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteContact(contact._id)}
                                                        className="inline-flex items-center justify-center p-2 rounded-xl border-2 border-transparent text-neutral-400 hover:text-red-500 hover:bg-red-50 hover:border-red-200 transition-all cursor-pointer"
                                                        title="Delete Record"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                </td>

                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
