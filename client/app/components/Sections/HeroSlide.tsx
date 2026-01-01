"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { slideVariants, animationConfig } from "../Hero-Slider/heroSlider.config";
import type { HeroSlideData } from "../Hero-Slider/heroSlider.data";

interface HeroSlideProps {
  slide: HeroSlideData;
  direction: number;
  isMobile: boolean;
}

const HeroSlide = memo(({ slide, direction, isMobile }: HeroSlideProps) => {
  const variants = isMobile
    ? {
        initial: { opacity: 0, x: direction > 0 ? 30 : -30 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: direction > 0 ? -30 : 30 },
      }
    : slideVariants;

  return (
    <Link href={slide.href} className="absolute inset-0 block overflow-hidden ">
      <motion.div
        custom={direction}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={animationConfig}
        className="absolute inset-0 group cursor-pointer"
      >
        {/* --- Image Layer --- */}
        <Image
          src={slide.image}
          alt={slide.alt}
          fill
          sizes="100vw"
          priority={false}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* --- Gradient Overlay --- */}
        <div className="absolute inset-0 bg-gradient-to-tr from-accent/70 via-accent/30 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-70" />

        {/* --- Content Layer --- */}
        {(slide.title || slide.description) && (
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 lg:p-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="max-w-3xl transition-transform duration-500 group-hover:-translate-y-2"
            >
              {slide.title && (
                // 1. Heading: "Somewhat white" (text-background)
                <h2 className="text-3xl font-bold tracking-tight leading-tight text-background drop-shadow-xl md:text-5xl lg:text-6xl">
                  {slide.title}
                </h2>
              )}
              
              {slide.description && (
                // 2. Subheading: "Red" (text-background) + Bold for readability
                <p className="mt-3 text-lg font-bold text-background drop-shadow-md md:text-xl lg:text-2xl line-clamp-3 max-w-2xl">
                  {slide.description}
                </p>
              )}
              
              {/* 3. View Details: "More Visible" 
                  - Removed opacity-0 (always visible now)
                  - Added a border and background to pop out
              */}
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-surface/50 backdrop-blur-sm text-sm font-bold uppercase tracking-wider text-foreground transition-colors duration-300 group-hover:bg-accent group-hover:border-accent group-hover:text-white">
                <span>View Details</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>

            </motion.div>
          </div>
        )}
      </motion.div>
    </Link>
  );
});

HeroSlide.displayName = "HeroSlide";

export default HeroSlide;