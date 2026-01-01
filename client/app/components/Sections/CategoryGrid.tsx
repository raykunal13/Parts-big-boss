"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Data configuration
const categories = [
  {
    id: 1,
    title: "Engine & Performance",
    subtitle: "Unlock your car's true potential",
    image: "/Category/categ1.png",
    href: "/parts/engine",
    size: "large", // Row 1: Spans 2 cols
  },
  {
    id: 2,
    title: "Braking Systems",
    subtitle: "Safety meets precision",
    image: "/Category/categ2.png",
    href: "/parts/brakes",
    size: "small", // Row 1: Spans 1 col
  },
  {
    id: 3,
    title: "Suspension & Handling",
    subtitle: "Smooth rides on any terrain",
    image: "/Category/categ3.png",
    href: "/parts/suspension",
    size: "small", // Row 2: Spans 1 col (sits below Item 1's left side)
  },
  {
    id: 4,
    title: "Electrical & Lighting",
    subtitle: "Batteries, Lights & Sensors",
    image: "/Category/categ4.png", // Using your generic image or swap for a lighting image
    href: "/parts/electrical",
    size: "large", // Row 2: Spans 2 cols (fills the remaining right space)
  },
];

export default function CategoryGrid() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Shop by Category</h2>
            <p className="mt-2 text-sm md:text-base text-gray-600">Find the exact parts for your system</p>
          </div>
          <Link 
            href="/categories" 
            className="flex items-center text-sm md:text-base text-[var(--accent)] font-semibold hover:text-[var(--accent-hover)] transition-colors"
          >
            View All Categories <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>

        {/* The Zig-Zag Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px] md:auto-rows-[380px]">
          {categories.map((cat, index) => (
            <Link
              key={cat.id}
              href={cat.href}
              className={`
                group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300
                ${cat.size === "large" ? "md:col-span-2" : "md:col-span-1"}
              `}
            >
              {/* Background Image with Zoom Effect */}
              <motion.div
                className="absolute inset-0 w-full h-full"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                {/* Note: We use a standard img tag here for simplicity, 
                   but Next.js <Image> is better for production performance.
                */}
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />

              {/* Text Content */}
              <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full z-10">
                <span className="inline-block px-3 py-1 mb-3 text-xs font-bold tracking-wider text-white uppercase bg-[var(--accent)] rounded-full">
                  {cat.size === "large" ? "Featured" : "Top Rated"}
                </span>
                
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">
                  {cat.title}
                </h3>
                
                <p className="text-gray-300 mb-4 line-clamp-1 opacity-90 md:max-w-[80%]">
                  {cat.subtitle}
                </p>
                
                {/* Slide-up Interaction */}
                <div className="
                  flex items-center text-white font-medium 
                  transform translate-y-4 opacity-0 
                  group-hover:translate-y-0 group-hover:opacity-100 
                  transition-all duration-300 ease-out
                ">
                  Explore Parts <ArrowRight className="ml-2 w-5 h-5 text-[var(--accent-hover)]" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}