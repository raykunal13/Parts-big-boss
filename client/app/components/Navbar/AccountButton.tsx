"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User, LogOut, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore, authStore } from "../../store/useAuthStore";
import { logoutUser } from "@/app/Data/authLoginInfo";

export default function AccountButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen]);

  const handleLogout = async () => {
    await logoutUser()
     authStore.logout();
    setIsOpen(false);
    router.push("/");
  };

  const handleLoginClick = () => {
    router.push("/login");
  };

  if (!isAuthenticated) {
    return (
      <div
        onClick={handleLoginClick}
        className="hidden lg:flex items-center justify-center p-2 rounded-lg transition-colors duration-200 group text-white cursor-pointer hover:text-black hover:bg-[var(--surface-hover)]"
        aria-label="Sign in"
      >
        <User
          size={20}
          className="transition-transform duration-200 group-hover:scale-110 "
        />
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Account Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="hidden lg:flex items-center justify-center p-2 rounded-lg transition-colors duration-200 group focus:outline-none focus:ring-2 focus:ring-offset-2 text-white cursor-pointer hover:text-black hover:bg-[var(--surface-hover)]"
        aria-label="Account menu"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <User
          size={20}
          className="transition-transform duration-200 group-hover:scale-110"
        />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 rounded-lg shadow-xl overflow-hidden z-40 animate-in fade-in duration-200 bg-white"
        >
          {/* Dropdown Header */}
          <div
            className="px-4 py-3 border-b"
            style={{
              borderColor: "var(--border)",
            }}
          >
            <p
              className="text-sm font-semibold"
              style={{
                color: "var(--foreground-light)",
              }}
            >
              Account
            </p>
          </div>

          {/* Dropdown Items */}
          <div className="py-1">
            {/* Profile */}
            <Link
              href="/profile"
              className="w-full text-left px-4 py-2 text-sm transition-colors duration-150 flex items-center gap-3"
              style={{
                color: "var(--foreground-light)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--surface-hover)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
              onClick={() => setIsOpen(false)}
            >
              <User size={16} style={{ color: "var(--text-muted)" }} />
              Profile
            </Link>

            {/* Orders */}
            <Link
              href="/profile/orders"
              className="w-full text-left px-4 py-2 text-sm transition-colors duration-150 flex items-center gap-3"
              style={{
                color: "var(--foreground-light)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--surface-hover)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
              onClick={() => setIsOpen(false)}
            >
              <ShoppingBag size={16} style={{ color: "var(--text-muted)" }} />
              Orders
            </Link>

            {/* Divider */}
            <div
              className="my-1 h-px"
              style={{
                backgroundColor: "var(--border)",
              }}
            />

            {/* Logout */}
            <div
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm transition-colors duration-150 flex items-center gap-3"
              style={{
                color: "var(--foreground-light)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--surface-hover)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <LogOut size={16} style={{ color: "var(--text-muted)" }} />
              Logout
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
