// FILE: lib/promos.ts

export interface PromoAnnouncement {
  id: string;
  title: string;
  badge: string; // e.g. "SPECIAL PROMO", "ANNOUNCEMENT", "FLASH SALE", "STUDENT PERK", "WEEKEND COMBO"
  description: string;
  discountCode?: string; // e.g. "STUDENT-FOCUS20"
  validityText: string; // e.g. "Valid until Oct 31, 2026"
  ctaText?: string; // e.g. "Claim Promo Pass"
  displayLocation: "both" | "banner" | "section";
  isActive: boolean;
  createdAt: string;
}

const PROMOS_STORAGE_KEY = "fnj_coworking_promos_v1";

export const SEED_PROMOS: PromoAnnouncement[] = [
  {
    id: "promo-seed-1",
    title: "Albay Student Midterms Sprint: 20% Off 5-Hour Pass",
    badge: "STUDENT PERK",
    description:
      "Show your valid Bicol University, UST-Legazpi, or Aquinas student ID at the 2nd Floor Biak Realty reception desk to unlock 20% off plus a complimentary brewed coffee upgrade.",
    discountCode: "BU-MIDTERMS20",
    validityText: "Valid until Nov 15, 2026",
    ctaText: "Claim Student Pass",
    displayLocation: "both",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "promo-seed-2",
    title: "Weekend Smash & Study: Free 1-Hour Pickleball Court",
    badge: "WEEKEND COMBO",
    description:
      "Book an 8-Hour Workday pass on Saturday or Sunday and get 1-hour complimentary court time on the 3rd floor FNJ Pickleball Club with free paddle rentals.",
    discountCode: "SMASH-STUDY",
    validityText: "Every Saturday & Sunday",
    ctaText: "Book Weekend Combo",
    displayLocation: "section",
    isActive: true,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "promo-seed-3",
    title: "24/7 Heavy-Duty Generator Active: Zero Brownout Guarantee",
    badge: "ANNOUNCEMENT",
    description:
      "Uninterrupted high-speed dual fiber internet and climate control during all Albay power grid scheduled maintenance. Walk-ins warmly welcomed.",
    validityText: "Always Active",
    ctaText: "Check Facility Specs",
    displayLocation: "banner",
    isActive: true,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
];

/**
 * Retrieves all stored promos or initializes with default seed data
 */
export function getPromos(): PromoAnnouncement[] {
  if (typeof window === "undefined") {
    return SEED_PROMOS;
  }

  try {
    const raw = localStorage.getItem(PROMOS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PROMOS_STORAGE_KEY, JSON.stringify(SEED_PROMOS));
      return SEED_PROMOS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(PROMOS_STORAGE_KEY, JSON.stringify(SEED_PROMOS));
      return SEED_PROMOS;
    }
    return parsed;
  } catch (err) {
    console.error("Failed to read promos from localStorage:", err);
    return SEED_PROMOS;
  }
}

/**
 * Retrieves only active promos for public display
 */
export function getActivePromos(): PromoAnnouncement[] {
  return getPromos().filter((p) => p.isActive);
}

/**
 * Saves a new promo or announcement
 */
export function savePromo(promo: PromoAnnouncement): void {
  if (typeof window === "undefined") return;

  try {
    const current = getPromos();
    const updated = [promo, ...current.filter((p) => p.id !== promo.id)];
    localStorage.setItem(PROMOS_STORAGE_KEY, JSON.stringify(updated));
    dispatchPromosChanged();
  } catch (err) {
    console.error("Failed to save promo:", err);
  }
}

/**
 * Updates an existing promo
 */
export function updatePromo(
  id: string,
  updates: Partial<Omit<PromoAnnouncement, "id">>
): void {
  if (typeof window === "undefined") return;

  try {
    const current = getPromos();
    const updated = current.map((p) => (p.id === id ? { ...p, ...updates } : p));
    localStorage.setItem(PROMOS_STORAGE_KEY, JSON.stringify(updated));
    dispatchPromosChanged();
  } catch (err) {
    console.error("Failed to update promo:", err);
  }
}

/**
 * Toggles a promo's active state
 */
export function togglePromoStatus(id: string): void {
  if (typeof window === "undefined") return;

  try {
    const current = getPromos();
    const updated = current.map((p) =>
      p.id === id ? { ...p, isActive: !p.isActive } : p
    );
    localStorage.setItem(PROMOS_STORAGE_KEY, JSON.stringify(updated));
    dispatchPromosChanged();
  } catch (err) {
    console.error("Failed to toggle promo status:", err);
  }
}

/**
 * Deletes a promo by id
 */
export function deletePromo(id: string): void {
  if (typeof window === "undefined") return;

  try {
    const current = getPromos();
    const updated = current.filter((p) => p.id !== id);
    localStorage.setItem(PROMOS_STORAGE_KEY, JSON.stringify(updated));
    dispatchPromosChanged();
  } catch (err) {
    console.error("Failed to delete promo:", err);
  }
}

/**
 * Resets storage back to default seed promos
 */
export function resetToSeedPromos(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(PROMOS_STORAGE_KEY, JSON.stringify(SEED_PROMOS));
    dispatchPromosChanged();
  } catch (err) {
    console.error("Failed to reset promos:", err);
  }
}

/**
 * Dispatches cross-tab and in-tab custom events
 */
function dispatchPromosChanged(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("fnj-promos-changed"));
}
