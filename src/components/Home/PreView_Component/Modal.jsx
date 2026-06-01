"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import gsap from "gsap";

const scaleAnimation = {
  initial: { scale: 0, x: "-50%", y: "-50%" },
  enter: {
    scale: 1,
    x: "-50%",
    y: "-50%",
    transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] },
  },
  closed: {
    scale: 0,
    x: "-50%",
    y: "-50%",
    transition: { duration: 0.4, ease: [0.32, 0, 0.67, 0] },
  },
};

export default function Modal({ modal, projects }) {
  const { active, index } = modal;
  
  const containerRef = useRef(null);

  useEffect(() => {
    // Ultra-smooth mouse tracking using GSAP quickTo for the modal card container
    const xToContainer = gsap.quickTo(containerRef.current, "left", {
      duration: 0.8,
      ease: "power3",
    });
    const yToContainer = gsap.quickTo(containerRef.current, "top", {
      duration: 0.8,
      ease: "power3",
    });

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      xToContainer(clientX);
      yToContainer(clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <motion.div
        ref={containerRef}
        variants={scaleAnimation}
        initial="initial"
        animate={active ? "enter" : "closed"}
        className="hidden md:flex w-[380px] h-[280px] fixed overflow-hidden pointer-events-none flex items-center justify-center bg-white z-[80] rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.1)] border border-zinc-100"
        style={{ left: "0px", top: "0px" }}
      >
        <div
          className="w-full h-full absolute transition-[top] duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
          style={{ top: index * -100 + "%" }}
        >
          {projects.map((project, idx) => {
            const { src } = project;
            return (
              <div
                className="w-full h-full flex items-center justify-center p-6 relative overflow-hidden bg-white"
                key={`modal_${idx}`}
              >
                <Image
                  src={src}
                  width={240}
                  height={240}
                  alt="chair preview"
                  className="object-contain max-h-[85%] w-auto transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            );
          })}
        </div>
      </motion.div>
    </>
  );
}
