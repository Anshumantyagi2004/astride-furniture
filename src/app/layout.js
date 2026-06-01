import { Forum } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar2 from "@/components/Home/Navbar2";
import Footer from "@/components/Main/Footer/Footer";
import SideMenuAddToCart from "@/components/Main/SideMenuAddToCart";

const forum = Forum({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-forum",
});

export const metadata = {
  title: "Astrides",
  description: "Astrides",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={forum.variable}>
      <body className="min-h-screen overflow-x-clip max-w-[100vw]">
        <Navbar2/>
        {children}
        <Toaster position="top-center" />
        <SideMenuAddToCart />
        <Footer/>
      </body>
    </html>
  );
}