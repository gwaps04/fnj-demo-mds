"use client";

import React from "react";
import Image from "next/image";
import { Trophy, CheckCircle2, ArrowRight, Clock } from "lucide-react";

interface SpecialAttractionPickleballProps {
  onOpenBooking: () => void;
}

export function SpecialAttractionPickleball({
  onOpenBooking,
}: SpecialAttractionPickleballProps) {
  return (
    <section className="py-24 sm:py-28 bg-[#F5F5DC] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Sleek Borderless Container with Soft Navy Shadow and Generous Breathing Room */}
        <div className="rounded-3xl bg-[#0A192F] text-white shadow-[0_10px_30px_rgba(10,25,47,0.12)] p-8 sm:p-14 lg:p-16 relative overflow-hidden">
          {/* Subtle gold glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 blur-[100px] pointer-events-none rounded-full" />

          <div className="grid lg:grid-cols-12 gap-12 items-center relative z-10">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-7">
              {/* Sleek Borderless Pill Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37] text-[#0A192F] text-xs font-black uppercase tracking-wider shadow-sm">
                <Trophy className="w-4 h-4 fill-[#0A192F]" />
                Special Attraction • 3rd Floor
              </div>

              {/* Required Exact Headline */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight uppercase">
                You may also play and enjoy{" "}
                <span className="text-[#D4AF37] underline decoration-[#D4AF37]/50 underline-offset-8">
                  FNJ Pickleball
                </span>{" "}
                at the 3rd Floor.
              </h2>

              <p className="text-sm sm:text-base text-stone-200 leading-relaxed font-normal">
                Finish your deep-focus work session on the 2nd floor and head straight upstairs
                for an invigorating rally! Albay’s dedicated indoor pickleball court features
                cushioned tournament surfaces, high ceilings, night LED floodlights, and gear rentals.
              </p>

              {/* Features List */}
              <div className="grid sm:grid-cols-2 gap-3.5 pt-1 text-xs text-stone-200">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#112442]">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span className="font-medium">Regulation indoor court (rain or shine)</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#112442]">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span className="font-medium">Paddle & ball rentals on site</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#112442]">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span className="font-medium">Beginner clinics & weekly mixers</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#112442]">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span className="font-medium">Shower & spectator viewing lounge</span>
                </div>
              </div>

              {/* Sleek Borderless CTA Buttons */}
              <div className="pt-3 flex flex-wrap items-center gap-4">
                <button
                  onClick={onOpenBooking}
                  className="px-8 py-4 rounded-xl bg-[#D4AF37] text-[#0A192F] font-black text-xs sm:text-sm uppercase tracking-wider shadow-sm transition-transform duration-200 hover:scale-105 hover:bg-[#b8952b] active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <span>Book Pickleball Slot</span>
                  <ArrowRight className="w-4 h-4 text-[#0A192F]" />
                </button>

                <div className="text-xs text-[#D4AF37] font-bold flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>Court slots starting at ₱300/hour</span>
                </div>
              </div>
            </div>

            {/* Right Column: Actual 3rd Floor Pickleball Court Photo */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden shadow-xl bg-stone-900 min-h-[340px] sm:min-h-[420px] h-full flex flex-col justify-end p-6 sm:p-8 group">
                {/* Optimized Next.js Image of 3rd Floor Pickleball Court */}
                <Image
                  src="/hero7.jpg"
                  alt="FNJ 3rd Floor Indoor Pickleball Court in Tagas, Daraga, Albay"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />

                {/* Legibility Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/95 via-[#0A192F]/30 to-transparent pointer-events-none" />

                {/* Overlaid Information Badge & Caption */}
                <div className="relative z-10 space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37] text-[#0A192F] text-[10px] font-black uppercase tracking-wider shadow-sm">
                    <Trophy className="w-3 h-3 fill-[#0A192F]" />
                    3rd Floor Indoor Court
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-white leading-tight">
                    Tournament-Marked Indoor Facility
                  </h4>
                  <p className="text-xs text-stone-300 leading-relaxed font-normal">
                    Rain-or-shine air ventilation, cushioned flooring, and night LED floodlights above the coworking space.
                  </p>
                </div>

                {/* Overlaid Corner Badge */}
                <div className="absolute top-4 right-4 z-20 px-3.5 py-1 rounded-full bg-[#0A192F]/90 backdrop-blur-md text-[#D4AF37] text-[10px] font-black uppercase tracking-wider shadow-sm border border-[#D4AF37]/30">
                  Level 3 Sports
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
