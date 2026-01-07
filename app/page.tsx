"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";

import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import ActionCards from "@/components/landing/ActionCards";

// 🔽 NEW SECTIONS (4 → 10)
import Services from "@/components/landing/Services";
import HowItWorks from "@/components/landing/HowItWorks";
import GlobalCoverage from "@/components/landing/GlobalCoverage";
import WhyChooseUs from "@/components/landing/WhyChooseUs";
import BusinessSolutions from "@/components/landing/BusinessSolutions";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

import PageLoader from "@/components/ui/PageLoader";

export default function HomePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial app load
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* PAGE LOADER */}
      <AnimatePresence>{loading && <PageLoader />}</AnimatePresence>

      {!loading && (
        <main className="bg-gray-50 min-h-screen">
          {/* 1–3 */}
          <Navbar />
          <Hero />
          <ActionCards />

          {/* 4–10 (DHL STRUCTURE) */}
          <Services />
          <HowItWorks />
          <GlobalCoverage />
          <WhyChooseUs />
          <BusinessSolutions />
          <CTA />
          <Footer />
        </main>
      )}
    </>
  );
}
