"use client";

import React, { useState } from "react";
import {
  Clock,
  CheckCircle,
  GraduationCap,
  Briefcase,
  Users,
  Sparkles,
  ArrowRight,
  Star,
  ArrowLeftRight,
} from "lucide-react";

interface RatesSectionProps {
  onOpenBooking: () => void;
}

export function RatesSection({ onOpenBooking }: RatesSectionProps) {
  // Toggle state to view Student vs Regular easily
  const [activeTab, setActiveTab] = useState<"regular" | "student">("regular");

  // Required exact pricing tiers:
  // 1 HR: ₱80 (Student) / ₱100 (Regular)
  // 3 HR: ₱220 (Student) / ₱280 (Regular)
  // 5 HR: ₱380 (Student) / ₱480 (Regular)
  // 8 HR: ₱550 (Student) / ₱650 (Regular)
  const rateTiers = [
    {
      hours: "1 HOUR",
      duration: "Quick Sprint",
      studentPrice: "₱80",
      regularPrice: "₱100",
      description: "Ideal for sending urgent files, printing, or waiting out rain.",
      badge: "Flexible",
    },
    {
      hours: "3 HOURS",
      duration: "Half-Day Sprint",
      studentPrice: "₱220",
      regularPrice: "₱280",
      description: "Great for a morning or afternoon focused productivity block.",
      badge: "Popular",
    },
    {
      hours: "5 HOURS",
      duration: "Extended Focus",
      studentPrice: "₱380",
      regularPrice: "₱480",
      description: "Perfect for thesis work, client video meetings, and deep work.",
      badge: "Great Value",
    },
    {
      hours: "8 HOURS",
      duration: "Full Working Day",
      studentPrice: "₱550",
      regularPrice: "₱650",
      description: "Comprehensive all-day access with unlimited coffee & generator power.",
      badge: "Best Deal",
    },
  ];

  return (
    <section id="pricing" className="py-24 sm:py-28 bg-[#F5F5DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0A192F] text-[#D4AF37] text-xs font-bold uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Transparent Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0A192F] tracking-tight uppercase">
            Rental Rates & Passes
          </h2>
          <div className="w-20 h-1 bg-[#D4AF37] mx-auto rounded-full" />
          <p className="text-sm sm:text-base text-[#0A192F]/80 leading-relaxed font-medium pt-2">
            Affordable hourly rates, student discounts, executive meeting rooms,
            and dedicated monthly memberships with zero hidden charges.
          </p>
        </div>

        {/* Refined Borderless Pill Switcher with Smooth Hover */}
        <div className="flex justify-center mb-14">
          <div className="inline-flex p-1.5 rounded-full bg-white shadow-sm">
            <button
              onClick={() => setActiveTab("regular")}
              className={`px-7 py-3 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                activeTab === "regular"
                  ? "bg-[#0A192F] text-[#D4AF37] shadow-sm"
                  : "text-[#0A192F]/70 hover:text-[#0A192F]"
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Regular Rates</span>
            </button>

            <button
              onClick={() => setActiveTab("student")}
              className={`px-7 py-3 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                activeTab === "student"
                  ? "bg-[#0A192F] text-[#D4AF37] shadow-sm"
                  : "text-[#0A192F]/70 hover:text-[#0A192F]"
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Student Rates (With ID)</span>
            </button>
          </div>
        </div>

        {/* 4 Hourly Rates Cards: Pure White Cards with Tactile Hover (-translate-y-2 & shadow-xl) and Tactile Buttons */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8 mb-20 items-stretch">
          {rateTiers.map((tier, idx) => {
            const price = activeTab === "student" ? tier.studentPrice : tier.regularPrice;
            const isFeatured = idx === 3; // 8 Hours

            return (
              <div
                key={idx}
                className="rounded-3xl p-6 sm:p-7 lg:p-8 bg-white shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl flex flex-col justify-between h-full relative cursor-default"
              >
                {isFeatured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#0A192F] text-[#D4AF37] text-[10px] font-black uppercase tracking-wider shadow-sm whitespace-nowrap">
                    Most Popular Day Pass
                  </div>
                )}

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#0A192F] text-[#D4AF37]">
                      {tier.badge}
                    </span>
                    <Clock className="w-4 h-4 text-[#D4AF37]" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-[#0A192F] tracking-tight">
                      {tier.hours}
                    </h3>
                    <p className="text-xs text-[#0A192F]/60 font-semibold">{tier.duration}</p>
                  </div>

                  {/* Pricing Display */}
                  <div className="py-4 border-y border-stone-100">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-4xl font-black text-[#0A192F] tracking-tight">{price}</span>
                      <span className="text-xs font-semibold text-[#0A192F]/60">
                        {activeTab === "student" ? "/ student pass" : "/ standard pass"}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#0A192F]/50 mt-1">
                      {activeTab === "student"
                        ? `Standard rate: ${tier.regularPrice}`
                        : `Student rate: ${tier.studentPrice} with ID`}
                    </div>
                  </div>

                  <p className="text-xs text-[#0A192F]/70 leading-relaxed font-normal min-h-[36px]">
                    {tier.description}
                  </p>

                  <ul className="space-y-2.5 text-xs text-[#0A192F] pt-2">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      <span>High-speed fiber Wi-Fi</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      <span>Dedicated power outlet</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      <span>Airconditioned comfort</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      <span>Full generator backup</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-8 mt-6 border-t border-stone-100">
                  {/* Tactile Button: Hover scale-105 & hover:bg-blue-900/90 */}
                  <button
                    onClick={onOpenBooking}
                    className="w-full py-3.5 rounded-xl bg-[#0A192F] text-white font-black text-xs uppercase tracking-wider shadow-sm transition-transform duration-200 hover:scale-105 hover:bg-blue-900/90 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Book Now</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Side-by-Side Comparison Summary Table: Tactile Hover on Container and Action Buttons */}
        <div className="mb-20 overflow-hidden rounded-3xl bg-white shadow-sm transition-all duration-300 ease-in-out hover:shadow-xl">
          <div className="bg-[#0A192F] px-8 py-5 flex items-center justify-between">
            <h4 className="text-sm sm:text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
              <span className="text-[#D4AF37]">★</span> Hourly Rate Comparison Table
            </h4>
            <span className="text-xs text-[#D4AF37] font-bold">Albay Best Value</span>
          </div>

          {/* Interactive Horizontal Scroll Guide Banner */}
          <div className="flex items-center justify-between px-6 sm:px-8 py-2.5 bg-[#F5F5DC]/90 border-b border-stone-200/80 text-xs text-[#0A192F]">
            <div className="flex items-center gap-2 font-bold">
              <ArrowLeftRight className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Horizontal Scroll View: Compare all durations & amenities</span>
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider text-[#0A192F]/60 flex items-center gap-1">
              <span>Scroll horizontally</span>
              <span className="text-[#D4AF37]">&rarr;</span>
            </span>
          </div>

          <div className="overflow-x-auto custom-horizontal-scrollbar pb-3">
            <table className="w-full text-left text-xs sm:text-sm min-w-[640px]">
              <thead className="bg-[#F5F5DC]/60 text-[#0A192F] font-bold">
                <tr>
                  <th className="py-4 px-6 sm:px-8">Duration Tier</th>
                  <th className="py-4 px-6 sm:px-8">Student Rate (With ID)</th>
                  <th className="py-4 px-6 sm:px-8">Regular Rate</th>
                  <th className="py-4 px-6 sm:px-8">Included Amenities</th>
                  <th className="py-4 px-6 sm:px-8 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-[#0A192F]">
                {rateTiers.map((r, i) => (
                  <tr key={i} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-4 px-6 sm:px-8 font-black">{r.hours}</td>
                    <td className="py-4 px-6 sm:px-8 font-black text-[#0A192F]">{r.studentPrice}</td>
                    <td className="py-4 px-6 sm:px-8 font-black text-[#0A192F]">{r.regularPrice}</td>
                    <td className="py-4 px-6 sm:px-8 text-xs text-[#0A192F]/70 font-normal">
                      Fiber Wi-Fi, Outlets, AC, Generator, Brewed Coffee
                    </td>
                    <td className="py-4 px-6 sm:px-8 text-right">
                      <button
                        onClick={onOpenBooking}
                        className="px-4 py-2 rounded-lg bg-[#0A192F] text-[#D4AF37] text-xs font-black uppercase shadow-sm transition-transform duration-200 hover:scale-105 hover:bg-blue-900/90 active:scale-95 cursor-pointer"
                      >
                        Book Now
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Featured Offer Cards with Tactile Hover Pulse */}
        <div className="grid md:grid-cols-12 gap-8">
          {/* Conference Room Details: Tactile Hover Pure White Card */}
          <div className="md:col-span-6 rounded-3xl bg-white p-8 sm:p-10 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl flex flex-col justify-between cursor-default">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#0A192F] text-[#D4AF37]">
                  Private Meeting Facility
                </span>
                <Users className="w-5 h-5 text-[#D4AF37]" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-[#0A192F] tracking-tight">
                  Conference Room Rental
                </h3>
                <p className="text-xs text-[#0A192F]/60 font-semibold uppercase tracking-wider mt-1">
                  Capacity: 1 TO 10 PAX
                </p>
              </div>

              {/* Price Banner */}
              <div className="p-6 rounded-2xl bg-[#F5F5DC]">
                <div className="text-3xl sm:text-4xl font-black text-[#0A192F]">
                  ₱700.00
                  <span className="text-xs font-bold text-[#0A192F]/70 uppercase ml-2">
                    PER HOUR
                  </span>
                </div>
                <p className="text-[11px] text-[#0A192F]/70 mt-1 font-normal">
                  Ideal for board meetings, client presentations, team scrums, and thesis defenses.
                </p>
              </div>

              <ul className="space-y-2.5 text-xs text-[#0A192F] font-medium pt-1">
                <li className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>Seating capacity: 1 TO 10 PAX comfortably</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>55” 4K Smart Presentation Display with HDMI & Wireless Casting</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>Glass whiteboard with dry-erase markers</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>Dedicated power strips & sound-isolated acoustic environment</span>
                </li>
              </ul>
            </div>

            <div className="pt-8 mt-6 border-t border-stone-100">
              <button
                onClick={onOpenBooking}
                className="w-full py-4 rounded-xl bg-[#0A192F] text-white font-black text-xs uppercase tracking-wider shadow-sm transition-transform duration-200 hover:scale-105 hover:bg-blue-900/90 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Book Conference Room</span>
                <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
              </button>
            </div>
          </div>

          {/* Highlighted Subscription: Tactile Hover Solid Navy Blue Card */}
          <div className="md:col-span-6 rounded-3xl bg-[#0A192F] text-white p-8 sm:p-10 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl flex flex-col justify-between relative cursor-default">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#D4AF37] text-[#0A192F] shadow-sm flex items-center gap-1.5">
                  <Star className="w-3 h-3 fill-[#0A192F]" />
                  Highlighted Subscription
                </span>
                <span className="text-xs text-stone-300 font-semibold">Priority Resident</span>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] block">
                  All-Inclusive Long Term Pass
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
                  1 MONTH SUBSCRIPTION
                </h3>
                <p className="text-xs text-stone-300 mt-1 font-normal">
                  Your dedicated home base for unstoppable productivity in Albay.
                </p>
              </div>

              {/* Exact Price: ₱9,000.00 */}
              <div className="p-6 rounded-2xl bg-[#112442]">
                <div className="text-3xl sm:text-4xl font-black text-[#D4AF37]">
                  ₱9,000.00
                  <span className="text-xs font-bold text-stone-300 uppercase ml-2">
                    / 30 DAYS
                  </span>
                </div>
                <p className="text-[11px] text-stone-300 mt-1 font-normal">
                  Enjoy unlimited facility usage, reserved locker, and priority perks every day.
                </p>
              </div>

              <ul className="space-y-2.5 text-xs text-stone-200 font-medium pt-1">
                <li className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>Dedicated workstation with ergonomic task chair</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>Unlimited monthly coworking access (Mon - Sun)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>5 Free Hours Conference Room credits included</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>Free personal secure locking storage locker</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>Exclusive 15% discount on 3rd Floor FNJ Pickleball bookings</span>
                </li>
              </ul>
            </div>

            <div className="pt-8 mt-6 border-t border-white/10">
              <button
                onClick={onOpenBooking}
                className="w-full py-4 rounded-xl bg-[#D4AF37] text-[#0A192F] font-black text-xs uppercase tracking-wider shadow-sm transition-transform duration-200 hover:scale-105 hover:bg-[#b8952b] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Subscribe for ₱9,000.00</span>
                <ArrowRight className="w-4 h-4 text-[#0A192F]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
