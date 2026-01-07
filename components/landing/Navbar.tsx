"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Truck, MapPin, LogIn } from "lucide-react";

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 bg-yellow-400 shadow-md"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: -5, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Truck className="w-7 h-7 text-gray-900" />
          </motion.div>

          <span className="font-extrabold text-lg tracking-wide text-gray-900 group-hover:tracking-wider transition-all">
            DHL Delivery
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6 text-sm font-semibold text-gray-900">
          {/* Track */}
          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/track"
              className="flex items-center gap-1 hover:underline"
            >
              <MapPin className="w-4 h-4" />
              Track
            </Link>
          </motion.div>

          {/* Login Button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/auth/login"
              className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-black transition"
            >
              <LogIn className="w-4 h-4" />
              Login 
            </Link>
          </motion.div>
        </nav>
      </div>
    </motion.header>
  );
}
