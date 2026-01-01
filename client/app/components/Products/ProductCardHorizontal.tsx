import {
  ShoppingCart,
  Star,
  Package,
  Check,
  Heart,
  AlertCircle
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

export default function ProductCardHorizontal({
  name,
  partNumber,
  price,
  originalPrice,
  image,
  rating,
  reviewCount,
  inStock,
  brand,
}: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <div className="group w-full bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row">
      
      {/* --- Image Section (Left) --- */}
      <div className="relative w-full sm:w-48 md:w-56 flex-shrink-0 bg-gray-50 flex items-center justify-center p-4">
        <div className="relative w-full aspect-[4/3] sm:aspect-square mix-blend-multiply">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Badges (Overlaid on Image) */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discount > 0 && (
            <span className="inline-flex items-center rounded-md bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
              -{discount}%
            </span>
          )}
        </div>
      </div>

      {/* --- Content Section (Middle) --- */}
      <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between border-b sm:border-b-0 sm:border-r border-gray-100 min-w-0">
        <div>
          <div className="flex justify-between items-start">
             <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wide mb-1">{brand}</p>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-tight mb-1 group-hover:text-blue-600 transition-colors line-clamp-2" title={name}>
                  {name}
                </h3>
                <p className="text-gray-500 text-xs font-mono">
                  Part #: <span className="text-gray-700">{partNumber}</span>
                </p>
             </div>
             
             {/* Wishlist Button (Visible on Desktop) */}
             <button className="hidden sm:block text-gray-400 hover:text-red-500 transition-colors p-1">
               <Heart size={18} />
             </button>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-3">
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
            <span className="text-xs text-gray-500 font-medium ml-1">
              ({reviewCount} reviews)
            </span>
          </div>
        </div>

        {/* Stock Status (Bottom of Middle) */}
        <div className="mt-4 flex items-center gap-2">
          {inStock ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
              <Package className="w-3.5 h-3.5" /> In Stock
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-700 bg-red-50 px-2.5 py-1 rounded-full">
              <AlertCircle className="w-3.5 h-3.5" /> Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* --- Action Section (Right) --- */}
      <div className="w-full sm:w-60 p-4 sm:p-5 bg-gray-50/50 sm:bg-white flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 border-t sm:border-t-0">
        
        {/* Price */}
        <div className="text-left sm:text-right">
          <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-0.5 hidden sm:block">Total Price</p>
          <div className="flex flex-col sm:items-end">
            <span className="text-xl font-bold text-gray-900">
              ${price.toFixed(2)}
            </span>
            {originalPrice && (
              <span className="text-sm text-gray-400 line-through font-medium">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Add Button */}
        <button
          onClick={handleAddToCart}
          disabled={!inStock || isAdded}
          className={`
            w-auto sm:w-full h-10 px-6 sm:px-4 
            inline-flex items-center justify-center 
            text-sm font-bold transition-all rounded-lg 
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2
            disabled:pointer-events-none disabled:opacity-50
            ${isAdded 
              ? "bg-green-600 text-white hover:bg-green-700" 
              : "bg-gray-900 text-white hover:bg-gray-800 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
            }
          `}
        >
          {isAdded ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Added</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add <span className="hidden sm:inline ml-1">to Cart</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}