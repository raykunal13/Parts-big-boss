"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CloudCog, Search, X } from "lucide-react";
import { useDebounce } from "../../store/useDebounce";
import { searchSuggestion } from "../../Data/searchSuggestion";

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "Engine oil filter",
    "Brake pads",
    "Spark plugs",
  ]);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  // Debounce the search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

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

  // Fetch suggestions when debounced query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedSearchQuery.trim()) {
        try {
          const results = await searchSuggestion(debouncedSearchQuery);
          // Ensure results is an array before setting
          if (Array.isArray(results)) {
             setSuggestions(results);
          } else {
             // If API returns { products: [...] } or similar, adjust here. 
             // For now assuming array or checking if data has property.
             setSuggestions(results.products || []);
          }
        } catch (error) {
          console.error("Error fetching suggestions:", error);
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [debouncedSearchQuery]);

  const handleSearch = (query: string = searchQuery) => {
    if (query.trim()) {
      // Add to recent searches if not already there
      if (!recentSearches.includes(query.trim())) {
        setRecentSearches([query.trim(), ...recentSearches.slice(0, 4)]);
      }
      // Handle search logic here
      console.log("Searching for:", query);
      setSearchQuery("");
      setIsOpen(false);
      // You might redirect here: router.push(`/search?q=${query}`)
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleRecentSearchClick = (search: string) => {
    setSearchQuery(search);
    handleSearch(search);
  };

  const handleSuggestionClick = (suggestion: any) => {
      // Assuming suggestion object has a name or title, or is a string
      const query = typeof suggestion === 'string' ? suggestion : suggestion.title || suggestion.name;
      setSearchQuery(query);
      handleSearch(query);
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

      {/* Animated Search Bar - IN FLEX FLOW */}
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
                    onClick={() => {
                        setSearchQuery("");
                        setSuggestions([]);
                    }}
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

            {/* Dropdown: Recent Searches OR Suggestions */}
            <AnimatePresence>
              {(isOpen && (recentSearches.length > 0 || suggestions.length > 0)) && (
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
                    max-h-80 overflow-y-auto
                  "
                >
                  <div className="py-2">
                    {/* Show Suggestions if user is typing (debouncedQuery exists) and we have results */}
                    {searchQuery.trim() && suggestions.length > 0 ? (
                        <>
                             <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Suggestions
                             </div>
                             {suggestions.map((item, index) => {
                                 // Determine display text
                                 const displayText = typeof item === 'string' ? item : (item.title || item.name || "Unknown Product");
                                 return (
                                    <div
                                        key={item.id || index}
                                        onClick={() => handleSuggestionClick(item)}
                                        className="
                                        flex items-center justify-between
                                        px-4 py-2.5
                                        hover:bg-gray-50
                                        cursor-pointer
                                        transition-colors
                                        "
                                    >
                                        <div className="flex-1 text-sm text-gray-700">
                                            {displayText}
                                        </div>
                                    </div>
                                 );
                             })}
                        </>
                    ) : (
                        /* Show Recent Searches if no query or empty query */
                        !searchQuery.trim() && recentSearches.length > 0 && (
                            <>
                                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Recent Searches
                                </div>
                                {recentSearches.map((search, index) => (
                                <div
                                    key={search}
                                    className="
                                    flex items-center justify-between
                                    px-4 py-2.5
                                    hover:bg-gray-50
                                    transition-colors
                                    group
                                    cursor-pointer
                                    "
                                    onClick={() => handleRecentSearchClick(search)}
                                >
                                    <div
                                    className="flex-1 text-left text-sm text-gray-700 hover:text-gray-900"
                                    >
                                    {search}
                                    </div>
                                    <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeRecentSearch(search);
                                    }}
                                    className="
                                        p-1 rounded
                                        text-gray-400 hover:text-gray-600 hover:bg-gray-200
                                        opacity-0 group-hover:opacity-100
                                        transition-all
                                    "
                                    role="button"
                                    aria-label="Remove search"
                                    >
                                    <X size={14} />
                                    </div>
                                </div>
                                ))}
                            </>
                        )
                    )}
                    
                    {/* No results state could be added here if suggestions is empty but query exists */}
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
