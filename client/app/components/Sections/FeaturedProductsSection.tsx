"use client";

import { useState, useEffect } from "react";
import { Product } from "../../types/product";
import ProductCard from "../Products/ProductCard";
import { FEATURED_PRODUCTS } from "../Data/productInfo";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function FeaturedProductsSection() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    
    // Configuration
    const DESKTOP_ITEMS_PER_PAGE = 4;
    const MOBILE_ITEMS_PER_PAGE = 1;
    const MAX_PRODUCTS_DESKTOP = 10;
    const MAX_PRODUCTS_MOBILE = 4;

    // Handle responsive state
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        // Initial check
        checkMobile();
        
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Reset index when view mode changes to avoid out-of-bounds
    useEffect(() => {
        setCurrentIndex(0);
    }, [isMobile]);

    // Derived logic
    const limit = isMobile ? MAX_PRODUCTS_MOBILE : MAX_PRODUCTS_DESKTOP;
    const itemsPerPage = isMobile ? MOBILE_ITEMS_PER_PAGE : DESKTOP_ITEMS_PER_PAGE;
    
    const displayProducts = FEATURED_PRODUCTS.slice(0, limit);
    const totalPages = Math.ceil(displayProducts.length / itemsPerPage);

    const currentProducts = displayProducts.slice(
        currentIndex * itemsPerPage, 
        (currentIndex + 1) * itemsPerPage
    );

    const handleDotClick = (index: number) => {
        setCurrentIndex(index);
    };

    const next = () => {
        setCurrentIndex((prev) => (prev + 1) % totalPages);
    };

    const prev = () => {
        setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
    };

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-16 group">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                    Featured Products
                </h2>
                <a href="/products" className="text-[var(--accent)] font-semibold text-sm hover:underline">
                    View All
                </a>
            </div>
            
            <div className="relative min-h-[400px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}
                    >
                        {currentProducts.map((product) => (
                            <div key={product.id} className="h-full">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </motion.div>
                </AnimatePresence>

                {/* Desktop Arrows (HeroSlider Style) */}
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

            {/* Pagination Dots (Mobile Only) */}
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