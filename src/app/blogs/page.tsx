"use client";

import { Playfair_Display } from "next/font/google";
import Image from "next/image";
import { motion } from "framer-motion";

import BlogCard from "@/components/pages/Blog/BlogCard";
import { blogs } from "@/data/blog";
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
});

const banner = "/blogs/desktop_banner.webp";

export default function BlogsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[430px] md:h-[500px] w-full overflow-hidden">
        <Image
          src={banner}
          alt="Blog Banner"
          fill
          priority
          className="object-cover object-center scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-4 text-xs md:text-sm uppercase tracking-[0.4em] text-white/80"
          >
            Explore Our Stories
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className={`${playfair.className} text-white text-6xl md:text-8xl font-semibold tracking-tight`}
          >
            Our Blog
          </motion.h1>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-5 h-[2px] bg-white/70"
          />

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.9 }}
            className="mt-6 max-w-3xl text-white/90 text-base md:text-xl leading-relaxed"
          >
            Insights on workspace comfort, productivity,
            design excellence, and modern living.
          </motion.p>
        </div>
      </section>

      {/* Blog Cards Section */}
      <section className="bg-[#fafafa] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 text-center">
            <span className="text-sm uppercase tracking-[0.3em] text-neutral-500">
              Latest Articles
            </span>

            <h2 className="mt-4 text-4xl md:text-5xl font-semibold">
              Stories & Insights
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-neutral-600">
              Explore expert perspectives on ergonomics,
              workspace design, productivity, and modern living.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} {...blog} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}