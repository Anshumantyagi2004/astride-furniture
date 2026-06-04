"use client";
import {
  useMotionValueEvent,
  useScroll,
  useTransform,
  motion,
} from "motion/react";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({
  data,
  title,
  subtitle,
}: {
  data: TimelineEntry[];
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="w-full bg-white dark:bg-neutral-950 font-sans md:px-10 border-t border-b border-zinc-100"
      ref={containerRef}
    >
      <div className="max-w-4xl mx-auto py-20 px-4 md:px-8 lg:px-10 text-center flex flex-col items-center">
        {title ? (
          title
        ) : (
          <h2 className="text-lg md:text-4xl mb-4 text-black dark:text-white max-w-4xl">
            Changelog from my journey
          </h2>
        )}
        {subtitle ? (
          subtitle
        ) : (
          <p className="text-neutral-700 dark:text-neutral-300 text-sm md:text-base max-w-sm">
            I&apos;ve been working on Aceternity for the past 2 years. Here&apos;s
            a timeline of my journey.
          </p>
        )}
      </div>

      <div ref={ref} className="relative max-w-4xl mx-auto pb-20">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-10 md:pt-40 md:gap-10"
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-white dark:bg-zinc-950 flex items-center justify-center shadow-md border border-zinc-100 dark:border-zinc-850">
                <div className="h-3 w-3 rounded-full bg-zinc-900 dark:bg-zinc-100" />
              </div>
              <h3 
                className="hidden md:block text-xl md:pl-20 md:text-7xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter uppercase"
                style={{ fontFamily: 'Impact, "Arial Black", sans-serif' }}
              >
                {item.title}
              </h3>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <h3 
                className="md:hidden block text-4xl mb-4 text-left font-black text-zinc-900 dark:text-zinc-100 tracking-tighter uppercase"
                style={{ fontFamily: 'Impact, "Arial Black", sans-serif' }}
              >
                {item.title}
              </h3>
              {item.content}{" "}
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[4px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-zinc-200 via-zinc-300 to-zinc-200 [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[4px] bg-gradient-to-b from-black via-zinc-600 to-zinc-300 rounded-full"
          />
        </div>
      </div>
    </div>
  );
};
