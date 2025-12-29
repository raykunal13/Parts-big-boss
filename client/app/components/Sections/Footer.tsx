"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-700 pt-20 pb-10 border-t border-[var(--brand-red)]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Column 1: Brand Info (Spans 4 columns on large screens) */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent)] text-white font-bold text-2xl shadow-lg transition-transform group-hover:scale-105">
                P
              </div>
              <span className="font-bold text-3xl tracking-tight text-white group hover:text-[var(--accent)] transition-colors">
                PartsBigBoss
              </span>
            </Link>
            <p className="text-gray-700 text-base leading-relaxed max-w-sm">
              Your trusted partner for premium automotive parts. Genuine components, unbeatable prices, and express delivery nationwide.
            </p>
            <div className="flex gap-4 pt-2">
              <SocialIcon icon={<Facebook size={20} />} href="#" label="Facebook" />
              <SocialIcon icon={<Instagram size={20} />} href="#" label="Instagram" />
              <SocialIcon icon={<Twitter size={20} />} href="#" label="Twitter" />
              <SocialIcon 
                icon={
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="lucide lucide-message-circle"
                  >
                    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                    {/* Optional: 'phone' inside or just keep it simple as a chat bubble which is cleaner and often used for 'chat' actions */}
                  </svg>
                } 
                href="#" 
                label="WhatsApp" 
              />
            </div>
          </div>

          {/* Column 2: Quick Links (Spans 2 columns) */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-bold mb-6 text-white hover:text-gray-400 tracking-wide">Quick Links</h3>
            <ul className="space-y-4 text-sm text-gray-300">
              <li><FooterLink href="/about">About Us</FooterLink></li>
              <li><FooterLink href="/contact">Contact Support</FooterLink></li>
              <li><FooterLink href="/blog">Automotive Blog</FooterLink></li>
              <li><FooterLink href="/careers">Careers</FooterLink></li>
              <li><FooterLink href="/terms">Terms & Conditions</FooterLink></li>
              <li><FooterLink href="/privacy">Privacy Policy</FooterLink></li>
            </ul>
          </div>

          {/* Column 3: Top Categories (Spans 3 columns) */}
          <div className="lg:col-span-3">
            <h3 className="text-lg font-bold mb-6 text-white tracking-wide hover:text-gray-400">Top Categories</h3>
            <ul className="space-y-4 text-sm text-gray-300">
              <li><FooterLink href="/parts/engine">Engine & Performance</FooterLink></li>
              <li><FooterLink href="/parts/brakes">Brake Systems</FooterLink></li>
              <li><FooterLink href="/parts/suspension">Suspension & Steering</FooterLink></li>
              <li><FooterLink href="/categories/accessories">Car Accessories</FooterLink></li>
              <li><FooterLink href="/parts/electrical">Electrical & Lights</FooterLink></li>
              <li><FooterLink href="/parts/oils">Oils & Fluids</FooterLink></li>
            </ul>
          </div>

          {/* Column 4: Contact & Newsletter (Spans 3 columns) */}
          <div className="lg:col-span-3 space-y-8">
            <div>
              <h3 className="text-lg font-bold mb-6 text-white tracking-wide hover:text-gray-400">Contact Us</h3>
              <ul className="space-y-4 text-sm text-gray-300">
                <li className="flex items-start gap-4">
                  <div className="mt-1 p-1 bg-white/5 rounded-full text-[var(--accent)]">
                    <MapPin size={16} />
                  </div>
                  <span className="leading-relaxed text-gray-600">123 Auto Market Rd, Sector 48,<br />Gurugram, Haryana 122001</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="p-1 bg-white/5 rounded-full text-[var(--accent)]">
                    <Phone size={16} />
                  </div>
                  <span className="font-medium text-gray-600">+91 98765 43210</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="p-1 bg-white/5 rounded-full text-[var(--accent)]">
                    <Mail size={16} />
                  </div>
                  <span className="font-medium text-gray-600">support@partsbigboss.com</span>
                </li>
              </ul>
            </div>

            {/* Newsletter Input */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-sm font-bold text-white mb-2">Subscribe to our newsletter</p>
              <p className="text-xs text-gray-400 mb-4">Get the latest updates and offers.</p>
              <form className="relative flex items-center">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full bg-black/20 border border-white/10 rounded-lg pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-[var(--accent)] focus:bg-black/30 transition-all text-white placeholder:text-gray-500"
                />
                <button 
                  type="submit"
                  className="absolute right-1.5 p-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-md transition-colors shadow-lg"
                  aria-label="Subscribe"
                >
                  <ArrowRight size={16} />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} PartsBigBoss. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-8">
            <Link href="#" className="text:white hover:text-gray-400 ">Sitemap</Link>
            <Link href="#" className="text:white hover:text-gray-400 transition-colors">Cookie Policy</Link>
            <Link href="#" className="text:white hover:text-gray-400 transition-colors">Privacy Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Helper Components for cleaner code
function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="group flex items-center gap-2 hover:text-white transition-colors duration-200"
    >
      <span className="h-1 w-1 rounded-full bg-[var(--accent)] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
      <span className="group-hover:translate-x-1 transition-transform duration-300 text-gray-700">
        {children}
      </span>
    </Link>
  );
}

function SocialIcon({ icon, href, label }: { icon: React.ReactNode; href: string; label: string }) {
  return (
    <a 
      href={href} 
      aria-label={label}
      className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/5 hover:bg-[var(--accent)] hover:border-[var(--accent)] text-gray-300 hover:text-white transition-all duration-300 hover:-translate-y-1 shadow-sm"
    >
      {icon}
    </a>
  );
}
