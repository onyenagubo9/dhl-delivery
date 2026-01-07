"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Globe, Package, Clock, Headphones } from "lucide-react";

/* ---------------- COUNT UP COMPONENT ---------------- */

function CountUp({
  value,
  suffix = "",
  duration = 1800,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const incrementTime = 16; // ~60fps
    const totalSteps = duration / incrementTime;
    const increment = end / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return (
    <>
      {count}
      {suffix}
    </>
  );
}

/* ---------------- COMPONENT ---------------- */

export default function GlobalCoverage() {
  const stats = [
    {
      icon: Globe,
      value: 220,
      suffix: "+",
      label: "Countries Covered",
    },
    {
      icon: Package,
      value: 50000,
      suffix: "+",
      label: "Daily Shipments",
    },
    {
      icon: Clock,
      value: 99,
      suffix: ".8%",
      label: "On-Time Delivery",
    },
    {
      icon: Headphones,
      value: 24,
      suffix: "/7",
      label: "Customer Support",
    },
  ];

  return (
    <section className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Global Delivery Network
          </h2>
          <p className="text-lg text-gray-600">
            Delivering to customers worldwide through a trusted and scalable logistics infrastructure.
          </p>

          {/* Accent line */}
          <div className="mt-6 flex justify-center">
            <span className="h-0.75 w-24 bg-yellow-400 rounded-full" />
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {stats.map(({ icon: Icon, value, suffix, label }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -6 }}
              className="group p-8 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-xl transition"
            >
              {/* Icon */}
              <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-xl bg-yellow-400/10 mb-5 group-hover:bg-yellow-400 transition">
                <Icon className="w-7 h-7 text-yellow-500 group-hover:text-gray-900 transition" />
              </div>

              {/* Number */}
              <p className="text-3xl md:text-4xl font-extrabold text-yellow-500 mb-2">
                <CountUp value={value} suffix={suffix} />
              </p>

              {/* Label */}
              <p className="text-sm text-gray-600 tracking-wide">
                {label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
