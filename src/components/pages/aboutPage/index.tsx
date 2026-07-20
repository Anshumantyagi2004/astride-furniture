 'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { useScroll, useTransform, motion } from 'framer-motion';
import { Timeline } from '@/components/ui/timeline';
import bannerImage from './about_image.png';

const stats = [
  { value: '2015', label: 'Founded' },
  { value: '50K+', label: 'Happy Customers' },
  { value: '12+', label: 'Countries Served' },
  { value: '40+', label: 'Products Designed' },
];

const values = [
  {
    icon: '◈',
    title: 'Precision Engineering',
    desc: 'Every joint, curve, and material is chosen with obsessive attention to detail. We believe that form and function are never at odds — they are one.',
  },
  {
    icon: '◉',
    title: 'Human-Centered Design',
    desc: 'Our team of ergonomics experts and industrial designers collaborate with real people to solve real pain points — not just create beautiful objects.',
  },
  {
    icon: '◎',
    title: 'Durability First',
    desc: 'We engineer products to last a decade, not a season. Every Astride chair undergoes rigorous stress-testing far beyond industry benchmarks.',
  },
  {
    icon: '◇',
    title: 'Responsible Materials',
    desc: 'From our elastomeric mesh to our die-cast bases, we source responsibly and are constantly improving our environmental footprint.',
  },
];

const team = [
  { name: 'Ravi Sethi', role: 'Founder & Chief Designer', img: '/Png1/img1 (1).webp' },
  { name: 'Priya Mehta', role: 'Head of Ergonomics Research', img: '/Png1/chair12_ErgoFit.webp' },
  { name: 'Anshuman Tyagi', role: 'Engineering Lead', img: '/Png1/chair11_octave.webp' },
];

function ParallaxSection() {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['-10vh', '10vh']);

  return (
    <div
      ref={container}
      className="relative flex items-center justify-center h-[35vh] md:h-[80vh] lg:h-[85vh] overflow-hidden"
      style={{ clipPath: 'polygon(0% 0, 100% 0%, 100% 100%, 0 100%)' }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* Fixed parallax image */}
      <div className="fixed top-[-10vh] left-0 h-[120vh] w-full">
        <motion.div style={{ y }} className="relative w-full h-full">
          <Image
            src={bannerImage}
            alt="Astride Chairs"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </motion.div>
      </div>
    </div>
  );
}

