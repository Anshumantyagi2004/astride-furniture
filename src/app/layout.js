import { Forum, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import SideMenuAddToCart from "@/components/Main/SideMenuAddToCart";
import LayoutWrapper from "./LayoutWrapper";

const forum = Forum({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-forum",
});

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Astrides",
  description: "Astrides",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${forum.variable} ${sans.variable} ${sans.className}`}>
      <head>
        <link rel="preload" href="/3D_asset_glb/a3.glb" as="fetch" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://img.youtube.com" />
        <link rel="dns-prefetch" href="https://img.youtube.com" />
        <link rel="preconnect" href="https://www.youtube.com" />
      </head>
      <body className="min-h-screen overflow-x-clip max-w-[100vw]">
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
        <Toaster position="top-center" />
        <SideMenuAddToCart />
      </body>
    </html>
  );
}