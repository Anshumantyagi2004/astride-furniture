import Image from "next/image";

const reviews = [
  {
    rating: 5,
    text: "I'm a professional gamer and Astride helped me upgrade my whole setup. The Monster chair made my space the coolest spot in the house.",
    name: "Rohit Pandit",
    role: "Gamer & Coder",
    avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop",
    cardBg: "bg-white",
    rotateClass: "md:rotate-[-1.6deg]",
  },
  {
    rating: 5,
    text: "Never knew a chair could be this comfortable. I'm glued to the screen 8–10 hours a day and the Vision makes work feel light. It's basically yoga for your back.",
    name: "Akshay Malhotra",
    role: "IT Professional",
    avatar: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=150&auto=format&fit=crop",
    cardBg: "bg-[#FDF1FA]",
    rotateClass: "md:rotate-[1.4deg]",
  },
  {
    rating: 5,
    text: "Exactly what my editing setup needed. Hours on a normal chair were wrecking my health and focus. Got the Beast — beastmode has been ON ever since.",
    name: "Meghna Chadha",
    role: "Video Editor",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop",
    cardBg: "bg-[#F4F0FF]",
    rotateClass: "md:rotate-[-0.8deg]",
  },
];

export default function Reviews_New() {
  return (
    <section
      className="w-full py-16 md:py-24 px-5 md:px-8 lg:px-16 relative overflow-hidden"
      style={{
        backgroundColor: "#F5EFE6",
        backgroundImage:
          "linear-gradient(#d6c9b8 1px, transparent 1px), linear-gradient(90deg, #d6c9b8 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }}
    >
      <div className="max-w-[1200px] mx-auto">
        
        {/* Section Head */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#7C3AED] bg-[#EDE9FE] border border-[#DDD6FE] rounded-full mb-4">
            No cap, just reviews
          </span>
          <h2 className="text-4xl md:text-6xl font-sans font-black tracking-tight mb-4 uppercase text-[#131313]">
            Loved by <span className="bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] bg-clip-text text-transparent">professionals.</span>
          </h2>
          <p className="text-zinc-600 text-lg md:text-xl font-medium tracking-wide">
            Gamers, devs, and creators who upgraded their setup with Astride comfort.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          {reviews.map((review, i) => (
            <div
              key={i}
              className={`relative ${review.cardBg} border-[2.5px] border-[#131313] px-7 py-7 pb-8 rounded-lg transition-transform duration-300 hover:rotate-0 hover:scale-[1.02] ${review.rotateClass}`}
              style={{
                boxShadow: "6px 6px 0px #131313",
              }}
            >
              {/* Tape deco */}
              <div
                className="absolute -top-[13px] left-1/2 -translate-x-1/2 w-24 h-6 rounded-[3px]"
                style={{
                  backgroundColor: "rgba(220, 243, 81, 0.85)",
                  boxShadow: "0 2px 4px rgba(19, 19, 19, 0.12)",
                  transform: "translateX(-50%) rotate(-2deg)",
                }}
              />

              {/* Quote Mark */}
              <span className="font-serif text-5xl font-black text-[#EC4899] leading-none block mt-4 mb-1">
                "
              </span>

              {/* Review Text */}
              <p className="text-[14.5px] text-[#333333] leading-relaxed mb-6 font-medium">
                {review.text}
              </p>

              {/* Reviewer Info */}
              <div className="flex items-center gap-3 pt-2 border-t border-[#131313]/10">
                {/* Avatar */}
                <div className="relative w-12 h-12 shrink-0 rounded-full border-[2.5px] border-[#131313] overflow-hidden">
                  <Image
                    src={review.avatar}
                    alt={review.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <b className="block text-[14px] text-[#131313] font-black">{review.name}</b>
                  <span className="block text-[12px] text-zinc-500 font-semibold">{review.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Proof bottom line */}
        <p className="text-center mt-16 font-bold text-[#131313] text-lg">
          500+ verified reviews — <span className="bg-gradient-to-r from-[#EC4899] to-[#F97316] bg-clip-text text-transparent font-serif italic text-2xl font-black ml-1">real people, real comfort ♥</span>
        </p>

      </div>
    </section>
  );
}