export default function AboutPage() {
  const heroContainer = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroContainer,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(heroProgress, [0, 1], ['0vh', '40vh']);
  

  return (
    <main className="bg-[#F8F9FA] text-[#161316]" style={{ fontFamily: '"Inter", sans-serif' }}>

      {/* ── HERO ── */}
      <div ref={heroContainer} className="h-[50vh] overflow-hidden relative">
        <motion.div style={{ y: heroY }} className="relative w-full h-full">
          <Image
            src={bannerImage}
            alt="Astride About Hero"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
            priority
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-black/80 z-10" />
        </motion.div>

        {/* Hero text */}
        <div className="absolute inset-0 flex flex-col items-center justify-start pt-24 md:pt-40 text-center z-20 px-6">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="text-white text-5xl sm:text-7xl lg:text-8xl font-extrabold uppercase leading-none tracking-tight font-sans"
          >
            About Us
          </motion.h1>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        >
          <span className="text-zinc-400 text-[10px] uppercase tracking-[0.25em]">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-white/60 to-transparent" />
        </motion.div>
      </div>

      {/* ── INTRO COPY ── */}
      <section className="max-w-5xl mx-auto px-6 py-6 md:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.3em] mb-4">Who We Are</p>
            <h2 className="text-5xl sm:text-6xl font-extrabold uppercase leading-[0.9] tracking-tight mb-0">
              <span className="block text-[#161316]">MADE FOR</span>
              <span className="block text-transparent [-webkit-text-stroke:2px_#18181b]">MAKERS</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <p className="text-zinc-600 text-base sm:text-lg leading-relaxed mb-5">
              Astride was born in a small workshop in New Delhi in 2015. We were tired of choosing between chairs that looked good and chairs that felt good. So we built our own.
            </p>
            <p className="text-zinc-600 text-base sm:text-lg leading-relaxed">
              Today, we're a team of engineers, designers, and ergonomics researchers united by one belief: the best chair is one you stop thinking about — because it simply disappears beneath you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-[#161316] py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <p className="text-white text-5xl sm:text-6xl font-extrabold uppercase leading-none tracking-tighter">{stat.value}</p>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] mt-3">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── PARALLAX MID-BANNER ── */}
      <ParallaxSection />



      {/* ── TIMELINE ── */}
      <Timeline
        title={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.3em] mb-4">Our Journey</p>
            <h2
              className="text-5xl sm:text-6xl font-extrabold uppercase leading-[0.9] tracking-tight"
            >
              <span className="block text-[#161316]">THE STORY</span>
              <span className="block text-transparent [-webkit-text-stroke:2px_#18181b]">SO FAR</span>
            </h2>
          </motion.div>
        }
        subtitle={<div className="h-4" />}
        data={[
          {
            title: "2015",
            content: (
              <div className="space-y-4">
                <h4 className="text-2xl sm:text-3xl font-bold text-zinc-900 uppercase tracking-tight">The Workshop Begins</h4>
                <p className="text-zinc-600 text-base md:text-lg leading-relaxed max-w-xl font-light">
                  Founded in New Delhi with a single prototype and a dream of redefining the workspace chair. Our journey started in a tiny workshop with one mission: zero compromises on back health.
                </p>
              </div>
            ),
          },
          {
            title: "2020",
            content: (
              <div className="space-y-4">
                <h4 className="text-2xl sm:text-3xl font-bold text-zinc-900 uppercase tracking-tight">First Product Launch</h4>
                <p className="text-zinc-600 text-base md:text-lg leading-relaxed max-w-xl font-light">
                  Astride Ace hits the market and sells out within 3 weeks. The waitlist begins. This marked our evolution from custom prototypes to scaling a revolutionary product.
                </p>
              </div>
            ),
          },
          {
            title: "2021",
            content: (
              <div className="space-y-4">
                <h4 className="text-2xl sm:text-3xl font-bold text-zinc-900 uppercase tracking-tight">Pan-India Distribution</h4>
                <p className="text-zinc-600 text-base md:text-lg leading-relaxed max-w-xl font-light">
                  Expanded to 40+ cities, partnered with leading e-commerce platforms, crossed 10,000 units sold. Delivering ergonomics comfort across the nation.
                </p>
              </div>
            ),
          },
          {
            title: "2023",
            content: (
              <div className="space-y-4">
                <h4 className="text-2xl sm:text-3xl font-bold text-zinc-900 uppercase tracking-tight">International Expansion</h4>
                <p className="text-zinc-600 text-base md:text-lg leading-relaxed max-w-xl font-light">
                  Launched in many other states. Our ergonomic standards surpass European benchmarks, making comfort global.
                </p>
              </div>
            ),
          },
          {
            title: "2025",
            content: (
              <div className="space-y-4">
                <h4 className="text-2xl sm:text-3xl font-bold text-zinc-900 uppercase tracking-tight">Astride 2.0</h4>
                <p className="text-zinc-600 text-base md:text-lg leading-relaxed max-w-xl font-light">
                  Introduced our next-gen mesh technology and smart posture tracking features. 50K+ happy customers and growing.
                </p>
              </div>
            ),
          },
        ]}
      />

      {/* ── CTA ── */}
      <section className="relative py-16 md:py-28 px-6 text-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/Png1/about_2.jpeg"
            alt="Find Your Perfect Seat Background"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-zinc-200 text-xs font-bold uppercase tracking-[0.3em] mb-6">Ready?</p>
          <h2
            className="text-white text-5xl sm:text-7xl lg:text-8xl font-extrabold uppercase leading-none tracking-tight mb-8"
          >
            Find Your<br />
            <span className="text-transparent [-webkit-text-stroke:2px_white]">Perfect Seat</span>
          </h2>
          <p className="text-zinc-100 text-base max-w-lg mx-auto mb-10 leading-relaxed">
            Explore our full collection of premium ergonomic chairs — each one engineered to make your day better.
          </p>
          <a
            href="/products"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-[#161316] font-bold uppercase tracking-widest text-sm rounded-full hover:bg-zinc-100 transition-colors duration-300 shadow-xl"
          >
            Shop All Chairs
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </motion.div>
      </section>

    </main>
  );
}
