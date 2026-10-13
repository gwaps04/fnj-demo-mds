"use client";

// FILE: components/HeaderNavigation.tsx
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  ArrowRight,
  Sparkles,
  MapPin,
  Clock,
  Layers,
  Tag,
  Image as ImageIcon,
  Phone,
  ShieldCheck,
  LayoutDashboard,
} from "lucide-react";

interface HeaderNavigationProps {
  onOpenBooking: () => void;
}

export function HeaderNavigation({ onOpenBooking }: HeaderNavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer on Escape key press
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setMobileMenuOpen(false);
    }
  }, []);

  // Close mobile drawer when window resizes to desktop breakpoint (>= 1024px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  // Lock body scroll safely when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      const scrollY = window.scrollY;
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
      return () => {
        document.body.style.overflow = "";
        document.body.style.touchAction = "";
        window.scrollTo(0, scrollY);
      };
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
  }, [mobileMenuOpen]);

  const navLinks = [
    {
      name: "Promos",
      href: "#promos",
      desc: "Live Deals & Bulletin",
      icon: Sparkles,
    },
    {
      name: "Amenities",
      href: "#amenities",
      desc: "2nd Floor Facilities & Fiber",
      icon: Layers,
    },
    {
      name: "Pricing",
      href: "#pricing",
      desc: "Student & Regular Hourly Passes",
      icon: Tag,
    },
    {
      name: "Gallery",
      href: "#gallery",
      desc: "Spaces, Desks & Atmosphere",
      icon: ImageIcon,
    },
    {
      name: "Location",
      href: "#location",
      desc: "Tagas, Daraga, Albay",
      icon: MapPin,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md shadow-sm transition-all duration-300">
      {/* 
        ========================================================================
        1. TOP NOTICE ANNOUNCEMENT BAR
        Responsive across XS (320px), Mobile, Tablet, and Desktop.
        ========================================================================
      */}
      <div className="bg-[#0A192F] text-stone-200 text-xs py-2 px-3 sm:px-4 text-center flex items-center justify-center gap-2 overflow-hidden border-b border-[#0A192F]/20">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D4AF37] text-[#0A192F] font-black text-[10px] sm:text-[11px] uppercase tracking-wider shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0A192F] animate-pulse"></span>
          Now Open in Tagas, Daraga
        </span>
        <span className="hidden md:inline text-stone-500">•</span>
        <span className="hidden md:inline text-stone-300 font-medium text-xs truncate max-w-xl">
          2nd Floor Biak Realty Corporation (Beside Mayon Petroleum Gas Station)
        </span>
      </div>

      {/* 
        ========================================================================
        2. MAIN NAVIGATION HEADER CONTAINER
        Breakpoint: Desktop (>= 1024px: lg), Mobile & Tablet (< 1024px)
        Ensures NO overlap or wrapping collision on 768px-1023px tablet screens.
        ========================================================================
      */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-3">
        {/* Brand / Logo Anchor */}
        <a
          href="#"
          className="flex items-center gap-2.5 sm:gap-3.5 group shrink-0 min-w-0"
          aria-label="FNJ Coworking Space Rental Home"
        >
          {/* Logo Badge */}
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-[#0A192F] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300 shrink-0">
            <span className="font-black text-base sm:text-lg tracking-wider text-[#D4AF37]">
              FNJ
            </span>
          </div>

          {/* Brand Typography with Fluid Responsive Sizing */}
          <div className="flex flex-col min-w-0">
            <span className="text-sm sm:text-base lg:text-lg font-black tracking-tight text-[#0A192F] uppercase truncate group-hover:text-[#D4AF37] transition-colors duration-200">
              FNJ Coworking
            </span>
            <span className="text-[10px] sm:text-[11px] font-semibold tracking-wide text-[#0A192F]/70 flex items-center gap-1 truncate">
              <span className="hidden min-[380px]:inline">Space Rental</span>
              <span className="hidden min-[380px]:inline text-[#D4AF37]">•</span>
              <span className="text-[#D4AF37] font-black">Daraga, Albay</span>
            </span>
          </div>
        </a>

        {/* 
          ========================================================================
          DESKTOP NAVIGATION (1024px+ lg)
          Amenities, Pricing, Gallery, Location, Book Now
          (Strictly NO 'About Us' link as required)
          ========================================================================
        */}
        <nav className="hidden lg:flex items-center lg:gap-6 xl:gap-8 text-sm font-bold text-[#0A192F]">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="py-2 text-[#0A192F] hover:text-[#D4AF37] transition-colors duration-200 whitespace-nowrap cursor-pointer relative group"
            >
              <span>{link.name}</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF37] group-hover:w-full transition-all duration-300 rounded-full" />
            </a>
          ))}

          {/* Admin CRM Link */}
          <Link
            href="/admin"
            className="px-3.5 py-2 rounded-full border border-[#0A192F]/20 text-[#0A192F] hover:bg-[#0A192F] hover:text-[#D4AF37] font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
            title="Operations CRM Dashboard"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Admin CRM</span>
          </Link>

          {/* Desktop Tactile Book Now CTA Button */}
          <button
            onClick={onOpenBooking}
            className="px-6 py-2.5 rounded-full bg-[#0A192F] text-white font-black text-xs uppercase tracking-wider shadow-sm transition-transform duration-200 hover:scale-105 hover:bg-blue-900/90 active:scale-95 flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 group"
          >
            <span>Book Now</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37] group-hover:translate-x-0.5 transition-transform" />
          </button>
        </nav>

        {/* 
          ========================================================================
          MOBILE & TABLET CONTROLS (< 1024px: lg:hidden)
          Includes fast Book Now CTA (screen width >= 480px) + 44px Touch Hamburger
          ========================================================================
        */}
        <div className="flex items-center gap-2.5 lg:hidden shrink-0">
          {/* Quick Book CTA on medium mobile & tablet screens */}
          <button
            onClick={onOpenBooking}
            className="hidden sm:inline-flex px-4 py-2 rounded-full bg-[#0A192F] text-white font-black text-xs uppercase tracking-wider shadow-sm transition-transform duration-200 hover:scale-105 hover:bg-blue-900/90 active:scale-95 whitespace-nowrap cursor-pointer items-center gap-1.5"
          >
            <span>Book Now</span>
            <ArrowRight className="w-3 h-3 text-[#D4AF37]" />
          </button>

          {/* Touch-First 44x44px Hamburger Trigger */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="w-11 h-11 flex items-center justify-center rounded-xl bg-stone-100/80 hover:bg-stone-200/80 active:bg-stone-300/80 text-[#0A192F] transition-colors cursor-pointer border border-stone-200/50"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-[#0A192F]" />
            ) : (
              <Menu className="w-5 h-5 text-[#0A192F]" />
            )}
          </button>
        </div>
      </div>

      {/* 
        ========================================================================
        3. ACCESSIBLE RESPONSIVE SLIDE-OVER DRAWER (< 1024px)
        - Works across every aspect ratio (Portrait 9:16, Landscape 16:9, Tablets 4:3, Foldables).
        - Uses 100dvh (dynamic viewport height) so mobile browser address bars never clip content.
        - Click outside backdrop to close.
        - Integrated Escape key support and resize listener.
        ========================================================================
      */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          className="fixed inset-0 z-[60] lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Drawer"
        >
          {/* Dimmed Blurred Backdrop with dismiss tap */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            aria-hidden="true"
          />

          {/* Drawer Panel: Slide in from right (or full-width on narrow mobile) */}
          <div className="fixed inset-y-0 right-0 w-full max-w-sm sm:max-w-md bg-white shadow-2xl flex flex-col h-[100dvh] z-[61] border-l border-stone-100 animate-in slide-in-from-right duration-300">
            {/* Drawer Header with Logo & Close Button */}
            <div className="h-18 sm:h-20 px-6 flex items-center justify-between border-b border-stone-100 bg-[#F5F5DC]/40 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#0A192F] flex items-center justify-center text-[#D4AF37] font-black text-sm">
                  FNJ
                </div>
                <div>
                  <h3 className="font-black text-sm text-[#0A192F] uppercase">
                    FNJ Coworking
                  </h3>
                  <p className="text-[10px] text-[#0A192F]/60 font-semibold">
                    Tagas, Daraga, Albay
                  </p>
                </div>
              </div>

              {/* Close Button (44x44px touch target) */}
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-11 h-11 flex items-center justify-center rounded-xl bg-stone-100 hover:bg-stone-200 text-[#0A192F] transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Navigation Body (Supports short aspect ratios e.g. 16:9 mobile landscape) */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 overscroll-contain">
              {/* Navigation Links */}
              <nav className="flex flex-col space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#0A192F]/50 px-3 mb-2">
                  Navigation Menu
                </span>

                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="group flex items-center justify-between p-3.5 rounded-2xl text-[#0A192F] hover:bg-[#F5F5DC] active:bg-[#F5F5DC]/80 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-[#0A192F] text-[#D4AF37] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="font-black text-sm text-[#0A192F] group-hover:text-[#D4AF37] transition-colors block">
                            {link.name}
                          </span>
                          <span className="text-xs text-[#0A192F]/60 font-medium">
                            {link.desc}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all" />
                    </a>
                  );
                })}
              </nav>

              {/* Primary Call to Action Card in Drawer */}
              <div className="p-5 rounded-2xl bg-[#0A192F] text-white space-y-3 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Instant Desk & Room Reservation</span>
                </div>
                <h4 className="text-base font-black text-white">
                  Reserve Your Workspace Today
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed font-normal">
                  Guaranteed airconditioned seats, high-speed fiber internet, and 100% generator backup in Albay.
                </p>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenBooking();
                  }}
                  className="w-full py-3.5 rounded-xl bg-[#D4AF37] text-[#0A192F] font-black text-xs uppercase tracking-wider shadow-sm transition-transform duration-200 hover:scale-102 hover:bg-[#b8952b] active:scale-95 flex items-center justify-center gap-2 cursor-pointer mt-1"
                >
                  <span>Book Now</span>
                  <ArrowRight className="w-4 h-4 text-[#0A192F]" />
                </button>

                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-xl border border-white/20 text-white font-bold text-xs uppercase tracking-wider hover:bg-white/10 transition-colors flex items-center justify-center gap-2 cursor-pointer mt-1"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Admin CRM Portal</span>
                </Link>
              </div>

              {/* Quick Facility Guide Snippet at Bottom */}
              <div className="p-4 rounded-2xl bg-[#F5F5DC]/70 border border-stone-200/40 text-xs text-[#0A192F] space-y-2">
                <div className="font-bold flex items-center gap-2 text-[#0A192F]">
                  <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>2nd Floor Biak Realty Corp., Tagas, Daraga</span>
                </div>
                <div className="text-[11px] text-[#0A192F]/70 flex items-center gap-2 font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#0A192F]/50 shrink-0" />
                  <span>Mon-Sat: 8AM-10PM • Sun: 9AM-8PM</span>
                </div>
                <div className="text-[11px] text-[#0A192F]/70 flex items-center gap-2 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                  <span>Beside Mayon Petroleum Gas Station</span>
                </div>
              </div>
            </div>

            {/* Sticky Drawer Footer */}
            <div className="p-4 border-t border-stone-100 bg-stone-50 text-center text-[11px] text-[#0A192F]/60 shrink-0 font-medium">
              FNJ Coworking & 3F Pickleball Club • Daraga, Albay
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
