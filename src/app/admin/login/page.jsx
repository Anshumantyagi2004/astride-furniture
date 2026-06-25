"use client";
import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";

export default function page() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (password === "astride@1234" && email === "admin@astride.in") {
            document.cookie = "admin-token=secret123; path=/";
            router.push("/admin");
        } else {
            toast.error("Invaild credentials!");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 p-4 text-black">
            <div className="w-full max-w-md backdrop-blur-lg bg-white/80 border border-white/30 shadow-2xl rounded-3xl p-8">

                <div className="flex flex-col items-center mb-4">
                    <div className="">
                        <Image
                            src={"/logo.webp"}
                            alt="logo"
                            className="w-full h-full object-contain"
                            height={100}
                            width={100}
                        />
                    </div>

                    <h1 className="text-3xl font-bold mt-2 text-gray-800">
                        Welcome Back
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Login to continue
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="relative">
                        <Mail
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                            size={20}
                        />

                        <input
                            type="email"
                            placeholder="Admin Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 bg-white/70 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            required
                        />
                    </div>

                    <div className="relative">
                        <Lock
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                            size={20}
                        />

                        <input
                            type={showPass ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-300 bg-white/70 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            required
                        />

                        {/* Toggle Password */}
                        <button type="button" onClick={() => setShowPass(!showPass)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 transition"
                        >
                            {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 text-gray-600">
                            <input type="checkbox" className="accent-blue-600" />
                            Remember me
                        </label>
                    </div>

                    {/* Submit */}
                    <button type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 text-white py-3 rounded-xl font-semibold shadow-lg shadow-blue-200"
                    >
                        Login
                    </button>

                    {/* Footer */}
                    <p className="text-center text-sm text-gray-600">
                        © {new Date().getFullYear()} Astride Furniture
                    </p>
                </form>
            </div>
        </div>
    );
}