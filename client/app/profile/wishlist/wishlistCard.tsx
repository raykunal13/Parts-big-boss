"use client";

import {
  ShoppingCart,
  Star,
  Package,
  Check,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Product } from "../../types/product";
import { useRouter } from "next/navigation";

interface WishlistProductCardProps {
  product: Product;
  onRemove?: (id: string | number) => void;
}

export default function WishlistProductCard({
  product,
  onRemove,
}: WishlistProductCardProps) {
  const [isAdded, setIsAdded] = useState(false);

  const {
    id,
    title,
    part_number,
    price,
    image_url,
    rating = 0,
    rating_count = 0,
    category = "Generic",
  } = product;

  const inStock = true;
  const originalPrice = Math.round(price * 1.2);
  const discount = Math.round(((originalPrice - price) / originalPrice) * 100);

  const router = useRouter();

  const handleBuyNow = () => {
    router.push("/billing");
  };

  return (
    <div className="group relative flex flex-col sm:flex-row gap-4 rounded-xl border border-gray-200 bg-white p-4 hover:shadow-lg transition">
      
      {/* IMAGE */}
      <div className="relative w-full sm:w-48 shrink-0 rounded-lg bg-gray-50 overflow-hidden">
        <img
          src={image_url}
          alt={title}
          className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
        />

        {discount > 0 && (
          <span className="absolute top-2 left-2 rounded-md bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white">
            -{discount}%
          </span>
        )}

        <button
          onClick={() => onRemove?.(id)}
          className="absolute top-2 right-2 rounded-full bg-white p-2 text-gray-400 shadow hover:text-red-600 hover:bg-red-50 transition"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* CONTENT */}
      <div className="flex-1 min-w-0 flex flex-col justify-between gap-3">
        <div className="space-y-1">
          <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">
            {category}
          </p>

          <h3 className="text-base font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition">
            {title}
          </h3>

          <p className="text-xs text-gray-500 font-mono">
            Part #: <span className="text-gray-700">{part_number}</span>
          </p>
        </div>

        {/* RATING */}
        <div className="flex items-center gap-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.round(rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">
            {rating.toFixed(1)} • {rating_count} reviews
          </span>
        </div>

        {/* STATUS */}
        <div className="flex items-center gap-2">
          {inStock ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
              <Package size={14} /> In stock · ships fast
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
              <AlertCircle size={14} /> Out of stock
            </span>
          )}
        </div>
      </div>

      {/* ACTION */}
      <div className="flex sm:flex-col justify-between sm:items-end gap-4 sm:w-56">
        <div className="text-left sm:text-right space-y-0.5">
          <p className="text-xs text-green-600 font-semibold">
            You save ₹{originalPrice - price}
          </p>
          <p className="text-xl font-bold text-gray-900">
            ₹{price}
          </p>
          <p className="text-sm text-gray-400 line-through">
            ₹{originalPrice}
          </p>
        </div>

        <button
          onClick={handleBuyNow}
          disabled={!inStock || isAdded}
          className={`
            group relative h-11 w-full rounded-lg font-semibold
            transition overflow-hidden
            ${
              isAdded
                ? "bg-green-600 text-white"
                : "bg-gray-900 text-white hover:shadow-md"
            }
          `}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isAdded ? (
              <>
                <Check size={16} /> Added
              </>
            ) : (
              <>
                <ShoppingCart size={16} /> Buy Now
              </>
            )}
          </span>

          {!isAdded && (
            <span className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          )}
        </button>
      </div>
    </div>
  );
}
