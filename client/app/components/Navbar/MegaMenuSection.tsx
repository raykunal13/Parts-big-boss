"use client";

import Link from "next/link";
import { ReactNode } from "react";

export interface MegaMenuSectionItem {
  label: string;
  href: string;
  badge?: string;
  featured?: boolean;
}

interface MegaMenuSectionProps {
  title: string;
  items: MegaMenuSectionItem[];
  icon?: ReactNode;
  viewAllHref?: string;
  viewAllLabel?: string;
}

export default function MegaMenuSection({
  title,
  items,
  icon,
  viewAllHref,
  viewAllLabel = "View All",
}: MegaMenuSectionProps) {
  return (
    <div className="space-y-5">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        {icon && (
          <div
            style={{
              color: "var(--primary-red)",
            }}
          >
            {icon}
          </div>
        )}
        <h3
          className="text-xs font-bold uppercase tracking-widest"
          style={{
            color: "var(--text-muted)",
            letterSpacing: "0.05em",
          }}
        >
          {title}
        </h3>
      </div>

      {/* Items List */}
      <ul className="space-y-3">
        {items.map((item, idx) => (
          <li key={idx}>
            <Link
              href={item.href}
              className="inline-flex items-center gap-2 py-1.5 px-2.5 rounded transition-all duration-150"
              style={{
                color: item.featured
                  ? "var(--primary-red)"
                  : "var(--text-secondary)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--surface-hover)";
                e.currentTarget.style.color = "var(--primary-red)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = item.featured
                  ? "var(--primary-red)"
                  : "var(--text-secondary)";
              }}
            >
              <span className="font-medium text-sm">{item.label}</span>
              {item.badge && (
                <span
                  className="ml-1 px-2 py-0.5 rounded text-xs font-bold whitespace-nowrap"
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

      {/* View All Link */}
      {viewAllHref && (
        <div className="pt-2 border-t border-[var(--border)]">
          <Link
            href={viewAllHref}
            className="
        inline-flex items-center gap-1
        text-sm font-semibold
        text-[var(--primary-white)]
        py-1.5 px-2.5 rounded-md
        transition-colors duration-150
        hover:bg-[var(--surface-hover)]
        hover:text-[var(--primary-white)]
      "
          >
            {viewAllLabel}
            <span aria-hidden>→</span>
          </Link>
        </div>
      )}
    </div>
  );
}
