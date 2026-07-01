"use client";

// 1. ADDED useEffect to imports
import { useState, useEffect } from "react";
import { m, LazyMotion, domAnimation, AnimatePresence } from "framer-motion";
import { Plus_Jakarta_Sans } from "next/font/google";
import { FaYoutube, FaInstagram, FaPlay, FaStar, FaArrowRight } from "react-icons/fa6";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

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
        quote: "Changed my posture completely in just 2 weeks. Best purchase of 2024.",
        rating: 5,
        thumbnail: "https://img.youtube.com/vi/54IyaNt-2vo/maxresdefault.jpg",
        embed: "https://www.youtube.com/embed/54IyaNt-2vo?autoplay=1&mute=0",
        link: "https://youtube.com/shorts/54IyaNt-2vo?si=iKq2oLeR_ALTdM0i",
        duration: "0:45",
        accentFrom: "#8B5CF6",
        accentTo: "#EC4899",
    },
    {
        id: 2,
        platform: "youtube",
        tag: "Ergonomics Review",
        author: "Rohan Malhotra",
        quote: "The lumbar support is insane. Zero back pain after 10-hour sessions.",
        rating: 5,
        thumbnail: "https://img.youtube.com/vi/IouzNcfz0Yw/maxresdefault.jpg",
        embed: "https://www.youtube.com/embed/IouzNcfz0Yw?autoplay=1&mute=0",
        link: "https://youtube.com/shorts/36wb7ZDNdZg?si=UB8Jyle00n26bCvE",
        duration: "0:58",
        accentFrom: "#EC4899",
        accentTo: "#F97316",
    },
    {
        id: 3,
        platform: "youtube",
        tag: "Setup Upgrade",
        author: "Vikram Singh",
        quote: "The ultimate chair for long work sessions and intense gaming.",
        rating: 5,
        thumbnail: "https://img.youtube.com/vi/--rKEoktpGw/maxresdefault.jpg",
        embed: "https://www.youtube.com/embed/--rKEoktpGw?autoplay=1&mute=0",
        link: "https://www.youtube.com/watch?v=--rKEoktpGw",
        duration: "0:55",
        accentFrom: "#3B82F6",
        accentTo: "#10B981",
    },
    {
        id: 4,
        platform: "youtube",
        tag: "Design & Comfort",
        author: "Kabir Mehta",
        quote: "Premium build quality and amazing adjustable arms. Highly recommend!",
        rating: 5,
        thumbnail: "https://img.youtube.com/vi/0OoCSmxvWkw/maxresdefault.jpg",
        embed: "https://www.youtube.com/embed/0OoCSmxvWkw?autoplay=1&mute=0",
        link: "https://youtube.com/shorts/0OoCSmxvWkw?si=eL47xyu4TzE3r8CU",
        duration: "0:58",
        accentFrom: "#8B5CF6",
        accentTo: "#3B82F6",
    },
];

function PlatformBadge({ platform }) {
    if (platform === "youtube") {
        return (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-600 rounded-lg text-white text-[11px] font-bold uppercase tracking-wider">
                <FaYoutube size={11} />
                <span>Shorts</span>
            </div>
        );
    }
    return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-white text-[11px] font-bold uppercase tracking-wider"
            style={{ background: "linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)" }}>
            <FaInstagram size={11} />
            <span>Reels</span>
        </div>
    );
}

function StarRating({ count }) {
    return (
        <div className="flex items-center gap-0.5">
            {[...Array(count)].map((_, i) => (
                <FaStar key={i} size={10} className="text-yellow-400" />
            ))}
        </div>
    );
}

