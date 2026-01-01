"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

import SearchBar from "../Navbar/SearchBar";
import CartButton from "../Navbar/CartButton";
import AccountButton from "../Navbar/AccountButton";
import MobileMenu from "../Navbar/MobileMenu";
import NavItem from "../Navbar/NavItem";

// example imports – adjust paths as needed
import {
  partsMegaMenu,
  categoriesMegaMenu,
  brandsMegaMenu,
} from "../../Data/megaMenus";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black backdrop-blur-xl shadow-sm "
          : "bg-black"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* ================= LOGO ================= */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[var(--accent)] text-white font-bold">
              P
            </div>
            <span className="hidden sm:inline font-semibold text-white text-2xl">
              PartsBigBoss
            </span>
          </Link>

          {/* ================= DESKTOP NAV ================= */}
          <div className="hidden lg:flex items-center gap-8 flex-1 justify-center">
            <NavItem label="Parts" megaMenuData={partsMegaMenu} />
            <NavItem label="Categories" megaMenuData={categoriesMegaMenu} />
            <NavItem label="Brands" megaMenuData={brandsMegaMenu} />
          </div>

          {/* ================= ACTIONS ================= */}
          <div className="flex items-center gap-3">
            {/* Desktop actions */}
            <div className="hidden lg:flex items-center gap-3">
              <SearchBar />
              <AccountButton />
              <CartButton />
            </div>

            {/* Mobile actions */}
            <div className="flex lg:hidden items-center gap-2">
              <SearchBar />
              <CartButton />
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="
                  inline-flex items-center justify-center
                  rounded-lg p-2
                  text-white
                  transition-colors
                  hover:text-white
                  hover:bg-[var(--surface-hover)]
                "
                aria-label="Open menu"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </nav>
  );
}