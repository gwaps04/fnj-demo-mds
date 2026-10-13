"use client";

// FILE: components/BookingModal.tsx
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import QRCode from "qrcode";
import {
  X,
  Check,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Trophy,
  Coffee,
  Clock,
  GraduationCap,
  Briefcase,
  Users,
  ShieldCheck,
  QrCode,
  MapPin,
  RefreshCw,
  Target,
  Laptop,
  Mail,
  Phone,
  User,
  Download,
  ExternalLink,
  Eye,
  Calendar,
  Share2,
  Copy,
  LayoutDashboard,
} from "lucide-react";
import { TimeSlotPicker } from "@/components/TimeSlotPicker";
import {
  saveBooking,
  calculateDepartureTime,
  BookingRecord,
} from "@/lib/bookings";
import { generateBrandedQrDataUrl } from "@/lib/brandedQr";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BookingModal({ isOpen, onClose }: BookingModalProps) {
  // Wizard Step: 1 through 5 for questions, 6 for Final Recommendation, Time Selection & Guest Details
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Question 1 (Checkbox / Multi-select): Main goal
  const [goals, setGoals] = useState<string[]>([
    "Laser-focused solo study",
  ]);

  // Question 2 (Single select): Environment
  const [environment, setEnvironment] = useState<string>(
    "The open hot desk / café vibe"
  );

  // Question 3 (Single select): Duration
  const [duration, setDuration] = useState<string>(
    "The full 8-hour workday"
  );

  // Question 4 (Single select): Student rates
  const [isStudent, setIsStudent] = useState<string>(
    "No, I'll use the Regular/Professional rate"
  );

  // Question 5 (Single select): Specialized spaces / add-ons
  const [addons, setAddons] = useState<string>(
    "Nope, just standard ergonomic seating"
  );

  // Time & Date Selection state
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedTime, setSelectedTime] = useState<string>("09:00 AM");

  // Guest Contact Information
  const [guestName, setGuestName] = useState<string>("");
  const [guestEmail, setGuestEmail] = useState<string>("");
  const [guestPhone, setGuestPhone] = useState<string>("");
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [voucherCode, setVoucherCode] = useState<string>("FNJ-PASS-7391");
  const [confirmedBookingId, setConfirmedBookingId] = useState<string>("");

  // QR Code Data URL state
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [showQrViewer, setShowQrViewer] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Derive customized match recommendation
  const isStudentRate = isStudent.startsWith("Yes");
  let recommendedTitle = "8-Hour Coworking Day Pass";
  let recommendedPrice = isStudentRate ? "₱550.00" : "₱650.00";
  let recommendedNumericPrice = isStudentRate ? 550 : 650;
  let recommendedRateLabel = isStudentRate ? "Student Discount Rate" : "Regular Professional Rate";

  if (duration.includes("Monthly Subscription")) {
    recommendedTitle = "1 Month Dedicated Subscription";
    recommendedPrice = "₱9,000.00";
    recommendedNumericPrice = 9000;
    recommendedRateLabel = "All-Inclusive Resident Membership";
  } else if (addons.includes("Conference Room")) {
    recommendedTitle = "Executive Conference Room (1-10 Pax)";
    recommendedPrice = "₱700.00 / Hour";
    recommendedNumericPrice = 700;
    recommendedRateLabel = "Private Boardroom Rate";
  } else if (duration.includes("1-hour")) {
    recommendedTitle = "1-Hour Quick Sprint Pass";
    recommendedPrice = isStudentRate ? "₱80.00" : "₱100.00";
    recommendedNumericPrice = isStudentRate ? 80 : 100;
  } else if (duration.includes("3-to-5 hour")) {
    recommendedTitle = "5-Hour Extended Focus Pass";
    recommendedPrice = isStudentRate ? "₱380.00" : "₱480.00";
    recommendedNumericPrice = isStudentRate ? 380 : 480;
  }

  // Calculated departure time
  const calculatedDeparture = useMemo(() => {
    return calculateDepartureTime(selectedTime, duration);
  }, [selectedTime, duration]);

  // Generate QR Code data URL when confirmed or voucher generated
  useEffect(() => {
    if (voucherCode) {
      const passPayload = JSON.stringify({
        venue: "FNJ Coworking Space & Pickleball",
        address: "2F Biak Realty Corp., Lakandula Dr., Daraga, Albay",
        voucher: voucherCode,
        holder: guestName || "FNJ Valued Guest",
        email: guestEmail || "guest@fnjcoworking.ph",
        phone: guestPhone || "09XX-XXX-XXXX",
        date: selectedDate,
        arrival: selectedTime,
        departure: calculatedDeparture,
        plan: recommendedTitle,
        rate: recommendedPrice,
        facility: addons,
        status: "RESERVED - LIVE MOCKUP",
      });

      generateBrandedQrDataUrl({
        payloadText: passPayload,
        voucherCode,
        guestName: guestName || "Valued Albayan Guest",
        arrivalDate: selectedDate,
        arrivalTime: selectedTime,
        departureTime: calculatedDeparture,
        zoneOrPlan: recommendedTitle,
        rateCategory: isStudent.startsWith("Yes") ? "Student Verified Rate" : "Regular Workspace Rate",
      })
        .then((url) => {
          setQrDataUrl(url);
        })
        .catch((err) => {
          console.error("Branded QR Code generation error:", err);
        });
    }
  }, [
    voucherCode,
    guestName,
    guestEmail,
    guestPhone,
    selectedDate,
    selectedTime,
    calculatedDeparture,
    recommendedTitle,
    recommendedPrice,
    addons,
  ]);

  if (!isOpen) return null;

  // Question 1 Options
  const goalOptions = [
    {
      id: "A",
      label: "Laser-focused solo study",
      desc: "Quiet reading, thesis writing, and zero distraction.",
      icon: Target,
    },
    {
      id: "B",
      label: "Remote work & Zoom calls",
      desc: "Fast fiber internet, client calls, and multi-monitor setup.",
      icon: Laptop,
    },
    {
      id: "C",
      label: "Team brainstorming & meetings",
      desc: "Group discussions, pitch preparations, and collaborative whiteboard.",
      icon: Users,
    },
    {
      id: "D",
      label: "A mix of work and Pickleball!",
      desc: "Productive desk sprint followed by recreation on the 3rd floor.",
      icon: Trophy,
    },
  ];

  // Question 2 Options
  const environmentOptions = [
    {
      id: "A",
      label: "The silent study zone",
      desc: "Acoustically quiet zone with partitioned focus pods.",
      badge: "Quiet Pods",
    },
    {
      id: "B",
      label: "The open hot desk / café vibe",
      desc: "Bustling, natural ambient lighting with fresh brewed coffee aroma.",
      badge: "Main Hall",
    },
    {
      id: "C",
      label: "A private enclosed meeting room",
      desc: "Sound-isolated 1-10 Pax suite with 55” 4K presentation display.",
      badge: "Private Suite",
    },
  ];

  // Question 3 Options
  const durationOptions = [
    {
      id: "A",
      label: "A quick 1-hour sprint",
      desc: "Quick emergency work, file uploads, printing, or waiting out rain.",
      priceTag: "₱80 – ₱100",
    },
    {
      id: "B",
      label: "A 3-to-5 hour deep dive",
      desc: "Ideal focused session for students or freelancers with flexible schedules.",
      priceTag: "₱220 – ₱480",
    },
    {
      id: "C",
      label: "The full 8-hour workday",
      desc: "All-day pass with bottomless coffee and continuous generator protection.",
      priceTag: "₱550 – ₱650",
    },
    {
      id: "D",
      label: "I'm looking for a Monthly Subscription",
      desc: "Dedicated personal workstation, 30 days unlimited access & lockers.",
      priceTag: "₱9,000 / Mo",
    },
  ];

  // Question 4 Options
  const studentOptions = [
    {
      id: "A",
      label: "Yes! (I have my valid Student ID ready)",
      desc: "Unlock student rates (1 HR: ₱80, 3 HR: ₱220, 5 HR: ₱380, 8 HR: ₱550).",
      icon: GraduationCap,
      badge: "Student Discount",
    },
    {
      id: "B",
      label: "No, I'll use the Regular/Professional rate",
      desc: "Standard professional rate (1 HR: ₱100, 3 HR: ₱280, 5 HR: ₱480, 8 HR: ₱650).",
      icon: Briefcase,
      badge: "Standard Rate",
    },
  ];

  // Question 5 Options
  const addonOptions = [
    {
      id: "A",
      label: "The 10-Pax Executive Conference Room",
      desc: "₱700/hour private boardroom with 4K casting display and whiteboard.",
      icon: Users,
    },
    {
      id: "B",
      label: "3rd Floor Pickleball Court access",
      desc: "Reserve indoor court time (day/night play + paddle rental available).",
      icon: Trophy,
    },
    {
      id: "C",
      label: "Nope, just standard ergonomic seating",
      desc: "Includes high-speed Wi-Fi, power outlets, AC, and brewed coffee.",
      icon: CheckCircle,
    },
  ];

  // Toggle helper for Question 1 (checkbox)
  const toggleGoal = (label: string) => {
    if (goals.includes(label)) {
      if (goals.length > 1) {
        setGoals(goals.filter((g) => g !== label));
      }
    } else {
      setGoals([...goals, label]);
    }
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Move to Recommendation Step 6
      const randomCode =
        "FNJ-" +
        (addons.includes("Pickleball") ? "PB-" : "PASS-") +
        Math.floor(1000 + Math.random() * 9000);
      setVoucherCode(randomCode);
      setCurrentStep(6);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleRestart = () => {
    setCurrentStep(1);
    setIsConfirmed(false);
  };

  // Handle Generate Instant Mockup Pass Voucher with persistent localStorage write
  const handleGeneratePass = () => {
    const bookingId = "fnj-" + Date.now();
    setConfirmedBookingId(bookingId);

    const newBooking: BookingRecord = {
      id: bookingId,
      voucherCode,
      guestName: guestName.trim() || "Valued Albayan Guest",
      guestEmail: guestEmail.trim() || "guest@fnjcoworking.ph",
      guestPhone: guestPhone.trim() || "0917-123-4567",
      goals,
      environment,
      duration,
      arrivalDate: selectedDate,
      arrivalTime: selectedTime,
      departureTime: calculatedDeparture,
      isStudent: isStudent.startsWith("Yes"),
      addons,
      recommendedTitle,
      recommendedPrice,
      totalPriceAmount: recommendedNumericPrice,
      status: "Confirmed",
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage simulation
    saveBooking(newBooking);
    setIsConfirmed(true);
  };

  // Handle Download QR code as image
  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const downloadLink = document.createElement("a");
    downloadLink.href = qrDataUrl;
    downloadLink.download = `${voucherCode}-QR-PASS.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  // Handle copy voucher code to clipboard
  const handleCopyCode = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(voucherCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Blurred Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        aria-hidden="true"
      />

      {/* Modal Dialog Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 my-auto flex flex-col max-h-[92dvh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="bg-[#0A192F] text-white px-6 sm:px-8 py-4 sm:py-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0A192F] p-1 flex items-center justify-center shadow-xs overflow-hidden border border-[#D4AF37]/40 shrink-0">
              <Image
                src="/fnj-logo.png"
                alt="FNJ Logo"
                width={36}
                height={36}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base tracking-tight text-white uppercase">
                {currentStep <= 5
                  ? "Workspace Qualifier Quiz"
                  : isConfirmed
                  ? "Reservation Confirmed"
                  : "Your Tailored Pass Recommendation"}
              </h3>
              <p className="text-[11px] text-[#D4AF37] font-semibold">
                {currentStep <= 5
                  ? `Question ${currentStep} of 5 Pre-Qualifying Steps`
                  : isConfirmed
                  ? "Official Mockup QR Pass & Live CRM Sync"
                  : "Pick Time Slot & Claim Voucher"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 min-w-[44px] min-h-[44px] rounded-full bg-white/10 hover:bg-white/20 text-stone-200 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar (Only shown during questions 1-5) */}
        {currentStep <= 5 && (
          <div className="w-full bg-stone-100 h-1.5 shrink-0">
            <div
              className="bg-[#D4AF37] h-full transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>
        )}

        {/* Main Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* ======================================================== */}
          {/* QUESTION 1 (MULTI-SELECT CHECKBOX): Main Goal            */}
          {/* ======================================================== */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="space-y-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#D4AF37] bg-[#0A192F] px-3 py-1 rounded-full inline-block">
                  Question 1 of 5 • Multiple Selection
                </span>
                <h4 className="text-xl sm:text-2xl font-black text-[#0A192F] tracking-tight pt-2">
                  What is your main goal for today&apos;s visit?
                </h4>
                <p className="text-xs text-[#0A192F]/70">
                  Select all choices that match your planned session today.
                </p>
              </div>

              <div className="space-y-3">
                {goalOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isChecked = goals.includes(opt.label);
                  return (
                    <div
                      key={opt.id}
                      onClick={() => toggleGoal(opt.label)}
                      className={`p-4 sm:p-5 rounded-2xl transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 min-h-[48px] ${
                        isChecked
                          ? "bg-[#0A192F] text-white shadow-md scale-[1.01]"
                          : "bg-stone-50 hover:bg-stone-100 text-[#0A192F]"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            isChecked
                              ? "bg-[#D4AF37] text-[#0A192F]"
                              : "bg-white text-[#0A192F] shadow-xs"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-black text-sm sm:text-base leading-snug">
                            <span className="text-[#D4AF37] font-black mr-2">
                              {opt.id})
                            </span>
                            {opt.label}
                          </div>
                          <p
                            className={`text-xs mt-0.5 ${
                              isChecked ? "text-stone-300" : "text-[#0A192F]/60"
                            }`}
                          >
                            {opt.desc}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border ${
                          isChecked
                            ? "bg-[#D4AF37] border-[#D4AF37] text-[#0A192F]"
                            : "border-stone-300 bg-white"
                        }`}
                      >
                        {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* QUESTION 2: Environment Preference                       */}
          {/* ======================================================== */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="space-y-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#D4AF37] bg-[#0A192F] px-3 py-1 rounded-full inline-block">
                  Question 2 of 5 • Workspace Environment
                </span>
                <h4 className="text-xl sm:text-2xl font-black text-[#0A192F] tracking-tight pt-2">
                  Which environment helps you thrive best?
                </h4>
                <p className="text-xs text-[#0A192F]/70">
                  Pick your preferred acoustic comfort and seating arrangement.
                </p>
              </div>

              <div className="space-y-3">
                {environmentOptions.map((opt) => {
                  const isSelected = environment === opt.label;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setEnvironment(opt.label)}
                      className={`p-5 rounded-2xl transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 min-h-[48px] ${
                        isSelected
                          ? "bg-[#0A192F] text-white shadow-md scale-[1.01]"
                          : "bg-stone-50 hover:bg-stone-100 text-[#0A192F]"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-black text-sm ${
                            isSelected
                              ? "bg-[#D4AF37] text-[#0A192F]"
                              : "bg-white text-[#0A192F] shadow-xs"
                          }`}
                        >
                          {opt.id}
                        </div>
                        <div>
                          <div className="font-black text-sm sm:text-base leading-snug">
                            {opt.label}
                          </div>
                          <p
                            className={`text-xs mt-0.5 ${
                              isSelected ? "text-stone-300" : "text-[#0A192F]/60"
                            }`}
                          >
                            {opt.desc}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${
                          isSelected
                            ? "bg-[#D4AF37] text-[#0A192F]"
                            : "bg-white text-[#0A192F]/70 shadow-xs"
                        }`}
                      >
                        {opt.badge}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* QUESTION 3: Duration Needed                              */}
          {/* ======================================================== */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="space-y-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#D4AF37] bg-[#0A192F] px-3 py-1 rounded-full inline-block">
                  Question 3 of 5 • Time Commitment
                </span>
                <h4 className="text-xl sm:text-2xl font-black text-[#0A192F] tracking-tight pt-2">
                  How much time do you need to conquer your tasks?
                </h4>
                <p className="text-xs text-[#0A192F]/70">
                  Select your estimated duration for transparent pricing calculation.
                </p>
              </div>

              <div className="space-y-3">
                {durationOptions.map((opt) => {
                  const isSelected = duration === opt.label;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setDuration(opt.label)}
                      className={`p-5 rounded-2xl transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 min-h-[48px] ${
                        isSelected
                          ? "bg-[#0A192F] text-white shadow-md scale-[1.01]"
                          : "bg-stone-50 hover:bg-stone-100 text-[#0A192F]"
                      }`}
                    >
                      <div>
                        <div className="font-black text-sm sm:text-base leading-snug">
                          <span className="text-[#D4AF37] font-black mr-2">
                            {opt.id})
                          </span>
                          {opt.label}
                        </div>
                        <p
                          className={`text-xs mt-0.5 ${
                            isSelected ? "text-stone-300" : "text-[#0A192F]/60"
                          }`}
                        >
                          {opt.desc}
                        </p>
                      </div>

                      <div
                        className={`px-3 py-1.5 rounded-full text-xs font-black shrink-0 ${
                          isSelected
                            ? "bg-[#D4AF37] text-[#0A192F]"
                            : "bg-white text-[#0A192F] shadow-xs"
                        }`}
                      >
                        {opt.priceTag}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* QUESTION 4: Rate Category (Student vs Regular)           */}
          {/* ======================================================== */}
          {currentStep === 4 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="space-y-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#D4AF37] bg-[#0A192F] px-3 py-1 rounded-full inline-block">
                  Question 4 of 5 • Rate Category
                </span>
                <h4 className="text-xl sm:text-2xl font-black text-[#0A192F] tracking-tight pt-2">
                  Will you be unlocking our Student Rates today?
                </h4>
                <p className="text-xs text-[#0A192F]/70">
                  Special discounted tiers available with school/university ID card.
                </p>
              </div>

              <div className="space-y-3">
                {studentOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = isStudent === opt.label;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setIsStudent(opt.label)}
                      className={`p-5 rounded-2xl transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 min-h-[48px] ${
                        isSelected
                          ? "bg-[#0A192F] text-white shadow-md scale-[1.01]"
                          : "bg-stone-50 hover:bg-stone-100 text-[#0A192F]"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected
                              ? "bg-[#D4AF37] text-[#0A192F]"
                              : "bg-white text-[#0A192F] shadow-xs"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-black text-sm sm:text-base leading-snug">
                            <span className="text-[#D4AF37] font-black mr-2">
                              {opt.id})
                            </span>
                            {opt.label}
                          </div>
                          <p
                            className={`text-xs mt-0.5 ${
                              isSelected ? "text-stone-300" : "text-[#0A192F]/60"
                            }`}
                          >
                            {opt.desc}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${
                          isSelected
                            ? "bg-[#D4AF37] text-[#0A192F]"
                            : "bg-white text-[#0A192F]/70 shadow-xs"
                        }`}
                      >
                        {opt.badge}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* QUESTION 5: Specialized Spaces / Add-ons                 */}
          {/* ======================================================== */}
          {currentStep === 5 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="space-y-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#D4AF37] bg-[#0A192F] px-3 py-1 rounded-full inline-block">
                  Question 5 of 5 • Facility Add-ons
                </span>
                <h4 className="text-xl sm:text-2xl font-black text-[#0A192F] tracking-tight pt-2">
                  Do you need to reserve any specialized spaces or add-ons?
                </h4>
                <p className="text-xs text-[#0A192F]/70">
                  Let us know if you require private conference rooms or 3rd-floor recreation.
                </p>
              </div>

              <div className="space-y-3">
                {addonOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = addons === opt.label;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setAddons(opt.label)}
                      className={`p-5 rounded-2xl transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 min-h-[48px] ${
                        isSelected
                          ? "bg-[#0A192F] text-white shadow-md scale-[1.01]"
                          : "bg-stone-50 hover:bg-stone-100 text-[#0A192F]"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected
                              ? "bg-[#D4AF37] text-[#0A192F]"
                              : "bg-white text-[#0A192F] shadow-xs"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-black text-sm sm:text-base leading-snug">
                            <span className="text-[#D4AF37] font-black mr-2">
                              {opt.id})
                            </span>
                            {opt.label}
                          </div>
                          <p
                            className={`text-xs mt-0.5 ${
                              isSelected ? "text-stone-300" : "text-[#0A192F]/60"
                            }`}
                          >
                            {opt.desc}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border ${
                          isSelected
                            ? "bg-[#D4AF37] border-[#D4AF37] text-[#0A192F]"
                            : "border-stone-300 bg-white"
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 6: RECOMMENDATION, TIME PICKER & PERSISTENT PASS    */}
          {/* ======================================================== */}
          {currentStep === 6 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* RESERVATION SUCCESS BANNER (Shown when confirmed) */}
              {isConfirmed && (
                <div className="p-5 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-3 animate-in fade-in zoom-in-95 duration-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                        <Check className="w-5 h-5 stroke-[3]" />
                      </div>
                      <span className="text-base sm:text-lg font-black text-emerald-950">
                        Reservation Success!
                      </span>
                    </div>
                    <span className="text-[11px] font-black text-emerald-800 bg-emerald-200/80 px-3 py-1 rounded-full uppercase tracking-wider">
                      Pass Active ✓
                    </span>
                  </div>

                  <div className="text-xs text-emerald-900 leading-relaxed space-y-2">
                    <p className="font-medium">
                      Thank you{guestName ? `, ${guestName}` : ""}! Your workstation mockup reservation has been captured and synchronized to the Live Admin CRM.
                    </p>
                    <p className="bg-white/80 p-3 rounded-xl border border-emerald-200/60 flex items-start gap-2.5 text-emerald-900">
                      <Mail className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <span>
                        <strong className="font-black text-emerald-950">Email Confirmation Dispatched:</strong> You will receive an official email confirming your reservation voucher at{" "}
                        <span className="font-mono font-bold underline text-emerald-950">
                          {guestEmail || "your provided email"}
                        </span>
                        . Please present this pass upon arrival in Daraga.
                      </span>
                    </p>
                  </div>

                  {/* Direct Link to Admin CRM */}
                  <div className="pt-1 flex items-center justify-between">
                    <span className="text-[11px] text-emerald-800 font-bold">
                      Saved to live schedule database
                    </span>
                    <Link
                      href="/admin"
                      target="_blank"
                      className="inline-flex items-center gap-1.5 text-xs font-black text-[#0A192F] bg-[#D4AF37] px-3.5 py-1.5 rounded-xl shadow-xs hover:bg-[#b8952b] transition-colors"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      <span>View in Admin CRM &rarr;</span>
                    </Link>
                  </div>
                </div>
              )}

              {/* Highlight Recommendation Card */}
              <div className="p-6 rounded-3xl bg-[#0A192F] text-white space-y-4 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-[#D4AF37] text-[#0A192F] text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 fill-[#0A192F]" />
                    Custom-Matched Plan
                  </span>
                  <span className="text-xs text-stone-300 font-semibold">
                    {recommendedRateLabel}
                  </span>
                </div>

                <div>
                  <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {recommendedTitle}
                  </h4>
                  <p className="text-xs text-stone-300 mt-1">
                    Matched based on your 5 qualification answers:
                  </p>
                </div>

                {/* Price Display */}
                <div className="p-4 rounded-2xl bg-[#112442] flex items-baseline justify-between">
                  <span className="text-xs font-bold text-stone-300 uppercase">
                    Calculated Mockup Fee
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-[#D4AF37]">
                    {recommendedPrice}
                  </span>
                </div>

                {/* Answers Checklist */}
                <div className="grid sm:grid-cols-2 gap-2 pt-1 text-xs text-stone-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                    <span className="truncate">Zone: {environment}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                    <span className="truncate">Time: {duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                    <span className="truncate">Rates: {isStudent}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                    <span className="truncate">Add-on: {addons}</span>
                  </div>
                </div>
              </div>

              {/* TIME SLOT SELECTION COMPONENT (Before confirmation) */}
              {!isConfirmed && (
                <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-sm space-y-4">
                  <div className="border-b border-stone-100 pb-3">
                    <h5 className="font-black text-base text-[#0A192F] flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#D4AF37]" />
                      <span>Select Arrival Time & Duration Slot</span>
                    </h5>
                    <p className="text-xs text-[#0A192F]/60 mt-0.5">
                      Choose your arrival hour. Departure time calculates automatically based on your {duration.split(" ")[1] || "chosen"} session.
                    </p>
                  </div>

                  {/* Interactive Time Picker (Phase-of-Day tabs + Tape + Smart Calculation) */}
                  <TimeSlotPicker
                    selectedTime={selectedTime}
                    onSelectTime={setSelectedTime}
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                    durationOption={duration}
                  />
                </div>
              )}

              {/* DIGITAL PASS VOUCHER & QR CODE SECTION */}
              <div className="p-6 rounded-3xl bg-stone-50 border border-stone-200/80 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0A192F] text-[#D4AF37] flex items-center justify-center font-black">
                      <QrCode className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-[#0A192F]/60 tracking-wider">
                        Official Mockup Pass Voucher
                      </span>
                      <div className="font-mono font-black text-sm text-[#0A192F] flex items-center gap-2">
                        <span>{voucherCode}</span>
                        <button
                          onClick={handleCopyCode}
                          className="text-[10px] text-stone-500 hover:text-[#0A192F] px-1.5 py-0.5 rounded bg-stone-200/70 cursor-pointer flex items-center gap-1 font-sans"
                          title="Copy voucher code"
                        >
                          {copiedCode ? (
                            <span className="text-emerald-700 font-bold">Copied!</span>
                          ) : (
                            <React.Fragment>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </React.Fragment>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[11px] font-black px-3 py-1 rounded-full ${
                      isConfirmed
                        ? "text-emerald-800 bg-emerald-100"
                        : "text-[#0A192F] bg-[#D4AF37]/20"
                    }`}
                  >
                    {isConfirmed ? "Live Sync Confirmed ✓" : "Ready to Claim"}
                  </span>
                </div>

                {/* FORM INPUTS BEFORE CONFIRMATION */}
                {!isConfirmed ? (
                  <div className="space-y-4 pt-1">
                    <p className="text-xs text-[#0A192F]/75">
                      Please enter your contact details to generate your official pass QR code and synchronize your booking with the Admin CRM schedule.
                    </p>

                    <div className="grid sm:grid-cols-2 gap-3.5">
                      <div className="sm:col-span-2">
                        <label className="text-[11px] font-black uppercase tracking-wider text-[#0A192F] block mb-1.5 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>Your Full Name</span>
                        </label>
                        <input
                          type="text"
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          placeholder="e.g. Maria Santos"
                          className="w-full px-4 py-3 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white text-[#0A192F] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#0A192F] focus:border-transparent transition-all"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-black uppercase tracking-wider text-[#0A192F] block mb-1.5 flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>Email Address (For Confirmation)</span>
                        </label>
                        <input
                          type="email"
                          value={guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                          placeholder="e.g. maria.santos@gmail.com"
                          className="w-full px-4 py-3 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white text-[#0A192F] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#0A192F] focus:border-transparent transition-all"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-black uppercase tracking-wider text-[#0A192F] block mb-1.5 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>Mobile Number</span>
                        </label>
                        <input
                          type="tel"
                          value={guestPhone}
                          onChange={(e) => setGuestPhone(e.target.value)}
                          placeholder="e.g. 0917-123-4567"
                          className="w-full px-4 py-3 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white text-[#0A192F] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#0A192F] focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleGeneratePass}
                      className="w-full min-h-[50px] py-4 rounded-xl bg-[#0A192F] text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-md transition-transform duration-200 hover:scale-102 hover:bg-blue-900/90 active:scale-98 flex items-center justify-center gap-2.5 cursor-pointer mt-3"
                    >
                      <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                      <span>Generate Instant Mockup Pass Voucher</span>
                      <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                    </button>
                  </div>
                ) : (
                  /* POST-CONFIRMATION: QR CODE PASS CARD, SCHEDULE BREAKDOWN, DOWNLOAD BUTTON & VIEW QR CODE LINK */
                  <div className="space-y-5">
                    {/* Visual QR Code Ticket Card */}
                    <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center gap-5">
                      {/* Left: Rendered High-Definition QR Code */}
                      <div className="relative group shrink-0">
                        <div className="w-36 sm:w-40 aspect-[460/620] bg-white p-1 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-center overflow-hidden">
                          {qrDataUrl ? (
                            <img
                              src={qrDataUrl}
                              alt={`Pass QR Code for ${voucherCode}`}
                              className="w-full h-full object-contain rounded-xl"
                            />
                          ) : (
                            <div className="w-full h-full bg-stone-100 animate-pulse rounded-lg" />
                          )}
                        </div>
                        {/* Instant click to view QR */}
                        <button
                          onClick={() => setShowQrViewer(true)}
                          className="absolute inset-0 bg-[#0A192F]/80 text-white rounded-2xl flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[11px] font-bold"
                          title="Click to view full-size QR code"
                        >
                          <Eye className="w-5 h-5 text-[#D4AF37]" />
                          <span>View QR</span>
                        </button>
                      </div>

                      {/* Right: Pass Details Breakdown & Schedule */}
                      <div className="flex-1 space-y-2 text-center sm:text-left">
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-black uppercase text-[#D4AF37] tracking-wider">
                            Pass Holder & Scheduled Slot
                          </span>
                          <h5 className="font-black text-sm sm:text-base text-[#0A192F]">
                            {guestName || "Registered Guest"}
                          </h5>
                          <p className="text-xs text-[#0A192F]/60">
                            {guestEmail || "guest@fnjcoworking.ph"} • {guestPhone || "09XX-XXX-XXXX"}
                          </p>
                        </div>

                        {/* Schedule Chips */}
                        <div className="pt-1.5 flex flex-wrap items-center gap-2 justify-center sm:justify-start text-[11px] text-[#0A192F]">
                          <span className="px-2.5 py-1 rounded-md bg-stone-100 font-semibold flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-[#D4AF37]" />
                            <span>{selectedDate}</span>
                          </span>
                          <span className="px-2.5 py-1 rounded-md bg-stone-100 font-semibold flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#D4AF37]" />
                            <span>{selectedTime} – {calculatedDeparture}</span>
                          </span>
                          <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 font-bold border border-amber-200">
                            {recommendedPrice}
                          </span>
                        </div>

                        <p className="text-[11px] text-stone-500 pt-1">
                          Present this voucher at the 2nd Floor Biak Realty reception desk for instant check-in.
                        </p>
                      </div>
                    </div>

                    {/* DUAL ACTION BUTTONS: DOWNLOAD PASS QR CODE & VIEW QR CODE LINK */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {/* 1. Download PASS QR Code Button */}
                      <button
                        onClick={handleDownloadQr}
                        className="min-h-[46px] px-5 py-3 rounded-xl bg-[#0A192F] text-white font-black text-xs uppercase tracking-wider shadow-sm transition-all duration-200 hover:bg-blue-900 hover:scale-102 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Download className="w-4 h-4 text-[#D4AF37]" />
                        <span>Download PASS QR Code</span>
                      </button>

                      {/* 2. Link / Modal Trigger to View QR Code */}
                      <button
                        onClick={() => setShowQrViewer(true)}
                        className="min-h-[46px] px-5 py-3 rounded-xl bg-white border border-stone-300 text-[#0A192F] hover:bg-stone-50 hover:border-[#0A192F] font-bold text-xs uppercase tracking-wider shadow-xs transition-all duration-200 hover:scale-102 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Eye className="w-4 h-4 text-[#D4AF37]" />
                        <span>View QR Code (Full Size)</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Location Quick Ref */}
                <div className="pt-2 text-[11px] text-[#0A192F]/70 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                  <span>2nd Floor Biak Realty Corp., Lakandula Dr., Tagas, Daraga, Albay</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-stone-50 px-6 sm:px-8 py-4 border-t border-stone-100 flex items-center justify-between shrink-0">
          {currentStep > 1 && currentStep <= 5 ? (
            <button
              onClick={handleBack}
              className="min-h-[44px] px-5 py-2.5 rounded-full bg-white text-[#0A192F] hover:bg-stone-100 font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : currentStep === 6 ? (
            <button
              onClick={handleRestart}
              className="min-h-[44px] px-5 py-2.5 rounded-full bg-white text-[#0A192F] hover:bg-stone-100 font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Retake Questions</span>
            </button>
          ) : (
            <div className="text-xs text-[#0A192F]/60 font-semibold">
              Step 1 of 5
            </div>
          )}

          {currentStep < 5 ? (
            <button
              onClick={handleNext}
              className="min-h-[44px] px-6 py-2.5 rounded-full bg-[#0A192F] text-white font-black text-xs uppercase tracking-wider shadow-sm transition-transform duration-200 hover:scale-105 hover:bg-blue-900/90 active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <span>Next Question</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
            </button>
          ) : currentStep === 5 ? (
            <button
              onClick={handleNext}
              className="min-h-[44px] px-6 py-2.5 rounded-full bg-[#D4AF37] text-[#0A192F] font-black text-xs uppercase tracking-wider shadow-sm transition-transform duration-200 hover:scale-105 hover:bg-[#b8952b] active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <span>Pick Arrival Time & Pass</span>
              <Sparkles className="w-3.5 h-3.5 text-[#0A192F]" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="min-h-[44px] px-6 py-2.5 rounded-full bg-[#0A192F] text-white font-black text-xs uppercase tracking-wider shadow-sm transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Done / Close</span>
            </button>
          )}
        </div>
      </div>

      {/* FULL-SIZE QR CODE VIEWER LIGHTBOX MODAL */}
      {showQrViewer && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div
            onClick={() => setShowQrViewer(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            aria-hidden="true"
          />

          <div className="relative bg-white rounded-3xl p-5 sm:p-7 max-w-md w-full text-center space-y-4 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowQrViewer(false)}
              className="absolute top-4 right-4 w-9 h-9 min-w-[44px] min-h-[44px] rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close QR viewer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="pt-2">
              <span className="text-[10px] font-black uppercase text-[#D4AF37] tracking-widest bg-[#0A192F] px-3 py-1 rounded-full inline-block">
                Digital Pass QR
              </span>
              <h4 className="text-lg font-black text-[#0A192F] mt-1.5">
                {guestName || "FNJ Coworking Guest"}
              </h4>
              <p className="font-mono text-xs text-[#0A192F]/60 font-bold">
                {voucherCode}
              </p>
              <p className="text-xs text-stone-500 font-semibold mt-0.5">
                {selectedDate} • {selectedTime} – {calculatedDeparture}
              </p>
            </div>

            {/* High-Resolution Branded Pass Display */}
            <div className="w-64 max-w-full aspect-[460/620] mx-auto bg-white p-1 rounded-2xl border-2 border-[#D4AF37] shadow-lg flex items-center justify-center overflow-hidden">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`Pass QR Code for ${voucherCode}`}
                  className="w-full h-full object-contain rounded-xl"
                />
              ) : (
                <div className="w-full h-full bg-stone-100 animate-pulse rounded-lg" />
              )}
            </div>

            <div className="text-xs text-stone-600 leading-snug">
              Scan this code directly on our reception iPad scanner or save it to your phone photos.
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={handleDownloadQr}
                className="w-full min-h-[44px] py-3 rounded-xl bg-[#0A192F] text-white font-black text-xs uppercase tracking-wider hover:bg-blue-900 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Download className="w-4 h-4 text-[#D4AF37]" />
                <span>Save to Photos / Download</span>
              </button>
              <button
                onClick={() => setShowQrViewer(false)}
                className="w-full min-h-[44px] py-2.5 rounded-xl bg-stone-100 text-[#0A192F] font-bold text-xs hover:bg-stone-200 transition-colors cursor-pointer"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
