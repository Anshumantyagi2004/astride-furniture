"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Sidebar from "@/components/Admin/Sidebar";
import { 
    Users, 
    User, 
    Mail, 
    Phone, 
    Trash2,
    Loader2 
} from "lucide-react";

export default function Page() {
    const [users, setUsers] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    const getUsers = async () => {
        try {
            const { data } = await axios.get("/api/auth/users");
            if (data.success) {
                setUsers(data.users || []);
                setTotalUsers(data.totalUsers || 0);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load users list");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!confirm("Are you sure you want to delete this user account?")) return;

        try {
            setDeletingId(id);
            const { data } = await axios.delete(`/api/auth/users?id=${id}`);
            if (data.success) {
                toast.success("User deleted successfully");
                setUsers(users.filter((user) => user._id !== id));
                setTotalUsers((prev) => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete user");
        } finally {
            setDeletingId(null);
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <div className="min-h-screen bg-[#F9FAFB] flex font-sans">
            <Sidebar />

            <main className="flex-1 p-6 md:p-10 lg:p-12 text-neutral-800">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div>
                            <h1 className="text-4xl font-extrabold text-black tracking-tight uppercase" style={{ fontFamily: "'Inter', sans-serif" }}>
                                Users Management
                            </h1>
                            <p className="text-base text-neutral-500 font-medium mt-2">
                                Monitor and view all registered customer accounts.
                            </p>
                        </div>

                        {/* Total Users Summary Stat Card */}
                        <div className="bg-white border border-neutral-150 rounded-3xl p-6 shadow-sm flex items-center gap-4 min-w-[220px]">
                            <div className="w-12 h-12 rounded-2xl bg-neutral-900 flex items-center justify-center text-white">
                                <Users size={22} />
                            </div>
                            <div>
                                <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider block mb-0.5">Total Customers</span>
                                <span className="text-3xl font-black text-black leading-none">{totalUsers}</span>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-4">
                            <Loader2 className="animate-spin text-black" size={40} />
                            <span className="text-base font-bold text-neutral-500 uppercase tracking-widest">Loading Customers...</span>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="bg-white rounded-3xl border border-neutral-100 p-20 text-center shadow-sm flex flex-col items-center justify-center">
                            <Users className="text-neutral-350 mb-6" size={64} />
                            <h3 className="text-2xl font-bold text-neutral-900 mb-2">No Registered Users</h3>
                            <p className="text-base text-neutral-400 font-medium">When customers register, they will list up here.</p>
                        </div>
                    ) : (
                        <div className="bg-white border border-neutral-150 rounded-3xl shadow-[0_25px_50px_rgba(0,0,0,0.03)] overflow-hidden">
                            {/* Table Layout */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-neutral-50 border-b border-neutral-150">
                                            <th className="px-5 py-4 text-xs font-black text-neutral-400 uppercase tracking-wider">Customer</th>
                                            <th className="px-5 py-4 text-xs font-black text-neutral-400 uppercase tracking-wider">Email Address</th>
                                            <th className="px-5 py-4 text-xs font-black text-neutral-400 uppercase tracking-wider">Phone Number</th>
                                            <th className="px-5 py-4 text-xs font-black text-neutral-400 uppercase tracking-wider">Registered On</th>
                                            <th className="px-5 py-4 text-xs font-black text-neutral-400 uppercase tracking-wider text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100">
                                        {users.map((customer) => (
                                            <tr key={customer._id} className="hover:bg-neutral-50/50 transition-colors">
                                                {/* Customer Name */}
                                                <td className="px-5 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full border border-neutral-200 bg-neutral-100/70 flex items-center justify-center text-neutral-500 shrink-0">
                                                            <User size={18} />
                                                        </div>
                                                        <div>
                                                            <p className="text-base font-bold text-neutral-900 leading-tight">{customer.name}</p>
                                                            <span className="text-[11px] text-neutral-400 font-mono">ID: {customer._id}</span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Email */}
                                                <td className="px-5 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2 text-sm font-semibold text-neutral-700">
                                                        <Mail size={15} className="text-neutral-400 shrink-0" />
                                                        <span className="select-all">{customer.email}</span>
                                                    </div>
                                                </td>

                                                {/* Phone */}
                                                <td className="px-5 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2 text-sm font-semibold text-neutral-700">
                                                        <Phone size={15} className="text-neutral-400 shrink-0" />
                                                        {customer.phone ? (
                                                            <span className="select-all">{customer.phone}</span>
                                                        ) : (
                                                            <span className="text-neutral-450 italic font-medium">No Phone Number</span>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Registered Date */}
                                                <td className="px-5 py-4 whitespace-nowrap text-sm text-neutral-500 font-medium">
                                                    {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' }) : "—"}
                                                </td>

                                                {/* Actions */}
                                                <td className="px-5 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        type="button"
                                                        disabled={deletingId === customer._id}
                                                        onClick={() => handleDeleteUser(customer._id)}
                                                        className="inline-flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all disabled:opacity-50"
                                                    >
                                                        {deletingId === customer._id ? (
                                                            <Loader2 className="animate-spin" size={14} />
                                                        ) : (
                                                            <Trash2 size={14} />
                                                        )}
                                                        <span>Delete User</span>
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