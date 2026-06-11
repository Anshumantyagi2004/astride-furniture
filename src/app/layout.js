import { Forum, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Main/Footer/Footer";
import SideMenuAddToCart from "@/components/Main/SideMenuAddToCart";
import Navbar from "@/components/Main/Navbar/Navbar";
import Navbar3 from "@/components/Home/Navbar3";

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
      <body className="min-h-screen overflow-x-clip max-w-[100vw]">
        <Navbar3/>
        {children}
        <Toaster position="top-center" />
        <SideMenuAddToCart />
        <Footer/>
      </body>
    </html>
  );
}