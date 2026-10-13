"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  Compass,
} from "lucide-react";

interface FooterLocationProps {
  onOpenBooking: () => void;
}

export function FooterLocation({ onOpenBooking }: FooterLocationProps) {
  const [copied, setCopied] = useState(false);
  const fullAddress =
    "2nd Floor Biak Realty Corporation, Lakandula Drive, Tagas, Daraga, Albay";

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(fullAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <footer id="location" className="bg-[#0A192F] text-white">
      {/* Location Showcase Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Brand & Exact Address */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#0A192F] p-1.5 flex items-center justify-center shadow-sm overflow-hidden border border-[#D4AF37]/30 shrink-0">
                <Image
                  src="/fnj-logo.png"
                  alt="FNJ Coworking Logo"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h3 className="text-xl font-black text-white tracking-tight uppercase">
                  FNJ Coworking Space
                </h3>
                <p className="text-xs text-[#D4AF37] font-bold tracking-wide">
                  Rental & Productivity Hub • Daraga, Albay
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-normal">
              Escape home interruptions and power outages in Albay. FNJ pairs
              commercial generator protection with high-speed fiber Wi-Fi, air-conditioned
              comfort, bottomless coffee, and Albay’s thrilling 3rd-floor indoor pickleball court.
            </p>

            {/* Required Exact Address Card (Borderless, Soft Padding) */}
            <div className="p-6 rounded-3xl bg-[#112442] space-y-3 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-[#D4AF37] text-[#0A192F] shrink-0 mt-0.5 shadow-sm">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] block">
                      Facility Address
                    </span>
                    <p className="text-sm font-bold text-white leading-snug mt-0.5">
                      {fullAddress}
                    </p>
                    <p className="text-xs text-[#D4AF37] mt-1 font-semibold">
                      ★ Landmark: Beside Mayon Petroleum Gas Station
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleCopy}
                  className="shrink-0 px-3 py-1.5 rounded-xl bg-[#0A192F] hover:bg-black text-stone-200 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                  title="Copy full address"
                >
                  {copied ? (
                    <div className="flex items-center gap-1 text-[#D4AF37]">
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <Copy className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Copy</span>
                    </div>
                  )}
                </button>
              </div>

              <div className="pt-3 border-t border-white/10 text-[11px] text-stone-300 flex items-center gap-2 font-normal">
                <Compass className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>3 mins from Daraga Public Market • 7 mins from Legazpi City Center</span>
              </div>
            </div>
          </div>

          {/* Middle Column: Operating Hours & Quick Navigation */}
          <div className="lg:col-span-4 space-y-6">
            <div className="space-y-3">
              <h4 className="text-sm font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-2">
                <Clock className="w-4 h-4" /> Operating Hours
              </h4>
              <div className="space-y-2.5 text-xs text-stone-300 bg-[#112442] p-6 rounded-3xl shadow-sm">
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span className="text-stone-400">Monday – Saturday:</span>
                  <span className="font-bold text-white">8:00 AM – 10:00 PM</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span className="text-stone-400">Sunday:</span>
                  <span className="font-bold text-white">9:00 AM – 8:00 PM</span>
                </div>
                <div className="flex justify-between pt-1 text-[#D4AF37] font-semibold">
                  <span>Monthly Members:</span>
                  <span>Extended Keycard Access</span>
                </div>
              </div>
            </div>

            {/* Social Links (With required Facebook Icon Placeholder) */}
            <div className="space-y-3">
              <h4 className="text-sm font-black uppercase tracking-wider text-[#D4AF37]">
                Connect With Us
              </h4>
              <p className="text-xs text-stone-400 leading-relaxed font-normal">
                Follow our community page for daily desk availability and pickleball court mixers:
              </p>

              <div className="flex items-center gap-3 pt-1">
                {/* Facebook Social Link */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-black shadow-sm transition-all group"
                  aria-label="Visit FNJ on Facebook"
                >
                  <svg
                    className="w-4 h-4 fill-current group-hover:scale-110 transition-transform"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>Facebook: FNJ Coworking & Pickleball</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Final CTA "Book Today" */}
          <div className="lg:col-span-3 rounded-3xl bg-[#112442] p-8 text-center space-y-5 shadow-sm">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] bg-[#0A192F] px-3 py-1 rounded-full inline-block">
              Fast Online Reservation
            </span>

            <h4 className="text-xl font-black text-white uppercase tracking-tight">
              Ready to Secure Your Spot?
            </h4>

            <p className="text-xs text-stone-300 leading-relaxed font-normal">
              Book hourly passes, private conference suites, or 3rd floor pickleball slots in seconds.
            </p>

            {/* Required Final Navy Blue "Book Today" CTA Button (Sleek Borderless, Tactile Hover) */}
            <button
              onClick={onOpenBooking}
              className="w-full py-4 rounded-xl bg-[#0A192F] text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-sm transition-transform duration-200 hover:scale-105 hover:bg-blue-900/90 active:scale-95 flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>Book Today</span>
              <ArrowRight className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="text-[11px] text-stone-400 flex items-center justify-center gap-1.5 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Walk-ins are also warmly welcome</span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Admin CRM Portal */}
        <div className="pt-10 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div>
            © {new Date().getFullYear()} FNJ Coworking Space Rental & Pickleball Club. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px]">
            <span className="text-[#D4AF37] font-semibold">
              Tagas, Daraga, Albay, Philippines
            </span>
            <span>•</span>
            <Link
              href="/admin"
              className="text-stone-300 hover:text-[#D4AF37] font-bold underline underline-offset-4 transition-colors"
            >
              Admin CRM Portal &rarr;
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
