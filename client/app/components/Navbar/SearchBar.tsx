"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "Engine oil filter",
    "Brake pads",
    "Spark plugs",
  ]);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Add to recent searches if not already there
      if (!recentSearches.includes(searchQuery.trim())) {
        setRecentSearches([searchQuery.trim(), ...recentSearches.slice(0, 4)]);
      }
      // Handle search logic here
      console.log("Searching for:", searchQuery);
      setSearchQuery("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleRecentSearchClick = (search: string) => {
    setSearchQuery(search);
    // Optionally trigger search immediately
    console.log("Selected recent search:", search);
  };

  const removeRecentSearch = (searchToRemove: string) => {
    setRecentSearches(recentSearches.filter((s) => s !== searchToRemove));
  };

  return (
    <div ref={searchRef} className="relative flex items-center">
      {/* Search Button - stays in flex flow */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(true)}
            className="
              inline-flex items-center justify-center
              rounded-lg p-2
              text-white
              hover:text-black
              hover:bg-[var(--surface-hover)] 
              hover:rounded-full
              transition-colors
              flex-shrink-0 cursor-pointer
            "
            aria-label="Search"
            role="button"
            tabIndex={0}
          >
            <Search size={20} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated Search Bar - IN FLEX FLOW (not absolute) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, width: 0, marginLeft: 0 }}
            animate={{ opacity: 1, width: 320, marginLeft: 8 }}
            exit={{ opacity: 0, width: 0, marginLeft: 0 }}
            transition={{
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="relative overflow-visible flex-shrink-0"
          >
            <motion.div
              className="relative"
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search parts..."
                className="
                  w-full h-10 pl-10 pr-10
                  rounded-lg
                  border border-gray-300
                  bg-white
                  text-gray-900
                  placeholder-gray-500
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  transition-all
                "
              />

              <AnimatePresence>
                {searchQuery && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                    onClick={() => setSearchQuery("")}
                    className="
                      absolute right-3 top-1/2 -translate-y-1/2
                      text-gray-400 hover:text-gray-600
                      transition-colors cursor-pointer
                    "
                    role="button"
                    tabIndex={0}
                  >
                    <X size={18} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Recent Searches - positioned relative to parent */}
            <AnimatePresence>
              {recentSearches.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{
                    duration: 0.2,
                    delay: 0.1,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  className="
                    absolute top-full left-0 right-0 mt-2
                    bg-white rounded-lg shadow-lg border border-gray-200
                    overflow-hidden
                    z-50
                  "
                >
                  <div className="py-2">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Recent Searches
                    </div>
                    {recentSearches.map((search, index) => (
                      <motion.div
                        key={search}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{
                          duration: 0.2,
                          delay: index * 0.05,
                        }}
                        className="
                          flex items-center justify-between
                          px-4 py-2.5
                          hover:bg-gray-50
                          transition-colors
                          group
                        "
                      >
                        <div
                          onClick={() => handleRecentSearchClick(search)}
                          className="flex-1 text-left text-sm text-gray-700 hover:text-gray-900 cursor-pointer"
                          role="button"
                          tabIndex={0}
                        >
                          {search}
                        </div>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            removeRecentSearch(search);
                          }}
                          className="
                            p-1 rounded
                            text-gray-400 hover:text-gray-600 hover:bg-gray-200
                            opacity-0 group-hover:opacity-100
                            transition-all cursor-pointer
                          "
                          aria-label="Remove search"
                          role="button"
                          tabIndex={0}
                        >
                          <X size={14} />
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
