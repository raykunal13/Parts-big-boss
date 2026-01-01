import {
  ShoppingCart,
  Star,
  Package,
  Check,
} from "lucide-react";
import { useState } from "react";
interface ProductCardProps {
  id: string;
  name: string;
  partNumber: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  compatibility?: string;
  brand: string;
}
import { cartStore } from "@/app/store/useCartCount";
export default function ProductCard({
  name,
  partNumber,
  price,
  originalPrice,
  image,
  rating,
  reviewCount,
  inStock,
  compatibility,
  brand,
}: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false);
  
  const handleAddToCart = () => {
    if (isAdded) {
       // Redirect to checkout or cart
       window.location.href = "/cart"; // Or use router.push if using useRouter
       return;
    }
    setIsAdded(true);
    cartStore.increment();
    // No timeout, keeps "Buy Now" state
  };

  const discount = originalPrice
    ? Math.round(
        ((originalPrice - price) / originalPrice) * 100,
      )
    : 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image Section */}
      <div className="relative bg-gray-50 aspect-[4/3]">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
        
        {/* Discount Badge */}
        {discount > 0 && (
          <span className="absolute top-2 left-2 inline-flex items-center rounded-full bg-red-600 px-2.5 py-0.5 text-xs font-semibold text-white transition-colors hover:bg-red-700">
            -{discount}%
          </span>
        )}

        {/* Stock Status Badge */}
        {inStock ? (
          <span className="absolute top-2 right-2 inline-flex items-center rounded-full bg-green-600 px-2.5 py-0.5 text-xs font-semibold text-white transition-colors hover:bg-green-700">
            <Package className="w-3 h-3 mr-1" />
            In Stock
          </span>
        ) : (
          <span className="absolute top-2 right-2 inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-800 transition-colors">
            Out of Stock
          </span>
        )}
      </div>

      {/* Content Section */}
      <div className="p-3">
        {/* Brand */}
        <p className="text-gray-500 text-xs font-medium mb-1 uppercase tracking-wide">{brand}</p>

        {/* Product Name */}
        <h3 className="mb-1 text-base font-semibold text-gray-900 line-clamp-1" title={name}>
          {name}
        </h3>

        {/* Part Number */}
        <p className="text-gray-500 text-xs font-mono mb-3">
          Part #: {partNumber}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 font-medium">
            ({reviewCount})
          </span>
        </div>

        {/* Price Section */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900">
              ${price.toFixed(2)}
            </span>
            {originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!inStock}
          className={`
            inline-flex items-center justify-center w-full h-9 px-4 py-2 
            text-sm font-medium transition-colors rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 
            disabled:pointer-events-none disabled:opacity-50
            ${isAdded 
              ? "bg-blue-600 text-white hover:bg-blue-700" 
              : "bg-gray-900 text-white hover:bg-gray-800 shadow-sm"
            }
          `}
        >
          {isAdded ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Buy Now
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}