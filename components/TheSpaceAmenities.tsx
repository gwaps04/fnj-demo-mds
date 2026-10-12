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
  // Required 4 Core Amenities
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
    <section id="amenities" className="py-24 sm:py-28 bg-[#F5F5DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0A192F] text-[#D4AF37] text-xs font-bold uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            2nd Floor Facilities
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0A192F] tracking-tight uppercase">
            The Space & Amenities
          </h2>
          <div className="w-20 h-1 bg-[#D4AF37] mx-auto rounded-full" />
          <p className="text-sm sm:text-base text-[#0A192F]/80 leading-relaxed font-medium pt-2">
            Engineered from the ground up for Albay’s freelancers, remote professionals,
            college students, and digital creators who require absolute reliability.
          </p>
        </div>

        {/* 4 Core Amenities: Pure White Cards with Soft Subtle Shadows and Zero Harsh Borders */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {coreAmenities.map((amenity) => {
            const IconComponent = amenity.icon;
            return (
              <div
                key={amenity.id}
                className="relative rounded-3xl bg-white p-8 sm:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    {/* Sleek Borderless Icon Container */}
                    <div className="w-14 h-14 rounded-2xl bg-[#0A192F] flex items-center justify-center text-[#D4AF37] shadow-sm group-hover:scale-105 transition-transform">
                      <IconComponent className="w-7 h-7" />
                    </div>

                    {/* Sleek Borderless Badge */}
                    <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#0A192F] text-[#D4AF37]">
                      {amenity.badge}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    <h3 className="text-lg font-black tracking-wide text-[#0A192F]">
                      {amenity.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#0A192F]/70 leading-relaxed font-normal">
                      {amenity.description}
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-stone-100 flex items-center gap-2 text-xs text-[#0A192F] font-semibold">
                  <CheckCircle className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>Included in every pass</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Albay Local Power Continuity: Pure White Card with Soft Shadow and Zero Harsh Borders */}
        <div className="rounded-3xl bg-white p-8 sm:p-12 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
          <div className="grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0A192F] text-[#D4AF37] text-xs font-black uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5" /> Albay Power Continuity Standard
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#0A192F] tracking-tight">
                Brownouts? Never a Blip on Your Screen.
              </h3>
              <p className="text-sm text-[#0A192F]/70 leading-relaxed max-w-2xl font-normal">
                When sudden weather conditions or grid load-shedding hit Daraga and Legazpi,
                our on-site commercial diesel generator automatically triggers within seconds.
                Stay focused on your deliverables without anxiety.
              </p>
            </div>

            <div className="md:col-span-4 bg-[#F5F5DC] p-6 rounded-2xl text-xs text-[#0A192F] space-y-3">
              <div className="font-black text-[#0A192F] uppercase text-xs tracking-wider flex items-center gap-1.5">
                <span className="text-[#D4AF37]">★</span> Every Pass Includes:
              </div>
              <ul className="space-y-2">
                {bonusAmenities.map((bonus, bIdx) => (
                  <li key={bIdx} className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span className="font-medium text-[#0A192F]/80">{bonus.title}</span>
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
