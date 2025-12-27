"use client";

import { useState } from "react";
import { Product } from "../../types/product";
import { motion } from "framer-motion";
import { ShoppingCart, Star, Heart } from "lucide-react";
import { cartStore } from "../../store/useCartCount";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(product.price / 100);

  const rating = product.rating ?? 4.5;
  const ratingCount = product.rating_count ?? 128;

  const [isInCart, setIsInCart] = useState(false);

  const toggleCart = () => {
    if (isInCart) {
      cartStore.decrement();
      setIsInCart(false);
    } else {
      cartStore.increment();
      setIsInCart(true);
    }
  };

  return (
    <motion.article
      initial="rest"
      whileHover="hover"
      animate="rest"
      className="
        group relative flex h-full flex-col overflow-hidden
        rounded-xl bg-white
        border border-[var(--border)]
        transition-all duration-300
        hover:shadow-xl hover:border-[var(--text-secondary)]
      "
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-[var(--surface)] overflow-hidden">
        <motion.img
          variants={{
            rest: { scale: 1 },
            hover: { scale: 1.04 },
          }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          src={product.image_url || "https://placehold.co/400x300"}
          alt={product.title}
          className="h-full w-full object-contain p-6 mix-blend-multiply"
        />

        {/* Top-right Cart (formerly wishlist) */}
        {/* Top-right Heart Toggle */}
        <div
          className={`
            absolute top-3 right-3
            flex h-9 w-9 items-center justify-center
            rounded-full bg-white
            border border-[var(--border)]
            transition-colors duration-200
            cursor-pointer
            ${isInCart ? "text-red-500 border-red-200" : "text-[var(--text-secondary)] hover:text-red-500"}
          `}
          onClick={toggleCart}
          aria-label={isInCart ? "Remove from cart" : "Add to cart"}
        >
          <Heart 
            size={18} 
            className={isInCart ? "fill-current" : ""} 
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-grow flex-col p-4">
        {/* Title */}
        <h3
          className="
            text-sm font-semibold leading-snug
            text-[var(--text-primary)]
            line-clamp-2 min-h-[2.5rem]
          "
          title={product.title}
        >
          {product.title}
        </h3>

        {/* Part number */}
        <p className="mt-1 text-xs font-mono text-[var(--text-muted)]">
          #{product.part_number}
        </p>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              className={`${
                i < Math.floor(rating)
                  ? "fill-yellow-500 text-yellow-500"
                  : "text-yellow-300"
              }`}
            />
          ))}
          <span className="ml-1 text-xs text-[var(--text-muted)]">
            {rating} ({ratingCount})
          </span>
        </div>

        <div className="flex-grow" />

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between">
          {/* Price */}
          <div>
            <span className="block text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
              Price
            </span>
            <span className="text-xl font-bold text-[var(--accent)] tracking-tight">
              {formattedPrice}
            </span>
          </div>

          {/* Buy Now */}
          <motion.div
            variants={{
              rest: { opacity: 0, y: 6 },
              hover: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="
              flex items-center gap-2
              rounded-full px-4 py-2
              bg-[var(--accent)] text-white
              text-sm font-semibold
              shadow-md
              cursor-pointer
            "
            aria-label="Buy now"
          >
            <ShoppingCart size={16} />
            Buy Now
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
}
