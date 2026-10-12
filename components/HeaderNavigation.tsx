"use client";

import React, { useState } from "react";
import { Menu, X, ArrowRight, ShieldCheck } from "lucide-react";

interface HeaderNavigationProps {
  onOpenBooking: () => void;
}

export function HeaderNavigation({ onOpenBooking }: HeaderNavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#F5F5DC]/95 backdrop-blur-md border-b border-[#0A192F]/15 transition-all">
      {/* Top Banner Notice */}
      <div className="bg-[#0A192F] text-stone-200 text-xs py-1.5 px-4 text-center flex items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] font-semibold text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse"></span>
          Now Open: Tagas, Daraga, Albay
        </span>
        <span className="hidden sm:inline text-stone-500">•</span>
        <span className="hidden sm:inline text-stone-300">
          2nd Floor Biak Realty Corporation (Beside Mayon Petroleum)
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Z-Pattern Step 1: Top-Left Eye Focus -> Logo Placeholder */}
        <a href="#" className="flex items-center gap-3.5 group">
          {/* 
            ========================================================================
            [IMAGE PLACEHOLDER: LOGO]
            Swap the placeholder below with your local asset: e.g. /public/logo.png
            ========================================================================
          */}
          <div className="relative w-12 h-12 rounded-xl bg-[#0A192F] border-2 border-[#D4AF37] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform overflow-hidden">
            <span className="font-extrabold text-lg tracking-wider text-[#D4AF37]">
              FNJ
            </span>
            {/* Visual badge highlight */}
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#D4AF37] rounded-full flex items-center justify-center text-[8px] font-black text-[#0A192F]">
              ★
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-extrabold tracking-tight text-[#0A192F] uppercase">
              FNJ Coworking Space
            </span>
            <span className="text-[11px] font-medium tracking-wide text-[#0A192F]/70 flex items-center gap-1">
              <span>Rental & Productivity Hub</span>
              <span className="text-[#D4AF37]">•</span>
              <span className="text-[#D4AF37] font-bold">Daraga, Albay</span>
            </span>
          </div>
        </a>

        {/* Z-Pattern Step 2: Top-Right Eye Scan -> Navigation Links (Strictly NO "About Us" link) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#0A192F]">
          <a
            href="#amenities"
            className="hover:text-[#D4AF37] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-[#D4AF37] after:transition-all"
          >
            Amenities
          </a>
          <a
            href="#pricing"
            className="hover:text-[#D4AF37] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-[#D4AF37] after:transition-all"
          >
            Pricing
          </a>
          <a
            href="#gallery"
            className="hover:text-[#D4AF37] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-[#D4AF37] after:transition-all"
          >
            Gallery
          </a>
          <a
            href="#location"
            className="hover:text-[#D4AF37] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-[#D4AF37] after:transition-all"
          >
            Location
          </a>

          {/* Primary Navy Blue CTA Button with Gold trim */}
          <button
            onClick={onOpenBooking}
            className="px-6 py-2.5 rounded-lg bg-[#0A192F] hover:bg-[#112442] text-white font-bold text-xs uppercase tracking-wider border-2 border-[#D4AF37] shadow-md hover:shadow-lg hover:shadow-[#0A192F]/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Book Now</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
          </button>
        </nav>

        {/* Mobile Hamburger Trigger */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={onOpenBooking}
            className="px-3 py-1.5 rounded-md bg-[#0A192F] text-white font-bold text-xs border border-[#D4AF37]"
          >
            Book Now
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[#0A192F] hover:bg-[#0A192F]/10 transition-colors"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#0A192F]/20 bg-[#F5F5DC] px-4 pt-3 pb-6 space-y-4 shadow-xl">
          <nav className="flex flex-col space-y-3 text-sm font-semibold text-[#0A192F]">
            <a
              href="#amenities"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-[#0A192F]/10 hover:text-[#D4AF37]"
            >
              Amenities
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-[#0A192F]/10 hover:text-[#D4AF37]"
            >
              Pricing
            </a>
            <a
              href="#gallery"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-[#0A192F]/10 hover:text-[#D4AF37]"
            >
              Gallery
            </a>
            <a
              href="#location"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-[#0A192F]/10 hover:text-[#D4AF37]"
            >
              Location
            </a>
          </nav>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenBooking();
            }}
            className="w-full py-3 text-center text-xs uppercase font-extrabold tracking-wider rounded-lg bg-[#0A192F] text-white border-2 border-[#D4AF37] shadow-md flex items-center justify-center gap-2"
          >
            <span>Book Now</span>
            <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
          </button>
        </div>
      )}
    </header>
  );
}
