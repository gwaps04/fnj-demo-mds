"use client";

import React from "react";
import {
  Wifi,
  Zap,
  Wind,
  Armchair,
  Coffee,
  ShieldCheck,
  CheckCircle,
  Sparkles,
} from "lucide-react";

export function TheSpaceAmenities() {
  // Required 4 Core Amenities + Supporting Perks
  const coreAmenities = [
    {
      id: "internet",
      title: "HIGH-SPEED INTERNET",
      badge: "Dual-WAN Fiber",
      description:
        "Low-latency, symmetrical high-speed fiber internet designed for seamless Zoom calls, cloud uploads, and uninterrupted remote workflows.",
      icon: Wifi,
    },
    {
      id: "power",
      title: "POWER OUTLETS",
      badge: "Generator-Backed",
      description:
        "Abundant dedicated 220V power outlets and surge-protected strips at every workstation. Brownout-proof automatic diesel generator on site.",
      icon: Zap,
    },
    {
      id: "aircon",
      title: "AIRCONDITIONED SPACE",
      badge: "Inverter Climate",
      description:
        "Whisper-quiet commercial inverter air-conditioning maintaining a crisp, refreshing, and odor-free working environment throughout the day.",
      icon: Wind,
    },
    {
      id: "environment",
      title: "COMFORTABLE ENVIRONMENT",
      badge: "Ergonomic & Quiet",
      description:
        "Ergonomic mesh chairs, spacious wooden desk surfaces, sound-dampened acoustic ambiance, and natural daylight for zero eye fatigue.",
      icon: Armchair,
    },
  ];

  const bonusAmenities = [
    { title: "Unlimited Fresh Brewed Coffee & Purified Water", icon: Coffee },
    { title: "Commercial Generator with Instant Automatic Transfer Switch", icon: Zap },
    { title: "Acoustic Phone Booth for Private Zoom / Voice Calls", icon: ShieldCheck },
    { title: "High-Resolution Printing & Scanning Station Available", icon: Sparkles },
  ];

  return (
    <section id="amenities" className="py-20 bg-[#F5F5DC] border-b-2 border-[#0A192F]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0A192F] text-[#D4AF37] text-xs font-bold uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            2nd Floor Facilities
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0A192F] tracking-tight uppercase">
            The Space & Amenities
          </h2>
          <div className="w-24 h-1.5 bg-[#D4AF37] mx-auto rounded-full" />
          <p className="text-sm sm:text-base text-[#0A192F]/80 leading-relaxed font-medium">
            Engineered from the ground up for Albay’s freelancers, remote professionals,
            college students, and digital creators who require absolute reliability.
          </p>
        </div>

        {/* 4 Core Amenities with Solid Navy Blue background blocks and Gold accents */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {coreAmenities.map((amenity) => {
            const IconComponent = amenity.icon;
            return (
              <div
                key={amenity.id}
                className="relative rounded-2xl bg-[#0A192F] text-white p-7 border-2 border-[#D4AF37]/80 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all flex flex-col justify-between group"
              >
                {/* Gold Accent Top Bar */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    {/* Placeholder SVG Icon Container */}
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#1B2A4A] to-[#0A192F] border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shadow-lg group-hover:scale-110 transition-transform">
                      <IconComponent className="w-7 h-7" />
                    </div>

                    <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40">
                      {amenity.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-black tracking-wide text-white group-hover:text-[#D4AF37] transition-colors">
                    {amenity.title}
                  </h3>

                  <p className="text-xs text-stone-300 leading-relaxed font-normal">
                    {amenity.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-1.5 text-xs text-[#D4AF37] font-semibold">
                  <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
                  <span>Always included in all passes</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Albay Local Brownout-Proof Guarantee Banner */}
        <div className="rounded-2xl bg-[#0A192F] border-2 border-[#D4AF37] p-6 sm:p-8 text-white shadow-xl">
          <div className="grid md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
                <Zap className="w-4 h-4" /> Albay Power Continuity Standard
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Brownouts? Never a Blip on Your Screen.
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                When sudden weather conditions or grid load-shedding hit Daraga and Legazpi,
                our on-site commercial diesel generator automatically triggers within seconds.
                Stay focused on your deliverables without anxiety.
              </p>
            </div>

            <div className="md:col-span-4 bg-[#112442] p-4 rounded-xl border border-[#D4AF37]/30 text-xs text-stone-200 space-y-2">
              <div className="font-bold text-[#D4AF37] uppercase text-[11px] tracking-wider">
                Every Pass Includes:
              </div>
              <ul className="space-y-1.5">
                {bonusAmenities.map((bonus, bIdx) => (
                  <li key={bIdx} className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span>{bonus.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
