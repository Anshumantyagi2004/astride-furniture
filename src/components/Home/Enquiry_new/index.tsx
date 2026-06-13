"use client";

import { useState } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

export default function Enquiry_New() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          companyName,
          quantity,
          email,
          phone,
          location,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
      } else {
        setErrorMsg(data.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="bulk"
      className="overflow-hidden bg-[#131313] py-[32px] md:py-[40px] lg:py-[48px] text-white"
    >
      <div className="mx-auto max-w-[1440px] px-5 md:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* LEFT */}
          <div>
            <span
              className={`inline-block rounded-md px-4 py-[6px] text-[11px] font-black uppercase tracking-[0.15em] text-white ${sans.className}`}
              style={{ background: "linear-gradient(90deg, #EC4899, #F97316)" }}
            >
              Corporate enquiry
            </span>

            <h2 className="mt-5 text-[40px] font-black uppercase leading-[1.0] tracking-[-0.02em] md:text-[54px] lg:text-[68px]">
              Outfit Your<br />Entire{" "}
              <span className={`${sans.className} bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] bg-clip-text text-transparent font-extrabold`}>
                Workspace.
              </span>
            </h2>

            <p className={`mt-5 max-w-[460px] text-[16px] font-medium leading-7 text-[#BDBDBD] ${sans.className}`}>
              Bulk pricing, white-glove delivery, and a dedicated
              account manager — tailored for offices of every scale.
              500+ companies across India already rep the seat.
            </p>

            <ul className={`mt-10 space-y-5 ${sans.className}`}>
              {/* 1 */}
              <li className="flex gap-4">
                <div className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl border border-[#3A3A3A] bg-[#222]">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#DCF351"
                    strokeWidth="2"
                    className="h-6 w-6"
                  >
                    <path
                      d="M12 2v20M7 7h7.5a3 3 0 0 1 0 6H8.5a3 3 0 0 0 0 6H17"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <div>
                  <b className="block text-[15px] font-black text-white">
                    Bulk pricing
                  </b>
                  <span className="text-[13px] text-[#9C9C9C]">
                    Exclusive rates for 5+ units
                  </span>
                </div>
              </li>

              {/* 2 */}
              <li className="flex gap-4">
                <div className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl border border-[#3A3A3A] bg-[#222]">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#EC4899"
                    strokeWidth="2"
                    className="h-6 w-6"
                  >
                    <circle cx="12" cy="8" r="4" />

                    <path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" />
                  </svg>
                </div>

                <div>
                  <b className="block text-[15px] font-black text-white">
                    Dedicated manager
                  </b>
                  <span className="text-[13px] text-[#9C9C9C]">
                    Personal account support
                  </span>
                </div>
              </li>

              {/* 3 */}
              <li className="flex gap-4">
                <div className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl border border-[#3A3A3A] bg-[#222]">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#A855F7"
                    strokeWidth="2"
                    className="h-6 w-6"
                  >
                    <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" />

                    <circle cx="7" cy="18" r="1.8" />

                    <circle cx="17" cy="18" r="1.8" />
                  </svg>
                </div>

                <div>
                  <b className="block text-[15px] font-black text-white">
                    Priority delivery
                  </b>
                  <span className="text-[13px] text-[#9C9C9C]">
                    White-glove installation
                  </span>
                </div>
              </li>
            </ul>
          </div>

          {/* RIGHT */}
          <div className={sans.className}>
            {!submitted ? (
              <form
                onSubmit={handleSubmit}
                className="rotate-[0.8deg] rounded-[28px] bg-white p-7 text-[#131313] shadow-[10px_10px_0_#8B5CF6] md:p-10"
              >
                <h3 className="text-[26px] font-black uppercase tracking-tight font-forum">
                  Let&apos;s Talk Chairs
                </h3>

                <p className="mb-5 mt-1 text-xs text-[#888] font-medium">
                  Fields marked * are required.
                </p>

                {errorMsg && (
                  <p className="mb-4 text-xs font-bold text-red-500 uppercase tracking-wide">
                    ⚠️ {errorMsg}
                  </p>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#131313]">
                      Full name*
                    </label>

                    <input
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-[10px] border-2 border-[#131313] px-4 py-[13px] text-sm font-semibold outline-none transition focus:border-[#8B5CF6] focus:shadow-[3px_3px_0_#8B5CF6]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#131313]">
                      Company*
                    </label>

                    <input
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full rounded-[10px] border-2 border-[#131313] px-4 py-[13px] text-sm font-semibold outline-none transition focus:border-[#8B5CF6] focus:shadow-[3px_3px_0_#8B5CF6]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#131313]">
                      No. of chairs*
                    </label>

                    <input
                      type="number"
                      min="1"
                      required
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full rounded-[10px] border-2 border-[#131313] px-4 py-[13px] text-sm font-semibold outline-none transition focus:border-[#8B5CF6] focus:shadow-[3px_3px_0_#8B5CF6]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#131313]">
                      Official email*
                    </label>

                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-[10px] border-2 border-[#131313] px-4 py-[13px] text-sm font-semibold outline-none transition focus:border-[#8B5CF6] focus:shadow-[3px_3px_0_#8B5CF6]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#131313]">
                      Phone (optional)
                    </label>

                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-[10px] border-2 border-[#131313] px-4 py-[13px] text-sm font-semibold outline-none transition focus:border-[#8B5CF6] focus:shadow-[3px_3px_0_#8B5CF6]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#131313]">
                      Your location*
                    </label>

                    <input
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full rounded-[10px] border-2 border-[#131313] px-4 py-[13px] text-sm font-semibold outline-none transition focus:border-[#8B5CF6] focus:shadow-[3px_3px_0_#8B5CF6]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#131313] px-7 py-[15px] font-extrabold uppercase tracking-[0.1em] text-[13px] text-white transition duration-300 hover:-translate-y-1 hover:bg-[#1F1F1F] hover:shadow-xl cursor-pointer disabled:bg-neutral-500 disabled:cursor-not-allowed"
                >
                  {loading ? "Submitting..." : "Submit Enquiry"}
                  <span className="text-base">→</span>
                </button>
              </form>
            ) : (
              <div className="rotate-[0.8deg] rounded-[28px] bg-white p-10 text-[#131313] shadow-[10px_10px_0_#8B5CF6]">
                <h3 className="text-[28px] font-black uppercase font-forum">
                  Enquiry sent ✦
                </h3>

                <p className="mt-4 text-[#555] font-semibold">
                  Our team will reach out within one
                  business day.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}