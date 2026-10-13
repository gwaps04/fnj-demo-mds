"use client";

// FILE: components/AnnouncementBanner.tsx
import React, { useState, useEffect } from "react";
import { Sparkles, ArrowRight, X, Megaphone, Tag } from "lucide-react";
import { getActivePromos, PromoAnnouncement } from "@/lib/promos";

interface AnnouncementBannerProps {
  onOpenBooking: () => void;
}

export function AnnouncementBanner({ onOpenBooking }: AnnouncementBannerProps) {
  const [activePromos, setActivePromos] = useState<PromoAnnouncement[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  const loadPromos = () => {
    const list = getActivePromos().filter(
      (p) => p.displayLocation === "banner" || p.displayLocation === "both"
    );
    setActivePromos(list);
  };

  useEffect(() => {
    loadPromos();

    const handleSync = () => {
      loadPromos();
    };

    window.addEventListener("fnj-promos-changed", handleSync);
    window.addEventListener("storage", handleSync);

    return () => {
      window.removeEventListener("fnj-promos-changed", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  // Auto rotate banner if multiple announcements
  useEffect(() => {
    if (activePromos.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activePromos.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activePromos.length]);

  if (isDismissed || activePromos.length === 0) {
    return null;
  }

  const currentPromo = activePromos[currentIndex] || activePromos[0];

  return (
    <div className="bg-[#0A192F] text-white border-b border-[#D4AF37]/30 relative z-50 text-xs py-2 px-3 sm:px-6 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Badge & Announcement Title */}
        <div className="flex items-center gap-2.5 overflow-hidden flex-1">
          <span className="px-2 py-0.5 rounded-full bg-[#D4AF37] text-[#0A192F] text-[10px] font-black uppercase tracking-wider shrink-0 flex items-center gap-1 shadow-xs">
            <Sparkles className="w-3 h-3 fill-[#0A192F]" />
            <span>{currentPromo.badge || "PROMO"}</span>
          </span>

          <p className="font-semibold text-white truncate text-[11px] sm:text-xs">
            <span className="font-black text-[#D4AF37] mr-1.5">{currentPromo.title}</span>
            {currentPromo.discountCode && (
              <span className="hidden md:inline font-mono text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-stone-200 mr-1.5">
                Code: {currentPromo.discountCode}
              </span>
            )}
            <span className="hidden lg:inline text-stone-300">
              — {currentPromo.description}
            </span>
          </p>
        </div>

        {/* Right: CTA & Dismiss Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenBooking}
            className="px-2.5 py-1 rounded-lg bg-[#D4AF37] hover:bg-[#b8952b] text-[#0A192F] font-black text-[10px] sm:text-xs uppercase tracking-wider transition-transform hover:scale-105 active:scale-95 flex items-center gap-1 cursor-pointer shadow-xs"
          >
            <span>{currentPromo.ctaText || "Claim Pass"}</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          <button
            onClick={() => setIsDismissed(true)}
            className="w-6 h-6 rounded-md hover:bg-white/10 text-stone-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Dismiss announcement"
            title="Dismiss announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
