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
  Calendar, 
  Clock, 
  User, 
  Share2, 
  BookOpen,
  Link as LinkIcon
} from "lucide-react";
import toast from "react-hot-toast";

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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.metaDescription || blog.title,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Article link copied to clipboard!");
    }
  };

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

            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-black text-zinc-900 tracking-tighter leading-[1.1] max-w-5xl">
              {blog.title}
            </h1>

            <div className="flex flex-col sm:flex-wrap sm:items-center sm:justify-center gap-3 sm:gap-x-8 sm:gap-y-4 text-zinc-700 text-xs sm:text-base md:text-lg font-medium pt-2 md:pt-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-zinc-900/10 flex items-center justify-center">
                  <User size={16} className="text-zinc-800" />
                </div>
                <span className="text-zinc-900 font-semibold text-sm md:text-base">{blog.author || "Astride Team"}</span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 hidden sm:block"></span>
              <div className="flex items-center gap-2 text-zinc-800 font-semibold">
                <Clock size={18} />
                <span className="text-sm md:text-base">{blog.readTime ? (blog.readTime.includes("read") ? blog.readTime : `${blog.readTime} read`) : "5 min read"}</span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 hidden sm:block"></span>
              <div className="flex items-center gap-2 text-zinc-800 font-semibold">
                <Calendar size={18} />
                <span className="text-sm md:text-base">
                  {new Date(blog.date || blog.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="relative z-20 bg-[#FDFDFD] rounded-t-[3rem] md:rounded-t-[4rem] -mt-10 md:-mt-16 pt-16 md:pt-24 pb-32 px-6 shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* Left Sidebar - Social Share (Sticky) */}
          <div className="hidden lg:block lg:col-span-2">
            <div className="sticky top-32 flex flex-col gap-6">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest pl-2">Share</span>
              <div className="flex flex-col gap-3">
                <button onClick={handleShare} className="w-12 h-12 rounded-full bg-white border border-neutral-100 flex items-center justify-center text-neutral-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all duration-300 shadow-sm hover:shadow-md">
                  <LinkIcon size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Center Content */}
          <div className="lg:col-span-8 space-y-12">
            {/* Specific Post Image */}
            <div className="relative w-full h-[300px] md:h-[500px] rounded-3xl overflow-hidden shadow-lg border border-neutral-100">
              <Image
                src={blog.thumbnail}
                alt={blog.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 100vw"
                className="object-cover"
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
              className="prose prose-neutral max-w-none text-lg md:text-xl leading-relaxed space-y-6"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Bottom Meta & Tags */}
            <div className="pt-16 pb-8 border-t border-neutral-200/60 mt-16 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex flex-col gap-2 w-full md:w-auto">
                <span className="text-xs text-neutral-400 font-bold uppercase tracking-widest">Tagged In</span>
                <span className="inline-block px-4 py-2 bg-neutral-100 text-neutral-800 rounded-lg text-sm font-bold uppercase tracking-wider w-max hover:bg-neutral-200 transition-colors cursor-pointer">
                  {blog.category || "Workspace"}
                </span>
              </div>

              {/* Mobile Share (Visible only on small screens) */}
              <div className="flex lg:hidden w-full md:w-auto items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                <span className="text-sm font-bold text-neutral-600 uppercase tracking-widest">Share:</span>
                <div className="flex items-center gap-2">
                  <button onClick={handleShare} className="p-2.5 rounded-full bg-white border border-neutral-200 text-neutral-600 hover:text-indigo-600">
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Author Bio Box */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-neutral-900 rounded-[2rem] p-8 md:p-10 text-white flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/30 transition-all duration-700" />
              
              <div className="w-24 h-24 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                <User size={40} className="text-white/80" />
              </div>
              <div className="flex-1 text-center md:text-left z-10">
                <h4 className="text-sm font-bold text-indigo-300 uppercase tracking-widest mb-2">Written By</h4>
                <h3 className="text-2xl font-bold mb-3">{blog.author || "Astride Team"}</h3>
                <p className="text-white/60 text-base leading-relaxed">
                  A passionate writer exploring the realms of {(blog.category || "workspace").toLowerCase()} and modern trends. Capturing thoughts and sharing them with the world.
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </main>
  );
}