function FeaturedCard({ video, onPlay, isPlaying, isPriority = false }) {
    return (
        <m.div
            key={video.id}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-2xl overflow-hidden w-full h-full min-h-[420px] lg:h-[510px] flex flex-col justify-end group cursor-pointer max-md:!shadow-none max-md:!transform-none"
            style={{ boxShadow: `0 24px 48px -10px ${video.accentFrom}40` }}
        >
            <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"
                style={{
                    boxShadow: `inset 0 0 0 2px ${video.accentFrom}80`,
                }}
            />

            <div className="absolute inset-0">
                {isPlaying ? (
                    <iframe
                        src={video.embed}
                        className="w-full h-full border-0"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                    />
                ) : (
                    <div className="w-full h-full relative flex items-center justify-center bg-black">
                        <img
                            src={video.thumbnail}
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover filter blur-[15px] opacity-40 scale-110 pointer-events-none max-md:hidden"
                            loading={isPriority ? "eager" : "lazy"}
                            decoding="async" 
                        />
                        <img
                            src={video.thumbnail}
                            alt={video.author}
                            className="relative h-full w-auto object-contain transition-transform duration-700 group-hover:scale-102 z-10"
                            loading={isPriority ? "eager" : "lazy"}
                            fetchPriority={isPriority ? "high" : "auto"}
                            decoding="async"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10 z-10 pointer-events-none" />
                        <div
                            className="absolute inset-0 opacity-20 z-10 pointer-events-none"
                            style={{
                                background: `linear-gradient(135deg, ${video.accentFrom}30 0%, transparent 60%)`,
                            }}
                        />
                    </div>
                )}
            </div>

            {!isPlaying && (
                <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                    <PlatformBadge platform={video.platform} />
                    <div className="px-2 py-0.5 bg-black/40 backdrop-blur-sm rounded text-[10px] font-semibold text-white/80 border border-white/10">
                        {video.duration}
                    </div>
                </div>
            )}
            {!isPlaying && (
                <div className="absolute top-4 right-4 z-20">
                    <div className="px-2.5 py-0.5 rounded bg-white/10 backdrop-blur-sm border border-white/20 text-[10px] font-semibold text-white">
                        {video.tag}
                    </div>
                </div>
            )}

            {!isPlaying && (
                <button
                    onClick={onPlay}
                    className="absolute inset-0 z-20 flex items-center justify-center"
                    aria-label="Play featured video"
                >
                    <m.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-16 h-16 rounded-full flex items-center justify-center relative"
                        style={{
                            background: `linear-gradient(135deg, ${video.accentFrom}, ${video.accentTo})`,
                            boxShadow: `0 0 30px ${video.accentFrom}70`,
                        }}
                    >
                        <FaPlay size={18} className="text-white translate-x-0.5" />
                        <span className="absolute inset-0 rounded-full animate-ping opacity-25"
                            style={{ background: `linear-gradient(135deg, ${video.accentFrom}, ${video.accentTo})` }} />
                    </m.div>
                </button>
            )}

            {!isPlaying && (
                <div className="relative z-20 p-5">
                    <StarRating count={video.rating} />
                    <h3 className="text-white text-xl font-black mt-1.5 mb-0.5">{video.author}</h3>
                    <p className="text-white/60 text-xs leading-relaxed max-w-[300px] italic">"{video.quote}"</p>
                    <div className="flex items-center gap-1.5 mt-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-emerald-400 text-[10px] font-semibold">Verified Astride Owner</span>
                    </div>
                </div>
            )}
        </m.div>
    );
}

