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
  variable: "--font-sans",
});

export const metadata = {
  title: "ASTRIDE® Office Chair Manufacturer| Ergonomic Office Chairs, Gaming Chairs & Workstations",
  description: "Discover ASTRIDE® premium office Chair manufacturer including ergonomic office chairs, gaming chairs, executive chairs, visitor chairs, bar stools, workstations, and office seating solutions.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${forum.variable} ${sans.variable} ${sans.className}`}>
      <head>
        <meta
          name="google-site-verification"
          content="oo7Se9amQ-_Nfvln61Rt4HRmrRKaSecpc_wTTyBFTfk"
        />
        <script defer src="https://cloud.umami.is/script.js" data-website-id="24892c29-995b-4c38-baa1-308094691027"></script>

        

        <link
          rel="preload"
          href="/3D_asset_glb/a3.glb"
          as="fetch"
          crossOrigin="anonymous"
        />
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