"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { customerReviews } from "../Data/customerReviewData";
import CustomerReviewCard from "../CustomerReview/CustomerReviewCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CustomerReviewSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Configuration
  const DESKTOP_ITEMS_PER_PAGE = 3;
  const MOBILE_ITEMS_PER_PAGE = 1;
  const AUTOPLAY_INTERVAL = 5000;

  // Handle responsive state
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Reset index when view mode changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [isMobile]);

  // Derived logic
  const itemsPerPage = isMobile ? MOBILE_ITEMS_PER_PAGE : DESKTOP_ITEMS_PER_PAGE;
  const totalPages = Math.ceil(customerReviews.length / itemsPerPage);
  
  const currentReviews = customerReviews.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  );

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  }, [totalPages]);

  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  }, [totalPages]);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  // Autoplay functionality
  useEffect(() => {
    if (!isMobile && isHovering) return;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      next();
    }, AUTOPLAY_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isMobile, isHovering, next]);

  return (
    <section 
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-16 group relative"
      onMouseEnter={() => !isMobile && setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Section Header */}
      <div className="mb-8 w-full text-center">
        <h2 className="text-xl font-bold text-[var(--text-primary)]">
          Customer Reviews
        </h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Verified feedback from customers who purchased this product
        </p>
      </div>

      <div className="relative min-h-[200px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {currentReviews.map((review) => (
              <CustomerReviewCard
                key={review.id}
                name={review.name}
                rating={review.rating}
                comment={review.comment}
                date={review.date}
                verified={review.verified}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Desktop Arrows */}
        {!isMobile && totalPages > 1 && (
          <>
            <div
              onClick={prev}
              className="
                absolute -left-16 top-1/2 -translate-y-1/2 z-10
                flex h-12 w-12 items-center justify-center rounded-full
                bg-white border border-gray-200 shadow-lg cursor-pointer
                text-gray-700
                opacity-0 transition-all duration-300
                group-hover:opacity-100 group-hover:translate-x-2
                hover:bg-[var(--accent)] hover:text-white hover:border-[var(--accent)]
              "
              aria-label="Previous page"
            >
              <ChevronLeft size={24} />
            </div>
            <div
              onClick={next}
              className="
                absolute -right-16 top-1/2 -translate-y-1/2 z-10
                flex h-12 w-12 items-center justify-center rounded-full
                bg-white border border-gray-200 shadow-lg cursor-pointer
                text-gray-700
                opacity-0 transition-all duration-300
                group-hover:opacity-100 group-hover:-translate-x-2
                hover:bg-[var(--accent)] hover:text-white hover:border-[var(--accent)]
              "
              aria-label="Next page"
            >
              <ChevronRight size={24} />
            </div>
          </>
        )}
      </div>

      {/* Mobile Pagination Dots */}
      {isMobile && totalPages > 1 && (
        <div className="flex justify-center gap-3 mt-8">
          {Array.from({ length: totalPages }).map((_, i) => (
            <div
              key={i}
              role="button"
              onClick={() => handleDotClick(i)}
              className="p-2 cursor-pointer transition-all duration-300 group"
              aria-label={`Go to page ${i + 1}`}
            >
              <div
                className={`h-1.5 rounded-full transition-all duration-500 shadow-sm ${
                  i === currentIndex 
                    ? "w-8 bg-[var(--accent)] shadow-[0_0_10px_var(--accent-soft)]" 
                    : "w-1.5 bg-gray-300 group-hover:bg-gray-400"
                }`}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
