"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCartCount } from "../../store/useCartCount";

export default function CartButton() {
  const cartCount = useCartCount();

  return (
    <Link
      href="/cart"
      className="relative p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200 group"
      aria-label={`Shopping cart with ${cartCount} items`}
    >
      <ShoppingCart
        size={20}
        className="transition-transform duration-200 group-hover:scale-110"
      />

      {cartCount > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-red-500 rounded-full">
          {cartCount > 99 ? "99+" : cartCount}
        </span>
      )}
    </Link>
  );
}
