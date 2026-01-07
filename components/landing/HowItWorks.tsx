"use client";

import { motion, Variants } from "framer-motion";
import { PackagePlus, Truck, MapPin, CheckCircle } from "lucide-react";

/* ---------------- ANIMATION VARIANTS ---------------- */

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const stepVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
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

export default function HowItWorks() {
  const steps = [
    {
      icon: PackagePlus,
      title: "Create Shipment",
      text: "Enter shipment details and generate a tracking number instantly.",
    },
    {
      icon: Truck,
      title: "We Pick It Up",
      text: "Our logistics network collects your package from the origin.",
    },
    {
      icon: MapPin,
      title: "Track in Real-Time",
      text: "Monitor your shipment’s journey with live tracking updates.",
    },
    {
      icon: CheckCircle,
      title: "Delivered Safely",
      text: "Your package arrives securely at its final destination.",
    },
  ];

  return (
    <section
      className="relative py-28 overflow-hidden"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1601584115197-04ecc0da31d7)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative max-w-7xl mx-auto px-6 text-white">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-200">
            A simple, transparent process designed for speed and reliability.
          </p>

          {/* Accent line */}
          <div className="mt-6 flex justify-center">
            <span className="h-0.75 w-24 bg-yellow-400 rounded-full" />
          </div>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-4 gap-10"
        >
          {steps.map(({ icon: Icon, title, text }, index) => (
            <motion.div
              key={title}
              variants={stepVariants}
              whileHover={{ y: -8 }}
              className="relative group text-center p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition"
            >
              {/* Step Number */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-yellow-400 text-gray-900 font-bold flex items-center justify-center shadow-lg">
                {index + 1}
              </div>

              {/* Icon */}
              <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-xl bg-yellow-400/20 mb-6 group-hover:bg-yellow-400 transition">
                <Icon className="w-8 h-8 text-yellow-400 group-hover:text-gray-900 transition" />
              </div>

              {/* Text */}
              <h3 className="font-bold text-lg mb-3">
                {title}
              </h3>
              <p className="text-sm text-gray-200 leading-relaxed">
                {text}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
