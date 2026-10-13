"use client";

// FILE: components/PromosSection.tsx
import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Tag,
  Calendar,
  ArrowRight,
  Copy,
  Check,
  Megaphone,
  Gift,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { getActivePromos, PromoAnnouncement } from "@/lib/promos";

interface PromosSectionProps {
  onOpenBooking: () => void;
}

export function PromosSection({ onOpenBooking }: PromosSectionProps) {
  const [activePromos, setActivePromos] = useState<PromoAnnouncement[]>([]);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const loadPromos = () => {
    const list = getActivePromos().filter(
      (p) => p.displayLocation === "section" || p.displayLocation === "both"
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

  const handleCopyCode = (id: string, code: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCodeId(id);
      setTimeout(() => setCopiedCodeId(null), 2000);
    }
  };

  if (activePromos.length === 0) {
    return null; // Gracefully collapses if no section promos are active
  }

  return (
    <section id="promos" className="py-12 sm:py-16 bg-[#F5F5DC] border-t border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0A192F] text-[#D4AF37] text-xs font-black uppercase tracking-widest shadow-xs">
            <Sparkles className="w-3.5 h-3.5 fill-[#D4AF37]" />
            <span>Exclusive Deals & Announcements</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0A192F] tracking-tight">
            Live Albay Member Perks & Promos
          </h2>

          <p className="text-xs sm:text-sm text-[#0A192F]/70">
            Managed directly from our live Daraga hub operations. Claim voucher passes online and present code at our 2nd floor desk.
          </p>
        </div>

        {/* Promo Cards Grid - 5-Tier Responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {activePromos.map((promo) => {
            const isCopied = copiedCodeId === promo.id;
            return (
              <div
                key={promo.id}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between space-y-5 group"
              >
                {/* Card Top: Badge & Validity */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#0A192F] text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 border border-[#D4AF37]/30">
                      <Tag className="w-3 h-3 text-[#B8952B]" />
                      <span>{promo.badge || "PROMO"}</span>
                    </span>

                    <span className="text-[11px] font-bold text-stone-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#D4AF37]" />
                      <span>{promo.validityText}</span>
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="font-black text-lg sm:text-xl text-[#0A192F] tracking-tight group-hover:text-blue-900 transition-colors">
                      {promo.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                      {promo.description}
                    </p>
                  </div>
                </div>

                {/* Card Bottom: Discount Code & CTA */}
                <div className="space-y-3 pt-3 border-t border-stone-100">
                  {promo.discountCode && (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 block">
                          Voucher Code
                        </span>
                        <span className="font-mono font-black text-xs text-[#0A192F]">
                          {promo.discountCode}
                        </span>
                      </div>

                      <button
                        onClick={() => handleCopyCode(promo.id, promo.discountCode!)}
                        className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 hover:border-[#0A192F] text-stone-700 hover:text-[#0A192F] font-bold text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                        title="Copy promo code"
                      >
                        {isCopied ? (
                          <React.Fragment>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-700 font-bold">Copied!</span>
                          </React.Fragment>
                        ) : (
                          <React.Fragment>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </React.Fragment>
                        )}
                      </button>
                    </div>
                  )}

                  <button
                    onClick={onOpenBooking}
                    className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-[#0A192F] text-white hover:bg-blue-900 font-black text-xs uppercase tracking-wider shadow-xs hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{promo.ctaText || "Claim Pass Voucher"}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
