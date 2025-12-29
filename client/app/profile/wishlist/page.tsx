"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Heart, Tag } from "lucide-react";
import ProductCardHorizontal from "../../components/Products/ProductCardHorizontal";
import { Product } from "../../types/product";

// Mock Data
const SAVED_ITEMS = {
  "Hyundai Creta 1.6 SX": [
    {
      id: 101,
      title: "Front Brake Pads - Bosch",
      price: 185000,
      part_number: "0986AB1054",
      image_url: "/placeholder-brake.png",
      category: "Brakes",
      slug: "brake-pads-bosch",
      rating: 4.5,
      rating_count: 120,
    },
    {
      id: 102,
      title: "Cabin Air Filter - 3M",
      price: 45000,
      part_number: "3M-CAF-99",
      image_url: "/placeholder-filter.png",
      category: "Filters",
      slug: "cabin-filter-3m",
      rating: 4.2,
      rating_count: 85,
    },
  ],
  "Universal Parts": [
    {
      id: 201,
      title: "Microfiber Cleaning Cloth (Pack of 3)",
      price: 35000,
      part_number: "MF-CL-03",
      image_url: "/placeholder-cloth.png",
      category: "Accessories",
      slug: "microfiber-cloth-pack",
      rating: 4.8,
      rating_count: 450,
    },
  ],
};

const SUGGESTED_CATEGORIES = [
  "Engine Oil",
  "Wiper Blades",
  "Car Mats",
  "LED Bulbs",
];

export default function WishlistPage() {
  const hasItems = Object.keys(SAVED_ITEMS).length > 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--foreground)]">Saved Parts</h1>
        <p className="text-[var(--text-secondary)]">Your wishlist grouped by compatibility</p>
      </div>

      {hasItems ? (
        <div className="space-y-10">
          {Object.entries(SAVED_ITEMS).map(([groupName, products], groupIndex) => (
            <motion.div
              key={groupName}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: groupIndex * 0.1 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-bold text-[var(--foreground)] flex items-center gap-2">
                <Tag size={20} className="text-[var(--accent)]" />
                For {groupName}
              </h2>
              {/* Updated Grid for Horizontal Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {products.map((product) => (
                     <ProductCardHorizontal key={product.id} product={product} /> 
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-24 h-24 rounded-full bg-[var(--surface-hover)] flex items-center justify-center text-[var(--text-muted)] mb-6">
            <Heart size={40} />
          </div>
          <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">Your wishlist is empty</h3>
          <p className="text-[var(--text-secondary)] max-w-xs mb-8">
            Start saving parts for your dream build. Here are some popular categories:
          </p>
          
          <div className="flex flex-wrap justify-center gap-3">
            {SUGGESTED_CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={`/search?q=${cat}`}
                className="px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-full text-sm font-medium hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
              >
                {cat}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
