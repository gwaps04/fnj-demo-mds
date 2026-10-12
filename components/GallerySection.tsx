"use client";

import React, { useState } from "react";
import { Sparkles, Image as ImageIcon } from "lucide-react";

export function GallerySection() {
  // 6 Image Gallery Blocks annotated for local asset swaps
  const galleryItems = [
    {
      id: 1,
      targetFileName: "gallery-coworking-main.jpg",
      title: "Main Coworking Open Floor",
      category: "Workstations",
      caption: "Spacious individual desks with ergonomic chairs and natural light.",
      aspect: "col-span-1 md:col-span-2 row-span-1",
    },
    {
      id: 2,
      targetFileName: "gallery-conference-room.jpg",
      title: "10-Pax Executive Conference Suite",
      category: "Meetings",
      caption: "Acoustic-treated meeting room equipped with 55” 4K display.",
      aspect: "col-span-1 row-span-1",
    },
    {
      id: 3,
      targetFileName: "gallery-pickleball-court.jpg",
      title: "3rd Floor FNJ Pickleball Court",
      category: "Recreation",
      caption: "Full tournament-marked indoor court with night lighting.",
      aspect: "col-span-1 row-span-1",
    },
    {
      id: 4,
      targetFileName: "gallery-focus-pods.jpg",
      title: "Silent Focus Cubicles",
      category: "Quiet Zone",
      caption: "Partitioned spaces engineered for deep uninterrupted coding and study.",
      aspect: "col-span-1 row-span-1",
    },
    {
      id: 5,
      targetFileName: "gallery-coffee-pantry.jpg",
      title: "Artisan Coffee & Pantry Bar",
      category: "Refreshments",
      caption: "Unlimited brewed coffee beans, hot tea, and chilled filtered water.",
      aspect: "col-span-1 md:col-span-2 row-span-1",
    },
    {
      id: 6,
      targetFileName: "gallery-lounge-area.jpg",
      title: "Breakout & Reading Lounge",
      category: "Community",
      caption: "Comfortable sofas for casual reading, team chat, or midday unwinding.",
      aspect: "col-span-1 row-span-1",
    },
  ];

  const [activeFilter, setActiveFilter] = useState("all");

  const filteredItems =
    activeFilter === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.category.toLowerCase() === activeFilter);

  return (
    <section id="gallery" className="py-24 sm:py-28 bg-[#F5F5DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0A192F] text-[#D4AF37] text-xs font-bold uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Facility Tour
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0A192F] tracking-tight uppercase">
            Spaces & Atmosphere Gallery
          </h2>
          <div className="w-20 h-1 bg-[#D4AF37] mx-auto rounded-full" />
          <p className="text-sm sm:text-base text-[#0A192F]/80 leading-relaxed font-medium pt-2">
            Take a visual tour inside FNJ Coworking Space and Pickleball Club in Tagas, Daraga.
            Notice where you can easily swap your actual photographs below.
          </p>
        </div>

        {/* Refined Borderless Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
          {[
            { id: "all", label: "All Spaces" },
            { id: "workstations", label: "Workstations" },
            { id: "meetings", label: "Meeting Rooms" },
            { id: "recreation", label: "Pickleball 3F" },
            { id: "refreshments", label: "Coffee Pantry" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeFilter === tab.id
                  ? "bg-[#0A192F] text-[#D4AF37] shadow-sm"
                  : "bg-white text-[#0A192F]/70 hover:text-[#0A192F] shadow-sm"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 6 Responsive Image Blocks Grid: Pure White Background, Soft Shadows, Zero Harsh Borders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`group relative rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] bg-white transition-all duration-300 ${item.aspect}`}
            >
              {/* 
                ========================================================================
                [IMAGE PLACEHOLDER: GALLERY BLOCK #{item.id}]
                Target Asset File: /public/{item.targetFileName}
                ========================================================================
              */}
              <div className="relative w-full min-h-[280px] sm:min-h-[320px] h-full flex flex-col items-center justify-center p-8 text-center bg-stone-100/70 group-hover:bg-stone-100 transition-colors">
                {/* Borderless Icon Container */}
                <div className="w-16 h-16 rounded-2xl bg-[#0A192F] flex items-center justify-center text-[#D4AF37] shadow-sm group-hover:scale-105 transition-transform mb-4">
                  <ImageIcon className="w-8 h-8" />
                </div>

                <div className="max-w-xs space-y-2 p-4 rounded-2xl bg-white shadow-sm">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] bg-[#0A192F] px-2.5 py-1 rounded-full inline-block">
                    {item.category}
                  </span>
                  <div className="font-black text-xs text-[#0A192F]">
                    /{item.targetFileName}
                  </div>
                  <p className="text-[11px] text-[#0A192F]/70 leading-snug font-normal">
                    {item.title}
                  </p>
                </div>
              </div>

              {/* Hover Overlay Caption with Solid Navy Blue background */}
              <div className="absolute inset-0 bg-[#0A192F]/92 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-8 flex flex-col justify-end text-white">
                <div className="space-y-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37]">
                    {item.category}
                  </span>
                  <h4 className="text-base sm:text-lg font-black text-white">{item.title}</h4>
                  <p className="text-xs text-stone-300 leading-relaxed font-normal">{item.caption}</p>
                  <div className="pt-2 text-[10px] text-[#D4AF37] font-mono">
                    Local path: /public/{item.targetFileName}
                  </div>
                </div>
              </div>

              {/* Borderless Corner Badge */}
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#0A192F] text-[10px] font-black text-[#D4AF37] shadow-sm">
                Photo #{item.id}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
