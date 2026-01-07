"use client";

import { motion } from "framer-motion";
import { Truck } from "lucide-react";

export default function PageLoader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-200 bg-yellow-400 flex items-center justify-center"
    >
      <div className="flex flex-col items-center gap-4">
        {/* Truck Animation */}
        <motion.div
          animate={{ x: [-20, 20, -20] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
        >
          <Truck className="w-14 h-14 text-gray-900" />
        </motion.div>

        {/* Text */}
        <p className="font-bold text-gray-900 tracking-wide">
          Loading DHL Delivery…
        </p>
      </div>
    </motion.div>
  );
}
