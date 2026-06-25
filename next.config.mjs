/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disabled reactCompiler in dev — it's experimental and memory-heavy
  // reactCompiler: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Fix: silences 'multiple lockfiles' workspace root warning
  turbopack: {
    root: "/Users/simran/Desktop/PROMO/astride-furniture",
  },
  // Expose env vars to server-side API routes
  env: {
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
    NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  },
};

export default nextConfig;
