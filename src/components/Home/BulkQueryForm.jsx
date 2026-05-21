"use client";

import { motion } from "framer-motion";

import {
    User,
    Building2,
    Mail,
    Phone,
    Armchair,
    MapPin,
} from "lucide-react";

export default function BulkQueryForm() {
    return (
        <section className="w-full py-10 bg-white">
            <div className="max-w-5xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-3xl border border-gray-200 shadow-lg overflow-hidden"
                >
                    <div className="bg-[#00badb] px-6 py-5 text-center">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white">
                            Bulk Office Chair Enquiry
                        </h2>

                        <p className="mt-1 text-white/90 text-sm">
                            Get special pricing for your office workspace setup
                        </p>
                    </div>

                    <div className="p-5 sm:p-6">
                        <form className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black">
                            <div className="relative">
                                <User
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                                />

                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    className="w-full h-12 rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 outline-none focus:border-[#00badb] transition-all"
                                />
                            </div>

                            <div className="relative">
                                <Building2
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                                />

                                <input
                                    type="text"
                                    placeholder="Company Name"
                                    className="w-full h-12 rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 outline-none focus:border-[#00badb] transition-all"
                                />
                            </div>

                            <div className="relative">
                                <Armchair
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                                />

                                <input
                                    type="number"
                                    placeholder="No. of Chairs"
                                    className="w-full h-12 rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 outline-none focus:border-[#00badb] transition-all"
                                />
                            </div>

                            <div className="relative">
                                <Mail
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                                />

                                <input
                                    type="email"
                                    placeholder="Official Email"
                                    className="w-full h-12 rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 outline-none focus:border-[#00badb] transition-all"
                                />
                            </div>

                            <div className="relative">
                                <Phone
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                                />

                                <input
                                    type="tel"
                                    placeholder="Mobile Number"
                                    className="w-full h-12 rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 outline-none focus:border-[#00badb] transition-all"
                                />
                            </div>

                            <div className="relative">
                                <MapPin
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                                />

                                <input
                                    type="text"
                                    placeholder="Your Location"
                                    className="w-full h-12 rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 outline-none focus:border-[#00badb] transition-all"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.98 }}
                                    // type="submit"
                                    className="w-full h-12 rounded-xl bg-[#00badb] hover:bg-cyan-500 text-white font-semibold text-base transition-all duration-300 shadow-md"
                                >
                                    Submit Enquiry
                                </motion.button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}