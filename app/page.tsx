"use client";

// FILE: app/page.tsx
import React, { useState } from "react";
import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { HeaderNavigation } from "@/components/HeaderNavigation";
import { HeroCarousel } from "@/components/HeroCarousel";
import { PromosSection } from "@/components/PromosSection";
import { TheSpaceAmenities } from "@/components/TheSpaceAmenities";
import { SpecialAttractionPickleball } from "@/components/SpecialAttractionPickleball";
import { RatesSection } from "@/components/RatesSection";
import { GallerySection } from "@/components/GallerySection";
import { FooterLocation } from "@/components/FooterLocation";
import { BookingModal } from "@/components/BookingModal";

export default function FnjCoworkingHomePage() {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  const handleOpenBooking = () => {
    setBookingModalOpen(true);
  };

  const handleCloseBooking = () => {
    setBookingModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F5F5DC] text-[#0A192F] flex flex-col font-sans selection:bg-[#D4AF37] selection:text-[#0A192F]">
      {/* 0. DYNAMIC LIVE ANNOUNCEMENT TICKER (Admin CRM Controlled) */}
      <AnnouncementBanner onOpenBooking={handleOpenBooking} />

      {/* 1. HEADER / NAVIGATION (Amenities, Pricing, Gallery, Location, Book Now, Admin CRM) */}
      <HeaderNavigation onOpenBooking={handleOpenBooking} />

      <main className="flex-1">
        {/* 2. HERO SECTION CAROUSEL (WORK. FOCUS. ACHIEVE. + Carousel Controls) */}
        <HeroCarousel onOpenBooking={handleOpenBooking} />

        {/* 3. LIVE PROMOS & ANNOUNCEMENTS SECTION (Admin CRM Controlled) */}
        <PromosSection onOpenBooking={handleOpenBooking} />

        {/* 4. THE SPACE (AMENITIES): Internet, Power Outlets, Airconditioned Space, Comfortable Environment */}
        <TheSpaceAmenities />

        {/* 5. SPECIAL ATTRACTION: FNJ Pickleball at the 3rd Floor */}
        <SpecialAttractionPickleball onOpenBooking={handleOpenBooking} />

        {/* 6. RATES (GRID/CARDS): Student vs Regular, Conference Room ₱700/hr, 1 Month ₱9,000.00 */}
        <RatesSection onOpenBooking={handleOpenBooking} />

        {/* 7. GALLERY: Responsive 6-block Image Grid */}
        <GallerySection />

        {/* 8. FOOTER / LOCATION: 2nd Floor Biak Realty Corp., Lakandula Drive, Tagas, Daraga, Albay */}
        <FooterLocation onOpenBooking={handleOpenBooking} />
      </main>

      {/* Interactive Reservation Modal Engine */}
      <BookingModal isOpen={bookingModalOpen} onClose={handleCloseBooking} />
    </div>
  );
}
