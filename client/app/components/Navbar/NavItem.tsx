"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import MegaMenuSection from "./MegaMenuSection";

interface MegaMenuSectionItem {
  label: string;
  href: string;
  badge?: string;
  featured?: boolean;
}

interface MegaMenuSectionData {
  title: string;
  items: MegaMenuSectionItem[];
  icon?: React.ReactNode;
}

interface MegaMenuDataType {
  sections: MegaMenuSectionData[];
}

interface NavItemProps {
  label: string;
  href?: string;
  megaMenuData?: MegaMenuDataType;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function NavItem({
  label,
  href = "#",
  megaMenuData,
  isOpen = false,
  onOpenChange,
}: NavItemProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const open = onOpenChange ? isOpen : internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  const hasMegaMenu = !!megaMenuData?.sections?.length;

  /* ---------------------------
     Outside click + ESC close
  ---------------------------- */
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, setOpen]);

  /* ---------------------------
     Simple link (no mega menu)
  ---------------------------- */
  if (!hasMegaMenu) {
    return (
      <Link
        href={href}
        className="
          relative text-sm font-medium
          text-[var(--text-secondary)]
          transition-colors duration-200
          hover:text-[var(--foreground)]
        "
      >
        {label}
      </Link>
    );
  }

  /* ---------------------------
     Hover handlers
  ---------------------------- */
  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <div
      ref={menuRef}
      className="relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* NAV BUTTON */}
      <div
        className="
    relative flex items-center gap-1 py-2 px-3
    bg-transparent
    text-md font-medium
    text-white
    transition-colors duration-200
    focus:outline-none
  "
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {/* Label + underline */}
        <span className="relative">
          {label}
          <span
            className="
                
              pointer-events-none
              absolute left-0 -bottom-1
              h-[2px] w-full
              bg-[var(--accent)]
              origin-left
              scale-x-0
              transition-transform duration-300 ease-out
              group-hover:scale-x-100
            "
          />
        </span>

        <ChevronDown
          size={16}
          className={`transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* MEGA MENU */}
      {open && (
        <div
          className="
            absolute top-full left-1/2
            -translate-x-1/2 pt-4 z-50
            animate-in fade-in slide-in-from-top-2
            duration-200
          "
          role="menu"
        >
          <div
            className="
              w-[900px]
              max-w-[calc(100vw-4rem)]
              rounded-2xl
              overflow-hidden
              bg-[var(--surface)]
              shadow-[0_20px_80px_rgba(0,0,0,0.35)]
              ring-1 ring-white/5
            "
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-[var(--border)]">
              <h3 className="text-sm font-semibold text-[var(--foreground)]">
                Explore {label}
              </h3>
            </div>

            {/* Content */}
            <div className="px-8 py-8 grid gap-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {megaMenuData.sections.map((section, idx) => (
                <MegaMenuSection
                  key={idx}
                  title={section.title}
                  items={section.items}
                  icon={section.icon}
                />
              ))}
            </div>

            {/* Footer */}
            <div className="px-8 py-4 border-t border-[var(--border)] bg-[var(--surface-hover)] flex items-center justify-between">
              <p className="text-xs text-[var(--text-muted)]">
                Browse our complete catalog
              </p>
              <Link
                href={`/${label.toLowerCase()}`}
                className="
                  text-sm font-semibold
                  text-[var(--accent)]
                  transition-colors duration-200
                  hover:text-[var(--accent-hover)]
                "
                role="menuitem"
              >
                View All {label} →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
