import { Barlow, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata = {
  title: "Astrides",
  description: "Astrides",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={barlow.className}
    >
      <body className="min-h-screen">
        {children}
        <Toaster position="top-center"/>
      </body>
    </html>
  );
}
