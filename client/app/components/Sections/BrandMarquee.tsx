"use client";

import { motion } from "framer-motion";
import Link from "next/link";

// Using the brands you listed in your mega menu
const brands = [
  { name: "Bosch", logo: "https://placehold.co/100x100/white/3a2525?text=Bosch" },
  { name: "Brembo", logo: "https://placehold.co/100x100/white/e31b23?text=Brembo" },
  { name: "Michelin", logo: "https://placehold.co/100x100/white/003399?text=Michelin" },
  { name: "Castrol", logo: "https://placehold.co/100x100/white/009900?text=Castrol" },
  { name: "NGK", logo: "https://placehold.co/100x100/white/d40000?text=NGK" },
  { name: "K&N", logo: "https://placehold.co/100x100/white/f15a29?text=K&N" },
  { name: "Bilstein", logo: "https://placehold.co/100x100/white/005696?text=Bilstein" },
  { name: "HKS", logo: "https://placehold.co/100x100/white/000000?text=HKS" },
  { name: "Eibach", logo: "https://placehold.co/100x100/white/ed1c24?text=Eibach" },
  { name: "Denso", logo: "https://placehold.co/100x100/white/ed1c24?text=Denso" },
  { name: "Valeo", logo: "https://placehold.co/100x100/white/009640?text=Valeo" },
  { name: "Continental", logo: "https://placehold.co/100x100/white/ffa500?text=Conti" },
];

// Duplicate the list to create the seamless infinite loop
const marqueeBrands = [...brands, ...brands];

export default function BrandMarquee() {
  return (
    <section className="py-16 bg-[var(--surface-hover)] border-t border-[var(--border)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Trusted by Top Manufacturers</h2>
        <div className="w-16 h-1 bg-[var(--accent)] mx-auto mt-2 rounded-full opacity-80" />
      </div>

      <div className="relative w-full flex overflow-hidden mask-gradient">
        {/* The Track */}
        <motion.div
          className="flex gap-12 items-center whitespace-nowrap px-4"
          animate={{ x: "-50%" }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 30, // Adjust speed (higher = slower)
          }}
          whileHover={{ animationPlayState: "paused" }} // Optional: pause heavily via CSS if preferred, or rely on hover states below
        >
          {marqueeBrands.map((brand, index) => (
            <Link
              key={`${brand.name}-${index}`}
              href={`/brands/${brand.name.toLowerCase()}`}
              className="group flex flex-col items-center justify-center gap-2 cursor-pointer"
            >
              {/* Circular Icon Container */}
              <div 
                className="
                  w-24 h-24 rounded-full bg-white 
                  border border-gray-100 shadow-sm 
                  flex items-center justify-center p-4 
                  transition-all duration-300
                  group-hover:shadow-lg group-hover:border-[var(--accent-soft)] group-hover:scale-110
                "
              >
                {/* Logo Image */}
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="
                    w-full h-full object-contain 
                    filter grayscale opacity-60 
                    transition-all duration-300 
                    group-hover:grayscale-0 group-hover:opacity-100
                  "
                />
              </div>
              
              {/* Optional: Brand Name Text (Hidden by default, shown on hover?) 
                  Or simply keep it minimal. Let's keep it minimal for that "sexy" look. 
              */}
            </Link>
          ))}
        </motion.div>
        
        {/* Gradient Masks to fade edges */}
        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
      </div>
    </section>
  );
}