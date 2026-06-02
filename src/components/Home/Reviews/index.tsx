"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Review {
  id: number;
  name: string;
  role: string;
  text: string;
  avatar: string;
  rating: number;
}

const REVIEWS: Review[] = [
  {
    id: 1,
    name: "Rohit Pandit",
    role: "Gamer and Coder",
    text: "I am a professional gamer and Greensoul helped me upgrade my gaming setup. Their super cool surface table and Monster chair has made my space the most coolest spot in my house.",
    avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop",
    rating: 5,
  },
  {
    id: 2,
    name: "Akshay Malhotra",
    role: "IT Professional",
    text: "Never in my life I knew that a chair can be so comfortable. I have a WFH job and glued to the screen atleast 8-10 hour a day. The Vision has it so much easier for me to feel comfortable and light at work. It is actually yoga for back.",
    avatar: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=150&auto=format&fit=crop",
    rating: 5,
  },
  {
    id: 3,
    name: "Meghna Chadha",
    role: "Video Editor",
    text: "This is what my video editing setup needed. Hours of editing on a normal chair was affecting my work, health and activeness. Got the Beast and my beastmode has been turned on ever since. Thank you GreenSoul for such an amazing product.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop",
    rating: 5,
  },
];

export default function Reviews() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title entrance
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current.children,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      if (cardsRef.current) {
        const cards = Array.from(cardsRef.current.children);

        // Cards slide in
        gsap.fromTo(
          cards,
          { opacity: 0, y: 50, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            stagger: 0.13,
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );

        // 3D tilt on hover
        cards.forEach((card) => {
          const inner = card.querySelector(".card-inner");
          if (!inner) return;

          const handleMouseMove = (e: Event) => {
            const mouseEvent = e as MouseEvent;
            const rect = (card as HTMLElement).getBoundingClientRect();
            const x = mouseEvent.clientX - rect.left - rect.width / 2;
            const y = mouseEvent.clientY - rect.top - rect.height / 2;
            const rotateX = -(y / (rect.height / 2)) * 8;
            const rotateY = (x / (rect.width / 2)) * 8;

            gsap.to(inner, {
              rotationX: rotateX,
              rotationY: rotateY,
              scale: 1.02,
              boxShadow: "0 24px 60px rgba(28,43,74,0.12), 0 4px 16px rgba(28,43,74,0.06)",
              transformPerspective: 1000,
              ease: "power2.out",
              duration: 0.3,
              overwrite: "auto",
            });
          };

          const handleMouseLeave = () => {
            gsap.to(inner, {
              rotationX: 0,
              rotationY: 0,
              scale: 1,
              boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
              ease: "power3.out",
              duration: 0.5,
              overwrite: "auto",
            });
          };

          card.addEventListener("mousemove", handleMouseMove);
          card.addEventListener("mouseleave", handleMouseLeave);
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#F4F4F6] overflow-hidden border-t border-b border-slate-200 flex flex-col justify-center relative py-10"
    >
      {/* Soft background blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[400px] bg-slate-300/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-blue-100/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 w-full flex flex-col gap-10 relative z-10">

        {/* ── Title ── */}
        <div ref={titleRef} className="text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.05]">
            Loved by{" "}
            <span className="bg-gradient-to-r from-slate-600 to-slate-500 bg-clip-text text-transparent">
              Professionals
            </span>
          </h2>
          <p className="mt-3 text-slate-500 max-w-lg mx-auto text-sm leading-relaxed">
            Hear from gamers, developers, and creators who upgraded their setup with Astride premium comfort.
          </p>
        </div>

        {/* ── Cards Grid ── */}
        <div
          ref={cardsRef}
          className="flex overflow-x-auto gap-4 pb-4 scrollbar-none snap-x snap-mandatory md:grid md:grid-cols-3 md:gap-5 md:pb-0 md:overflow-visible items-stretch"
          style={{ transformStyle: "preserve-3d" }}
        >
          {REVIEWS.map((review) => (
            <div
              key={review.id}
              className="relative group cursor-pointer w-[85vw] max-w-[320px] md:w-auto md:max-w-none snap-start flex-shrink-0"
              style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
            >
              <div
                className="card-inner relative flex flex-col gap-5 rounded-2xl p-7 h-full overflow-hidden transition-all duration-300 whitespace-normal"
                style={{
                  background: "linear-gradient(145deg, #ffffff 0%, #f8f8fa 100%)",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.04)",
                  border: "1px solid rgba(203,213,225,0.6)",
                }}
              >
                {/* Top glassy highlight */}
                <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent" />

                {/* Left accent bar */}
                <div className="absolute left-0 top-8 bottom-8 w-[3px] rounded-r-full bg-gradient-to-b from-slate-300 via-slate-400 to-slate-200 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Giant decorative quote mark */}
                <div className="absolute top-4 right-5 text-[80px] font-black leading-none text-slate-100 select-none pointer-events-none font-serif">
                  "
                </div>

                {/* ── Top row: avatar + name + stars ── */}
                <div className="flex items-center gap-4 relative z-10">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 shadow-sm ring-2 ring-slate-100">
                    <div className="relative w-full h-full">
                      <Image
                        src={review.avatar}
                        alt={review.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  </div>
                  {/* Name + role + stars */}
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="font-extrabold text-slate-900 text-sm tracking-tight leading-none">
                      {review.name}
                    </span>
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                      {review.role}
                    </span>
                    <div className="flex items-center gap-0.5 mt-1">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star
                          key={i}
                          size={11}
                          fill="#94a3b8"
                          stroke="#94a3b8"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 relative z-10" />

                {/* Review text */}
                <p className="text-slate-500 text-[13px] leading-[1.75] font-medium relative z-10 flex-1 whitespace-normal">
                  "{review.text}"
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom trust bar */}
        <div className="flex items-center justify-center gap-6 pt-2">
          <div className="h-px flex-1 max-w-[80px] bg-slate-200" />
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
            500+ verified reviews
          </span>
          <div className="h-px flex-1 max-w-[80px] bg-slate-200" />
        </div>

      </div>
    </section>
  );
}
