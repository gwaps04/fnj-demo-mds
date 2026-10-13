"use client";

// FILE: components/TimeSlotPicker.tsx
import React, { useState, useMemo } from "react";
import {
  Clock,
  Sun,
  Sunrise,
  Sunset,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { calculateDepartureTime } from "@/lib/bookings";

interface TimeSlotPickerProps {
  selectedTime: string;
  onSelectTime: (time: string) => void;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  durationOption: string;
}

type DayPhase = "morning" | "afternoon" | "evening";

const SLOTS_BY_PHASE: Record<DayPhase, string[]> = {
  morning: [
    "08:00 AM",
    "08:30 AM",
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
  ],
  afternoon: [
    "12:00 PM",
    "12:30 PM",
    "01:00 PM",
    "01:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
  ],
  evening: [
    "05:00 PM",
    "05:30 PM",
    "06:00 PM",
    "06:30 PM",
    "07:00 PM",
    "07:30 PM",
    "08:00 PM",
  ],
};

export function TimeSlotPicker({
  selectedTime,
  onSelectTime,
  selectedDate,
  onSelectDate,
  durationOption,
}: TimeSlotPickerProps) {
  // Determine initial phase from selectedTime
  const initialPhase: DayPhase = useMemo(() => {
    if (selectedTime.includes("PM")) {
      const hour = parseInt(selectedTime.split(":")[0], 10);
      if (hour >= 5 && hour !== 12) return "evening";
      return "afternoon";
    }
    return "morning";
  }, [selectedTime]);

  const [activePhase, setActivePhase] = useState<DayPhase>(initialPhase);

  // Calculate dynamic departure time
  const calculatedDeparture = useMemo(() => {
    return calculateDepartureTime(selectedTime, durationOption);
  }, [selectedTime, durationOption]);

  // Today and Tomorrow formatted dates
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);
  const tomorrowStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  }, []);

  const currentSlots = SLOTS_BY_PHASE[activePhase];

  return (
    <div className="space-y-4">
      {/* 1. Date Selector: Quick Date Chips (Today / Tomorrow / Pick Date) */}
      <div>
        <label className="text-[11px] font-black uppercase tracking-wider text-[#0A192F] block mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Select Reservation Date</span>
          </span>
          <span className="text-[10px] text-stone-500 font-semibold lowercase">
            albay standard time (gmt+8)
          </span>
        </label>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => onSelectDate(todayStr)}
            className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              selectedDate === todayStr
                ? "bg-[#0A192F] text-white shadow-sm"
                : "bg-white border border-stone-200 text-[#0A192F] hover:bg-stone-50"
            }`}
          >
            <span>Today</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded font-black ${
                selectedDate === todayStr
                  ? "bg-[#D4AF37] text-[#0A192F]"
                  : "bg-stone-100 text-stone-600"
              }`}
            >
              Recommended
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSelectDate(tomorrowStr)}
            className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              selectedDate === tomorrowStr
                ? "bg-[#0A192F] text-white shadow-sm"
                : "bg-white border border-stone-200 text-[#0A192F] hover:bg-stone-50"
            }`}
          >
            <span>Tomorrow</span>
          </button>

          <div className="relative shrink-0">
            <input
              type="date"
              value={selectedDate}
              min={todayStr}
              onChange={(e) => onSelectDate(e.target.value)}
              className="min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white border border-stone-200 text-[#0A192F] cursor-pointer focus:outline-none focus:border-[#0A192F]"
            />
          </div>
        </div>
      </div>

      {/* 2. Phase-of-Day Tabs: Morning, Afternoon, Evening */}
      <div>
        <label className="text-[11px] font-black uppercase tracking-wider text-[#0A192F] block mb-2 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Pick Arrival Phase & Exact Time Slot</span>
        </label>

        <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-100 rounded-2xl mb-3">
          <button
            type="button"
            onClick={() => setActivePhase("morning")}
            className={`min-h-[38px] py-2 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activePhase === "morning"
                ? "bg-[#0A192F] text-white shadow-sm"
                : "text-stone-600 hover:text-[#0A192F]"
            }`}
          >
            <Sunrise className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Morning</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePhase("afternoon")}
            className={`min-h-[38px] py-2 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activePhase === "afternoon"
                ? "bg-[#0A192F] text-white shadow-sm"
                : "text-stone-600 hover:text-[#0A192F]"
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Afternoon</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePhase("evening")}
            className={`min-h-[38px] py-2 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activePhase === "evening"
                ? "bg-[#0A192F] text-white shadow-sm"
                : "text-stone-600 hover:text-[#0A192F]"
            }`}
          >
            <Sunset className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Evening</span>
          </button>
        </div>

        {/* 3. Horizontal Scroll Tape & Touch Grid of Available Time Slots */}
        <div className="overflow-x-auto pb-2 scrollbar-none -mx-1 px-1">
          <div className="flex sm:grid sm:grid-cols-4 gap-2 min-w-max sm:min-w-0">
            {currentSlots.map((slot) => {
              const isSelected = selectedTime === slot;
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => onSelectTime(slot)}
                  className={`min-h-[44px] min-w-[100px] sm:min-w-0 px-3.5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${
                    isSelected
                      ? "bg-[#0A192F] text-[#D4AF37] ring-2 ring-[#D4AF37] shadow-md scale-102"
                      : "bg-white border border-stone-200/90 text-[#0A192F] hover:bg-stone-50 hover:border-stone-300"
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>{slot}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Smart "Arrival & Departure" Grid */}
      <div className="p-4 rounded-2xl bg-[#0A192F]/5 border border-[#0A192F]/10 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-black uppercase text-[#0A192F]/60">
          <span>Smart Schedule Calculation</span>
          <span className="text-[#D4AF37] font-bold">Auto-Computed</span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          {/* Arrival Column */}
          <div className="p-3 rounded-xl bg-white border border-stone-200 shadow-xs">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mb-1">
              Check-In Time
            </span>
            <div className="text-base sm:text-lg font-black text-[#0A192F] flex items-center gap-1.5">
              <span>{selectedTime}</span>
            </div>
            <span className="text-[10px] text-stone-500 font-medium block mt-0.5">
              Target arrival in Daraga
            </span>
          </div>

          {/* Departure Column */}
          <div className="p-3 rounded-xl bg-white border border-stone-200 shadow-xs">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full inline-block mb-1">
              Estimated Checkout
            </span>
            <div className="text-base sm:text-lg font-black text-[#0A192F] flex items-center gap-1.5">
              <span>{calculatedDeparture}</span>
            </div>
            <span className="text-[10px] text-stone-500 font-medium block mt-0.5">
              Based on {durationOption.split(" ")[1] || "selected"} duration
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
