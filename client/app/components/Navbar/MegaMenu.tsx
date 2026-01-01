"use client";

import Link from "next/link";
import { useRef, useEffect } from "react";

interface MegaMenuItem {
  label: string;
  href: string;
  badge?: string;
  featured?: boolean;
}

interface MegaMenuSection {
  title: string;
  items: MegaMenuItem[];
  icon?: React.ReactNode;
}

interface MegaMenuProps {
  sections: MegaMenuSection[];
  isOpen?: boolean;
  onClose?: () => void;
  columns?: 3 | 4;
  alignment?: "left" | "center";
}

export default function MegaMenu({
  sections,
  isOpen = true,
  onClose,
  columns = 3,
  alignment = "center",
}: MegaMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const focusableItems = useRef<HTMLAnchorElement[]>([]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) {
        onClose();
      }

      // Arrow navigation
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        const currentIndex = focusableItems.current.indexOf(
          document.activeElement as HTMLAnchorElement
        );
        let nextIndex = currentIndex;

        if (e.key === "ArrowDown") {
          nextIndex = (currentIndex + 1) % focusableItems.current.length;
        } else {
          nextIndex =
            currentIndex <= 0
              ? focusableItems.current.length - 1
              : currentIndex - 1;
        }

        focusableItems.current[nextIndex]?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Click outside to close
  useEffect(() => {
    if (!isOpen || !onClose) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const gridColsClass = columns === 4 ? "grid-cols-4" : "grid-cols-3";
  const alignmentClass =
    alignment === "center" ? "left-1/2 -translate-x-1/2" : "left-0";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-30"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* MegaMenu Container */}
      <div
        ref={menuRef}
        className={`absolute top-full ${alignmentClass} pt-4 z-40 w-screen max-w-6xl`}
        role="menu"
      >
        {/* MegaMenu Card */}
        <div
          className="rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300"
          style={{
            backgroundColor: "var(--primary-white)",
          }}
        >
          {/* Content Grid */}
          <div className={`grid ${gridColsClass} gap-6 p-8`}>
            {sections.map((section, sectionIdx) => (
              <div key={sectionIdx} className="space-y-4">
                {/* Section Header */}
                <div className="flex items-center gap-2">
                  {section.icon && (
                    <div
                      style={{
                        color: "var(--primary-red)",
                      }}
                    >
                      {section.icon}
                    </div>
                  )}
                  <h3
                    className="text-sm font-semibold uppercase tracking-wider"
                    style={{
                      color: "var(--foreground-light)",
                    }}
                  >
                    {section.title}
                  </h3>
                </div>

                {/* Section Items */}
                <ul className="space-y-2.5">
                  {section.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="relative">
                      <Link
                        ref={(el) => {
                          if (el) focusableItems.current.push(el);
                        }}
                        href={item.href}
                        className="flex items-center justify-between py-1.5 px-2 rounded text-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2"
                        style={{
                          color: item.featured
                            ? "var(--primary-red)"
                            : "var(--text-secondary)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "var(--surface-hover)";
                          e.currentTarget.style.color = "var(--primary-red)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.color = item.featured
                            ? "var(--primary-red)"
                            : "var(--text-secondary)";
                        }}
                        role="menuitem"
                      >
                        <span className="font-medium">{item.label}</span>
                        {item.badge && (
                          <span
                            className="ml-2 px-2 py-0.5 rounded text-xs font-semibold"
                            style={{
                              backgroundColor: "var(--primary-red)",
                              color: "var(--primary-white)",
                            }}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div
            className="px-8 py-4 border-t flex items-center justify-between"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--surface-hover)",
            }}
          >
            <p
              className="text-xs"
              style={{
                color: "var(--text-muted)",
              }}
            >
              Browse our complete catalog of automotive parts
            </p>
            <Link
              href="/shop"
              className="text-sm font-semibold transition-colors duration-150"
              style={{
                color: "var(--primary-red)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--primary-red-dark)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--primary-red)")
              }
              role="menuitem"
            >
              View All →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
