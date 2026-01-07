"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Mail, Lock, Truck, ArrowRight, Loader2 } from "lucide-react";
import { loginUser } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const role = await loginUser(email, password);

      if (role === "admin") {
        router.replace("/dashboard/admin");
      } else if (role === "rider") {
        router.replace("/dashboard/rider");
      } else {
        router.replace("/dashboard/customer");
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <Image
        src="/images/delivery.jpg"
        alt="Delivery background"
        fill
        priority
        className="object-cover scale-105"
      />

      {/* Softer Overlay (clearer image) */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4 animate-fade-in-up">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/30">
          {/* Brand */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg">
              <Truck className="text-white w-7 h-7" />
            </div>

            <h1 className="text-2xl font-bold text-dark mt-3">
              Global Delivery
            </h1>
            <p className="text-sm text-gray-600">
              Fast • Secure • Worldwide
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm mb-4 animate-shake">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                placeholder="Email address"
                className="w-full pl-11 pr-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                placeholder="Password"
                className="w-full pl-11 pr-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="group w-full bg-primary hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <a
              href="/auth/register"
              className="text-primary font-semibold hover:underline"
            >
              Create one
            </a>
          </div>

          {/* Trust Badge */}
          <div className="mt-4 flex justify-center">
            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
              Trusted Global Logistics Platform
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
