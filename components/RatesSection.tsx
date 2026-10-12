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
  ShieldCheck,
  Star,
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
    <section id="pricing" className="py-20 bg-[#F5F5DC] border-b-2 border-[#0A192F]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0A192F] text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Transparent Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0A192F] tracking-tight uppercase">
            Rental Rates & Passes
          </h2>
          <div className="w-24 h-1.5 bg-[#D4AF37] mx-auto rounded-full" />
          <p className="text-sm sm:text-base text-[#0A192F]/80 leading-relaxed font-medium">
            Affordable hourly rates, student discounts, executive meeting rooms,
            and dedicated monthly memberships with zero hidden charges.
          </p>
        </div>

        {/* Student vs Regular Rate Switcher */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-2xl bg-[#0A192F] border-2 border-[#D4AF37] shadow-xl">
            <button
              onClick={() => setActiveTab("regular")}
              className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "regular"
                  ? "bg-[#D4AF37] text-[#0A192F] shadow-md"
                  : "text-stone-300 hover:text-white"
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Regular Rates</span>
            </button>

            <button
              onClick={() => setActiveTab("student")}
              className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "student"
                  ? "bg-[#D4AF37] text-[#0A192F] shadow-md"
                  : "text-stone-300 hover:text-white"
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Student Rates (With Valid ID)</span>
            </button>
          </div>
        </div>

        {/* 4 Hourly Rates Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {rateTiers.map((tier, idx) => {
            const price = activeTab === "student" ? tier.studentPrice : tier.regularPrice;
            const isFeatured = idx === 3; // 8 Hours

            return (
              <div
                key={idx}
                className={`rounded-2xl p-6 bg-white border-2 border-[#0A192F] shadow-lg hover:shadow-xl transition-all flex flex-col justify-between relative ${
                  isFeatured ? "ring-4 ring-[#D4AF37]" : ""
                }`}
              >
                {isFeatured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#0A192F] text-[#D4AF37] text-[10px] font-black uppercase tracking-wider border border-[#D4AF37]">
                    Most Popular Day Pass
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded bg-[#F5F5DC] text-[#0A192F] border border-[#0A192F]/20 uppercase">
                      {tier.badge}
                    </span>
                    <Clock className="w-4 h-4 text-[#D4AF37]" />
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-[#0A192F] tracking-tight">
                      {tier.hours}
                    </h3>
                    <p className="text-xs text-[#0A192F]/70 font-medium">{tier.duration}</p>
                  </div>

                  {/* Pricing Display */}
                  <div className="py-3 border-y border-[#0A192F]/15">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-[#0A192F]">{price}</span>
                      <span className="text-xs font-semibold text-[#0A192F]/70">
                        {activeTab === "student" ? "/ student pass" : "/ standard pass"}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#0A192F]/60 mt-1">
                      {activeTab === "student"
                        ? `Standard rate: ${tier.regularPrice}`
                        : `Student rate: ${tier.studentPrice} with ID`}
                    </div>
                  </div>

                  <p className="text-xs text-[#0A192F]/80 leading-relaxed font-normal min-h-[36px]">
                    {tier.description}
                  </p>

                  <ul className="space-y-2 text-xs text-[#0A192F] pt-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                      <span>High-speed fiber Wi-Fi</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                      <span>Dedicated power outlet</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                      <span>Airconditioned comfort</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                      <span>Full generator backup</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-6 mt-4 border-t border-[#0A192F]/10">
                  <button
                    onClick={onOpenBooking}
                    className="w-full py-2.5 rounded-xl bg-[#0A192F] hover:bg-[#112442] text-white font-extrabold text-xs uppercase tracking-wider border border-[#D4AF37] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Book Now</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Side-by-Side Comparison Summary Table */}
        <div className="mb-16 overflow-hidden rounded-2xl bg-white border-2 border-[#0A192F] shadow-xl">
          <div className="bg-[#0A192F] px-6 py-4 flex items-center justify-between">
            <h4 className="text-sm sm:text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
              <span className="text-[#D4AF37]">★</span> Hourly Rate Comparison Table
            </h4>
            <span className="text-xs text-[#D4AF37] font-semibold">Albay Best Value</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#F5F5DC] border-b border-[#0A192F]/20 text-[#0A192F] font-bold">
                <tr>
                  <th className="py-3 px-4 sm:px-6">Duration Tier</th>
                  <th className="py-3 px-4 sm:px-6">Student Rate (With ID)</th>
                  <th className="py-3 px-4 sm:px-6">Regular Rate</th>
                  <th className="py-3 px-4 sm:px-6">Included Amenities</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0A192F]/10 text-[#0A192F]">
                {rateTiers.map((r, i) => (
                  <tr key={i} className="hover:bg-stone-50 transition-colors">
                    <td className="py-3 px-4 sm:px-6 font-bold">{r.hours}</td>
                    <td className="py-3 px-4 sm:px-6 font-black text-[#0A192F]">{r.studentPrice}</td>
                    <td className="py-3 px-4 sm:px-6 font-black text-[#0A192F]">{r.regularPrice}</td>
                    <td className="py-3 px-4 sm:px-6 text-xs text-[#0A192F]/70">
                      Fiber Wi-Fi, Outlets, AC, Generator, Brewed Coffee
                    </td>
                    <td className="py-3 px-4 sm:px-6 text-right">
                      <button
                        onClick={onOpenBooking}
                        className="px-3.5 py-1.5 rounded-lg bg-[#0A192F] text-white text-xs font-bold hover:bg-[#112442] border border-[#D4AF37] transition-all cursor-pointer"
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

        {/* Two Featured Offer Cards: Conference Room + Highlighted 1 Month Subscription */}
        <div className="grid md:grid-cols-12 gap-8">
          {/* Required Conference Room Details: 1 TO 10 PAX, ₱700.00 PER HOUR */}
          <div className="md:col-span-6 rounded-2xl bg-white border-2 border-[#0A192F] p-7 shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-md bg-[#0A192F] text-[#D4AF37]">
                  Private Meeting Facility
                </span>
                <Users className="w-5 h-5 text-[#D4AF37]" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-[#0A192F] tracking-tight">
                  Conference Room Rental
                </h3>
                <p className="text-xs text-[#0A192F]/70 font-semibold uppercase tracking-wider mt-1">
                  Capacity: 1 TO 10 PAX
                </p>
              </div>

              {/* Price Banner */}
              <div className="p-4 rounded-xl bg-[#F5F5DC] border border-[#0A192F]/20">
                <div className="text-3xl sm:text-4xl font-black text-[#0A192F]">
                  ₱700.00
                  <span className="text-xs font-bold text-[#0A192F]/70 uppercase ml-2">
                    PER HOUR
                  </span>
                </div>
                <p className="text-[11px] text-[#0A192F]/70 mt-1">
                  Ideal for board meetings, client presentations, team scrums, and thesis defenses.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-[#0A192F] font-medium pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
                  <span>Seating capacity: 1 TO 10 PAX comfortably</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
                  <span>55” 4K Smart Presentation Display with HDMI & Wireless Casting</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
                  <span>Glass whiteboard with dry-erase markers</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
                  <span>Dedicated power strips & sound-isolated acoustic environment</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 mt-6 border-t border-[#0A192F]/10">
              <button
                onClick={onOpenBooking}
                className="w-full py-3.5 rounded-xl bg-[#0A192F] hover:bg-[#112442] text-white font-extrabold text-xs uppercase tracking-wider border-2 border-[#D4AF37] shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Book Conference Room</span>
                <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
              </button>
            </div>
          </div>

          {/* Required Highlighted Subscription: 1 MONTH SUBSCRIPTION for ₱9,000.00 */}
          <div className="md:col-span-6 rounded-2xl bg-[#0A192F] text-white border-4 border-[#D4AF37] p-7 shadow-2xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#D4AF37] text-[#0A192F] px-4 py-1 text-[11px] font-black uppercase tracking-wider rounded-bl-xl shadow-md flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-[#0A192F]" />
              Highlighted Subscription
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] block">
                  All-Inclusive Long Term Pass
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  1 MONTH SUBSCRIPTION
                </h3>
                <p className="text-xs text-stone-300 mt-1">
                  Your dedicated home base for unstoppable productivity in Albay.
                </p>
              </div>

              {/* Exact Price: ₱9,000.00 */}
              <div className="p-4 rounded-xl bg-[#112442] border border-[#D4AF37]/40">
                <div className="text-3xl sm:text-4xl font-black text-[#D4AF37]">
                  ₱9,000.00
                  <span className="text-xs font-bold text-stone-300 uppercase ml-2">
                    / 30 DAYS
                  </span>
                </div>
                <p className="text-[11px] text-stone-300 mt-1">
                  Enjoy unlimited facility usage, reserved locker, and priority perks every day.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-stone-200 font-medium pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
                  <span>Dedicated workstation with ergonomic task chair</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
                  <span>Unlimited monthly coworking access (Mon - Sun)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
                  <span>5 Free Hours Conference Room credits included</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
                  <span>Free personal secure locking storage locker</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
                  <span>Exclusive 15% discount on 3rd Floor FNJ Pickleball bookings</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 mt-6 border-t border-white/10">
              <button
                onClick={onOpenBooking}
                className="w-full py-3.5 rounded-xl bg-[#D4AF37] hover:bg-[#b8952b] text-[#0A192F] font-black text-xs uppercase tracking-wider shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
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
