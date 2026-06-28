"use client";

import { use, useRef, useState, useEffect } from "react";
import { blogs } from "@/data/blog";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { 
  ArrowLeft, 
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
  const blog = blogs.find(
    (item) => item.slug === slug
  );
  const [isMobile, setIsMobile] = useState(false);

  if (!blog) {
    notFound();
  }

  useEffect(() => {
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
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const { scrollY } = useScroll();

  // Disable parallax on mobile for better performance
  const heroY = isMobile ? 0 : useTransform(scrollY, [0, 1000], [0, 400]);
  const heroOpacity = isMobile ? 1 : useTransform(scrollY, [0, 500], [1, 0]);
  const heroScale = isMobile ? 1 : useTransform(scrollY, [0, 500], [1, 1.1]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.shortContent,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Article link copied to clipboard!");
    }
  };

  const paragraphs = blog.longContent.trim().split("\n\n");
  const firstParagraph = paragraphs[0];
  const restParagraphs = paragraphs.slice(1);

  return (
    <main ref={containerRef} className="min-h-screen bg-[#FDFDFD] text-neutral-800 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Reading Progress Indicator - Minimal Top Bar */}
      <motion.div
        className="fixed left-0 top-0 z-[100] h-1 bg-indigo-600 origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Floating Back Navigation Header - Mobile optimized */}
      <motion.div 
        initial={{ opacity: 0, x: isMobile ? 0 : -20, y: isMobile ? 10 : 0 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: isMobile ? 0.3 : 0.5, duration: 0.5 }}
        className={`${isMobile ? 'fixed bottom-6 left-6 right-6 z-40' : 'fixed top-8 left-8 z-50'}`}
      >
        <Link 
          href="/blogs"
          className={`flex items-center gap-3 rounded-full bg-white/40 hover:bg-white/90 text-neutral-900 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-500 group border border-white/50 ${isMobile ? 'w-full justify-center py-4 px-6' : 'px-5 py-3'}`}
        >
          <div className="bg-neutral-900 text-white rounded-full p-1.5 transition-transform duration-300 group-hover:-translate-x-1">
            <ArrowLeft size={isMobile ? 20 : 16} strokeWidth={2.5} />
          </div>
          <span className={`font-bold tracking-widest uppercase ${isMobile ? 'text-base' : 'text-sm'}`}>Back</span>
        </Link>
      </motion.div>

      {/* Hero Section with Parallax */}
      <section className="relative h-[60vh] md:h-[80vh] min-h-[400px] md:min-h-[600px] w-full overflow-hidden bg-black flex items-end">
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y: isMobile ? 0 : heroY, opacity: isMobile ? 1 : heroOpacity, scale: isMobile ? 1 : heroScale }}
        >
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 100vw"
            className="object-cover opacity-100"
          />
          {/* Subtle bottom gradient only for text readability */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </motion.div>

        {/* Title Block */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 md:px-8 pb-12 md:pb-20 lg:pb-28">
          <motion.div
            initial={{ opacity: 0, y: isMobile ? 20 : 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: isMobile ? 0.6 : 0.8, delay: isMobile ? 0.1 : 0.2 }}
            className="flex flex-col items-center text-center space-y-4 md:space-y-8"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-white/10 text-white/90 backdrop-blur-md border border-white/20 text-xs md:text-sm font-bold tracking-widest uppercase">
              <BookOpen size={isMobile ? 14 : 16} />
              {blog.category}
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-black text-white tracking-tighter leading-[1.1] max-w-5xl">
              {blog.title}
            </h1>

            <div className="flex flex-col sm:flex-wrap sm:items-center sm:justify-center gap-3 sm:gap-x-8 sm:gap-y-4 text-white/70 text-xs sm:text-base md:text-lg font-medium pt-2 md:pt-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <User size={isMobile ? 12 : 16} className="text-white" />
                </div>
                <span className="text-white/90 text-sm md:text-base">{blog.author}</span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-white/30 hidden sm:block"></span>
              <div className="flex items-center gap-2">
                <Clock size={isMobile ? 14 : 18} />
                <span className="text-sm md:text-base">{blog.readTime} read</span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-white/30 hidden sm:block"></span>
              <div className="flex items-center gap-2">
                <Calendar size={isMobile ? 14 : 18} />
                <span className="text-sm md:text-base">{blog.date}</span>
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
                <button className="w-12 h-12 rounded-full bg-white border border-neutral-100 flex items-center justify-center text-neutral-600 hover:text-blue-500 hover:border-blue-200 hover:bg-blue-50 transition-all duration-300 shadow-sm hover:shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                </button>
                <button className="w-12 h-12 rounded-full bg-white border border-neutral-100 flex items-center justify-center text-neutral-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all duration-300 shadow-sm hover:shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </button>
                <button className="w-12 h-12 rounded-full bg-white border border-neutral-100 flex items-center justify-center text-neutral-600 hover:text-blue-700 hover:border-blue-200 hover:bg-blue-50 transition-all duration-300 shadow-sm hover:shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                </button>
              </div>
            </div>
          </div>

          {/* Center Content */}
          <div className="lg:col-span-8 space-y-12">
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
                "{blog.shortContent}"
              </p>
            </motion.div>

            {/* Content Body */}
            <div className="prose prose-lg md:prose-xl prose-neutral max-w-none space-y-10">
              {/* First paragraph with drop cap */}
              {firstParagraph && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8 }}
                  className="text-lg md:text-xl leading-loose text-neutral-700 first-letter:float-left first-letter:text-6xl first-letter:md:text-7xl first-letter:font-black first-letter:text-indigo-600 first-letter:mr-4 first-letter:mt-1 first-letter:leading-none text-justify"
                >
                  {firstParagraph}
                </motion.p>
              )}

              {/* Rest of the paragraphs */}
              {restParagraphs.map((paragraph, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8 }}
                  className="text-lg md:text-xl leading-loose text-neutral-700 text-justify"
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>

            {/* Bottom Meta & Tags */}
            <div className="pt-16 pb-8 border-t border-neutral-200/60 mt-16 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex flex-col gap-2 w-full md:w-auto">
                <span className="text-xs text-neutral-400 font-bold uppercase tracking-widest">Tagged In</span>
                <span className="inline-block px-4 py-2 bg-neutral-100 text-neutral-800 rounded-lg text-sm font-bold uppercase tracking-wider w-max hover:bg-neutral-200 transition-colors cursor-pointer">
                  {blog.category}
                </span>
              </div>

              {/* Mobile Share (Visible only on small screens) */}
              <div className="flex lg:hidden w-full md:w-auto items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                <span className="text-sm font-bold text-neutral-600 uppercase tracking-widest">Share:</span>
                <div className="flex items-center gap-2">
                  <button onClick={handleShare} className="p-2.5 rounded-full bg-white border border-neutral-200 text-neutral-600 hover:text-indigo-600">
                    <Share2 size={18} />
                  </button>
                  <button className="p-2.5 rounded-full bg-white border border-neutral-200 text-neutral-600 hover:text-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                  </button>
                  <button className="p-2.5 rounded-full bg-white border border-neutral-200 text-neutral-600 hover:text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Next Article Teaser / Author Bio Box */}
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
                <h3 className="text-2xl font-bold mb-3">{blog.author}</h3>
                <p className="text-white/60 text-base leading-relaxed">
                  A passionate writer exploring the realms of {blog.category.toLowerCase()} and modern trends. Capturing thoughts and sharing them with the world.
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </main>
  );
}