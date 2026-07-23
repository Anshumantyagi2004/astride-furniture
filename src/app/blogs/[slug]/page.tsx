"use client";

import { use, useRef, useState, useEffect } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { 
  User, 
  BookOpen
} from "lucide-react";

export default function BlogDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Fetch single blog from the API
    const getBlogData = async () => {
      try {
        const { data } = await axios.get(`/api/blog?slug=${slug}`);
        if (data.success) {
          setBlog(data.blog);
        } else {
          setBlog(null);
        }
      } catch (err) {
        console.error("Failed to load blog:", err);
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };
    getBlogData();

    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 767px)');
    const handler = (e: MediaQueryList | MediaQueryListEvent) => setIsMobile((e as any).matches);
    handler(mq);
    if (mq.addEventListener) mq.addEventListener('change', handler as any);
    else mq.addListener(handler as any);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', handler as any);
      else mq.removeListener(handler as any);
    };
  }, [slug]);

  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const { scrollY } = useScroll();

  // Parallax effects - disabled on mobile automatically by viewport
  const heroY = useTransform(scrollY, [0, 1000], [0, 400]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 500], [1, 1.1]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD]">
        <div className="w-8 h-8 border-4 border-zinc-300 border-t-zinc-950 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!blog) {
    notFound();
  }

  return (
    <main ref={containerRef} className="min-h-screen bg-[#FDFDFD] text-neutral-800 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Reading Progress Indicator - Minimal Top Bar */}
      <motion.div
        className="fixed left-0 top-0 z-[100] h-1 bg-indigo-600 origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Hero Section with Parallax */}
      <section className="relative h-[60vh] md:h-[80vh] min-h-[400px] md:min-h-[600px] w-full overflow-hidden bg-zinc-100 flex items-end">
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ 
            y: mounted && !isMobile ? heroY : 0, 
            opacity: mounted && !isMobile ? heroOpacity : 1, 
            scale: mounted && !isMobile ? heroScale : 1 
          }}
        >
          <Image
            src="/Png1/about_2.webp"
            alt={blog.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 100vw"
            className="object-cover opacity-100"
          />
        </motion.div>

        {/* Title Block */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 md:px-8 pb-12 md:pb-20 lg:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center text-center space-y-4 md:space-y-8"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-zinc-900/10 text-zinc-900 backdrop-blur-md border border-zinc-900/20 text-xs md:text-sm font-bold tracking-widest uppercase">
              <BookOpen size={16} />
              {blog.category || "Workspace"}
            </span>

            <div className="relative px-6 py-4 md:px-12 md:py-8 rounded-3xl bg-white/40 backdrop-blur-md border border-white/60 shadow-[0_0_50px_rgba(255,255,255,0.8)]">
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-bold text-zinc-900 tracking-tighter leading-[1.1] max-w-5xl">
                {blog.title}
              </h1>
            </div>

            {/* Metadata section removed */}
          </motion.div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="relative z-20 bg-[#FDFDFD] rounded-t-[3rem] md:rounded-t-[4rem] -mt-10 md:-mt-16 pt-16 md:pt-24 pb-32 px-6 shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">
        <div className="max-w-7xl mx-auto">
          {/* Main Content */}
          <div className="space-y-12">
            {/* Specific Post Image */}
            <div className="relative w-full rounded-3xl overflow-hidden shadow-lg border border-neutral-100 bg-neutral-100 flex items-center justify-center p-2 md:p-4">
              <Image
                src={blog.thumbnail}
                alt={blog.title}
                width={1200}
                height={675}
                priority
                className="w-full h-auto max-h-[600px] object-contain rounded-2xl"
              />
            </div>

            {/* Introduction / Short Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute -left-6 md:-left-10 top-0 bottom-0 w-1 bg-indigo-500 rounded-full" />
              <p className="text-xl md:text-2xl leading-relaxed text-neutral-600 font-medium italic text-balance">
                "{blog.metaDescription}"
              </p>
            </motion.div>

            {/* Content Body (Jodit Editor Rich Text HTML) */}
            <article 
              className="w-full text-neutral-800 text-lg md:text-xl leading-relaxed"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />



          </div>
        </div>
      </section>
    </main>
  );
}