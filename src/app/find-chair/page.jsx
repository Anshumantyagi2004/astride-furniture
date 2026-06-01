"use client";

import ChairFinder from "@/components/Home/ChairFinder";
import { useRouter } from "next/navigation";

export default function FindChairPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <ChairFinder onBack={() => router.push("/")} />
    </div>
  );
}
