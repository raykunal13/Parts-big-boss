"use client";

import { Product } from "../../types/product";
import { motion } from "framer-motion";
import { ShoppingCart, Star } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCardHorizontal({ product }: ProductCardProps) {
  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(product.price / 100);

  const rating = product.rating ?? 4.5;
  const ratingCount = product.rating_count ?? 128;

  return (
    <motion.article
      initial="rest"
      whileHover="hover"
      animate="rest"
      className="
        group relative flex flex-row overflow-hidden
        rounded-xl bg-white
        border border-[var(--border)]
        transition-all duration-300
        hover:shadow-lg hover:border-[var(--text-secondary)]
        h-32 w-full
      "
    >
      {/* Image */}
      <div className="relative w-32 min-w-[8rem] bg-[var(--surface)] overflow-hidden">
        <motion.img
          variants={{
            rest: { scale: 1 },
            hover: { scale: 1.05 },
          }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          src={product.image_url || "https://placehold.co/300x300"}
          alt={product.title}
          className="h-full w-full object-contain p-2 mix-blend-multiply"
        />
      </div>

      {/* Content */}
      <div className="flex flex-grow flex-col justify-between p-3 min-w-0">
        <div>
          {/* Title */}
          <div className="flex justify-between items-start gap-2">
            <h3
              className="
                text-sm font-semibold leading-tight
                text-[var(--text-primary)]
                line-clamp-2
              "
              title={product.title}
            >
              {product.title}
            </h3>
          </div>

          {/* Part number */}
          <p className="mt-1 text-xs font-mono text-[var(--text-muted)]">
            #{product.part_number}
          </p>

          {/* Rating */}
          <div className="mt-1.5 flex items-center gap-1">
            <Star
              size={12}
              className="fill-yellow-500 text-yellow-500"
            />
            <span className="text-xs font-medium text-[var(--text-secondary)]">
              {rating}
            </span>
            <span className="text-[10px] text-[var(--text-muted)]">
              ({ratingCount})
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-end justify-between mt-1">
          {/* Price */}
          <div>
            <span className="text-lg font-bold text-[var(--accent)] tracking-tight">
              {formattedPrice}
            </span>
          </div>

          {/* Add Cart Button */}
          <button
            className="
              flex items-center gap-1.5
              rounded-lg px-3 py-1.5
              bg-[var(--surface)] text-[var(--text-primary)]
              hover:bg-[var(--accent)] hover:text-white
              text-xs font-semibold
              transition-colors duration-200
              border border-[var(--border)]
            "
            aria-label="Add to cart"
          >
            <ShoppingCart size={14} />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </motion.article>
  );
}
