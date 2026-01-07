"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Building2, PackageCheck, BarChart3, Plug } from "lucide-react";

export default function BusinessSolutions() {
  const features = [
    {
      icon: PackageCheck,
      title: "Bulk & Contract Shipping",
      text: "Optimized logistics for high-volume and recurring shipments.",
    },
    {
      icon: Plug,
      title: "API & System Integration",
      text: "Seamless integration with your existing platforms and tools.",
    },
    {
      icon: BarChart3,
      title: "Advanced Reporting",
      text: "Gain insights with real-time tracking and performance analytics.",
    },
  ];

  return (
    <section className="py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-yellow-400/10">
              <Building2 className="w-7 h-7 text-yellow-500" />
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Business & Enterprise Solutions
          </h2>

          <p className="text-lg text-gray-600">
            Scalable logistics solutions designed to support growing businesses and global enterprises.
          </p>

          {/* Accent */}
          <div className="mt-6 flex justify-center">
            <span className="h-[3px] w-24 bg-yellow-400 rounded-full" />
          </div>
        </motion.div>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left: Features */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {features.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex gap-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-yellow-400/10 shrink-0">
                  <Icon className="w-6 h-6 text-yellow-500" />
                </div>

                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">
                    {title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {text}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Right: CTA Card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white border border-gray-200 rounded-2xl shadow-xl p-10"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Partner With Us
            </h3>

            <p className="text-gray-600 mb-8">
              Open a business account to access custom pricing, priority support, and powerful logistics tools.
            </p>

            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center bg-gray-900 text-white px-6 py-3 rounded-md font-semibold hover:bg-black transition"
            >
              Open Business Account
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
