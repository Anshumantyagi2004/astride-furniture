import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

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
  return (
    <Link href={`/blogs/${slug}`}>
      <article className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-[32px] bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
        <div className="relative h-[280px] overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition duration-700 group-hover:scale-110"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          <div className="absolute left-5 top-5 rounded-full bg-white/15 px-4 py-2 text-xs text-white backdrop-blur-md">
            {date}
          </div>

          <div className="absolute bottom-5 left-5">
            <span className="rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-800">
              {category}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-7">
          <div className="mb-4 flex items-center gap-2 text-sm text-neutral-500">
            <span>{author}</span>
            <span>•</span>
            <span>{readTime}</span>
          </div>

          <h3 className="line-clamp-2 text-2xl font-semibold leading-tight text-neutral-900">
            {title}
          </h3>

          <p className="mt-4 line-clamp-3 flex-1 text-neutral-600 leading-relaxed">
            {shortContent}
          </p>

          <div className="mt-8 flex items-center justify-between border-t border-neutral-100 pt-5">
            <span className="text-sm font-semibold tracking-wide text-neutral-900">
              Read Article
            </span>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 transition-all duration-300 group-hover:bg-neutral-900">
              <ArrowUpRight
                size={18}
                className="transition-all duration-300 group-hover:text-white"
              />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}