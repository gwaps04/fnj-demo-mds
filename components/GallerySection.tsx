"use client";

// FILE: components/GallerySection.tsx
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Sparkles,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  X,
  Layers,
  Tag,
  Clock,
  Camera,
} from "lucide-react";

interface GalleryItem {
  id: number;
  fileName: string;
  src: string;
  title: string;
  category: "workstations" | "meetings" | "pickleball" | "refreshments";
  categoryLabel: string;
  caption: string;
  floor: string;
}

export function GallerySection() {
  // Using actual photos hero1.jpg through hero7.jpg from FNJ Coworking
  const galleryItems: GalleryItem[] = [
    {
      id: 1,
      fileName: "hero1.jpg",
      src: "/hero1.jpg",
      title: "Main Coworking Open Floor",
      category: "workstations",
      categoryLabel: "Workstations",
      caption:
        "Spacious workstations featuring ergonomic seating, natural ambient lighting, and dedicated power outlets at every desk.",
      floor: "2nd Floor Main Hall",
    },
    {
      id: 2,
      fileName: "hero2.jpg",
      src: "/hero2.jpg",
      title: "Dedicated Focus Cubicles",
      category: "workstations",
      categoryLabel: "Workstations",
      caption:
        "Partitioned focus desks tailored for deep sprints, programming, thesis writing, and zero-distraction productivity.",
      floor: "2nd Floor Quiet Zone",
    },
    {
      id: 3,
      fileName: "hero3.jpg",
      src: "/hero3.jpg",
      title: "Executive Conference Boardroom",
      category: "meetings",
      categoryLabel: "Meeting Room",
      caption:
        "10-pax private executive suite equipped with 55” 4K presentation display, glass whiteboard, and acoustic insulation.",
      floor: "2nd Floor Suite",
    },
    {
      id: 4,
      fileName: "hero4.jpg",
      src: "/hero4.jpg",
      title: "Hot Desk Flex Lounge",
      category: "workstations",
      categoryLabel: "Workstations",
      caption:
        "Ergonomic flex seats with quick plug-in charging strips and high-speed fiber Wi-Fi for dynamic working days.",
      floor: "2nd Floor Flex Area",
    },
    {
      id: 5,
      fileName: "hero5.jpg",
      src: "/hero5.jpg",
      title: "Artisan Coffee Bar & Pantry",
      category: "refreshments",
      categoryLabel: "Coffee & Pantry",
      caption:
        "Complimentary bottomless fresh brewed coffee, pure filtered water, and beverage counter for all pass holders.",
      floor: "2nd Floor Refreshment Bar",
    },
    {
      id: 6,
      fileName: "hero6.jpg",
      src: "/hero6.jpg",
      title: "Private Acoustic Call Booth",
      category: "meetings",
      categoryLabel: "Call Booth",
      caption:
        "Sound-isolated corner booth for confidential client Zoom calls, interviews, podcasts, and video presentations.",
      floor: "2nd Floor Acoustic Pod",
    },
    {
      id: 7,
      fileName: "hero7.jpg",
      src: "/hero7.jpg",
      title: "3rd Floor Indoor Pickleball Court",
      category: "pickleball",
      categoryLabel: "Pickleball 3F",
      caption:
        "Albay’s premier indoor pickleball facility with cushioned tournament lines, night LED lighting, and paddle rentals.",
      floor: "3rd Floor Sports Hub",
    },
  ];

  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const filteredItems =
    activeFilter === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeFilter);

  // Lightbox keyboard controls
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (selectedPhotoIndex === null) return;
      if (e.key === "Escape") {
        setSelectedPhotoIndex(null);
      } else if (e.key === "ArrowLeft") {
        setSelectedPhotoIndex((prev) =>
          prev !== null ? (prev - 1 + galleryItems.length) % galleryItems.length : null
        );
      } else if (e.key === "ArrowRight") {
        setSelectedPhotoIndex((prev) =>
          prev !== null ? (prev + 1) % galleryItems.length : null
        );
      }
    },
    [selectedPhotoIndex, galleryItems.length]
  );

  useEffect(() => {
    if (selectedPhotoIndex !== null) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedPhotoIndex, handleKeyDown]);

  const activePhoto = selectedPhotoIndex !== null ? galleryItems[selectedPhotoIndex] : null;

  return (
    <section id="gallery" className="py-24 sm:py-28 bg-[#F5F5DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0A192F] text-[#D4AF37] text-xs font-bold uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Actual Facility Photos
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0A192F] tracking-tight uppercase">
            Spaces & Atmosphere Gallery
          </h2>
          <div className="w-20 h-1 bg-[#D4AF37] mx-auto rounded-full" />
          <p className="text-sm sm:text-base text-[#0A192F]/80 leading-relaxed font-medium pt-2">
            Explore FNJ Coworking Space and 3rd Floor Pickleball Club in Tagas, Daraga.
            Tap any photograph for high-resolution inspection.
          </p>
        </div>

        {/* Refined Borderless Filter Pills with Smooth Tactile Hover */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-12 sm:mb-14">
          {[
            { id: "all", label: "All Spaces (7)" },
            { id: "workstations", label: "Workstations" },
            { id: "meetings", label: "Meeting & Calls" },
            { id: "pickleball", label: "Pickleball 3F" },
            { id: "refreshments", label: "Coffee Pantry" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeFilter === tab.id
                  ? "bg-[#0A192F] text-[#D4AF37] shadow-sm scale-102"
                  : "bg-white text-[#0A192F]/70 hover:text-[#0A192F] hover:bg-stone-50 shadow-sm"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 
          ========================================================================
          RESPONSIVE GALLERY GRID (5-TIER RESPONSIVE)
          - XS Mobile (< 640px): 1 Column
          - Tablet (640px - 1023px): 2 Columns
          - Desktop (1024px+): 3 Columns (with featured bento aspect)
          ========================================================================
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((item) => {
            const globalIndex = galleryItems.findIndex((g) => g.id === item.id);
            return (
              <div
                key={item.id}
                onClick={() => setSelectedPhotoIndex(globalIndex)}
                className="group relative rounded-3xl overflow-hidden shadow-sm bg-white transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl cursor-pointer flex flex-col"
              >
                {/* Image Container with Consistent Aspect Ratio (4:3) and Next.js Image Optimization */}
                <div className="relative w-full aspect-[4/3] bg-stone-900 overflow-hidden">
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                    referrerPolicy="no-referrer"
                    priority={item.id <= 2}
                  />

                  {/* Gradient Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/90 via-[#0A192F]/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300 pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
                    <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#0A192F]/90 backdrop-blur-md text-[#D4AF37] shadow-sm">
                      {item.categoryLabel}
                    </span>

                    <span className="text-[10px] font-semibold text-white/90 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full">
                      {item.floor}
                    </span>
                  </div>

                  {/* Center Zoom Icon on Hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <div className="w-12 h-12 rounded-2xl bg-[#D4AF37] text-[#0A192F] flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
                      <Maximize2 className="w-5 h-5 stroke-[2.5]" />
                    </div>
                  </div>
                </div>

                {/* Card Content Footer */}
                <div className="p-6 bg-white flex flex-col justify-between flex-1">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-black text-base text-[#0A192F] tracking-tight group-hover:text-[#0A192F] transition-colors leading-snug">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-xs text-[#0A192F]/70 leading-relaxed font-normal">
                      {item.caption}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] font-semibold text-[#0A192F]/60">
                    <span className="text-[#D4AF37] font-black uppercase">
                      Photo #{item.id} of 7
                    </span>
                    <span className="group-hover:translate-x-1 group-hover:text-[#0A192F] transition-all flex items-center gap-1 font-bold">
                      Tap to enlarge &rarr;
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Albay Local Photographer & Assets Note */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-white shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#0A192F]/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0A192F] text-[#D4AF37] flex items-center justify-center shrink-0">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <p className="font-black text-sm text-[#0A192F]">
                Authentic Photography from FNJ Coworking & Pickleball
              </p>
              <p className="text-[11px] text-[#0A192F]/60">
                All photos are authentic assets from the Tagas, Daraga, Albay location.
              </p>
            </div>
          </div>

          <div className="text-[11px] font-bold text-[#D4AF37] bg-[#0A192F] px-4 py-2 rounded-full whitespace-nowrap">
            2nd & 3rd Floors Biak Realty Corp.
          </div>
        </div>
      </div>

      {/* 
        ========================================================================
        INTERACTIVE FULLSCREEN LIGHTBOX MODAL
        - Touch-friendly & responsive across mobile portrait, landscape, & tablets
        - Keyboard navigation (Left, Right, Escape)
        - Dynamic image scaling
        ========================================================================
      */}
      {activePhoto && selectedPhotoIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activePhoto.title}
          className="fixed inset-0 z-[100] bg-black/92 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200"
        >
          {/* Top Bar with Title, Counter, and Close Button */}
          <div className="flex items-center justify-between text-white pb-3 shrink-0">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-[#D4AF37] text-[#0A192F] font-black text-xs uppercase tracking-wider">
                {activePhoto.categoryLabel}
              </span>
              <span className="text-xs text-stone-300 font-medium hidden sm:inline">
                {activePhoto.floor}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-[#D4AF37]">
                {selectedPhotoIndex + 1} / {galleryItems.length}
              </span>

              <button
                onClick={() => setSelectedPhotoIndex(null)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 active:bg-white/40 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close photo preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Photo Viewing Area */}
          <div className="relative flex-1 w-full max-w-5xl mx-auto flex items-center justify-center my-auto min-h-0">
            {/* Previous Photo Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPhotoIndex(
                  (prev) => (prev! - 1 + galleryItems.length) % galleryItems.length
                );
              }}
              className="absolute left-2 sm:left-4 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-[#D4AF37] text-white hover:text-[#0A192F] backdrop-blur-md flex items-center justify-center transition-colors cursor-pointer shadow-lg"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Photo Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPhotoIndex((prev) => (prev! + 1) % galleryItems.length);
              }}
              className="absolute right-2 sm:right-4 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-[#D4AF37] text-white hover:text-[#0A192F] backdrop-blur-md flex items-center justify-center transition-colors cursor-pointer shadow-lg"
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Optimized High-Res Responsive Image Display */}
            <div className="relative w-full h-full max-h-[72vh] flex items-center justify-center">
              <Image
                src={activePhoto.src}
                alt={activePhoto.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 1200px"
                className="object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Bottom Caption Bar */}
          <div className="max-w-3xl mx-auto w-full text-center text-white pt-3 shrink-0">
            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
              {activePhoto.title}
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl mx-auto leading-relaxed">
              {activePhoto.caption}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
