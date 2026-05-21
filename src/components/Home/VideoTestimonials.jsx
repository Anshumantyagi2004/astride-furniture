"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    FaYoutube,
    FaInstagram,
    FaPlay,
} from "react-icons/fa6";

const videos = [
    {
        id: 1,
        platform: "youtube",
        thumbnail:
            "https://img.youtube.com/vi/54IyaNt-2vo/maxresdefault.jpg",
        embed:
            "https://www.youtube.com/embed/54IyaNt-2vo?autoplay=1&mute=0",
        link:
            "https://youtube.com/shorts/54IyaNt-2vo?si=iKq2oLeR_ALTdM0i",
    },

    {
        id: 2,
        platform: "youtube",
        thumbnail:
            "https://img.youtube.com/vi/rzfRqSPMfNE/maxresdefault.jpg",
        embed:
            "https://www.youtube.com/embed/rzfRqSPMfNE?autoplay=1&mute=0",
        link:
            "https://youtube.com/shorts/rzfRqSPMfNE?si=WnrwRG_M-E5ymXdT",
    },

    {
        id: 3,
        platform: "instagram",
        thumbnail: "/instagram-thumb-1.webp",
        embed:
            "https://www.instagram.com/reel/DXlZMlbR6YR/embed",
        link:
            "https://www.instagram.com/reel/DXlZMlbR6YR/?utm_source=ig_web_copy_link",
    },

    {
        id: 4,
        platform: "instagram",
        thumbnail: "/instagram-thumb-2.webp",
        embed:
            "https://www.instagram.com/reel/DPDmk8tiBGr/embed",
        link:
            "https://www.instagram.com/reel/DPDmk8tiBGr/?utm_source=ig_web_copy_link",
    },
];

export default function VideoTestimonials() {
    const [playingVideo, setPlayingVideo] = useState(null);

    return (
        <section className="w-full py-10 bg-[#f8fafc] overflow-hidden">

            <div className="max-w-7xl mx-auto px-4">

                {/* HEADER */}
                <div className="text-center mb-8">

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#243447]">
                        Video{" "}
                        <span className="text-[#00badb] relative inline-block">
                            Testimonials

                            <span className="absolute left-0 -bottom-2 w-full h-[4px] bg-[#00badb]/20 rounded-full"></span>
                        </span>
                    </h2>

                    <p className="mt-4 text-gray-700 max-w-2xl mx-auto leading-relaxed">
                        Watch real customer experiences from YouTube Shorts
                        and Instagram Reels.
                    </p>

                    <div className="flex items-center justify-center gap-2 mt-4">
                        <span className="w-16 h-[2px] bg-[#00badb]/30 rounded-full"></span>

                        <span className="w-3 h-3 rounded-full bg-[#00badb]"></span>

                        <span className="w-16 h-[2px] bg-[#00badb]/30 rounded-full"></span>
                    </div>
                </div>

                {/* VIDEOS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                    {videos.map((video, index) => (
                        <motion.div
                            key={video.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.3,
                                delay: index * 0.1,
                            }}
                            whileHover={{
                                y: -8,
                            }}
                            viewport={{ once: true }}
                            className="group relative rounded-3xl overflow-hidden bg-black shadow-xl"
                        >

                            {/* VIDEO CONTAINER */}
                            <div className="relative h-[500px] overflow-hidden">

                                {/* PLAY VIDEO */}
                                {playingVideo === video.id ? (
                                    <iframe
                                        src={video.embed}
                                        className="w-full h-full"
                                        allow="autoplay; encrypted-media"
                                        allowFullScreen
                                    />
                                ) : (
                                    <>
                                        {/* THUMBNAIL */}
                                        <img
                                            src={video.thumbnail}
                                            alt="video thumbnail"
                                            className="w-full h-full object-cover"
                                        />

                                        {/* DARK OVERLAY */}
                                        <div className="absolute inset-0 bg-black/30"></div>

                                        {/* PLAY BUTTON */}
                                        <button
                                            onClick={() => setPlayingVideo(video.id)}
                                            className="absolute inset-0 flex items-center justify-center"
                                        >
                                            <motion.div
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-2xl"
                                            >
                                                <FaPlay
                                                    size={28}
                                                    className="text-white ml-1"
                                                />
                                            </motion.div>
                                        </button>
                                    </>
                                )}

                                {/* PLATFORM ICON */}
                                <a
                                    href={video.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="absolute top-4 left-4 z-20"
                                >
                                    {video.platform === "youtube" ? (
                                        <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all">
                                            <FaYoutube size={24} />
                                        </div>
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all">
                                            <FaInstagram size={22} />
                                        </div>
                                    )}
                                </a>

                                {/* BOTTOM TEXT */}
                                <div className="absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t from-black/80 to-transparent">

                                    <h3 className="text-white text-lg font-semibold">
                                        Customer Review
                                    </h3>

                                    <p className="text-gray-200 text-sm mt-1">
                                        Click play to watch testimonial
                                    </p>
                                </div>

                            </div>
                        </motion.div>
                    ))}

                </div>
            </div>
        </section>
    );
}