"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, LogOut, Car, Package, Heart, Settings } from "lucide-react"; 
import { motion } from "framer-motion";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    { label: "My Garage", href: "/profile", icon: Car },
    { label: "Pit Stop (Orders)", href: "/profile/orders", icon: Package },
    { label: "Saved Parts", href: "/profile/wishlist", icon: Heart },
    { label: "Settings", href: "/profile/settings", icon: Settings },
  ];

  return (
   <div className="min-h-screen flex flex-row bg-[#FDFDF]">

  {/* SIDEBAR SECTION — ALWAYS VERTICALLY CENTERED */}
  <aside className="w-full lg:w-80 xl:w-96 flex-shrink-0 flex justify-center">
    <div className="flex flex-col justify-center h-full w-full px-4 sm:px-6">

      {/* Profile Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="p-6 rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-200/50 relative overflow-hidden group"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--accent)] to-[var(--brand-red-hot)]" />

        <div className="flex items-center gap-5">
          <div className="h-16 w-16 rounded-2xl bg-[var(--surface-hover)] border-2 border-white shadow-inner flex items-center justify-center text-xl font-bold text-[var(--accent)]">
            KR
          </div>
          <div>
            <h2 className="font-bold text-lg text-[var(--foreground)]">
              Kunal Ray
            </h2>
            <p className="text-xs text-[var(--text-muted)] font-medium bg-[var(--surface)] px-2 py-1 rounded-md inline-block mt-1">
              GARAGE BOSS
            </p>
          </div>
        </div>
      </motion.div>

      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mt-6 p-3 bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-lg shadow-gray-200/40"
      >
        <div className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative group block"
              >
                <div
                  className={`relative z-10 flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300
                    ${
                      isActive
                        ? "text-[var(--accent)]"
                        : "text-[var(--text-secondary)] hover:text-[var(--foreground)]"
                    }
                  `}
                >
                  <div className="flex items-center gap-4">
                    <item.icon
                      size={20}
                      strokeWidth={isActive ? 2.5 : 2}
                      className="group-hover:scale-110 transition-transform duration-300"
                    />
                    <span className="font-medium tracking-wide text-sm">
                      {item.label}
                    </span>
                  </div>

                  {isActive && (
                    <ChevronRight size={16} className="text-[var(--accent)]" />
                  )}
                </div>

                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-red-50/80 rounded-2xl border border-red-100"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </div>

        <div className="px-5 py-4 mt-2 border-t border-gray-100">
          <button className="w-full flex items-center gap-4 text-sm font-medium text-[var(--text-muted)] hover:text-red-600 transition-colors group">
            <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-red-50 transition-colors">
              <LogOut size={18} />
            </div>
            Log Out
          </button>
        </div>
      </motion.nav>
    </div>
  </aside>

  {/* MAIN CONTENT — TOP ALIGNED */}
  <main className="flex-1 min-w-0">
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="pt-12 px-6"
    >
      {children}
    </motion.div>
  </main>

</div>

  );
}