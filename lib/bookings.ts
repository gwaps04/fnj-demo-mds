// FILE: lib/bookings.ts

export interface BookingRecord {
  id: string;
  voucherCode: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  goals: string[];
  environment: string;
  duration: string;
  arrivalDate: string;
  arrivalTime: string;
  departureTime: string;
  isStudent: boolean;
  addons: string;
  recommendedTitle: string;
  recommendedPrice: string;
  totalPriceAmount: number;
  status: "Confirmed" | "Checked In" | "Completed" | "Cancelled";
  createdAt: string;
}

const STORAGE_KEY = "fnj_crm_bookings_v2";

// Calculate departure time based on arrival time string (e.g. "09:00 AM") and duration
export function calculateDepartureTime(
  arrivalTime: string,
  durationOption: string
): string {
  if (durationOption.includes("Monthly Subscription")) {
    return "All-Day Access (Unlimited 24/7)";
  }

  let durationHours = 8;
  if (durationOption.includes("1-hour")) {
    durationHours = 1;
  } else if (durationOption.includes("3-to-5 hour")) {
    durationHours = 4;
  } else if (durationOption.includes("8-hour")) {
    durationHours = 8;
  }

  // Parse time (e.g. "09:30 AM")
  const match = arrivalTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return "Flexible Check-out";

  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const ampm = match[3].toUpperCase();

  if (ampm === "PM" && hours !== 12) {
    hours += 12;
  } else if (ampm === "AM" && hours === 12) {
    hours = 0;
  }

  const departureDate = new Date();
  departureDate.setHours(hours + durationHours, parseInt(minutes, 10), 0, 0);

  let depHours = departureDate.getHours();
  const depMinutes = departureDate.getMinutes().toString().padStart(2, "0");
  const depAmPm = depHours >= 12 ? "PM" : "AM";

  depHours = depHours % 12;
  if (depHours === 0) depHours = 12;

  return `${depHours.toString().padStart(2, "0")}:${depMinutes} ${depAmPm}`;
}

