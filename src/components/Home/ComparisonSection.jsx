"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import { Check, X, } from "lucide-react";
import "swiper/css";
import "swiper/css/pagination";

const comparisons = [
    {
        title: "Office Chair Comparison",

        leftChair: {
            name: "ErgoFit Office",
            image: "/Product/1.webp",
            price: "₹12,999",
            features: [
                { label: "Ergonomic", value: true },
                { label: "Lumbar Support", value: true },
                { label: "3Y Warranty", value: true },
                { label: "Premium Mesh", value: true },
            ],
        },

        rightChair: {
            name: "Other Brand",
            image: "/Product/AlphaBrown_8.webp",
            price: "₹18,999",
            features: [
                { label: "Ergonomic", value: false },
                { label: "Lumbar Support", value: true },
                { label: "3Y Warranty", value: false },
                { label: "Premium Mesh", value: false },
            ],
        },
    },

    {
        title: "Gaming Chair Comparison",

        leftChair: {
            name: "ErgoFit Gaming",
            image: "/Product/Infographic-6.webp",
            price: "₹15,999",
            features: [
                { label: "Footrest", value: true },
                { label: "4D Armrest", value: true },
                { label: "180° Recline", value: true },
                { label: "Premium Leather", value: true },
            ],
        },

        rightChair: {
            name: "Other Gaming",
            image: "/Product/InfographicDesign-1.webp",
            price: "₹22,999",
            features: [
                { label: "Footrest", value: false },
                { label: "4D Armrest", value: false },
                { label: "180° Recline", value: true },
                { label: "Premium Leather", value: false },
            ],
        },
    },
];

export default function ComparisonSection() {
    return (
        <section className="w-full pt-10 bg-[#f8fafc] overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#161316] leading-tight">
                        Compare Our {" "}
                        <span className="text-[#FF6D29]">
                            Chairs
                        </span>
                         <div className="w-24 h-[2px] bg-[#FF6D29] mx-auto mt-2 rounded-full"></div>
                    </h2>
                </div>

                <Swiper
                    modules={[Pagination, Autoplay]}
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 3500, disableOnInteraction: false, }}
                    loop
                    spaceBetween={30}
                    className="pb-12! px-6!"
                >
                    {comparisons.map((comparison, index) => (
                        <SwiperSlide key={index}>
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className="bg-white border border-gray-200 rounded-3xl shadow-lg overflow-hidden"
                            >
                                <div className="bg-[#FF6D29] py-3 text-center">
                                    <h3 className="text-xl sm:text-2xl font-bold text-white">
                                        {comparison.title}
                                    </h3>
                                </div>

                                <div className="grid grid-cols-2">
                                    <div className="p-4 sm:p-5 border-r border-gray-200 text-center">
                                        <motion.div
                                            whileHover={{ scale: 1.04 }}
                                            className="relative h-[150px] sm:h-[190px]"
                                        >
                                            <Image
                                                src={comparison.leftChair.image}
                                                alt={comparison.leftChair.name}
                                                fill
                                                className="object-contain"
                                            />
                                        </motion.div>

                                        <h4 className="mt-3 text-base sm:text-lg font-bold text-[#243447]">
                                            {comparison.leftChair.name}
                                        </h4>

                                        <p className="mt-1 text-2xl font-bold text-green-500">
                                            {comparison.leftChair.price}
                                        </p>
                                    </div>

                                    {/* RIGHT */}
                                    <div className="p-4 sm:p-5 text-center">

                                        <motion.div
                                            whileHover={{ scale: 1.04 }}
                                            className="relative h-[150px] sm:h-[190px]"
                                        >
                                            <Image
                                                src={comparison.rightChair.image}
                                                alt={comparison.rightChair.name}
                                                fill
                                                className="object-contain"
                                            />
                                        </motion.div>

                                        <h4 className="mt-3 text-base sm:text-lg font-bold text-[#243447]">
                                            {comparison.rightChair.name}
                                        </h4>

                                        <p className="mt-1 text-2xl font-bold text-red-500">
                                            {comparison.rightChair.price}
                                        </p>
                                    </div>
                                </div>

                                {/* TABLE */}
                                <div className="border-t border-gray-200 overflow-hidden">

                                    {comparison.leftChair.features.map((feature, idx) => (
                                        <div
                                            key={idx}
                                            className="grid grid-cols-3 items-center border-b border-gray-100 last:border-none"
                                        >

                                            {/* FEATURE */}
                                            <div className="px-4 py-3 text-sm sm:text-base font-medium text-gray-700 bg-gray-50">
                                                {feature.label}
                                            </div>

                                            {/* LEFT VALUE */}
                                            <div className="flex justify-center py-2">
                                                {feature.value ? (
                                                    <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
                                                        <Check
                                                            size={16}
                                                            className="text-green-600"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center">
                                                        <X
                                                            size={16}
                                                            className="text-red-500"
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            {/* RIGHT VALUE */}
                                            <div className="flex justify-center py-2">
                                                {comparison.rightChair.features[idx].value ? (
                                                    <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
                                                        <Check
                                                            size={16}
                                                            className="text-green-600"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center">
                                                        <X
                                                            size={16}
                                                            className="text-red-500"
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                        </div>
                                    ))}

                                </div>

                            </motion.div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}