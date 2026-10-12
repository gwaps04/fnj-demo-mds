"use client";

import React, { useState } from "react";
import {
  X,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  CheckCircle,
  Coffee,
  Trophy,
  Users,
  Sparkles,
  ArrowRight,
  Star,
} from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BookingModal({ isOpen, onClose }: BookingModalProps) {
  // Service category
  const [category, setCategory] = useState<"coworking" | "conference" | "subscription" | "pickleball">("coworking");
  const [rateType, setRateType] = useState<"regular" | "student">("regular");
  const [selectedHourlyTier, setSelectedHourlyTier] = useState<"1hr" | "3hr" | "5hr" | "8hr">("8hr");
  const [conferenceHours, setConferenceHours] = useState(1);
  const [pickleballHours, setPickleballHours] = useState(1);
  const [pickleballSlot, setPickleballSlot] = useState<"day" | "night">("day");
  const [paddleRentalCount, setPaddleRentalCount] = useState(0);

  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [time, setTime] = useState("09:00 AM");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");

  if (!isOpen) return null;

  // Calculate price dynamically
  let totalPrice = 0;
  let serviceDescription = "";

  if (category === "coworking") {
    const isStudent = rateType === "student";
    if (selectedHourlyTier === "1hr") {
      totalPrice = isStudent ? 80 : 100;
      serviceDescription = `1 Hour ${isStudent ? "Student" : "Regular"} Coworking Pass`;
    } else if (selectedHourlyTier === "3hr") {
      totalPrice = isStudent ? 220 : 280;
      serviceDescription = `3 Hours ${isStudent ? "Student" : "Regular"} Coworking Pass`;
    } else if (selectedHourlyTier === "5hr") {
      totalPrice = isStudent ? 380 : 480;
      serviceDescription = `5 Hours ${isStudent ? "Student" : "Regular"} Coworking Pass`;
    } else {
      totalPrice = isStudent ? 550 : 650;
      serviceDescription = `8 Hours ${isStudent ? "Student" : "Regular"} Coworking Pass`;
    }
  } else if (category === "conference") {
    totalPrice = 700 * conferenceHours;
    serviceDescription = `Conference Room (1-10 Pax) • ${conferenceHours} Hour(s) @ ₱700/hr`;
  } else if (category === "subscription") {
    totalPrice = 9000;
    serviceDescription = "1 Month Coworking Subscription (Dedicated Workspace)";
  } else if (category === "pickleball") {
    const hourlyRate = pickleballSlot === "day" ? 300 : 400;
    const courtCost = hourlyRate * pickleballHours;
    const paddleCost = paddleRentalCount * 50;
    totalPrice = courtCost + paddleCost;
    serviceDescription = `3rd Floor Pickleball Court • ${pickleballHours} Hr(s) (${pickleballSlot === "day" ? "Day Rate ₱300" : "Night Rate ₱400"})`;
  }

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code =
      "FNJ-" +
      (category === "pickleball" ? "PB-" : "CW-") +
      Math.floor(1000 + Math.random() * 9000);
    setConfirmationCode(code);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#0A192F]/70 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog Card: Pure White, Soft High-Elevation Shadow, Borderless */}
      <div className="relative w-full max-w-xl rounded-3xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-8 sm:p-10 text-left z-10 my-8 max-h-[92vh] overflow-y-auto text-[#0A192F]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-[#0A192F]/60 hover:text-[#0A192F] hover:bg-stone-100 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div>
            <div className="space-y-1.5 pb-5 border-b border-stone-100">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0A192F] text-[#D4AF37] text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> FNJ Reservation Portal
              </div>
              <h3 className="text-2xl font-black text-[#0A192F] uppercase tracking-tight">
                Book Your Space
              </h3>
              <p className="text-xs text-[#0A192F]/70 font-normal">
                2nd Floor Biak Realty Corp., Lakandula Drive, Tagas, Daraga, Albay
              </p>
            </div>

            {/* Service Category Buttons (Borderless, Soft) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-6 p-1.5 rounded-2xl bg-[#0A192F]">
              <button
                type="button"
                onClick={() => setCategory("coworking")}
                className={`py-2.5 px-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  category === "coworking"
                    ? "bg-[#D4AF37] text-[#0A192F] shadow-sm"
                    : "text-stone-300 hover:text-white"
                }`}
              >
                <Coffee className="w-4 h-4" />
                <span>Coworking</span>
              </button>

              <button
                type="button"
                onClick={() => setCategory("conference")}
                className={`py-2.5 px-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  category === "conference"
                    ? "bg-[#D4AF37] text-[#0A192F] shadow-sm"
                    : "text-stone-300 hover:text-white"
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Conference</span>
              </button>

              <button
                type="button"
                onClick={() => setCategory("subscription")}
                className={`py-2.5 px-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  category === "subscription"
                    ? "bg-[#D4AF37] text-[#0A192F] shadow-sm"
                    : "text-stone-300 hover:text-white"
                }`}
              >
                <Star className="w-4 h-4" />
                <span>1 Month Pass</span>
              </button>

              <button
                type="button"
                onClick={() => setCategory("pickleball")}
                className={`py-2.5 px-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  category === "pickleball"
                    ? "bg-[#D4AF37] text-[#0A192F] shadow-sm"
                    : "text-stone-300 hover:text-white"
                }`}
              >
                <Trophy className="w-4 h-4" />
                <span>Pickleball 3F</span>
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
              {/* Category: Coworking */}
              {category === "coworking" && (
                <div className="space-y-3.5 p-5 rounded-2xl bg-[#F5F5DC]/60">
                  <div className="flex items-center justify-between pb-3 border-b border-[#0A192F]/10">
                    <span className="font-black uppercase text-[11px] text-[#0A192F]">
                      Rate Category
                    </span>
                    <div className="inline-flex rounded-full bg-white p-1 shadow-sm">
                      <button
                        type="button"
                        onClick={() => setRateType("regular")}
                        className={`px-3.5 py-1 rounded-full text-[11px] font-black uppercase transition-all ${
                          rateType === "regular"
                            ? "bg-[#0A192F] text-[#D4AF37]"
                            : "text-[#0A192F]/70"
                        }`}
                      >
                        Regular
                      </button>
                      <button
                        type="button"
                        onClick={() => setRateType("student")}
                        className={`px-3.5 py-1 rounded-full text-[11px] font-black uppercase transition-all ${
                          rateType === "student"
                            ? "bg-[#0A192F] text-[#D4AF37]"
                            : "text-[#0A192F]/70"
                        }`}
                      >
                        Student (With ID)
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="font-black uppercase text-[11px] text-[#0A192F]">
                      Select Duration Tier
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: "1hr", label: "1 HR", reg: "₱100", stu: "₱80" },
                        { id: "3hr", label: "3 HR", reg: "₱280", stu: "₱220" },
                        { id: "5hr", label: "5 HR", reg: "₱480", stu: "₱380" },
                        { id: "8hr", label: "8 HR", reg: "₱650", stu: "₱550" },
                      ].map((tier) => (
                        <button
                          key={tier.id}
                          type="button"
                          onClick={() => setSelectedHourlyTier(tier.id as any)}
                          className={`p-3 rounded-xl text-center transition-all cursor-pointer ${
                            selectedHourlyTier === tier.id
                              ? "bg-[#0A192F] text-white font-black shadow-sm"
                              : "bg-white text-[#0A192F] font-bold shadow-sm"
                          }`}
                        >
                          <div className="text-xs uppercase">{tier.label}</div>
                          <div className="text-sm font-black text-[#D4AF37]">
                            {rateType === "student" ? tier.stu : tier.reg}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Category: Conference Room */}
              {category === "conference" && (
                <div className="p-5 rounded-2xl bg-[#F5F5DC]/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-black text-sm text-[#0A192F] uppercase">
                        Executive Conference Suite
                      </h4>
                      <p className="text-[11px] text-[#0A192F]/70">
                        1 TO 10 PAX • ₱700.00 PER HOUR
                      </p>
                    </div>
                    <span className="text-lg font-black text-[#0A192F] bg-white px-3.5 py-1.5 rounded-xl shadow-sm">
                      ₱700 / hr
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#0A192F]/10">
                    <span className="font-bold">Select Hours:</span>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 8].map((h) => (
                        <button
                          key={h}
                          type="button"
                          onClick={() => setConferenceHours(h)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-black shadow-sm ${
                            conferenceHours === h
                              ? "bg-[#0A192F] text-white"
                              : "bg-white text-[#0A192F]"
                          }`}
                        >
                          {h} hr{h > 1 ? "s" : ""}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Category: 1 Month Subscription */}
              {category === "subscription" && (
                <div className="p-5 rounded-2xl bg-[#0A192F] text-white space-y-2 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#D4AF37] text-[#0A192F]">
                      Highlighted Monthly Pass
                    </span>
                    <span className="text-lg font-black text-[#D4AF37]">₱9,000.00</span>
                  </div>
                  <h4 className="font-black text-base text-white">
                    1 MONTH SUBSCRIPTION (30 DAYS)
                  </h4>
                  <p className="text-[11px] text-stone-300">
                    Includes dedicated desk, unlimited facility access, free locker storage, and
                    5 hours of free conference room credits.
                  </p>
                </div>
              )}

              {/* Category: Pickleball 3F */}
              {category === "pickleball" && (
                <div className="p-5 rounded-2xl bg-[#F5F5DC]/60 space-y-3">
                  <div>
                    <h4 className="font-black text-sm text-[#0A192F] uppercase">
                      3rd Floor Pickleball Indoor Court
                    </h4>
                    <p className="text-[11px] text-[#0A192F]/70">
                      Day (8AM-5PM): ₱300/hr • Night (5PM-10PM): ₱400/hr
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPickleballSlot("day")}
                      className={`p-3 rounded-xl text-center font-black shadow-sm ${
                        pickleballSlot === "day"
                          ? "bg-[#0A192F] text-white"
                          : "bg-white text-[#0A192F]"
                      }`}
                    >
                      <div>Day Slot (₱300/hr)</div>
                      <div className="text-[10px] font-normal text-stone-400">8:00 AM – 5:00 PM</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPickleballSlot("night")}
                      className={`p-3 rounded-xl text-center font-black shadow-sm ${
                        pickleballSlot === "night"
                          ? "bg-[#0A192F] text-white"
                          : "bg-white text-[#0A192F]"
                      }`}
                    >
                      <div>Night Floodlights (₱400/hr)</div>
                      <div className="text-[10px] font-normal text-stone-400">5:00 PM – 10:00 PM</div>
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#0A192F]/10">
                    <span className="font-bold">Paddle Rental (+₱50 each):</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPaddleRentalCount(Math.max(0, paddleRentalCount - 1))}
                        className="w-8 h-8 rounded-lg bg-[#0A192F] text-white font-bold"
                      >
                        -
                      </button>
                      <span className="w-4 text-center font-black">{paddleRentalCount}</span>
                      <button
                        type="button"
                        onClick={() => setPaddleRentalCount(Math.min(4, paddleRentalCount + 1))}
                        className="w-8 h-8 rounded-lg bg-[#0A192F] text-white font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#0A192F] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#0A192F]" /> Reservation Date
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-[#0A192F] font-semibold focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#0A192F] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#0A192F]" /> Arrival Time
                  </label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-[#0A192F] font-semibold focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  >
                    <option value="08:00 AM">08:00 AM</option>
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="01:00 PM">01:00 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="05:00 PM">05:00 PM</option>
                    <option value="06:00 PM">06:00 PM</option>
                    <option value="07:00 PM">07:00 PM</option>
                  </select>
                </div>
              </div>

              {/* User Contact Information */}
              <div className="space-y-2 pt-1">
                <div className="space-y-1">
                  <label className="font-bold text-[#0A192F] flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-[#0A192F]" /> Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maria Santos"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-[#0A192F] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-[#0A192F] flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-[#0A192F]" /> Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="maria@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-[#0A192F] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-[#0A192F] flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-[#0A192F]" /> Mobile Number
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="0917 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-[#0A192F] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />
                  </div>
                </div>
              </div>

              {/* Live Cost Calculation Bar */}
              <div className="p-5 rounded-2xl bg-[#0A192F] text-white space-y-1.5 shadow-sm">
                <div className="flex justify-between items-center text-xs text-stone-300">
                  <span>Selected Service:</span>
                  <span className="font-bold text-[#D4AF37]">{serviceDescription}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-white/10">
                  <span className="font-extrabold uppercase text-xs">Total Amount to Pay:</span>
                  <span className="text-2xl font-black text-[#D4AF37]">₱{totalPrice.toLocaleString()}</span>
                </div>
                <p className="text-[11px] text-stone-300 pt-1 font-normal">
                  Pay in cash, GCash, or Maya upon arrival at the 2nd floor reception desk.
                </p>
              </div>

              {/* Navy Blue Primary Submit CTA Button (Sleek Borderless) */}
              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-[#0A192F] hover:bg-[#112442] text-white font-black text-sm uppercase tracking-wider shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Confirm Reservation</span>
                <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
              </button>
            </form>
          </div>
        ) : (
          /* Confirmation Screen */
          <div className="text-center space-y-6 py-4">
            <div className="w-16 h-16 rounded-2xl bg-[#0A192F] text-[#D4AF37] flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-[#D4AF37] bg-[#0A192F] px-3.5 py-1 rounded-full inline-block">
                Booking Confirmed
              </span>
              <h3 className="text-2xl font-black text-[#0A192F] uppercase">
                We’re Ready For You!
              </h3>
              <p className="text-xs text-[#0A192F]/70">
                Please present this voucher code upon arriving at FNJ Daraga.
              </p>
            </div>

            {/* Voucher Card */}
            <div className="p-6 rounded-2xl bg-[#F5F5DC]/70 text-left space-y-3.5 shadow-sm">
              <div className="flex justify-between items-center pb-3 border-b border-[#0A192F]/10">
                <div>
                  <span className="text-[10px] text-[#0A192F]/60 uppercase font-black">
                    Booking Reference
                  </span>
                  <div className="text-lg font-black text-[#0A192F] tracking-wider">
                    {confirmationCode}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#0A192F]/60 uppercase font-black">
                    Status
                  </span>
                  <div className="text-xs font-black text-[#D4AF37] bg-[#0A192F] px-2.5 py-0.5 rounded-full">
                    ACTIVE VOUCHER
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[#0A192F]/60 block font-semibold">Guest Name</span>
                  <span className="font-bold text-[#0A192F]">{name || "Valued Guest"}</span>
                </div>
                <div>
                  <span className="text-[#0A192F]/60 block font-semibold">Service</span>
                  <span className="font-bold text-[#0A192F]">{serviceDescription}</span>
                </div>
                <div>
                  <span className="text-[#0A192F]/60 block font-semibold">Date</span>
                  <span className="font-bold text-[#0A192F]">{date}</span>
                </div>
                <div>
                  <span className="text-[#0A192F]/60 block font-semibold">Time Slot</span>
                  <span className="font-bold text-[#0A192F]">{time}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#0A192F]/10 flex justify-between items-center text-xs">
                <span className="font-bold text-[#0A192F]">Amount Due at Front Desk</span>
                <span className="text-xl font-black text-[#0A192F]">₱{totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 py-3.5 rounded-xl bg-[#0A192F] text-white font-black text-xs uppercase tracking-wider hover:bg-[#112442] shadow-sm transition-colors"
              >
                Close & Return
              </button>
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="py-3.5 px-5 rounded-xl bg-stone-100 text-[#0A192F] font-bold text-xs hover:bg-stone-200 transition-colors"
              >
                Book Another Pass
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
