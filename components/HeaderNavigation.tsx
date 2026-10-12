"use client";

import React, { useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";

interface HeaderNavigationProps {
  onOpenBooking: () => void;
}

export function HeaderNavigation({ onOpenBooking }: HeaderNavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#F5F5DC]/90 backdrop-blur-md transition-all">
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
          {/* Sleek Borderless Logo Container with Soft Shadow */}
          <div className="relative w-12 h-12 rounded-2xl bg-[#0A192F] flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.06)] group-hover:scale-105 transition-transform overflow-hidden">
            <span className="font-black text-lg tracking-wider text-[#D4AF37]">
              FNJ
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-black tracking-tight text-[#0A192F] uppercase">
              FNJ Coworking Space
            </span>
            <span className="text-[11px] font-semibold tracking-wide text-[#0A192F]/70 flex items-center gap-1.5">
              <span>Rental & Productivity Hub</span>
              <span className="text-[#D4AF37] font-bold">•</span>
              <span className="text-[#D4AF37] font-black">Daraga, Albay</span>
            </span>
          </div>
        </a>

        {/* Z-Pattern Step 2: Navigation Links (Strictly NO "About Us" link) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-[#0A192F]">
          <a
            href="#amenities"
            className="hover:text-[#D4AF37] transition-colors py-1"
          >
            Amenities
          </a>
          <a
            href="#pricing"
            className="hover:text-[#D4AF37] transition-colors py-1"
          >
            Pricing
          </a>
          <a
            href="#gallery"
            className="hover:text-[#D4AF37] transition-colors py-1"
          >
            Gallery
          </a>
          <a
            href="#location"
            className="hover:text-[#D4AF37] transition-colors py-1"
          >
            Location
          </a>

          {/* Sleek Borderless Solid Navy CTA Button with Gold Text */}
          <button
            onClick={onOpenBooking}
            className="px-6 py-2.5 rounded-full bg-[#0A192F] hover:bg-[#112442] text-white font-black text-xs uppercase tracking-wider shadow-[0_4px_14px_rgba(10,25,47,0.15)] hover:shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Book Now</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
          </button>
        </nav>

        {/* Mobile Hamburger Trigger */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={onOpenBooking}
            className="px-4 py-2 rounded-full bg-[#0A192F] text-white font-black text-xs uppercase shadow-sm"
          >
            Book Now
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-[#0A192F] hover:bg-[#0A192F]/5 transition-colors"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md px-6 pt-4 pb-8 space-y-4 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
          <nav className="flex flex-col space-y-3 text-sm font-bold text-[#0A192F]">
            <a
              href="#amenities"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 border-b border-stone-100 hover:text-[#D4AF37]"
            >
              Amenities
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 border-b border-stone-100 hover:text-[#D4AF37]"
            >
              Pricing
            </a>
            <a
              href="#gallery"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 border-b border-stone-100 hover:text-[#D4AF37]"
            >
              Gallery
            </a>
            <a
              href="#location"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 border-b border-stone-100 hover:text-[#D4AF37]"
            >
              Location
            </a>
          </nav>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenBooking();
            }}
            className="w-full py-3.5 text-center text-xs uppercase font-black tracking-wider rounded-xl bg-[#0A192F] text-white shadow-sm flex items-center justify-center gap-2"
          >
            <span>Book Now</span>
            <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
          </button>
        </div>
      )}
    </header>
  );
}
