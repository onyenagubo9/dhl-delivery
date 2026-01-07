"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, PackageSearch } from "lucide-react";

export default function Hero() {
  const [tracking, setTracking] = useState("");
  const router = useRouter();

  function handleTrack() {
    if (!tracking.trim()) return;
    router.push(`/track?code=${tracking}`);
  }

  return (
    <section
      className="relative min-h-[85vh] flex items-center overflow-hidden"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* ROUTE LINE */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1000 400"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M 100 300 C 300 100, 700 100, 900 300"
          fill="none"
          stroke="#FACC15"
          strokeWidth="3"
          strokeDasharray="8 10"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      </svg>

      {/* MAP PINS */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute left-[12%] bottom-[25%]"
        >
          <MapPin className="w-6 h-6 text-yellow-400" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.6 }}
          className="absolute left-[48%] top-[28%]"
        >
          <MapPin className="w-6 h-6 text-yellow-400" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2 }}
          className="absolute right-[12%] bottom-[25%]"
        >
          <MapPin className="w-6 h-6 text-yellow-400" />
        </motion.div>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
        {/* ANIMATED HEADLINE */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="
            text-4xl md:text-6xl font-extrabold mb-5
            bg-linear-to-r from-yellow-400 via-white to-yellow-400
            bg--linear-to-r
            bg-clip-text text-transparent
            animate-gradient
          "
        >
          Track Your Shipment Globally
        </motion.h1>

        {/* SUBTEXT */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg md:text-xl text-gray-200 mb-10"
        >
          Real-time tracking from pickup to final delivery.
        </motion.p>

        {/* TRACKING INPUT (GPS PULSE) */}
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ delay: 2.4, duration: 0.6 }}
          className="max-w-xl mx-auto flex bg-white rounded-xl overflow-hidden shadow-2xl"
        >
          <div className="flex items-center px-4 text-gray-500">
            <PackageSearch className="w-5 h-5" />
          </div>

          <input
            placeholder="Enter tracking number"
            className="flex-1 px-2 py-4 text-gray-800 outline-none"
            value={tracking}
            onChange={(e) => setTracking(e.target.value)}
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleTrack}
            className="bg-red-600 px-8 text-white font-semibold hover:bg-red-700 transition"
          >
            Track
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
