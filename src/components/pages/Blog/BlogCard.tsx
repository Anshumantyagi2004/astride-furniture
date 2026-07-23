import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useState, useEffect } from "react";

type BlogCardProps = {
  slug: string;
  image: string;
  title: string;
  shortContent: string;
  category: string;
  date: string;
  author: string;
  readTime: string;
};

export default function BlogCard({
  slug,
  image,
  title,
  shortContent,
  category,
  date,
  author,
  readTime,
}: BlogCardProps) {
  const [isMobile, setIsMobile] = useState(false);

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
  return (
    <Link href={`/blogs/${slug}`}>
      <article className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-[24px] md:rounded-[32px] bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
        <div className="relative h-[200px] md:h-[280px] overflow-hidden bg-neutral-200">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        </div>

        <div className="flex flex-1 flex-col p-5 md:p-7">
          <div className="mb-3 md:mb-4 flex flex-wrap items-center gap-2 text-xs md:text-sm text-neutral-500">
            <span className="line-clamp-1">{author}</span>
            <span>•</span>
            <span className="line-clamp-1">{date}</span>
          </div>

          <h3 className="line-clamp-2 text-lg md:text-2xl font-semibold leading-tight text-neutral-900">
            {title}
          </h3>

          <p className="mt-3 md:mt-4 line-clamp-2 md:line-clamp-3 flex-1 text-sm md:text-base text-neutral-600 leading-relaxed">
            {shortContent}
          </p>

          <div className="mt-6 md:mt-8 flex items-center justify-between border-t border-neutral-100 pt-4 md:pt-5">
            <span className="text-xs md:text-sm font-semibold tracking-wide text-neutral-900">
              Read Article
            </span>

            <div className="flex h-9 md:h-10 w-9 md:w-10 items-center justify-center rounded-full bg-neutral-100 transition-all duration-300 group-hover:bg-neutral-900 shrink-0">
              <ArrowUpRight
                size={isMobile ? 16 : 18}
                className="transition-all duration-300 group-hover:text-white"
              />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}