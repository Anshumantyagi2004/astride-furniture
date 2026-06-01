import { Forum } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

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
      <body className="min-h-screen overflow-x-hidden max-w-[100vw]">
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}