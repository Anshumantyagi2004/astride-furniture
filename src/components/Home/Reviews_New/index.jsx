import Image from "next/image";

const reviews = [
  {
    rating: 5,
    text: "I'm a professional gamer and this chair upgraded my whole setup. Twelve-hour sessions and my back doesn't even file a complaint anymore.",
    name: "Rohit Pandit",
    role: "Gamer & Coder",
    avatarBg: "from-[#6D28D9] via-[#7C3AED] to-[#4C1D95]",
    initials: "RP",
    cardBg: "bg-white",
  },
  {
    rating: 5,
    text: "WFH, glued to the screen 8–10 hours a day. The dynamic lumbar genuinely moves with you — it's basically yoga for your back.",
    name: "Akshay Malhotra",
    role: "IT Professional",
    avatarBg: "from-[#1E3A5F] via-[#2563EB] to-[#1E40AF]",
    initials: "AM",
    cardBg: "bg-white",
  },
  {
    rating: 4,
    halfStar: true,
    text: "Exactly what my editing setup needed. Assembly took 12 minutes flat, and the mesh stays cool through marathon render days. Beastmode: ON.",
    name: "Meghna Chadha",
    role: "Video Editor",
    avatarBg: "from-[#312E81] via-[#4338CA] to-[#3730A3]",
    initials: "MC",
    cardBg: "bg-[#F5F3FF]",
  },
];

function Stars({ count, halfStar = false }) {
  return (
    <div className="flex items-center gap-[2px]">
      {Array.from({ length: 5 }).map((_, i) => {
        if (i < count) {
          return <span key={i} className="text-[20px] text-[#F97316]">★</span>;
        } else if (i === count && halfStar) {
          return <span key={i} className="text-[20px] text-[#D1D5DB]">✩</span>;
        } else {
          return <span key={i} className="text-[20px] text-[#D1D5DB]">★</span>;
        }
      })}
    </div>
  );
}

export default function Reviews_New() {
  return (
    <section
      className="w-full py-16 md:py-20 px-5 md:px-8 lg:px-16"
      style={{
        backgroundColor: "#F5EFE6",
        backgroundImage:
          "linear-gradient(#d6c9b8 1px, transparent 1px), linear-gradient(90deg, #d6c9b8 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }}
    >
      <div className="max-w-[1200px] mx-auto">

        {/* Badge */}
        <div className="inline-block mb-5 rounded-md bg-[#DDD6FE] px-3 py-[5px] text-[11px] font-black uppercase tracking-[0.14em] text-[#5B21B6] border border-[#C4B5FD]">
          No cap, just reviews
        </div>

        {/* Heading */}
        <h2 className="font-black uppercase leading-[1.0] tracking-[-0.02em] mb-6 text-[42px] md:text-[60px] lg:text-[72px]">
          <span className="text-[#131313]">The People </span>
          <span
            style={{
              background: "linear-gradient(90deg, #8B5CF6, #A855F7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Have{" "}
          </span>
          <span
            style={{
              background: "linear-gradient(90deg, #EC4899, #F97316)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Spoken.
          </span>
        </h2>

        {/* Rating Summary */}
        <div className="flex items-center gap-4 mb-14">
          <span className="text-[56px] md:text-[68px] font-black text-[#131313] leading-none">4.8</span>
          <div className="flex flex-col gap-[5px]">
            <div className="flex items-center gap-[3px]">
              {[1,2,3,4,5].map((i) => (
                <span key={i} className="text-[22px] text-[#F97316]">★</span>
              ))}
            </div>
            <span className="text-[13px] text-[#6B7280] font-medium">512 verified reviews</span>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {reviews.map((review, i) => (
            <div
              key={i}
              className={`relative ${review.cardBg} rounded-[18px] border-[2.5px] border-[#131313] px-6 py-6 pt-8 flex flex-col gap-4`}
              style={{ boxShadow: "5px 5px 0px #131313" }}
            >
              {/* Tape decoration */}
              <div
                className="absolute -top-[11px] left-1/2 -translate-x-1/2 w-[60px] h-[20px] rounded-[4px]"
                style={{ backgroundColor: "#C8F135", transform: "translateX(-50%) rotate(-1.5deg)", opacity: 0.95 }}
              />

              {/* Stars */}
              <Stars count={review.rating} halfStar={review.halfStar} />

              {/* Review text */}
              <p className="text-[14px] md:text-[14.5px] text-[#1F2937] leading-[1.7] flex-1">
                {review.text}
              </p>

              {/* Reviewer */}
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-3">
                  {/* Avatar — dark gradient circle mimicking a real photo */}
                  <div
                    className={`w-11 h-11 rounded-full bg-gradient-to-br ${review.avatarBg} flex items-center justify-center text-white font-black text-[13px] shrink-0 border-2 border-white shadow-md`}
                  >
                    {review.initials}
                  </div>
                  <div>
                    <p className="text-[13.5px] font-black text-[#131313] leading-tight">{review.name}</p>
                    <p className="text-[11.5px] text-[#6B7280] mt-[1px]">{review.role}</p>
                  </div>
                </div>

                {/* Verified badge */}
                <span
                  className="text-[9px] font-black uppercase tracking-[0.1em] px-[9px] py-[5px] rounded-[5px] border-[1.5px] border-[#131313]"
                  style={{ backgroundColor: "#C8F135", color: "#131313" }}
                >
                  Verified
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
