"use client";

import React, { useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";

interface HeaderNavigationProps {
  onOpenBooking: () => void;
}

export function HeaderNavigation({ onOpenBooking }: HeaderNavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md shadow-sm transition-all duration-300">
      {/* Top Banner Notice */}
      <div className="bg-[#0A192F] text-stone-200 text-xs py-2 px-4 text-center flex items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#D4AF37] text-[#0A192F] font-black text-[11px] uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0A192F] animate-pulse"></span>
          Now Open in Tagas, Daraga, Albay
        </span>
        <span className="hidden sm:inline text-stone-500">•</span>
        <span className="hidden sm:inline text-stone-300 font-medium">
          2nd Floor Biak Realty Corporation (Beside Mayon Petroleum)
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Z-Pattern Step 1: Top-Left Eye Focus -> Logo */}
        <a href="#" className="flex items-center gap-3.5 group">
          <div className="relative w-12 h-12 rounded-2xl bg-[#0A192F] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300 overflow-hidden">
            <span className="font-black text-lg tracking-wider text-[#D4AF37]">
              FNJ
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-black tracking-tight text-[#0A192F] uppercase group-hover:text-[#D4AF37] transition-colors duration-200">
              FNJ Coworking Space
            </span>
            <span className="text-[11px] font-semibold tracking-wide text-[#0A192F]/70 flex items-center gap-1.5">
              <span>Rental & Productivity Hub</span>
              <span className="text-[#D4AF37] font-bold">•</span>
              <span className="text-[#D4AF37] font-black">Daraga, Albay</span>
            </span>
          </div>
        </a>

        {/* Z-Pattern Step 2: Frosted Glass Navigation Links with Smooth Gold Shift */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-[#0A192F]">
          <a
            href="#amenities"
            className="transition-colors duration-200 hover:text-[#D4AF37] py-1"
          >
            Amenities
          </a>
          <a
            href="#pricing"
            className="transition-colors duration-200 hover:text-[#D4AF37] py-1"
          >
            Pricing
          </a>
          <a
            href="#gallery"
            className="transition-colors duration-200 hover:text-[#D4AF37] py-1"
          >
            Gallery
          </a>
          <a
            href="#location"
            className="transition-colors duration-200 hover:text-[#D4AF37] py-1"
          >
            Location
          </a>

          {/* Tactile "Book Now" CTA Button: Hover scale-105, hover:bg-blue-900/90 */}
          <button
            onClick={onOpenBooking}
            className="px-6 py-2.5 rounded-full bg-[#0A192F] text-white font-black text-xs uppercase tracking-wider shadow-sm transition-all duration-200 hover:scale-105 hover:bg-blue-900/90 active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <span>Book Now</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
          </button>
        </nav>

        {/* Mobile Hamburger Trigger */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={onOpenBooking}
            className="px-4 py-2 rounded-full bg-[#0A192F] text-white font-black text-xs uppercase shadow-sm transition-transform duration-200 hover:scale-105 hover:bg-blue-900/90 active:scale-95"
          >
            Book Now
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-[#0A192F] hover:bg-black/5 transition-colors"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md px-6 pt-4 pb-8 space-y-4 shadow-sm border-t border-stone-100">
          <nav className="flex flex-col space-y-3 text-sm font-bold text-[#0A192F]">
            <a
              href="#amenities"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 border-b border-stone-100 hover:text-[#D4AF37] transition-colors"
            >
              Amenities
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 border-b border-stone-100 hover:text-[#D4AF37] transition-colors"
            >
              Pricing
            </a>
            <a
              href="#gallery"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 border-b border-stone-100 hover:text-[#D4AF37] transition-colors"
            >
              Gallery
            </a>
            <a
              href="#location"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 border-b border-stone-100 hover:text-[#D4AF37] transition-colors"
            >
              Location
            </a>
          </nav>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenBooking();
            }}
            className="w-full py-3.5 text-center text-xs uppercase font-black tracking-wider rounded-xl bg-[#0A192F] text-white shadow-sm transition-transform duration-200 hover:scale-105 hover:bg-blue-900/90 active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Book Now</span>
            <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
          </button>
        </div>
      )}
    </header>
  );
}
