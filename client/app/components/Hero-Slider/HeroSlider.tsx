"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import HeroSlide from "../Sections/HeroSlide";
import { heroSlides } from "./heroSlider.data";
import { autoplayTiming, breakpoints } from "./heroSlider.config";

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef<number | null>(null);
  const total = heroSlides.length;

  /* Detect mobile */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoints.md);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* Autoplay */
  useEffect(() => {
    if (!isMobile && isHovering) return;

    intervalRef.current = setInterval(
      () => {
        setDirection(1);
        setIndex((prev) => (prev + 1) % total);
      },
      isMobile ? autoplayTiming.mobile : autoplayTiming.desktop
    );

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isMobile, isHovering, total]);

  const next = useCallback(() => {
    setDirection(1);
    setIndex((i) => (i + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setDirection(-1);
    setIndex((i) => (i - 1 + total) % total);
  }, [total]);

  /* Touch swipe logic */
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    touchStartX.current = null;
    if (delta > 50) next();
    if (delta < -50) prev();
  };

  return (
    <section
      className="
        group relative w-full overflow-hidden
        mt-8 md:mt-12 lg:mt-16
        h-[45vh] md:h-[50vh] lg:h-[55vh]
        
        bg-surface 
      "
      onMouseEnter={() => !isMobile && setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <AnimatePresence mode="wait" custom={direction}>
        <HeroSlide
          key={heroSlides[index].id}
          slide={heroSlides[index]}
          direction={direction}
          isMobile={isMobile}
        />
      </AnimatePresence>

      {/* --- Desktop Navigation (DIVs) --- */}
      {!isMobile && (
        <>
          {/* Previous Arrow */}
          <div
            onClick={prev}
            role="button"
            tabIndex={0}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30
                       flex h-12 w-12 items-center justify-center rounded-full cursor-pointer
                       bg-surface/30 backdrop-blur-md 
                       border border-border
                       text-foreground opacity-0 transition-all duration-300
                       group-hover:opacity-100 
                       hover:bg-accent hover:border-accent hover:scale-110 active:scale-95 select-none"
            aria-label="Previous slide"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </div>

          {/* Next Arrow */}
          <div
            onClick={next}
            role="button"
            tabIndex={0}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30
                       flex h-12 w-12 items-center justify-center rounded-full cursor-pointer
                       bg-surface/30 backdrop-blur-md 
                       border border-border
                       text-foreground opacity-0 transition-all duration-300
                       group-hover:opacity-100 
                       hover:bg-accent hover:border-accent hover:scale-110 active:scale-95 select-none"
            aria-label="Next slide"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </>
      )}

      {/* --- Mobile Navigation (Dots) --- */}
      {isMobile && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-3">
          {heroSlides.map((_, i) => (
            <div
              key={i}
              role="button"
              onClick={() => {
                setDirection(i > index ? 1 : -1);
                setIndex(i);
              }}
              className="p-2 cursor-pointer"
              aria-label={`Go to slide ${i + 1}`}
            >
              <div
                className={`h-1.5 rounded-full transition-all duration-500 shadow-sm ${
                  i === index 
                    ? "w-8 bg-accent shadow-[0_0_10px_var(--accent)]" 
                    : "w-1.5 bg-border hover:bg-foreground/50"
                }`}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}