// Initial realistic Albay seeds
export const SEED_BOOKINGS: BookingRecord[] = [
  {
    id: "fnj-seed-1",
    voucherCode: "FNJ-PASS-8192",
    guestName: "Samantha Mae Perez",
    guestEmail: "samantha.perez@bicol-u.edu.ph",
    guestPhone: "0917-832-1920",
    goals: ["Laser-focused solo study"],
    environment: "The silent study zone",
    duration: "The full 8-hour workday",
    arrivalDate: new Date().toISOString().split("T")[0],
    arrivalTime: "08:30 AM",
    departureTime: "04:30 PM",
    isStudent: true,
    addons: "Nope, just standard ergonomic seating",
    recommendedTitle: "8-Hour Coworking Day Pass",
    recommendedPrice: "₱550.00",
    totalPriceAmount: 550,
    status: "Checked In",
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
  },
  {
    id: "fnj-seed-2",
    voucherCode: "FNJ-PASS-5402",
    guestName: "Arnel Joshua Diaz",
    guestEmail: "arnel.diaz@freelancealbayan.dev",
    guestPhone: "0928-441-9923",
    goals: ["Remote work & Zoom calls"],
    environment: "The open hot desk / café vibe",
    duration: "A 3-to-5 hour deep dive",
    arrivalDate: new Date().toISOString().split("T")[0],
    arrivalTime: "10:00 AM",
    departureTime: "02:00 PM",
    isStudent: false,
    addons: "Nope, just standard ergonomic seating",
    recommendedTitle: "5-Hour Extended Focus Pass",
    recommendedPrice: "₱480.00",
    totalPriceAmount: 480,
    status: "Confirmed",
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: "fnj-seed-3",
    voucherCode: "FNJ-PASS-3310",
    guestName: "Atty. Rafael Imperial",
    guestEmail: "rafael.imperial@legazpilaw.ph",
    guestPhone: "0919-555-8812",
    goals: ["Team brainstorming & meetings"],
    environment: "A private enclosed meeting room",
    duration: "A 3-to-5 hour deep dive",
    arrivalDate: new Date().toISOString().split("T")[0],
    arrivalTime: "01:30 PM",
    departureTime: "05:30 PM",
    isStudent: false,
    addons: "The 10-Pax Executive Conference Room",
    recommendedTitle: "Executive Conference Room (1-10 Pax)",
    recommendedPrice: "₱700.00 / Hour",
    totalPriceAmount: 2800,
    status: "Confirmed",
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
  },
  {
    id: "fnj-seed-4",
    voucherCode: "FNJ-PB-9021",
    guestName: "Coach Marcus Alcantara",
    guestEmail: "marcus.pickleball@daragaclub.com",
    guestPhone: "0995-123-9081",
    goals: ["A mix of work and Pickleball!"],
    environment: "The open hot desk / café vibe",
    duration: "The full 8-hour workday",
    arrivalDate: new Date().toISOString().split("T")[0],
    arrivalTime: "04:00 PM",
    departureTime: "08:00 PM",
    isStudent: false,
    addons: "3rd Floor Pickleball Court access",
    recommendedTitle: "8-Hour Coworking Day Pass",
    recommendedPrice: "₱650.00",
    totalPriceAmount: 650,
    status: "Confirmed",
    createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
  },
  {
    id: "fnj-seed-5",
    voucherCode: "FNJ-PASS-1092",
    guestName: "Clarisse Anne Villar",
    guestEmail: "clarisse.villar@ustalbay.edu.ph",
    guestPhone: "0908-771-3329",
    goals: ["Laser-focused solo study"],
    environment: "The silent study zone",
    duration: "A quick 1-hour sprint",
    arrivalDate: new Date().toISOString().split("T")[0],
    arrivalTime: "09:00 AM",
    departureTime: "10:00 AM",
    isStudent: true,
    addons: "Nope, just standard ergonomic seating",
    recommendedTitle: "1-Hour Quick Sprint Pass",
    recommendedPrice: "₱80.00",
    totalPriceAmount: 80,
    status: "Completed",
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
];

export function getBookings(): BookingRecord[] {
  if (typeof window === "undefined") {
    return SEED_BOOKINGS;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_BOOKINGS));
      return SEED_BOOKINGS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_BOOKINGS));
      return SEED_BOOKINGS;
    }
    return parsed;
  } catch (err) {
    console.error("Failed to load bookings from localStorage", err);
    return SEED_BOOKINGS;
  }
}

export function saveBooking(booking: BookingRecord): void {
  if (typeof window === "undefined") return;
  try {
    const current = getBookings();
    // Add new booking to the beginning
    const updated = [booking, ...current.filter((b) => b.id !== booking.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("fnj-bookings-changed", { detail: updated }));
  } catch (err) {
    console.error("Failed to save booking to localStorage", err);
  }
}

export function updateBookingStatus(
  id: string,
  newStatus: BookingRecord["status"]
): void {
  if (typeof window === "undefined") return;
  try {
    const current = getBookings();
    const updated = current.map((b) =>
      b.id === id ? { ...b, status: newStatus } : b
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("fnj-bookings-changed", { detail: updated }));
  } catch (err) {
    console.error("Failed to update booking status", err);
  }
}

export function deleteBooking(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const current = getBookings();
    const updated = current.filter((b) => b.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("fnj-bookings-changed", { detail: updated }));
  } catch (err) {
    console.error("Failed to delete booking", err);
  }
}

export function resetToSeedBookings(): BookingRecord[] {
  if (typeof window === "undefined") return SEED_BOOKINGS;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_BOOKINGS));
    window.dispatchEvent(new CustomEvent("fnj-bookings-changed", { detail: SEED_BOOKINGS }));
    return SEED_BOOKINGS;
  } catch (err) {
    console.error("Failed to reset bookings", err);
    return SEED_BOOKINGS;
  }
}