function SideCard({ video, onClick, index }) {
    return (
        <m.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "1000px" }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ 
                boxShadow: `0 0 25px 2px ${video.accentFrom}35, 0 12px 32px 0 rgba(0, 0, 0, 0.45), inset 0 1px 1px 0 rgba(255, 255, 255, 0.2)`
            }}
            className="relative rounded-xl overflow-hidden flex-1 min-h-[130px] lg:h-[135px] group cursor-pointer border border-white/[0.12] bg-white/[0.05] hover:bg-white/[0.1] hover:border-white/[0.22] backdrop-blur-xl transition-all duration-300"
            style={{ 
                boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)` 
            }}
            onClick={onClick}
        >
            <div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none z-10"
                style={{ boxShadow: `inset 0 0 0 1px rgba(255, 255, 255, 0.15)` }}
            />

            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div 
                    className="absolute -left-12 -top-12 w-36 h-36 rounded-full blur-3xl opacity-10 group-hover:opacity-25 transition-all duration-500"
                    style={{ background: `radial-gradient(circle, ${video.accentFrom}, transparent 70%)` }}
                />
                <div 
                    className="absolute -right-12 -bottom-12 w-28 h-28 rounded-full blur-2xl opacity-5 group-hover:opacity-15 transition-all duration-500"
                    style={{ background: `radial-gradient(circle, ${video.accentTo}, transparent 70%)` }}
                />
            </div>

            <div className="relative z-20 h-full flex items-center gap-3.5 px-4 py-3">
                <div
                    className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                    style={{
                        background: `linear-gradient(135deg, ${video.accentFrom}, ${video.accentTo})`,
                        boxShadow: `0 0 15px ${video.accentFrom}40`,
                    }}
                >
                    <FaPlay size={11} className="text-white translate-x-px" />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                        <PlatformBadge platform={video.platform} />
                        <span className="text-white/50 text-[9px]">{video.duration}</span>
                    </div>
                    <h4 className="text-white font-black text-sm truncate">{video.author}</h4>
                    <p className="text-white/50 text-[10px] mt-0.5 line-clamp-1 italic">"{video.quote}"</p>
                    <div className="flex items-center gap-1 mt-1">
                        <StarRating count={video.rating} />
                    </div>
                </div>

                <div
                    className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0"
                    style={{ background: `${video.accentFrom}20`, border: `1px solid ${video.accentFrom}40` }}
                >
                    <FaArrowRight size={10} className="text-white" />
                </div>
            </div>
        </m.div>
    );
}

export default function VideoTestimonials() {
    const [selectedId, setSelectedId] = useState(videos[0].id);
    const [playingId, setPlayingId] = useState(null);
    const [swiperInstance, setSwiperInstance] = useState(null);

    // 2. ADDED DESKTOP AUTOPLAY LOGIC
    // This effect handles auto-cycling the selected video on desktop screens.
    useEffect(() => {
        // If a video is playing, or if we are on a mobile screen (where Swiper handles it), do nothing.
        if (playingId !== null || (typeof window !== "undefined" && window.innerWidth < 1024)) {
            return;
        }

        const interval = setInterval(() => {
            setSelectedId((currentId) => {
                const currentIndex = videos.findIndex(v => v.id === currentId);
                const nextIndex = (currentIndex + 1) % videos.length;
                return videos[nextIndex].id;
            });
        }, 3500); // 3.5 seconds to match the mobile swiper delay

        // Cleanup interval on unmount or when playingId changes
        return () => clearInterval(interval);
    }, [playingId, selectedId]); // Depend on selectedId so manual clicks reset the timer properly

    const featured = videos.find(v => v.id === selectedId) || videos[0];
    const sideVideos = videos.filter(v => v.id !== selectedId);

    const handleSelectSideCard = (id) => {
        setSelectedId(id);
        setPlayingId(null); 
    };

    return (
        <LazyMotion features={domAnimation}>
            <section
                className={`relative w-full pt-2 pb-0 lg:pt-3 lg:pb-14 overflow-hidden ${sans.className}`}
                style={{ backgroundColor: "#0d0d0d" }}
            >
                <div className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full blur-[100px] opacity-15 pointer-events-none"
                    style={{ background: "radial-gradient(circle, #8B5CF6, transparent 70%)" }} />
                <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] rounded-full blur-[80px] opacity-10 pointer-events-none"
                    style={{ background: "radial-gradient(circle, #EC4899, transparent 70%)" }} />

                <div className="relative max-w-[1150px] mx-auto px-5 md:px-8">

                    <m.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "1000px" }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="mb-3"
                    >
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <span className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[3px] text-transparent bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] bg-clip-text mb-2.5">
                                    <span className="inline-block w-6 h-px bg-gradient-to-r from-[#8B5CF6] to-[#EC4899]" />
                                    Social Proof
                                </span>
                                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
                                    Hear it from{" "}
                                    <span className="bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] bg-clip-text text-transparent">
                                        real people.
                                    </span>
                                </h2>
                                <p className="mt-2 text-white/40 text-xs sm:text-sm max-w-sm font-medium">
                                    Unfiltered reviews from YouTube Shorts. 100% genuine.
                                </p>
                            </div>

                            <div className="flex items-center gap-5 shrink-0">
                                {[
                                    { label: "Reviews", value: "4,200+" },
                                    { label: "Avg Rating", value: "4.9 ★" },
                                 ].map((s) => (
                                     <div key={s.label} className="text-center">
                                         <p className="text-2xl font-black text-white">{s.value}</p>
                                         <p className="text-[10px] text-white/40 font-semibold uppercase tracking-widest mt-0.5">{s.label}</p>
                                     </div>
                                 ))}
                            </div>
                        </div>
                    </m.div>

                    <style jsx global>{`
                        .video-swiper .swiper-pagination-bullet {
                            background: rgba(255, 255, 255, 0.3) !important;
                            opacity: 1 !important;
                        }
                        .video-swiper .swiper-pagination-bullet-active {
                            background: #8B5CF6 !important;
                        }
                    `}</style>

                    {/* MOBILE LAYOUT (lg:hidden) */}
                    <div className="block lg:hidden w-full pb-0">
                        <Swiper
                            onSwiper={setSwiperInstance}
                            modules={[Pagination, Autoplay]}
                            pagination={{ clickable: true }}
                            loop={true}
                            autoplay={{
                                delay: 3500,
                                disableOnInteraction: false,
                            }}
                            spaceBetween={16}
                            slidesPerView={1}
                            className="video-swiper w-full"
                            onSlideChange={(swiper) => {
                                setPlayingId(null); 
                                if (swiper.autoplay && !swiper.autoplay.running) {
                                    swiper.autoplay.start(); 
                                }
                            }}
                        >
                            {videos.map((v, index) => (
                                <SwiperSlide key={v.id}>
                                    <div className="h-[430px] w-full">
                                        <FeaturedCard
                                            video={v}
                                            onPlay={() => {
                                                setPlayingId(v.id);
                                                if (swiperInstance && swiperInstance.autoplay) {
                                                    swiperInstance.autoplay.stop();
                                                }
                                            }}
                                            isPlaying={playingId === v.id}
                                            isPriority={index === 0} 
                                        />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        
                        <div className="mt-4">
                            <a
                                href="https://www.youtube.com/@astride.furniture"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between gap-3 px-5 py-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#8B5CF6] to-[#EC4899]">
                                        <FaYoutube size={16} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-xs">See 200+ more reviews</p>
                                        <p className="text-white/40 text-[10px]">On YouTube</p>
                                    </div>
                                </div>
                                <div className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#8B5CF6] group-hover:bg-[#8B5CF6]/20 transition-all duration-300">
                                    <FaArrowRight size={10} className="text-white/60 group-hover:text-white transition-colors" />
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* DESKTOP LAYOUT (lg:grid) */}
                    <div className="hidden lg:grid grid-cols-[1fr_1.05fr] gap-4 items-stretch">
                        <div className="relative w-full h-full min-h-[420px] lg:h-[510px]">
                            <AnimatePresence mode="wait">
                                <FeaturedCard
                                    key={featured.id}
                                    video={featured}
                                    onPlay={() => setPlayingId(featured.id)}
                                    isPlaying={playingId === featured.id}
                                    isPriority={true}
                                />
                            </AnimatePresence>
                        </div>

                        <div className="flex flex-col gap-3">
                            {sideVideos.map((v, i) => (
                                <SideCard
                                    key={v.id}
                                    video={v}
                                    index={i}
                                    onClick={() => handleSelectSideCard(v.id)}
                                />
                            ))}

                            <m.a
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "1000px" }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                href="https://www.youtube.com/@astride.furniture"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between gap-3 px-5 py-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#8B5CF6] to-[#EC4899]">
                                        <FaYoutube size={16} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-xs">See 200+ more reviews</p>
                                        <p className="text-white/40 text-[10px]">On YouTube</p>
                                    </div>
                                </div>
                                <div className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#8B5CF6] group-hover:bg-[#8B5CF6]/20 transition-all duration-300">
                                    <FaArrowRight size={10} className="text-white/60 group-hover:text-white transition-colors" />
                                </div>
                            </m.a>
                        </div>
                    </div>
                </div>
            </section>
        </LazyMotion>
    );
}