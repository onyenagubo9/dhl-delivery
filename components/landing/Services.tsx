"use client";

import { motion, Variants } from "framer-motion";
import { Plane, Truck, Ship, Warehouse } from "lucide-react";

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
  hidden: {
    opacity: 0,
    y: 50,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1], // ✅ CORRECT easing
    },
  },
};

/* ---------------- COMPONENT ---------------- */

export default function Services() {
  const services = [
    {
      icon: Plane,
      title: "Express Shipping",
      text: "Time-critical international delivery for documents and parcels.",
    },
    {
      icon: Truck,
      title: "Road Freight",
      text: "Reliable and efficient ground transportation across regions.",
    },
    {
      icon: Ship,
      title: "Ocean Cargo",
      text: "Cost-effective sea freight solutions for large-volume shipments.",
    },
    {
      icon: Warehouse,
      title: "Warehousing",
      text: "Secure storage, inventory management, and global distribution.",
    },
  ];

  return (
    <section className="relative py-28 bg-white overflow-hidden">
      {/* Background Accent */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.06 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#facc15,_transparent_70%)]"
      />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Our Logistics Services
          </h2>
         <motion.p
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6, delay: 0.15 }}
  className="relative text-lg text-gray-600 max-w-2xl mx-auto"
>
  Integrated global logistics solutions built for speed, scale, and reliability.

  {/* Animated underline accent */}
  <motion.span
    initial={{ scaleX: 0 }}
    whileInView={{ scaleX: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay: 0.4 }}
    className="absolute left-1/2 -bottom-3 h-0.5 w-24 bg-yellow-400 origin-left -translate-x-1/2"
  />
</motion.p>

        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-4 gap-10"
        >
          {services.map(({ icon: Icon, title, text }) => (
            <motion.div
              key={title}
              variants={cardVariants}
              whileHover={{ y: -8 }}
              className="group relative p-10 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-2xl transition"
            >
              {/* Bottom Accent Line */}
              <span className="absolute inset-x-0 bottom-0 h-0.75 bg-yellow-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-b-2xl" />

              {/* Icon */}
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="w-16 h-16 flex items-center justify-center rounded-xl bg-yellow-400/10 mb-8 group-hover:bg-yellow-400 transition"
              >
                <Icon className="w-8 h-8 text-yellow-500 group-hover:text-gray-900 transition" />
              </motion.div>

              {/* Text */}
              <h3 className="font-bold text-xl text-gray-900 mb-3">
                {title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {text}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
