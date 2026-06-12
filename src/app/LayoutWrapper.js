"use client";

import { usePathname } from "next/navigation";
import Navbar3 from "@/components/Home/Navbar3";
import Footer from "@/components/Main/Footer/Footer";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Navbar3 />}
      {children}
      {!isAdmin && <Footer />}
    </>
  );
}
