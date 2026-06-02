"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaYoutube,
    FaInstagram,
    FaPlay,
    FaStar,
} from "react-icons/fa6";
import { IoShieldCheckmark } from "react-icons/io5";

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
        link: "https://youtube.com/shorts/rzfRqSPMfNE?si=WnrwRG_M-E5ymXdT",
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
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
    }, []);

    return (
        <section className="w-full py-10 bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-[#f8fafc] overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                
                {/* HEADER */}
                <div className="text-center mb-8 relative">
                    <div className="absolute inset-0 -top-8 flex justify-center opacity-[0.03] select-none pointer-events-none">
                        <span className="text-8xl font-black text-slate-900 tracking-widest uppercase">Reviews</span>
                    </div>

                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight">
                        Video{" "}
                        <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 bg-clip-text text-transparent">
                            Testimonials
                        </span>
                    </h2>
                    
                    <p className="mt-4 text-slate-600 max-w-xl mx-auto text-base sm:text-lg leading-relaxed font-light">
                        Real people, real comfort. Watch honest reviews from YouTube Shorts and Instagram Reels.
                    </p>
                </div>

                {/* VIDEOS GRID / SWIPER */}
                <div className="flex overflow-x-auto pb-10 -mx-6 px-6 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-8 md:overflow-visible md:pb-0 md:px-0 md:-mx-0 md:snap-none">
                    {videos.map((video, index) => (
                        <motion.div
                            key={video.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: isMobile ? 0 : 0.5,
                                delay: isMobile ? 0 : index * 0.1,
                                ease: [0.21, 1.02, 0.43, 1.01]
                            }}
                            whileHover={{ y: -10 }}
                            viewport={{ once: true }}
                            className="w-[85vw] sm:w-[320px] md:w-auto shrink-0 snap-center md:snap-align-none group relative rounded-3xl overflow-hidden bg-slate-950 shadow-2xl transition-all duration-300 border border-slate-200/10 hover:shadow-slate-300/50 mr-4 md:mr-0"
                        >
                            {/* VIDEO WRAPPER */}
                            <div className="relative h-[480px] w-full overflow-hidden">
                                <AnimatePresence mode="wait">
                                    {playingVideo === video.id ? (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="w-full h-full bg-black"
                                        >
                                            <iframe
                                                src={video.embed}
                                                className="w-full h-full"
                                                allow="autoplay; encrypted-media"
                                                allowFullScreen
                                            />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="relative w-full h-full"
                                        >
                                            {/* THUMBNAIL */}
                                            <img
                                                src={video.thumbnail}
                                                alt={`${video.author}'s testimonial`}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />

                                            {/* MODERN MULTI-LAYER OVERLAY */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-black/30" />

                                            {/* PLAY BUTTON CONTAINER */}
                                            <button
                                                onClick={() => setPlayingVideo(video.id)}
                                                className="absolute inset-0 flex items-center justify-center group/btn z-10"
                                                aria-label="Play video testimonial"
                                            >
                                                <div className="relative">
                                                    {/* Outer pulsing ring */}
                                                    <div className="absolute -inset-4 rounded-full bg-white/10 blur-md group-hover/btn:bg-white/20 transition-all duration-300 group-hover/btn:scale-110" />
                                                    
                                                    {/* Core glass play circle */}
                                                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center shadow-2xl transition-all duration-300 group-hover/btn:scale-110 group-hover/btn:bg-white/30">
                                                        <FaPlay
                                                            size={20}
                                                            className="text-white translate-x-0.5 transition-transform duration-300 group-hover/btn:scale-110"
                                                        />
                                                    </div>
                                                </div>
                                            </button>

                                            {/* PLATFORM BADGE - PILL STYLE */}
                                            <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                                                {video.platform === "youtube" ? (
                                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-600 text-white text-xs font-semibold tracking-wider uppercase shadow-md border border-red-500/20">
                                                        <FaYoutube size={14} />
                                                        <span>Shorts</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-500 text-white text-xs font-semibold tracking-wider uppercase shadow-md border border-white/10">
                                                        <FaInstagram size={13} />
                                                        <span>Reels</span>
                                                    </div>
                                                )}
                                                
                                                {/* DURATION BADGE */}
                                                <div className="px-2 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-medium text-white tracking-wider">
                                                    {video.duration}
                                                </div>
                                            </div>

                                            {/* CATEGORY TAG BADGE */}
                                            <div className="absolute top-4 right-4 z-20">
                                                <div className="px-2.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-medium text-white tracking-wide">
                                                    {video.tag}
                                                </div>
                                            </div>

                                            {/* PREMIUM BOTTOM METADATA CARD */}
                                            <div className="absolute bottom-0 left-0 w-full p-6 z-20">
                                                {/* Stars rating */}
                                                <div className="flex items-center gap-1 mb-2">
                                                    {[...Array(video.rating)].map((_, i) => (
                                                        <FaStar key={i} size={12} className="text-yellow-400 fill-yellow-400" />
                                                    ))}
                                                </div>

                                                <h3 className="text-white text-lg font-bold tracking-tight">
                                                    {video.author}
                                                </h3>

                                                <div className="flex items-center gap-1.5 mt-1 text-slate-300">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                                    <p className="text-xs tracking-wide">
                                                        Verified Astride Owner
                                                    </p>
                                                </div>

                                                {/* Modern call to action on hover */}
                                                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0 transform">
                                                    <span>Watch Review</span>
                                                    <span className="font-semibold">&rarr;</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}