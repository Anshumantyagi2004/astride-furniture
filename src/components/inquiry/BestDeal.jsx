"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";

import "swiper/css";

const deals = [
  {
    id: 1,
    name: "Ergo Chair",
    image: "/banner1.webp",
    price: "₹18,990",
    oldPrice: "₹29,990",
  },
  {
    id: 2,
    name: "Office Chair Pro",
    image: "/banner2.webp",
    price: "₹15,990",
    oldPrice: "₹24,990",
  },
  {
    id: 3,
    name: "Gaming Chair",
    image: "/banner3.webp",
    price: "₹12,990",
    oldPrice: "₹19,990",
  },
];

const BestDeal = () => {
  return (
    <div className="block md:hidden w-full px-4 py-4">
      <Swiper
        modules={[Autoplay]}
        slidesPerView={1}
        loop
        autoplay={{ delay: 2000, disableOnInteraction: false }}
        className="w-full"
      >
        {deals.map((deal) => (
          <SwiperSlide key={deal.id}>
            <Link href={`/products/${deal.id}`}>
              
              {/* CARD */}
              <div className="h-[420px] bg-white rounded-[14px] border-[2.5px] border-[#131313] shadow-[6px_6px_0_#131313] overflow-hidden flex flex-col">
                
                {/* IMAGE */}
                <div className="relative w-full h-[220px] border-b-[2.5px] border-[#131313]">
                  <Image
                    src={deal.image}
                    alt={deal.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* CONTENT */}
                <div className="p-4 flex flex-col gap-3">
                  <h3 className="text-[18px] font-extrabold text-[#111]">
                    {deal.name}
                  </h3>

                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-[#111]">
                      {deal.price}
                    </span>
                    <span className="text-sm line-through text-gray-500">
                      {deal.oldPrice}
                    </span>
                  </div>

                  <button className="mt-auto bg-[#DCF351] text-[#131313] font-black py-3 rounded-full border-[2px] border-[#131313] shadow-[4px_4px_0_#131313] active:translate-y-[2px]">
                    VIEW DEAL
                  </button>
                </div>
              </div>

            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BestDeal;