"use client";

import { motion, Variants } from "framer-motion";
import { ShieldCheck, Clock, Globe, Headphones } from "lucide-react";

/* ---------------- ANIMATION VARIANTS ---------------- */

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/* ---------------- COMPONENT ---------------- */

export default function WhyChooseUs() {
  const reasons = [
    { icon: ShieldCheck, text: "Secure Handling" },
    { icon: Clock, text: "On-Time Delivery" },
    { icon: Globe, text: "Worldwide Reach" },
    { icon: Headphones, text: "24/7 Customer Support" },
  ];

  return (
    <section className="py-28 bg-gray-900 relative overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#facc15,_transparent_65%)] opacity-[0.05]" />

      <div className="relative max-w-7xl mx-auto px-6 text-white">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Why Choose Us
          </h2>
          <p className="text-lg text-gray-300">
            Trusted by businesses worldwide for secure, reliable, and efficient logistics.
          </p>

          {/* Accent line */}
          <div className="mt-6 flex justify-center">
            <span className="h-0.75 w-24 bg-yellow-400 rounded-full" />
          </div>
        </motion.div>

        {/* Reasons Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-4 gap-10"
        >
          {reasons.map(({ icon: Icon, text }) => (
            <motion.div
              key={text}
              variants={cardVariants}
              whileHover={{ y: -6 }}
              className="group p-8 rounded-2xl bg-gray-800 border border-gray-700 hover:border-yellow-400/40 transition shadow-lg"
            >
              {/* Icon */}
              <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-xl bg-yellow-400/10 mb-5 group-hover:bg-yellow-400 transition">
                <Icon className="w-7 h-7 text-yellow-400 group-hover:text-gray-900 transition" />
              </div>

              {/* Text */}
              <p className="text-center font-semibold text-lg">
                {text}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
