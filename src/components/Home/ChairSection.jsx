"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus_Jakarta_Sans } from "next/font/google";

const sans = Plus_Jakarta_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    variable: "--font-sans",
});

const chairData = [
    { 
        mainImage: "/Png1/img1 (1).webp", 
        hoverImage: "/Png/img1 (2).png", 
        name: "Ergonomic Comfort", 
        subtitle: "ErgoFit",
        productId: "6a27a9016149f2acd03556be",
        mainScaleValue: 0.95,
        hoverScaleValue: 1.00
    },
    { 
        mainImage: "/Png1/chair12_ErgoFit.webp", 
        hoverImage: "/Png1/chair12_ErgoFit12a.png", 
        name: "ErgoFit Premium", 
        subtitle: "Ergonomic White",
        productId: "6a27a9016149f2acd03556be",
        mainScaleValue: 0.95,
        hoverScaleValue: 1.00
    },
    { 
        mainImage: "/Png1/chair10_FitWell.webp", 
        hoverImage: "/Png1/chair10_FitWell10a.png", 
        name: "Ergonomic Comfort", 
        subtitle: "FlexPro",
        productId: "6a22790f4299b73c074f7e50",
        mainScaleValue: 0.95,
        hoverScaleValue: 1.00
    },
    { 
        mainImage: "/Png1/chair9_FitWell.webp", 
        hoverImage: "/Png1/chair9_FitWell9a.png", 
        name: "FitWell Basic", 
        subtitle: "FitWell Ergonomic",
        productId: "6a2269068d4f1a8c812a9e92",
        mainScaleValue: 0.95,
        hoverScaleValue: 1.00
    },
    { 
        mainImage: "/Png1/chair11_octave.webp", 
        hoverImage: "/Png1/chair11_octave11a.png", 
        name: "Studio", 
        subtitle: "Octave",
        productId: "6a225caabb685c5865ef3f59",
        mainScaleValue: 0.95,
        hoverScaleValue: 1.00
    },
];

function ChairCard({ chair, index, products }) {
    const [isHovered, setIsHovered] = useState(false);

    // Find product by ID (mapped in chairData) and use its slug for URL
    // This way, navigation works even if slug changes
    const product = products.find(p => p._id === chair.productId);
    const targetUrl = product ? `/products/${product.slug}` : `/products`;

    return (
        <Link
            href={targetUrl}
            key={index}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`group relative bg-white border border-gray-200 rounded-[30px] overflow-hidden hover:border-zinc-400 hover:-translate-y-3 transition-all duration-300 shadow-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] min-w-[290px] max-w-[320px] snap-center flex-shrink-0 md:min-w-0 md:max-w-none cursor-pointer block ${sans.className}`}
        >
            {/* HOVER GLOW */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-zinc-500/5 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>

            {/* IMAGE */}
            <div className="relative h-[300px] md:h-[420px] flex items-center justify-center p-6">
                <div className="w-full h-full flex items-center justify-center relative transition-transform duration-300 group-hover:scale-103 group-hover:-rotate-1">
                    {/* Main Image */}
                    <div 
                        className={`absolute w-full h-[260px] md:h-[380px] transition-all duration-500 flex items-center justify-center ${
                            isHovered ? "opacity-0 pointer-events-none" : "opacity-100"
                        }`}
                        style={{
                            transform: isHovered ? "scale(0.90)" : `scale(${chair.mainScaleValue || 0.95})`
                        }}
                    >
                        <Image
                            src={chair.mainImage}
                            alt={chair.name}
                            width={500}
                            height={500}
                            className="w-full h-full object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.08)] group-hover:drop-shadow-[0_35px_65px_rgba(0,0,0,0.12)] transition-all duration-500"
                        />
                    </div>

                    {/* Hover Image */}
                    <div 
                        className={`absolute w-full h-[260px] md:h-[380px] transition-all duration-500 flex items-center justify-center ${
                            isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
                        }`}
                        style={{
                            transform: isHovered ? `scale(${chair.hoverScaleValue || 1.00})` : "scale(0.90)"
                        }}
                    >
                        <Image
                            src={chair.hoverImage}
                            alt={chair.name}
                            width={500}
                            height={500}
                            className="w-full h-full object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.08)] group-hover:drop-shadow-[0_35px_65px_rgba(0,0,0,0.12)] transition-all duration-500"
                        />
                    </div>
                </div>
            </div>

            {/* CONTENT */}
            <div className="relative z-10 px-6 pb-5 bg-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className={`text-xl text-[#161316] font-bold ${sans.className}`}>
                            {chair.name}
                        </h3>
                        <p className={`text-[#8B5CF6] text-sm font-semibold mt-1 ${sans.className}`}>
                            {chair.subtitle}
                        </p>
                    </div>
                    <div className="w-11 h-11 rounded-full bg-zinc-950 text-white flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.15)] hover:bg-zinc-800">
                        →
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default function ChairSection() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch("/api/product");
                const data = await res.json();
                if (data?.success) {
                    setProducts(data.products);
                }
            } catch (err) {
                console.error("Error fetching products in ChairSection:", err);
            }
        };
        fetchProducts();
    }, []);

    return (
        <section className={`relative overflow-hidden bg-[#f1f3f5] pb-2 pt-2 border-t border-t-white ${sans.className}`}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-zinc-400/10 blur-[180px] rounded-full"></div>
            <div className="relative z-10 md:px-25 px-4 lg:px-10">
                <div className="text-center mb-8">
                    <p className={`uppercase tracking-[5px] text-[#8B5CF6] text-sm font-extrabold ${sans.className}`}>
                        Premium Ergonomics
                    </p>
                    <h2 className={`text-4xl md:text-6xl font-black text-[#161316] leading-none mt-2 ${sans.className}`}>
                        Designed For <br />
                        <span className="bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] bg-clip-text text-transparent font-extrabold">Modern Workspace</span>
                    </h2>
                </div>

                {/* CARDS */}
                <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory pb-6 scrollbar-hide md:grid md:grid-cols-2 xl:grid-cols-5 md:gap-6 -mx-4 px-4 md:mx-0 md:px-0">
                    {chairData.map((chair, index) => (
                        <ChairCard key={index} chair={chair} index={index} products={products} />
                    ))}
                </div>
            </div>
        </section>
    );
}