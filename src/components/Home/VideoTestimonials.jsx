"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Plus_Jakarta_Sans } from "next/font/google";
import {
    FaYoutube,
    FaInstagram,
    FaPlay,
    FaStar,
} from "react-icons/fa6";

const sans = Plus_Jakarta_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    variable: "--font-sans",
});

const videos = [
    {
        id: 1,
        platform: "youtube",
        tag: "Comfort & Support",
        author: "Aarav Sharma",
        rating: 5,
        thumbnail: "https://img.youtube.com/vi/54IyaNt-2vo/maxresdefault.jpg",
        embed: "https://www.youtube.com/embed/54IyaNt-2vo?autoplay=1&mute=0",
        link: "https://youtube.com/shorts/54IyaNt-2vo?si=iKq2oLeR_ALTdM0i",
        duration: "0:45",
    },
    {
        id: 2,
        platform: "youtube",
        tag: "Ergonomics Review",
        author: "Rohan Malhotra",
        rating: 5,
        thumbnail: "https://img.youtube.com/vi/rzfRqSPMfNE/maxresdefault.jpg",
        embed: "https://www.youtube.com/embed/rzfRqSPMfNE?autoplay=1&mute=0",
        link: "https://www.youtube.com/shorts/rzfRqSPMfNE?si=WnrwRG_M-E5ymXdT",
        duration: "0:58",
    },
    {
        id: 3,
        platform: "instagram",
        tag: "Aesthetic Setup",
        author: "Sneha Patel",
        rating: 5,
        thumbnail: "https://images.unsplash.com/photo-1505797149-43b0069ec26b?q=80&w=600&auto=format&fit=crop",
        embed: "https://www.instagram.com/reel/DXlZMlbR6YR/embed",
        link: "https://www.instagram.com/reel/DXlZMlbR6YR/?utm_source=ig_web_copy_link",
        duration: "0:30",
    },
    {
        id: 4,
        platform: "instagram",
        tag: "Unboxing & First Impression",
        author: "Vikram Mehta",
        rating: 5,
        thumbnail: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop",
        embed: "https://www.instagram.com/reel/DPDmk8tiBGr/embed",
        link: "https://www.instagram.com/reel/DPDmk8tiBGr/?utm_source=ig_web_copy_link",
        duration: "0:50",
    },
];

export default function VideoTestimonials() {
    const [playingVideo, setPlayingVideo] = useState(null);

    return (
        <section className={`w-full py-10 bg-gray-50 overflow-hidden ${sans.className}`}>
            <div className="max-w-7xl mx-auto px-6">
                
                {/* HEADER */}
                <div className="text-center mb-8 relative">
                    <p className={`uppercase tracking-[5px] text-[#8B5CF6] text-xs font-extrabold mb-2 ${sans.className}`}>
                        Social Proof
                    </p>
                    <h2 className={`text-4xl sm:text-5xl font-black text-slate-900 tracking-tight ${sans.className}`}>
                        Video <span className="bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] bg-clip-text text-transparent font-black">Testimonials</span>
                    </h2>
                    <p className={`mt-4 text-slate-600 max-w-xl mx-auto text-base sm:text-lg font-medium ${sans.className}`}>
                        Real people, real comfort. Watch honest reviews from YouTube Shorts and Instagram Reels.
                    </p>
                </div>

                {/* VIDEOS GRID / SWIPER */}
                <div className="flex overflow-x-auto pb-10 -mx-6 px-6 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-8 md:overflow-visible md:pb-0 md:px-0 md:-mx-0 md:snap-none">
                    {videos.map((video) => (
                        <div
                            key={video.id}
                            className={`w-[85vw] sm:w-[320px] md:w-auto shrink-0 snap-center md:snap-align-none relative rounded-2xl overflow-hidden bg-slate-900 shadow-lg border border-slate-200/50 mr-4 md:mr-0 ${sans.className}`}
                        >
                            {/* VIDEO WRAPPER */}
                            <div className="relative h-[480px] w-full bg-slate-800">
                                {playingVideo === video.id ? (
                                    <div className="w-full h-full bg-black">
                                        <iframe
                                            src={video.embed}
                                            className="w-full h-full border-0"
                                            allow="autoplay; encrypted-media"
                                            allowFullScreen
                                            loading="lazy"
                                        />
                                    </div>
                                ) : (
                                    <div className="relative w-full h-full">
                                        {/* THUMBNAIL */}
                                        <img
                                            src={video.thumbnail}
                                            alt={`${video.author}'s testimonial`}
                                            className="w-full h-full object-cover opacity-80"
                                            loading="lazy"
                                            decoding="async"
                                        />

                                        {/* SIMPLE OVERLAY */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                        {/* PLAY BUTTON CONTAINER */}
                                        <button
                                            onClick={() => setPlayingVideo(video.id)}
                                            className="absolute inset-0 flex items-center justify-center z-10"
                                            aria-label="Play video testimonial"
                                        >
                                            <div className="w-14 h-14 rounded-full bg-black/50 border border-white/20 flex items-center justify-center shadow-md">
                                                <FaPlay size={18} className="text-white translate-x-0.5" />
                                            </div>
                                        </button>

                                        {/* PLATFORM BADGE */}
                                        <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                                            {video.platform === "youtube" ? (
                                                <div className="flex items-center gap-1.5 px-3 py-1 bg-red-600 rounded text-white text-[11px] font-bold uppercase">
                                                    <FaYoutube size={12} />
                                                    <span>Shorts</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 px-3 py-1 bg-pink-600 rounded text-white text-[11px] font-bold uppercase">
                                                    <FaInstagram size={12} />
                                                    <span>Reels</span>
                                                </div>
                                            )}
                                            
                                            {/* DURATION BADGE */}
                                            <div className="px-2 py-1 bg-black/50 rounded text-[10px] font-medium text-white tracking-wider">
                                                {video.duration}
                                            </div>
                                        </div>

                                        {/* CATEGORY TAG BADGE */}
                                        <div className="absolute top-4 right-4 z-20">
                                            <div className="px-2 py-1 bg-black/40 rounded border border-white/10 text-[10px] font-medium text-white">
                                                {video.tag}
                                            </div>
                                        </div>

                                        {/* BOTTOM METADATA CARD */}
                                        <div className="absolute bottom-0 left-0 w-full p-5 z-20">
                                            {/* Stars rating */}
                                            <div className="flex items-center gap-1 mb-1">
                                                {[...Array(video.rating)].map((_, i) => (
                                                    <FaStar key={i} size={10} className="text-yellow-400" />
                                                ))}
                                            </div>

                                            <h3 className={`text-white text-base font-bold ${sans.className}`}>
                                                {video.author}
                                            </h3>

                                            <div className="flex items-center gap-1.5 mt-1 text-slate-300">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                <p className="text-[11px]">
                                                    Verified Astride Owner
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}