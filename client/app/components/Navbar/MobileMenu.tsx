"use client";

import Link from "next/link";
import { X, User, ChevronRight } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const navLinks = [
    { label: "Parts", href: "/parts" },
    { label: "Vehicles", href: "/vehicles" },
    { label: "Brands", href: "/brands" },
    { label: "About", href: "/about" },
  ];

  const vehicles = [
    { label: "2020 Honda Civic", id: 1 },
    { label: "2018 Toyota Camry", id: 2 },
    { label: "Add New Vehicle", id: "add", isAction: true },
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed inset-y-0 right-0 w-full max-w-sm bg-white z-50 shadow-xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto h-[calc(100vh-80px)]">
          {/* Navigation Links */}
          <div className="px-6 py-8 space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Navigation
            </p>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="flex items-center justify-between px-4 py-3 text-gray-900 text-lg font-medium hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                {link.label}
                <ChevronRight size={20} className="text-gray-400" />
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="px-6">
            <div className="border-t border-gray-100" />
          </div>

          {/* Vehicle Selector */}
          <div className="px-6 py-8 space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              My Vehicles
            </p>
            {vehicles.map((vehicle) => (
              <button
                key={vehicle.id}
                onClick={vehicle.isAction ? () => {} : onClose}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors duration-200 ${
                  vehicle.isAction
                    ? "text-gray-700 border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                    : "text-gray-900 bg-gray-50 hover:bg-gray-100"
                } font-medium`}
              >
                <span className="text-base">{vehicle.label}</span>
                <ChevronRight size={20} className="text-gray-400" />
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="px-6">
            <div className="border-t border-gray-100" />
          </div>

          {/* Account Section */}
          <div className="px-6 py-8">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Account
            </p>
            <Link
              href="/account"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-4 text-gray-900 font-medium hover:bg-gray-50 rounded-lg transition-colors duration-200"
            >
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <User size={20} className="text-gray-600" />
              </div>
              <div>
                <p className="text-base font-semibold">Sign In</p>
                <p className="text-sm text-gray-500">Manage your account</p>
              </div>
            </Link>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-8 space-y-3 border-t border-gray-100">
            <button className="w-full py-3 px-4 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors">
              Download App
            </button>
            <button className="w-full py-3 px-4 border border-gray-300 text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
