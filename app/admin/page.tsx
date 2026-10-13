"use client";

// FILE: app/admin/page.tsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import QRCode from "qrcode";
import {
  LayoutDashboard,
  Calendar,
  Clock,
  Users,
  Search,
  Filter,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Plus,
  RefreshCw,
  QrCode,
  Download,
  Trash2,
  Check,
  X,
  MapPin,
  TrendingUp,
  DollarSign,
  Coffee,
  Trophy,
  Briefcase,
  GraduationCap,
  Sparkles,
  Phone,
  Mail,
  User,
  SlidersHorizontal,
  ChevronDown,
  Building,
} from "lucide-react";
import {
  getBookings,
  saveBooking,
  updateBookingStatus,
  deleteBooking,
  resetToSeedBookings,
  BookingRecord,
  calculateDepartureTime,
} from "@/lib/bookings";

export default function AdminCrmDashboardPage() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedZoneFilter, setSelectedZoneFilter] = useState<string>("All");
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>("all");
  const [activeViewTab, setActiveViewTab] = useState<"table" | "timeline">("table");

  // Inspection modal for QR pass
  const [inspectingBooking, setInspectingBooking] = useState<BookingRecord | null>(null);
  const [inspectingQrDataUrl, setInspectingQrDataUrl] = useState<string>("");

  // Manual Walk-in Drawer / Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [walkinName, setWalkinName] = useState<string>("");
  const [walkinEmail, setWalkinEmail] = useState<string>("");
  const [walkinPhone, setWalkinPhone] = useState<string>("");
  const [walkinZone, setWalkinZone] = useState<string>("The open hot desk / café vibe");
  const [walkinDuration, setWalkinDuration] = useState<string>("The full 8-hour workday");
  const [walkinTime, setWalkinTime] = useState<string>("09:00 AM");
  const [walkinIsStudent, setWalkinIsStudent] = useState<boolean>(false);
  const [walkinAddon, setWalkinAddon] = useState<string>("Nope, just standard ergonomic seating");

  // Load bookings from localStorage
  const refreshBookings = useCallback(() => {
    const list = getBookings();
    setBookings(list);
  }, []);

  useEffect(() => {
    refreshBookings();

    const handleSync = () => {
      refreshBookings();
    };

    window.addEventListener("fnj-bookings-changed", handleSync);
    window.addEventListener("storage", handleSync);

    return () => {
      window.removeEventListener("fnj-bookings-changed", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, [refreshBookings]);

  // Generate QR for inspected booking
  useEffect(() => {
    if (inspectingBooking) {
      const payload = JSON.stringify({
        venue: "FNJ Coworking Space & Pickleball",
        address: "2F Biak Realty Corp., Lakandula Dr., Daraga, Albay",
        voucher: inspectingBooking.voucherCode,
        holder: inspectingBooking.guestName,
        email: inspectingBooking.guestEmail,
        date: inspectingBooking.arrivalDate,
        arrival: inspectingBooking.arrivalTime,
        departure: inspectingBooking.departureTime,
        plan: inspectingBooking.recommendedTitle,
        rate: inspectingBooking.recommendedPrice,
        facility: inspectingBooking.addons,
        status: inspectingBooking.status,
      });

      QRCode.toDataURL(payload, {
        width: 320,
        margin: 2,
        color: { dark: "#0A192F", light: "#FFFFFF" },
      })
        .then((url) => setInspectingQrDataUrl(url))
        .catch(() => setInspectingQrDataUrl(""));
    } else {
      setInspectingQrDataUrl("");
    }
  }, [inspectingBooking]);

  // Today string
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      // Search
      const matchesSearch =
        b.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.voucherCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.guestEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.guestPhone.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Zone Filter
      if (selectedZoneFilter === "Silent Study" && !b.environment.includes("silent")) {
        return false;
      }
      if (selectedZoneFilter === "Hot Desk" && !b.environment.includes("hot desk")) {
        return false;
      }
      if (selectedZoneFilter === "Conference" && !b.addons.includes("Conference Room")) {
        return false;
      }
      if (selectedZoneFilter === "Pickleball" && !b.addons.includes("Pickleball")) {
        return false;
      }

      // Date Filter
      if (selectedDateFilter === "today" && b.arrivalDate !== todayStr) {
        return false;
      }

      return true;
    });
  }, [bookings, searchQuery, selectedZoneFilter, selectedDateFilter, todayStr]);

  // Summary Metrics
  const metrics = useMemo(() => {
    const totalToday = bookings.filter((b) => b.arrivalDate === todayStr).length;
    const checkedInCount = bookings.filter((b) => b.status === "Checked In").length;
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalPriceAmount || 0), 0);
    const pickleballOrConf = bookings.filter(
      (b) => b.addons.includes("Pickleball") || b.addons.includes("Conference")
    ).length;

    return {
      totalCount: bookings.length,
      totalToday,
      checkedInCount,
      totalRevenue,
      pickleballOrConf,
    };
  }, [bookings, todayStr]);

  // Actions
  const handleStatusChange = (id: string, newStatus: BookingRecord["status"]) => {
    updateBookingStatus(id, newStatus);
    refreshBookings();
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this booking from the live schedule?")) {
      deleteBooking(id);
      refreshBookings();
    }
  };

  const handleResetData = () => {
    if (confirm("Reset to default realistic Albay seed bookings?")) {
      resetToSeedBookings();
      refreshBookings();
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    if (bookings.length === 0) return;
    const headers = [
      "Voucher Code",
      "Guest Name",
      "Email",
      "Phone",
      "Date",
      "Arrival Time",
      "Departure Time",
      "Zone",
      "Duration",
      "Rate Category",
      "Add-on",
      "Price",
      "Status",
    ];

    const rows = bookings.map((b) => [
      b.voucherCode,
      `"${b.guestName}"`,
      b.guestEmail,
      b.guestPhone,
      b.arrivalDate,
      b.arrivalTime,
      b.departureTime,
      `"${b.environment}"`,
      `"${b.duration}"`,
      b.isStudent ? "Student ID" : "Regular",
      `"${b.addons}"`,
      b.recommendedPrice,
      b.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `FNJ_Albay_Bookings_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Create Manual Walk-In
  const handleCreateWalkin = (e: React.FormEvent) => {
    e.preventDefault();
    const code = "FNJ-WALK-" + Math.floor(1000 + Math.random() * 9000);
    const departure = calculateDepartureTime(walkinTime, walkinDuration);

    let priceStr = "₱650.00";
    let priceNum = 650;
    let titleStr = "8-Hour Coworking Day Pass";

    if (walkinDuration.includes("1-hour")) {
      priceStr = walkinIsStudent ? "₱80.00" : "₱100.00";
      priceNum = walkinIsStudent ? 80 : 100;
      titleStr = "1-Hour Quick Sprint Pass";
    } else if (walkinDuration.includes("3-to-5 hour")) {
      priceStr = walkinIsStudent ? "₱380.00" : "₱480.00";
      priceNum = walkinIsStudent ? 380 : 480;
      titleStr = "5-Hour Extended Focus Pass";
    } else if (walkinDuration.includes("Monthly")) {
      priceStr = "₱9,000.00";
      priceNum = 9000;
      titleStr = "1 Month Dedicated Subscription";
    }

    if (walkinAddon.includes("Conference")) {
      priceStr = "₱700.00 / Hour";
      priceNum = 700;
      titleStr = "Executive Conference Room (1-10 Pax)";
    }

    const newBooking: BookingRecord = {
      id: "walkin-" + Date.now(),
      voucherCode: code,
      guestName: walkinName.trim() || "Walk-In Albay Guest",
      guestEmail: walkinEmail.trim() || "walkin@fnjcoworking.ph",
      guestPhone: walkinPhone.trim() || "0917-000-0000",
      goals: ["Walk-in desk access"],
      environment: walkinZone,
      duration: walkinDuration,
      arrivalDate: todayStr,
      arrivalTime: walkinTime,
      departureTime: departure,
      isStudent: walkinIsStudent,
      addons: walkinAddon,
      recommendedTitle: titleStr,
      recommendedPrice: priceStr,
      totalPriceAmount: priceNum,
      status: "Checked In",
      createdAt: new Date().toISOString(),
    };

    saveBooking(newBooking);
    refreshBookings();
    setIsAddModalOpen(false);

    // Reset fields
    setWalkinName("");
    setWalkinEmail("");
    setWalkinPhone("");
  };

  return (
    <div className="min-h-screen bg-[#F5F5DC] text-[#0A192F] font-sans flex flex-col">
      {/* 1. TOP EXECUTIVE HEADER */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Brand & CRM Title */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="w-10 h-10 rounded-xl bg-[#0A192F] text-[#D4AF37] font-black text-sm flex items-center justify-center shadow-xs hover:scale-105 transition-transform"
              title="Return to Public Website"
            >
              FNJ
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-base sm:text-lg text-[#0A192F] tracking-tight flex items-center gap-2">
                  <span>FNJ Operations CRM</span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Live Albay Hub
                  </span>
                </h1>
              </div>
              <p className="text-[11px] text-stone-500 font-medium">
                2F Biak Realty Corp., Lakandula Dr., Daraga, Albay
              </p>
            </div>
          </div>

          {/* Action Links & Back to Public Site */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className="min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-bold text-[#0A192F] hover:bg-stone-100 border border-stone-200/80 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Public Website</span>
            </Link>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="min-h-[40px] px-4 py-2 rounded-xl text-xs font-black bg-[#0A192F] text-white hover:bg-blue-900 transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Register Walk-In</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN CRM DASHBOARD CONTENT */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* KPI METRICS ROW */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Today's Bookings */}
          <div className="p-5 rounded-3xl bg-white shadow-xs border border-stone-200/80 space-y-2">
            <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
              <span>Today&apos;s Bookings</span>
              <Calendar className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#0A192F]">
              {metrics.totalToday}
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>{metrics.totalCount} total in system</span>
            </div>
          </div>

          {/* Card 2: Currently Checked In */}
          <div className="p-5 rounded-3xl bg-white shadow-xs border border-stone-200/80 space-y-2">
            <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
              <span>Currently Seated</span>
              <Users className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-800">
              {metrics.checkedInCount}
            </div>
            <div className="text-[11px] text-stone-500 font-medium">
              Checked-in at 2nd Floor desk
            </div>
          </div>

          {/* Card 3: Projected Revenue */}
          <div className="p-5 rounded-3xl bg-white shadow-xs border border-stone-200/80 space-y-2">
            <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
              <span>Est. Revenue Value</span>
              <DollarSign className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#0A192F]">
              ₱{metrics.totalRevenue.toLocaleString()}
            </div>
            <div className="text-[11px] text-[#D4AF37] font-bold">
              Albay best value rate tiers
            </div>
          </div>

          {/* Card 4: Specialized Spaces */}
          <div className="p-5 rounded-3xl bg-white shadow-xs border border-stone-200/80 space-y-2">
            <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
              <span>Boardroom & Pickleball</span>
              <Trophy className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#0A192F]">
              {metrics.pickleballOrConf}
            </div>
            <div className="text-[11px] text-stone-500 font-medium">
              Specialized facility bookings
            </div>
          </div>
        </div>

        {/* 3. CONTROLS, SEARCH, AND VIEW SWITCHER */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search guest name, voucher ID, phone, or email..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-stone-200 text-xs sm:text-sm bg-stone-50/60 text-[#0A192F] focus:outline-none focus:bg-white focus:border-[#0A192F] transition-all"
              />
            </div>

            {/* View Tabs & Export */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {/* Tab Selector */}
              <div className="p-1 bg-stone-100 rounded-2xl flex items-center shrink-0">
                <button
                  onClick={() => setActiveViewTab("table")}
                  className={`min-h-[36px] px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    activeViewTab === "table"
                      ? "bg-[#0A192F] text-white shadow-xs"
                      : "text-stone-600 hover:text-[#0A192F]"
                  }`}
                >
                  Schedule Table
                </button>
                <button
                  onClick={() => setActiveViewTab("timeline")}
                  className={`min-h-[36px] px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    activeViewTab === "timeline"
                      ? "bg-[#0A192F] text-white shadow-xs"
                      : "text-stone-600 hover:text-[#0A192F]"
                  }`}
                >
                  Daily Timeline
                </button>
              </div>

              {/* Export CSV */}
              <button
                onClick={handleExportCsv}
                className="min-h-[38px] px-3.5 py-2 rounded-xl text-xs font-bold bg-stone-100 hover:bg-stone-200 text-[#0A192F] transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                title="Export bookings to CSV"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export CSV</span>
              </button>

              {/* Reset Seed Data */}
              <button
                onClick={handleResetData}
                className="min-h-[38px] px-3.5 py-2 rounded-xl text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                title="Reset mock database to realistic defaults"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="hidden sm:inline">Reset Seeds</span>
              </button>
            </div>
          </div>

          {/* Quick Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pt-1 scrollbar-none text-xs">
            <span className="text-stone-400 font-bold text-[11px] uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              <span>Zone:</span>
            </span>

            {["All", "Silent Study", "Hot Desk", "Conference", "Pickleball"].map((zone) => (
              <button
                key={zone}
                onClick={() => setSelectedZoneFilter(zone)}
                className={`min-h-[32px] px-3 py-1 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
                  selectedZoneFilter === zone
                    ? "bg-[#0A192F] text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {zone}
              </button>
            ))}

            <div className="h-4 w-px bg-stone-300 mx-2 shrink-0" />

            {/* Date filter */}
            <button
              onClick={() => setSelectedDateFilter(selectedDateFilter === "today" ? "all" : "today")}
              className={`min-h-[32px] px-3 py-1 rounded-xl font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                selectedDateFilter === "today"
                  ? "bg-[#D4AF37] text-[#0A192F]"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              <Calendar className="w-3 h-3" />
              <span>Today Only</span>
            </button>
          </div>
        </div>

        {/* 4. VIEW RENDER: TABLE VIEW OR TIMELINE VIEW */}
        {activeViewTab === "table" ? (
          /* ======================================================== */
          /* TABLE VIEW: CLEAN SCHEDULE DATA TABLE                    */
          /* ======================================================== */
          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm min-w-[840px]">
                <thead className="bg-[#0A192F] text-white text-[11px] font-black uppercase tracking-wider">
                  <tr>
                    <th className="py-4 px-6">Voucher & Guest</th>
                    <th className="py-4 px-6">Schedule Slot</th>
                    <th className="py-4 px-6">Zone & Duration</th>
                    <th className="py-4 px-6">Rate & Fee</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-[#0A192F]">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-stone-400">
                        <div className="max-w-xs mx-auto space-y-2">
                          <AlertCircle className="w-8 h-8 text-stone-300 mx-auto" />
                          <p className="font-bold text-sm text-stone-600">No reservations match filters</p>
                          <p className="text-xs">
                            Try adjusting your search terms or clearing zone filters.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((b) => {
                      const isToday = b.arrivalDate === todayStr;
                      return (
                        <tr
                          key={b.id}
                          className="hover:bg-stone-50/80 transition-colors group"
                        >
                          {/* 1. Voucher & Guest */}
                          <td className="py-4 px-6">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-black text-xs text-[#0A192F] bg-stone-100 px-2 py-0.5 rounded">
                                  {b.voucherCode}
                                </span>
                                {b.isStudent && (
                                  <span className="text-[10px] font-black text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded flex items-center gap-1">
                                    <GraduationCap className="w-3 h-3" />
                                    Student
                                  </span>
                                )}
                              </div>
                              <div className="font-black text-sm text-[#0A192F]">
                                {b.guestName}
                              </div>
                              <div className="text-[11px] text-stone-500">
                                {b.guestPhone} • {b.guestEmail}
                              </div>
                            </div>
                          </td>

                          {/* 2. Schedule Slot */}
                          <td className="py-4 px-6">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 font-bold text-xs">
                                <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                                <span>{b.arrivalDate}</span>
                                {isToday && (
                                  <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                                    Today
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-stone-600 font-mono">
                                <Clock className="w-3.5 h-3.5 text-stone-400" />
                                <span>{b.arrivalTime} &rarr; {b.departureTime}</span>
                              </div>
                            </div>
                          </td>

                          {/* 3. Zone & Duration */}
                          <td className="py-4 px-6">
                            <div className="space-y-1">
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-stone-100 text-[#0A192F] inline-block">
                                {b.environment.replace("The ", "")}
                              </span>
                              <div className="text-xs text-stone-600 font-medium truncate max-w-[200px]">
                                {b.duration}
                              </div>
                              {b.addons !== "Nope, just standard ergonomic seating" && (
                                <div className="text-[10px] text-amber-800 font-bold flex items-center gap-1">
                                  <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                                  <span>{b.addons.replace("The ", "")}</span>
                                </div>
                              )}
                            </div>
                          </td>

                          {/* 4. Rate & Fee */}
                          <td className="py-4 px-6">
                            <div className="space-y-0.5">
                              <div className="font-black text-sm text-[#0A192F]">
                                {b.recommendedPrice}
                              </div>
                              <div className="text-[11px] text-stone-500">
                                {b.recommendedTitle}
                              </div>
                            </div>
                          </td>

                          {/* 5. Status Badge & Quick Toggle */}
                          <td className="py-4 px-6">
                            <select
                              value={b.status}
                              onChange={(e) =>
                                handleStatusChange(b.id, e.target.value as BookingRecord["status"])
                              }
                              className={`text-xs font-black px-3 py-1.5 rounded-xl border-none cursor-pointer focus:outline-none shadow-2xs ${
                                b.status === "Checked In"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : b.status === "Confirmed"
                                  ? "bg-blue-100 text-blue-900"
                                  : b.status === "Completed"
                                  ? "bg-stone-200 text-stone-700"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              <option value="Confirmed">Confirmed</option>
                              <option value="Checked In">Checked In</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>

                          {/* 6. Actions */}
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* View Pass QR */}
                              <button
                                onClick={() => setInspectingBooking(b)}
                                className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-[#0A192F] text-stone-700 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                                title="Inspect Pass QR code & details"
                              >
                                <QrCode className="w-4 h-4" />
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => handleDelete(b.id)}
                                className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-red-50 text-stone-400 hover:text-red-600 flex items-center justify-center transition-colors cursor-pointer"
                                title="Delete reservation"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="bg-stone-50 px-6 py-3 border-t border-stone-200/80 flex items-center justify-between text-xs text-stone-500">
              <span>Showing {filteredBookings.length} of {bookings.length} reservations</span>
              <span className="font-semibold">Local Storage Persistence Active</span>
            </div>
          </div>
        ) : (
          /* ======================================================== */
          /* TIMELINE VIEW: HOURLY PHASES & BOOKED SLOTS              */
          /* ======================================================== */
          <div className="space-y-6">
            {["Morning (08:00 AM – 11:30 AM)", "Afternoon (12:00 PM – 04:30 PM)", "Evening (05:00 PM – 08:30 PM)"].map(
              (phaseTitle, idx) => {
                const phaseKey = idx === 0 ? "morning" : idx === 1 ? "afternoon" : "evening";
                const phaseBookings = filteredBookings.filter((b) => {
                  const hour = parseInt(b.arrivalTime.split(":")[0], 10);
                  const isPm = b.arrivalTime.includes("PM");
                  if (phaseKey === "morning") return !isPm || (isPm && hour === 12);
                  if (phaseKey === "afternoon") return isPm && (hour < 5 || hour === 12);
                  return isPm && hour >= 5;
                });

                return (
                  <div
                    key={phaseTitle}
                    className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#0A192F] text-[#D4AF37] flex items-center justify-center font-black text-xs">
                          {idx + 1}
                        </div>
                        <div>
                          <h3 className="font-black text-base text-[#0A192F]">
                            {phaseTitle}
                          </h3>
                          <p className="text-xs text-stone-400 font-medium">
                            {phaseBookings.length} active reservations scheduled
                          </p>
                        </div>
                      </div>

                      <span className="text-[11px] font-bold text-stone-500 bg-stone-100 px-3 py-1 rounded-full">
                        {phaseBookings.length} Guests
                      </span>
                    </div>

                    {phaseBookings.length === 0 ? (
                      <p className="text-xs text-stone-400 py-4 italic">
                        No scheduled bookings in this time phase.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
                        {phaseBookings.map((b) => (
                          <div
                            key={b.id}
                            onClick={() => setInspectingBooking(b)}
                            className="p-4 rounded-2xl bg-stone-50/80 hover:bg-stone-100/90 border border-stone-200/60 transition-all cursor-pointer space-y-2 group"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono font-bold text-xs text-[#0A192F] flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                                <span>{b.arrivalTime} – {b.departureTime}</span>
                              </span>
                              <span
                                className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                                  b.status === "Checked In"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-blue-100 text-blue-900"
                                }`}
                              >
                                {b.status}
                              </span>
                            </div>

                            <div>
                              <div className="font-black text-sm text-[#0A192F] group-hover:text-blue-900 transition-colors">
                                {b.guestName}
                              </div>
                              <div className="text-[11px] text-stone-500 truncate">
                                {b.environment}
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-1 border-t border-stone-200/60 text-[11px]">
                              <span className="font-mono text-stone-400">
                                {b.voucherCode}
                              </span>
                              <span className="font-black text-[#0A192F]">
                                {b.recommendedPrice}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
            )}
          </div>
        )}
      </main>

      {/* 5. INSPECT QR CODE MODAL */}
      {inspectingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setInspectingBooking(null)}
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
            aria-hidden="true"
          />

          <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setInspectingBooking(null)}
              className="absolute top-4 right-4 w-9 h-9 min-w-[44px] min-h-[44px] rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center pt-2 space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] bg-[#0A192F] px-3 py-1 rounded-full inline-block">
                Albay Check-In Scanner Pass
              </span>
              <h3 className="text-xl font-black text-[#0A192F] pt-1">
                {inspectingBooking.guestName}
              </h3>
              <p className="font-mono text-xs font-bold text-stone-500">
                {inspectingBooking.voucherCode} • {inspectingBooking.arrivalDate}
              </p>
            </div>

            {/* QR Render */}
            <div className="w-52 h-52 mx-auto bg-white p-3 rounded-2xl border-2 border-[#D4AF37] shadow-inner flex items-center justify-center">
              {inspectingQrDataUrl ? (
                <img
                  src={inspectingQrDataUrl}
                  alt={`QR for ${inspectingBooking.voucherCode}`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full bg-stone-100 animate-pulse rounded-lg" />
              )}
            </div>

            {/* Breakdown Details */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-500 font-semibold">Scheduled Slot:</span>
                <span className="font-bold text-[#0A192F]">
                  {inspectingBooking.arrivalTime} – {inspectingBooking.departureTime}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500 font-semibold">Assigned Plan:</span>
                <span className="font-bold text-[#0A192F]">
                  {inspectingBooking.recommendedTitle}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500 font-semibold">Workspace Zone:</span>
                <span className="font-bold text-[#0A192F]">
                  {inspectingBooking.environment}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500 font-semibold">Specialized Add-on:</span>
                <span className="font-bold text-[#0A192F]">
                  {inspectingBooking.addons}
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-stone-200">
                <span className="text-stone-500 font-semibold">Total Fee:</span>
                <span className="font-black text-sm text-[#0A192F]">
                  {inspectingBooking.recommendedPrice}
                </span>
              </div>
            </div>

            {/* Status Change Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  handleStatusChange(inspectingBooking.id, "Checked In");
                  setInspectingBooking({ ...inspectingBooking, status: "Checked In" });
                }}
                className="flex-1 min-h-[44px] py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Checked In</span>
              </button>
              <button
                onClick={() => setInspectingBooking(null)}
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. REGISTER MANUAL WALK-IN DIALOG */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsAddModalOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
            aria-hidden="true"
          />

          <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl z-10 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 min-w-[44px] min-h-[44px] rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-black uppercase text-[#D4AF37] bg-[#0A192F] px-3 py-1 rounded-full inline-block">
                Reception Fast-Track
              </span>
              <h3 className="text-xl font-black text-[#0A192F] mt-2">
                Register Manual Walk-In Guest
              </h3>
              <p className="text-xs text-stone-500">
                Immediately issues pass voucher and seats guest in live schedule.
              </p>
            </div>

            <form onSubmit={handleCreateWalkin} className="space-y-4">
              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-[#0A192F] block mb-1">
                  Guest Full Name
                </label>
                <input
                  type="text"
                  required
                  value={walkinName}
                  onChange={(e) => setWalkinName(e.target.value)}
                  placeholder="e.g. Juan De La Cruz"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm bg-white text-[#0A192F] focus:outline-none focus:border-[#0A192F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-black uppercase tracking-wider text-[#0A192F] block mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={walkinPhone}
                    onChange={(e) => setWalkinPhone(e.target.value)}
                    placeholder="09XX-XXX-XXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs bg-white text-[#0A192F] focus:outline-none focus:border-[#0A192F]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-black uppercase tracking-wider text-[#0A192F] block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={walkinEmail}
                    onChange={(e) => setWalkinEmail(e.target.value)}
                    placeholder="guest@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs bg-white text-[#0A192F] focus:outline-none focus:border-[#0A192F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-black uppercase tracking-wider text-[#0A192F] block mb-1">
                    Arrival Time Slot
                  </label>
                  <select
                    value={walkinTime}
                    onChange={(e) => setWalkinTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs bg-white text-[#0A192F] font-bold focus:outline-none focus:border-[#0A192F]"
                  >
                    <option value="08:00 AM">08:00 AM (Morning)</option>
                    <option value="09:00 AM">09:00 AM (Morning)</option>
                    <option value="10:00 AM">10:00 AM (Morning)</option>
                    <option value="01:00 PM">01:00 PM (Afternoon)</option>
                    <option value="02:00 PM">02:00 PM (Afternoon)</option>
                    <option value="05:00 PM">05:00 PM (Evening)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-black uppercase tracking-wider text-[#0A192F] block mb-1">
                    Duration Tier
                  </label>
                  <select
                    value={walkinDuration}
                    onChange={(e) => setWalkinDuration(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs bg-white text-[#0A192F] font-bold focus:outline-none focus:border-[#0A192F]"
                  >
                    <option value="A quick 1-hour sprint">1-Hour Quick Sprint</option>
                    <option value="A 3-to-5 hour deep dive">5-Hour Focus Pass</option>
                    <option value="The full 8-hour workday">8-Hour Workday Pass</option>
                    <option value="I'm looking for a Monthly Subscription">1 Month Resident</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-[#0A192F] block mb-1">
                  Seating Zone
                </label>
                <select
                  value={walkinZone}
                  onChange={(e) => setWalkinZone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs bg-white text-[#0A192F] font-bold focus:outline-none focus:border-[#0A192F]"
                >
                  <option value="The open hot desk / café vibe">The open hot desk / café vibe</option>
                  <option value="The silent study zone">The silent study zone</option>
                  <option value="A private enclosed meeting room">A private enclosed meeting room</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="walkinStudentCheck"
                  checked={walkinIsStudent}
                  onChange={(e) => setWalkinIsStudent(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0A192F] focus:ring-[#0A192F]"
                />
                <label htmlFor="walkinStudentCheck" className="text-xs font-bold text-[#0A192F] cursor-pointer">
                  Apply Albay Student Discount Rate (ID Verified at Desk)
                </label>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 min-h-[46px] py-3 rounded-xl bg-[#0A192F] text-white font-black text-xs uppercase tracking-wider hover:bg-blue-900 transition-colors cursor-pointer shadow-xs"
                >
                  Confirm & Check-In Walk-In
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="min-h-[46px] px-5 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
