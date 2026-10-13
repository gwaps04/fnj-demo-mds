"use client";

// FILE: app/admin/page.tsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
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
  X,
  TrendingUp,
  DollarSign,
  Trophy,
  GraduationCap,
  Sparkles,
  Phone,
  Mail,
  Copy,
  Tag,
  Megaphone,
  Edit3,
  Layers,
  Check,
  Eye,
  SlidersHorizontal,
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
import {
  getPromos,
  savePromo,
  updatePromo,
  deletePromo,
  togglePromoStatus,
  resetToSeedPromos,
  PromoAnnouncement,
} from "@/lib/promos";
import { generateBrandedQrDataUrl } from "@/lib/brandedQr";

export default function AdminCrmDashboardPage() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [promos, setPromos] = useState<PromoAnnouncement[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedZoneFilter, setSelectedZoneFilter] = useState<string>("All");
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>("all");
  const [activeViewTab, setActiveViewTab] = useState<"table" | "timeline" | "promos">("table");

  // Inspection modal for QR pass
  const [inspectingBooking, setInspectingBooking] = useState<BookingRecord | null>(null);
  const [inspectingQrDataUrl, setInspectingQrDataUrl] = useState<string>("");
  const [isCopiedVoucher, setIsCopiedVoucher] = useState<boolean>(false);

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

  // Promo Add / Edit Modal state
  const [isPromoModalOpen, setIsPromoModalOpen] = useState<boolean>(false);
  const [editingPromoId, setEditingPromoId] = useState<string | null>(null);
  const [promoFormTitle, setPromoFormTitle] = useState<string>("");
  const [promoFormBadge, setPromoFormBadge] = useState<string>("SPECIAL PROMO");
  const [promoFormDesc, setPromoFormDesc] = useState<string>("");
  const [promoFormDiscountCode, setPromoFormDiscountCode] = useState<string>("");
  const [promoFormValidity, setPromoFormValidity] = useState<string>("Valid until Nov 30, 2026");
  const [promoFormCtaText, setPromoFormCtaText] = useState<string>("Claim Promo Pass");
  const [promoFormLocation, setPromoFormLocation] = useState<"both" | "banner" | "section">("both");
  const [promoFormIsActive, setPromoFormIsActive] = useState<boolean>(true);
  const [copiedPromoCodeId, setCopiedPromoCodeId] = useState<string | null>(null);

  // Load bookings from localStorage
  const refreshBookings = useCallback(() => {
    const list = getBookings();
    setBookings(list);
  }, []);

  // Load promos from localStorage
  const refreshPromos = useCallback(() => {
    const list = getPromos();
    setPromos(list);
  }, []);

  useEffect(() => {
    refreshBookings();
    refreshPromos();

    const handleBookingsSync = () => refreshBookings();
    const handlePromosSync = () => refreshPromos();

    window.addEventListener("fnj-bookings-changed", handleBookingsSync);
    window.addEventListener("fnj-promos-changed", handlePromosSync);
    window.addEventListener("storage", () => {
      refreshBookings();
      refreshPromos();
    });

    return () => {
      window.removeEventListener("fnj-bookings-changed", handleBookingsSync);
      window.removeEventListener("fnj-promos-changed", handlePromosSync);
    };
  }, [refreshBookings, refreshPromos]);

  // Generate Branded QR Code for inspected booking with FNJ Center Medallion, Date & Time
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

      generateBrandedQrDataUrl({
        payloadText: payload,
        voucherCode: inspectingBooking.voucherCode,
        guestName: inspectingBooking.guestName,
        arrivalDate: inspectingBooking.arrivalDate,
        arrivalTime: inspectingBooking.arrivalTime,
        departureTime: inspectingBooking.departureTime,
        zoneOrPlan: inspectingBooking.recommendedTitle,
        rateCategory: inspectingBooking.isStudent ? "Student Rate" : "Regular Rate",
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
      // Search query
      const matchesSearch =
        b.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.voucherCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.guestEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.guestPhone.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Zone Filter
      if (selectedZoneFilter === "Silent Study" && !b.environment.toLowerCase().includes("silent")) {
        return false;
      }
      if (selectedZoneFilter === "Hot Desk" && !b.environment.toLowerCase().includes("hot desk")) {
        return false;
      }
      if (selectedZoneFilter === "Conference" && !b.addons.toLowerCase().includes("conference")) {
        return false;
      }
      if (selectedZoneFilter === "Pickleball" && !b.addons.toLowerCase().includes("pickleball")) {
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

    const activePromosCount = promos.filter((p) => p.isActive).length;
    const bannerPromosCount = promos.filter((p) => p.isActive && (p.displayLocation === "banner" || p.displayLocation === "both")).length;

    return {
      totalCount: bookings.length,
      totalToday,
      checkedInCount,
      totalRevenue,
      pickleballOrConf,
      totalPromos: promos.length,
      activePromosCount,
      bannerPromosCount,
    };
  }, [bookings, promos, todayStr]);

  // Status Change
  const handleStatusChange = (id: string, newStatus: BookingRecord["status"]) => {
    updateBookingStatus(id, newStatus);
    refreshBookings();
  };

  // Delete Record
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this booking from the live schedule?")) {
      deleteBooking(id);
      refreshBookings();
      if (inspectingBooking?.id === id) {
        setInspectingBooking(null);
      }
    }
  };

  // Reset Data to Realistic Albay Seeds
  const handleResetData = () => {
    if (confirm("Reset to default realistic Albay seed bookings?")) {
      resetToSeedBookings();
      refreshBookings();
    }
  };

  // Download Inspected Branded Pass PNG
  const handleDownloadInspectedQr = () => {
    if (!inspectingQrDataUrl || !inspectingBooking) return;
    const link = document.createElement("a");
    link.href = inspectingQrDataUrl;
    link.download = `${inspectingBooking.voucherCode}-FNJ-BRANDED-PASS.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy Voucher Code
  const handleCopyVoucher = (code: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setIsCopiedVoucher(true);
      setTimeout(() => setIsCopiedVoucher(false), 2000);
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

  // --- PROMO MANAGEMENT HANDLERS ---
  const handleOpenNewPromoModal = () => {
    setEditingPromoId(null);
    setPromoFormTitle("");
    setPromoFormBadge("SPECIAL PROMO");
    setPromoFormDesc("");
    setPromoFormDiscountCode("");
    setPromoFormValidity("Valid until Nov 30, 2026");
    setPromoFormCtaText("Claim Promo Pass");
    setPromoFormLocation("both");
    setPromoFormIsActive(true);
    setIsPromoModalOpen(true);
  };

  const handleEditPromo = (promo: PromoAnnouncement) => {
    setEditingPromoId(promo.id);
    setPromoFormTitle(promo.title);
    setPromoFormBadge(promo.badge);
    setPromoFormDesc(promo.description);
    setPromoFormDiscountCode(promo.discountCode || "");
    setPromoFormValidity(promo.validityText);
    setPromoFormCtaText(promo.ctaText || "Claim Promo Pass");
    setPromoFormLocation(promo.displayLocation);
    setPromoFormIsActive(promo.isActive);
    setIsPromoModalOpen(true);
  };

  const handleSavePromoForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoFormTitle.trim() || !promoFormDesc.trim()) return;

    if (editingPromoId) {
      updatePromo(editingPromoId, {
        title: promoFormTitle.trim(),
        badge: promoFormBadge.trim(),
        description: promoFormDesc.trim(),
        discountCode: promoFormDiscountCode.trim() || undefined,
        validityText: promoFormValidity.trim(),
        ctaText: promoFormCtaText.trim() || "Claim Promo Pass",
        displayLocation: promoFormLocation,
        isActive: promoFormIsActive,
      });
    } else {
      const newPromo: PromoAnnouncement = {
        id: "promo-" + Date.now(),
        title: promoFormTitle.trim(),
        badge: promoFormBadge.trim(),
        description: promoFormDesc.trim(),
        discountCode: promoFormDiscountCode.trim() || undefined,
        validityText: promoFormValidity.trim(),
        ctaText: promoFormCtaText.trim() || "Claim Promo Pass",
        displayLocation: promoFormLocation,
        isActive: promoFormIsActive,
        createdAt: new Date().toISOString(),
      };
      savePromo(newPromo);
    }

    refreshPromos();
    setIsPromoModalOpen(false);
  };

  const handleTogglePromo = (id: string) => {
    togglePromoStatus(id);
    refreshPromos();
  };

  const handleDeletePromo = (id: string) => {
    if (confirm("Are you sure you want to remove this promo announcement?")) {
      deletePromo(id);
      refreshPromos();
    }
  };

  const handleResetPromos = () => {
    if (confirm("Reset promos to default realistic Albay promotions?")) {
      resetToSeedPromos();
      refreshPromos();
    }
  };

  const handleCopyPromoCode = (id: string, code: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedPromoCodeId(id);
      setTimeout(() => setCopiedPromoCodeId(null), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5DC] text-[#0A192F] font-sans flex flex-col w-full overflow-x-hidden">
      {/* 1. RESPONSIVE EXECUTIVE CRM HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Top / Left: Brand & Hub Title */}
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="w-10 h-10 min-w-[40px] rounded-xl bg-[#0A192F] text-[#D4AF37] font-black text-sm flex items-center justify-center shadow-xs hover:scale-105 transition-transform"
                title="Return to Public Website"
              >
                FNJ
              </Link>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-black text-base sm:text-lg text-[#0A192F] tracking-tight truncate">
                    FNJ Operations CRM
                  </h1>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                    Live Albay Hub
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 font-medium truncate">
                  2F Biak Realty Corp., Lakandula Dr., Daraga, Albay
                </p>
              </div>
            </div>

            {/* Right / Actions Row */}
            <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto justify-end">
              <Link
                href="/"
                className="min-h-[40px] px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold text-[#0A192F] hover:bg-stone-100 border border-stone-200/80 transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Public Site</span>
              </Link>

              {/* Add Promo Button (Accessible from any tab) */}
              <button
                onClick={handleOpenNewPromoModal}
                className="min-h-[40px] px-3 sm:px-3.5 py-2 rounded-xl text-xs font-black bg-[#D4AF37] text-[#0A192F] hover:bg-[#b8952b] transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                title="Add a new live promo or announcement"
              >
                <Sparkles className="w-3.5 h-3.5 fill-[#0A192F]" />
                <span>+ Add Promo</span>
              </button>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="min-h-[40px] px-3 sm:px-3.5 py-2 rounded-xl text-xs font-black bg-[#0A192F] text-white hover:bg-blue-900 transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Walk-In</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 2. MAIN CRM DASHBOARD CONTENT */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-5 sm:space-y-8">
        {/* KPI METRICS ROW - 5-TIER RESPONSIVE GRID */}
        {activeViewTab !== "promos" ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
            {/* Card 1: Today's Bookings */}
            <div className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-white shadow-xs border border-stone-200/80 space-y-1 sm:space-y-2">
              <div className="flex items-center justify-between text-stone-500 text-[11px] sm:text-xs font-bold">
                <span>Today&apos;s Bookings</span>
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37]" />
              </div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-black text-[#0A192F]">
                {metrics.totalToday}
              </div>
              <div className="text-[10px] sm:text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>{metrics.totalCount} total in system</span>
              </div>
            </div>

            {/* Card 2: Currently Checked In */}
            <div className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-white shadow-xs border border-stone-200/80 space-y-1 sm:space-y-2">
              <div className="flex items-center justify-between text-stone-500 text-[11px] sm:text-xs font-bold">
                <span>Currently Seated</span>
                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
              </div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-black text-emerald-800">
                {metrics.checkedInCount}
              </div>
              <div className="text-[10px] sm:text-[11px] text-stone-500 font-medium truncate">
                Checked-in at 2F desk
              </div>
            </div>

            {/* Card 3: Projected Revenue */}
            <div className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-white shadow-xs border border-stone-200/80 space-y-1 sm:space-y-2">
              <div className="flex items-center justify-between text-stone-500 text-[11px] sm:text-xs font-bold">
                <span>Est. Revenue Value</span>
                <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37]" />
              </div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-black text-[#0A192F]">
                ₱{metrics.totalRevenue.toLocaleString()}
              </div>
              <div className="text-[10px] sm:text-[11px] text-[#D4AF37] font-bold truncate">
                Albay best value rate tiers
              </div>
            </div>

            {/* Card 4: Active Promos Badge */}
            <div
              onClick={() => setActiveViewTab("promos")}
              className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-white shadow-xs border border-stone-200/80 space-y-1 sm:space-y-2 cursor-pointer hover:border-[#D4AF37] transition-all group"
            >
              <div className="flex items-center justify-between text-stone-500 text-[11px] sm:text-xs font-bold">
                <span>Live Website Promos</span>
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37]" />
              </div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-black text-[#0A192F] group-hover:text-blue-900">
                {metrics.activePromosCount} Active
              </div>
              <div className="text-[10px] sm:text-[11px] text-stone-500 font-medium truncate flex items-center justify-between">
                <span>Manage bulletin & deals</span>
                <span className="text-[#D4AF37] font-bold">View &rarr;</span>
              </div>
            </div>
          </div>
        ) : (
          /* PROMOS & BULLETIN METRICS ROW */
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
            <div className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-white shadow-xs border border-stone-200/80 space-y-1 sm:space-y-2">
              <div className="flex items-center justify-between text-stone-500 text-[11px] sm:text-xs font-bold">
                <span>Active Live on Website</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-black text-emerald-800">
                {metrics.activePromosCount}
              </div>
              <div className="text-[10px] sm:text-[11px] text-stone-500 font-medium truncate">
                Displayed on homepage & banner
              </div>
            </div>

            <div className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-white shadow-xs border border-stone-200/80 space-y-1 sm:space-y-2">
              <div className="flex items-center justify-between text-stone-500 text-[11px] sm:text-xs font-bold">
                <span>Top Notice Tickers</span>
                <Megaphone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37]" />
              </div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-black text-[#0A192F]">
                {metrics.bannerPromosCount}
              </div>
              <div className="text-[10px] sm:text-[11px] text-stone-500 font-medium truncate">
                Rotating top announcement bar
              </div>
            </div>

            <div className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-white shadow-xs border border-stone-200/80 space-y-1 sm:space-y-2">
              <div className="flex items-center justify-between text-stone-500 text-[11px] sm:text-xs font-bold">
                <span>Total Promos in CRM</span>
                <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-900" />
              </div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-black text-[#0A192F]">
                {promos.length}
              </div>
              <div className="text-[10px] sm:text-[11px] text-stone-500 font-medium truncate">
                Active & paused items
              </div>
            </div>

            <div className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-white shadow-xs border border-stone-200/80 space-y-1 sm:space-y-2">
              <div className="flex items-center justify-between text-stone-500 text-[11px] sm:text-xs font-bold">
                <span>Zero Database Needed</span>
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
              </div>
              <div className="text-sm sm:text-base font-black text-[#0A192F]">
                Real-Time Local Sync
              </div>
              <div className="text-[10px] sm:text-[11px] text-emerald-700 font-semibold truncate">
                100% Client-side persistent
              </div>
            </div>
          </div>
        )}

        {/* 3. CONTROLS & 3-WAY VIEW SWITCHER */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-stone-200/80 shadow-xs space-y-3 sm:space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
            {/* View Tabs Selector */}
            <div className="p-1 bg-stone-100 rounded-xl sm:rounded-2xl flex flex-wrap items-center shrink-0 gap-1">
              <button
                onClick={() => setActiveViewTab("table")}
                className={`min-h-[36px] px-3 sm:px-3.5 py-1.5 rounded-lg sm:rounded-xl text-xs font-black transition-all cursor-pointer ${
                  activeViewTab === "table"
                    ? "bg-[#0A192F] text-white shadow-xs"
                    : "text-stone-600 hover:text-[#0A192F]"
                }`}
              >
                Schedule View
              </button>
              <button
                onClick={() => setActiveViewTab("timeline")}
                className={`min-h-[36px] px-3 sm:px-3.5 py-1.5 rounded-lg sm:rounded-xl text-xs font-black transition-all cursor-pointer ${
                  activeViewTab === "timeline"
                    ? "bg-[#0A192F] text-white shadow-xs"
                    : "text-stone-600 hover:text-[#0A192F]"
                }`}
              >
                Daily Timeline
              </button>
              <button
                onClick={() => setActiveViewTab("promos")}
                className={`min-h-[36px] px-3 sm:px-3.5 py-1.5 rounded-lg sm:rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeViewTab === "promos"
                    ? "bg-[#0A192F] text-white shadow-xs"
                    : "text-stone-600 hover:text-[#0A192F]"
                }`}
              >
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                <span>Promos & Bulletin</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#D4AF37] text-[#0A192F] font-black">
                  {metrics.activePromosCount}
                </span>
              </button>
            </div>

            {/* Right Action Tools for Current Tab */}
            {activeViewTab !== "promos" ? (
              <div className="flex flex-wrap items-center gap-2">
                {/* Search Input */}
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search bookings..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 text-xs bg-stone-50/60 text-[#0A192F] focus:outline-none focus:bg-white"
                  />
                </div>

                {/* Export CSV */}
                <button
                  onClick={handleExportCsv}
                  className="min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-bold bg-stone-100 hover:bg-stone-200 text-[#0A192F] transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Export bookings to CSV"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">Export CSV</span>
                </button>

                {/* Reset Seed Data */}
                <button
                  onClick={handleResetData}
                  className="min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Reset bookings database"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="hidden sm:inline">Reset Seeds</span>
                </button>
              </div>
            ) : (
              /* Promo Actions */
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleOpenNewPromoModal}
                  className="min-h-[36px] px-3.5 py-1.5 rounded-xl text-xs font-black bg-[#0A192F] text-white hover:bg-blue-900 transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>New Announcement</span>
                </button>

                <button
                  onClick={handleResetPromos}
                  className="min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Reset promos to default Albay seed promos"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Reset Promos</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick Filter Chips for Bookings (Only visible in schedule or timeline tab) */}
          {activeViewTab !== "promos" && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin text-xs">
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

              <div className="h-4 w-px bg-stone-300 mx-1 shrink-0" />

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
          )}
        </div>

        {/* 4. VIEW RENDER: SCHEDULE, TIMELINE, OR PROMOS MANAGER */}
        {activeViewTab === "table" ? (
          <div className="space-y-4">
            {/* 4A. MOBILE RESERVATION CARDS FEED (Screen < 768px: md:hidden) */}
            <div className="md:hidden space-y-3">
              {filteredBookings.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center text-stone-400 border border-stone-200/80">
                  <AlertCircle className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                  <p className="font-bold text-sm text-stone-600">No reservations match filters</p>
                  <p className="text-xs">Try adjusting search or clearing filters.</p>
                </div>
              ) : (
                filteredBookings.map((b) => {
                  const isToday = b.arrivalDate === todayStr;
                  return (
                    <div
                      key={b.id}
                      className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-black text-xs text-[#0A192F] bg-stone-100 px-2 py-0.5 rounded">
                            {b.voucherCode}
                          </span>
                          {b.isStudent && (
                            <span className="text-[10px] font-black text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                              <GraduationCap className="w-3 h-3" />
                              Student
                            </span>
                          )}
                        </div>

                        <select
                          value={b.status}
                          onChange={(e) =>
                            handleStatusChange(b.id, e.target.value as BookingRecord["status"])
                          }
                          className={`text-xs font-black px-2.5 py-1 rounded-lg border-none cursor-pointer focus:outline-none shadow-2xs ${
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
                      </div>

                      <div>
                        <div
                          onClick={() => setInspectingBooking(b)}
                          className="font-black text-sm text-[#0A192F] hover:text-blue-900 cursor-pointer flex items-center justify-between"
                        >
                          <span>{b.guestName}</span>
                          <span className="font-black text-sm text-[#0A192F]">{b.recommendedPrice}</span>
                        </div>
                        <div className="text-[11px] text-stone-500 flex flex-wrap gap-x-2 pt-0.5">
                          <span>{b.guestPhone}</span>
                          <span>•</span>
                          <span className="truncate">{b.guestEmail}</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-xs space-y-1">
                        <div className="flex items-center justify-between font-bold text-[#0A192F]">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span>{b.arrivalDate}</span>
                            {isToday && (
                              <span className="text-[9px] font-black uppercase text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                                Today
                              </span>
                            )}
                          </span>
                          <span className="flex items-center gap-1 font-mono text-stone-600 text-[11px]">
                            <Clock className="w-3 h-3 text-stone-400" />
                            <span>{b.arrivalTime} – {b.departureTime}</span>
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-stone-500 pt-0.5">
                          <span className="truncate">{b.environment.replace("The ", "")}</span>
                          <span className="font-semibold text-stone-600 shrink-0">{b.duration.replace("The ", "")}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => setInspectingBooking(b)}
                          className="flex-1 min-h-[38px] py-1.5 px-3 rounded-xl bg-[#0A192F] text-white hover:bg-blue-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <QrCode className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>Inspect Branded Pass</span>
                        </button>
                        <button
                          onClick={() => handleDelete(b.id)}
                          className="min-h-[38px] w-9 rounded-xl bg-stone-100 hover:bg-red-50 text-stone-400 hover:text-red-600 flex items-center justify-center transition-colors cursor-pointer"
                          title="Delete booking"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* 4B. DESKTOP / TABLET SCHEDULE TABLE (>= 768px: hidden md:block) */}
            <div className="hidden md:block bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full text-left text-xs lg:text-sm min-w-[760px]">
                  <thead className="bg-[#0A192F] text-white text-[11px] font-black uppercase tracking-wider">
                    <tr>
                      <th className="py-4 px-4 lg:px-6">Voucher & Guest</th>
                      <th className="py-4 px-4 lg:px-6">Schedule Slot</th>
                      <th className="py-4 px-4 lg:px-6">Zone & Duration</th>
                      <th className="py-4 px-4 lg:px-6">Rate & Fee</th>
                      <th className="py-4 px-4 lg:px-6">Status</th>
                      <th className="py-4 px-4 lg:px-6 text-right">Actions</th>
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
                            <td className="py-4 px-4 lg:px-6">
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

                            <td className="py-4 px-4 lg:px-6">
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

                            <td className="py-4 px-4 lg:px-6">
                              <div className="space-y-1">
                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-stone-100 text-[#0A192F] inline-block">
                                  {b.environment.replace("The ", "")}
                                </span>
                                <div className="text-xs text-stone-600 font-medium truncate max-w-[180px]">
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

                            <td className="py-4 px-4 lg:px-6">
                              <div className="space-y-0.5">
                                <div className="font-black text-sm text-[#0A192F]">
                                  {b.recommendedPrice}
                                </div>
                                <div className="text-[11px] text-stone-500">
                                  {b.recommendedTitle}
                                </div>
                              </div>
                            </td>

                            <td className="py-4 px-4 lg:px-6">
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

                            <td className="py-4 px-4 lg:px-6 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => setInspectingBooking(b)}
                                  className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-[#0A192F] text-stone-700 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                                  title="Inspect Branded Pass QR code & details"
                                >
                                  <QrCode className="w-4 h-4" />
                                </button>

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

              <div className="bg-stone-50 px-4 lg:px-6 py-3 border-t border-stone-200/80 flex items-center justify-between text-xs text-stone-500">
                <span>Showing {filteredBookings.length} of {bookings.length} reservations</span>
                <span className="font-semibold">Local Storage Persistence Active</span>
              </div>
            </div>
          </div>
        ) : activeViewTab === "timeline" ? (
          /* TIMELINE VIEW */
          <div className="space-y-4 sm:space-y-6">
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
                    className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-stone-200/80 shadow-xs space-y-3 sm:space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#0A192F] text-[#D4AF37] flex items-center justify-center font-black text-xs">
                          {idx + 1}
                        </div>
                        <div>
                          <h3 className="font-black text-sm sm:text-base text-[#0A192F]">
                            {phaseTitle}
                          </h3>
                          <p className="text-[11px] sm:text-xs text-stone-400 font-medium">
                            {phaseBookings.length} active reservations scheduled
                          </p>
                        </div>
                      </div>

                      <span className="text-[11px] font-bold text-stone-500 bg-stone-100 px-2.5 sm:px-3 py-1 rounded-full">
                        {phaseBookings.length} Guests
                      </span>
                    </div>

                    {phaseBookings.length === 0 ? (
                      <p className="text-xs text-stone-400 py-3 italic">
                        No scheduled bookings in this time phase.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {phaseBookings.map((b) => (
                          <div
                            key={b.id}
                            onClick={() => setInspectingBooking(b)}
                            className="p-3.5 sm:p-4 rounded-2xl bg-stone-50/80 hover:bg-stone-100/90 border border-stone-200/60 transition-all cursor-pointer space-y-2 group"
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
        ) : (
          /* ======================================================== */
          /* 4C. PROMOS & ANNOUNCEMENTS BULLETIN MANAGER VIEW         */
          /* ======================================================== */
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs">
              <div>
                <h3 className="font-black text-base sm:text-lg text-[#0A192F] flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-[#D4AF37]" />
                  <span>Website Promos & Community Bulletin</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Promos and notices created here automatically display on the public website homepage and top announcement bar in real time without any database.
                </p>
              </div>

              <button
                onClick={handleOpenNewPromoModal}
                className="self-start sm:self-auto min-h-[42px] px-4 py-2 rounded-xl bg-[#0A192F] text-white hover:bg-blue-900 font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#D4AF37]" />
                <span>+ Create Promo Announcement</span>
              </button>
            </div>

            {/* Promos Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {promos.length === 0 ? (
                <div className="col-span-full bg-white rounded-3xl p-12 text-center text-stone-400 border border-stone-200/80 space-y-3">
                  <Megaphone className="w-10 h-10 text-stone-300 mx-auto" />
                  <h4 className="font-black text-base text-[#0A192F]">No Promos or Announcements Found</h4>
                  <p className="text-xs max-w-md mx-auto text-stone-500">
                    Add a discount voucher, student deal, or important facility announcement to display on the public site.
                  </p>
                  <button
                    onClick={handleResetPromos}
                    className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs"
                  >
                    Load Default Albay Seed Promos
                  </button>
                </div>
              ) : (
                promos.map((p) => (
                  <div
                    key={p.id}
                    className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all duration-200 flex flex-col justify-between space-y-4 shadow-xs ${
                      p.isActive
                        ? "border-stone-200 hover:border-[#D4AF37] hover:shadow-md"
                        : "border-stone-200 opacity-60 bg-stone-50/50"
                    }`}
                  >
                    {/* Top Row: Badge, Location & Status Toggle */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-[#D4AF37]/20 text-[#0A192F] text-[10px] font-black uppercase tracking-wider border border-[#D4AF37]/40 flex items-center gap-1">
                          <Tag className="w-3 h-3 text-[#B8952B]" />
                          <span>{p.badge}</span>
                        </span>

                        {/* Status Toggle Switch */}
                        <button
                          onClick={() => handleTogglePromo(p.id)}
                          className={`min-h-[28px] px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer ${
                            p.isActive
                              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                              : "bg-stone-200 text-stone-600 hover:bg-stone-300"
                          }`}
                          title={p.isActive ? "Click to Pause" : "Click to Activate"}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${p.isActive ? "bg-emerald-600 animate-pulse" : "bg-stone-400"}`} />
                          <span>{p.isActive ? "Live on Site" : "Paused"}</span>
                        </button>
                      </div>

                      {/* Display Location Tag */}
                      <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-medium">
                        <Layers className="w-3 h-3 text-[#D4AF37]" />
                        <span>
                          Placement:{" "}
                          <strong className="text-[#0A192F]">
                            {p.displayLocation === "both"
                              ? "Top Banner & Public Section"
                              : p.displayLocation === "banner"
                              ? "Top Announcement Bar Only"
                              : "Public Section Only"}
                          </strong>
                        </span>
                      </div>

                      {/* Title & Description */}
                      <div>
                        <h4 className="font-black text-base text-[#0A192F] leading-snug">
                          {p.title}
                        </h4>
                        <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                          {p.description}
                        </p>
                      </div>
                    </div>

                    {/* Voucher Code & Action Footer */}
                    <div className="space-y-3 pt-3 border-t border-stone-100">
                      {p.discountCode && (
                        <div className="flex items-center justify-between p-2 rounded-xl bg-stone-50 border border-stone-200 text-xs">
                          <span className="font-mono font-bold text-[#0A192F] text-xs">
                            {p.discountCode}
                          </span>
                          <button
                            onClick={() => handleCopyPromoCode(p.id, p.discountCode!)}
                            className="text-[10px] px-2 py-0.5 rounded bg-white hover:bg-stone-100 text-stone-700 font-bold border border-stone-200 cursor-pointer"
                          >
                            {copiedPromoCodeId === p.id ? "Copied!" : "Copy"}
                          </button>
                        </div>
                      )}

                      <div className="text-[11px] text-stone-400 font-medium flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-stone-400" />
                        <span>{p.validityText}</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => handleEditPromo(p)}
                          className="flex-1 min-h-[36px] py-1.5 px-3 rounded-xl bg-stone-100 hover:bg-[#0A192F] hover:text-white text-[#0A192F] font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => handleDeletePromo(p.id)}
                          className="min-h-[36px] w-9 rounded-xl bg-stone-100 hover:bg-red-50 text-stone-400 hover:text-red-600 flex items-center justify-center transition-colors cursor-pointer"
                          title="Delete promo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      {/* 5. INSPECT BRANDED QR CODE MODAL */}
      {inspectingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div
            onClick={() => setInspectingBooking(null)}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
            aria-hidden="true"
          />

          <div className="relative bg-white rounded-3xl p-5 sm:p-7 max-w-md w-full space-y-4 shadow-2xl z-10 max-h-[92dvh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200 my-auto">
            <button
              onClick={() => setInspectingBooking(null)}
              className="absolute top-4 right-4 w-9 h-9 min-w-[44px] min-h-[44px] rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close inspection dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center pt-1 space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] bg-[#0A192F] px-3 py-1 rounded-full inline-block">
                ★ FNJ Branded Pass QR ★
              </span>
              <h3 className="text-lg sm:text-xl font-black text-[#0A192F] pt-1">
                {inspectingBooking.guestName}
              </h3>
              <div className="flex items-center justify-center gap-2">
                <span className="font-mono text-xs font-bold text-stone-500">
                  {inspectingBooking.voucherCode}
                </span>
                <button
                  onClick={() => handleCopyVoucher(inspectingBooking.voucherCode)}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 hover:text-[#0A192F] font-bold cursor-pointer flex items-center gap-1"
                >
                  {isCopiedVoucher ? (
                    <span className="text-emerald-700">Copied!</span>
                  ) : (
                    <React.Fragment>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </React.Fragment>
                  )}
                </button>
              </div>
            </div>

            {/* Branded Pass Display */}
            <div className="w-56 sm:w-64 max-w-full aspect-[460/620] mx-auto bg-white p-1 rounded-2xl border-2 border-[#D4AF37] shadow-lg flex items-center justify-center overflow-hidden">
              {inspectingQrDataUrl ? (
                <img
                  src={inspectingQrDataUrl}
                  alt={`Branded QR Pass for ${inspectingBooking.voucherCode}`}
                  className="w-full h-full object-contain rounded-xl"
                />
              ) : (
                <div className="w-full h-full bg-stone-100 animate-pulse rounded-lg flex items-center justify-center text-xs text-stone-400">
                  Generating FNJ Pass...
                </div>
              )}
            </div>

            {/* Breakdown Details */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-stone-500 font-semibold">Scheduled Date:</span>
                <span className="font-bold text-[#0A192F] flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{inspectingBooking.arrivalDate}</span>
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500 font-semibold">Scheduled Time:</span>
                <span className="font-bold text-[#0A192F] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{inspectingBooking.arrivalTime} – {inspectingBooking.departureTime}</span>
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500 font-semibold">Workspace Plan:</span>
                <span className="font-bold text-[#0A192F] truncate max-w-[200px]">
                  {inspectingBooking.recommendedTitle}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500 font-semibold">Assigned Zone:</span>
                <span className="font-bold text-[#0A192F] truncate max-w-[200px]">
                  {inspectingBooking.environment}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-stone-200">
                <span className="text-stone-500 font-semibold">Mockup Fee:</span>
                <span className="font-black text-sm text-[#0A192F]">
                  {inspectingBooking.recommendedPrice}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 pt-1">
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
                onClick={handleDownloadInspectedQr}
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#0A192F] hover:bg-blue-900 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                title="Download pass badge with date, time & FNJ logo"
              >
                <Download className="w-4 h-4 text-[#D4AF37]" />
                <span>Download Pass</span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div
            onClick={() => setIsAddModalOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
            aria-hidden="true"
          />

          <div className="relative bg-white rounded-3xl p-5 sm:p-7 max-w-lg w-full space-y-4 shadow-2xl z-10 max-h-[92dvh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200 my-auto">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 min-w-[44px] min-h-[44px] rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-black uppercase text-[#D4AF37] bg-[#0A192F] px-3 py-1 rounded-full inline-block">
                Reception Fast-Track
              </span>
              <h3 className="text-lg sm:text-xl font-black text-[#0A192F] mt-2">
                Register Manual Walk-In Guest
              </h3>
              <p className="text-xs text-stone-500">
                Immediately issues pass voucher and seats guest in live schedule.
              </p>
            </div>

            <form onSubmit={handleCreateWalkin} className="space-y-3.5">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  type="submit"
                  className="flex-1 min-h-[44px] py-2.5 rounded-xl bg-[#0A192F] text-white font-black text-xs uppercase tracking-wider hover:bg-blue-900 transition-colors cursor-pointer shadow-xs"
                >
                  Confirm & Check-In Walk-In
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="min-h-[44px] px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. ADD / EDIT PROMO & ANNOUNCEMENT MODAL */}
      {isPromoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div
            onClick={() => setIsPromoModalOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
            aria-hidden="true"
          />

          <div className="relative bg-white rounded-3xl p-5 sm:p-7 max-w-lg w-full space-y-4 shadow-2xl z-10 max-h-[92dvh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200 my-auto">
            <button
              onClick={() => setIsPromoModalOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 min-w-[44px] min-h-[44px] rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-black uppercase text-[#0A192F] bg-[#D4AF37] px-3 py-1 rounded-full inline-block">
                {editingPromoId ? "Edit Announcement" : "Publish New Promo"}
              </span>
              <h3 className="text-lg sm:text-xl font-black text-[#0A192F] mt-2">
                {editingPromoId ? "Edit Promo Announcement" : "Create Promo Announcement"}
              </h3>
              <p className="text-xs text-stone-500">
                Immediately updates the live public website and top notice ticker with zero database.
              </p>
            </div>

            <form onSubmit={handleSavePromoForm} className="space-y-3.5">
              {/* Promo Title */}
              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-[#0A192F] block mb-1">
                  Announcement / Deal Title *
                </label>
                <input
                  type="text"
                  required
                  value={promoFormTitle}
                  onChange={(e) => setPromoFormTitle(e.target.value)}
                  placeholder="e.g. Albay Student Midterms: 20% Off 5-Hour Pass"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm bg-white text-[#0A192F] focus:outline-none focus:border-[#0A192F]"
                />
              </div>

              {/* Category / Badge */}
              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-[#0A192F] block mb-1">
                  Category Tag / Badge
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {[
                    "STUDENT PERK",
                    "WEEKEND COMBO",
                    "SPECIAL PROMO",
                    "ANNOUNCEMENT",
                    "FLASH SALE",
                    "COMMUNITY",
                  ].map((tag) => (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => setPromoFormBadge(tag)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer ${
                        promoFormBadge === tag
                          ? "bg-[#0A192F] text-white"
                          : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={promoFormBadge}
                  onChange={(e) => setPromoFormBadge(e.target.value.toUpperCase())}
                  placeholder="Or enter custom badge (e.g. MAYON VIEW)"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs bg-white text-[#0A192F] focus:outline-none focus:border-[#0A192F]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-[#0A192F] block mb-1">
                  Full Details / Terms *
                </label>
                <textarea
                  required
                  rows={3}
                  value={promoFormDesc}
                  onChange={(e) => setPromoFormDesc(e.target.value)}
                  placeholder="Describe the offer, eligibility (e.g. Present student ID at 2F desk), or facility update."
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs bg-white text-[#0A192F] focus:outline-none focus:border-[#0A192F] resize-none"
                />
              </div>

              {/* Discount Code & Validity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-black uppercase tracking-wider text-[#0A192F] block mb-1">
                    Promo Code (Optional)
                  </label>
                  <input
                    type="text"
                    value={promoFormDiscountCode}
                    onChange={(e) => setPromoFormDiscountCode(e.target.value.toUpperCase())}
                    placeholder="e.g. BU-MIDTERMS20"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-mono font-bold bg-white text-[#0A192F] focus:outline-none focus:border-[#0A192F]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-black uppercase tracking-wider text-[#0A192F] block mb-1">
                    Validity Duration
                  </label>
                  <input
                    type="text"
                    value={promoFormValidity}
                    onChange={(e) => setPromoFormValidity(e.target.value)}
                    placeholder="e.g. Valid until Nov 30, 2026"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs bg-white text-[#0A192F] focus:outline-none focus:border-[#0A192F]"
                  />
                </div>
              </div>

              {/* Button CTA text */}
              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-[#0A192F] block mb-1">
                  CTA Action Button Label
                </label>
                <input
                  type="text"
                  value={promoFormCtaText}
                  onChange={(e) => setPromoFormCtaText(e.target.value)}
                  placeholder="e.g. Claim Student Pass"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs bg-white text-[#0A192F] focus:outline-none focus:border-[#0A192F]"
                />
              </div>

              {/* Display Placement Selection */}
              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-[#0A192F] block mb-1">
                  Display Location on Public Site
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "both", label: "Banner & Section" },
                    { id: "banner", label: "Top Banner Only" },
                    { id: "section", label: "Section Only" },
                  ].map((loc) => (
                    <button
                      type="button"
                      key={loc.id}
                      onClick={() => setPromoFormLocation(loc.id as any)}
                      className={`p-2.5 rounded-xl text-center text-xs font-bold transition-all border cursor-pointer ${
                        promoFormLocation === loc.id
                          ? "bg-[#0A192F] text-white border-[#0A192F] shadow-xs"
                          : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                      }`}
                    >
                      {loc.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Switch */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="promoIsActiveCheck"
                  checked={promoFormIsActive}
                  onChange={(e) => setPromoFormIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0A192F] focus:ring-[#0A192F]"
                />
                <label htmlFor="promoIsActiveCheck" className="text-xs font-bold text-[#0A192F] cursor-pointer">
                  Make Live on Public Website Immediately
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  type="submit"
                  className="flex-1 min-h-[44px] py-2.5 rounded-xl bg-[#0A192F] text-white font-black text-xs uppercase tracking-wider hover:bg-blue-900 transition-colors cursor-pointer shadow-xs"
                >
                  {editingPromoId ? "Save Promo Changes" : "Publish Announcement"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsPromoModalOpen(false)}
                  className="min-h-[44px] px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors cursor-pointer"
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
