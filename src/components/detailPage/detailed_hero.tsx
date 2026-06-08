import Image from "next/image";

const DetailedHero = () => {
  return (
    <section className="py-12 bg-[#f8f8f8]">
      <div className="w-full px-8 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* First Banner */}
          <div className="group relative h-[340px] overflow-hidden rounded-[28px] shadow-md">
            <Image
              src="/Png/main_1.webp"
              alt="Astride Comfort"
              fill
              className="object-cover"
            />

            {/* Shine Effect */}
            <div
              className="
                absolute
                inset-0
                -translate-x-full
                bg-gradient-to-r
                from-transparent
                via-white/30
                to-transparent
                transition-transform
                duration-1000
                ease-out
                group-hover:translate-x-full
              "
            />
          </div>

          {/* Second Banner */}
          <div className="group relative h-[340px] overflow-hidden rounded-[28px] shadow-md">
            <Image
              src="/Png/main_2.webp"
              alt="Astride Warranty"
              fill
              className="object-cover"
            />

            {/* Shine Effect */}
            <div
              className="
                absolute
                inset-0
                -translate-x-full
                bg-gradient-to-r
                from-transparent
                via-white/30
                to-transparent
                transition-transform
                duration-1000
                ease-out
                group-hover:translate-x-full
              "
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default DetailedHero;