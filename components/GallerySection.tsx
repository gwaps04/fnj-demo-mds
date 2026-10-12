"use client";

import React, { useState } from "react";
import { Sparkles, Image as ImageIcon, ZoomIn, Eye } from "lucide-react";

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
    <section id="gallery" className="py-20 bg-[#F5F5DC] border-b-2 border-[#0A192F]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0A192F] text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Facility Tour
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0A192F] tracking-tight uppercase">
            Spaces & Atmosphere Gallery
          </h2>
          <div className="w-24 h-1.5 bg-[#D4AF37] mx-auto rounded-full" />
          <p className="text-sm sm:text-base text-[#0A192F]/80 leading-relaxed font-medium">
            Take a visual tour inside FNJ Coworking Space and Pickleball Club in Tagas, Daraga.
            Notice where you can easily swap your actual photographs below.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
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
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeFilter === tab.id
                  ? "bg-[#0A192F] text-[#D4AF37] border-2 border-[#D4AF37] shadow-md"
                  : "bg-white text-[#0A192F] border border-[#0A192F]/20 hover:border-[#0A192F]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 6 Responsive Image Blocks Grid with Explicit Image Placeholders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`group relative rounded-2xl overflow-hidden border-2 border-[#0A192F] shadow-lg bg-stone-200 transition-all hover:shadow-2xl hover:border-[#D4AF37] ${item.aspect}`}
            >
              {/* 
                ========================================================================
                [IMAGE PLACEHOLDER: GALLERY BLOCK #{item.id}]
                Target Asset File: /public/{item.targetFileName}
                TO SWAP WITH REAL IMAGE:
                Replace the gray placeholder block below with:
                <img
                  src={`/${item.targetFileName}`}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                ========================================================================
              */}
              <div className="relative w-full min-h-[260px] sm:min-h-[290px] h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-stone-200 via-stone-300 to-stone-400 group-hover:from-stone-300 group-hover:to-stone-400 transition-colors">
                {/* Semantic Gray Animated Skeleton Elements */}
                <div className="w-16 h-16 rounded-2xl bg-[#0A192F] border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shadow-lg group-hover:scale-110 transition-transform mb-3">
                  <ImageIcon className="w-8 h-8" />
                </div>

                <div className="max-w-xs space-y-1.5 p-3 rounded-xl bg-white/70 backdrop-blur-sm border border-[#0A192F]/20">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] bg-[#0A192F] px-2 py-0.5 rounded inline-block">
                    {item.category}
                  </span>
                  <div className="font-extrabold text-xs text-[#0A192F]">
                    /{item.targetFileName}
                  </div>
                  <p className="text-[11px] text-[#0A192F]/70 leading-snug">
                    {item.title}
                  </p>
                </div>
              </div>

              {/* Hover Overlay Caption with Navy Blue background and Gold trim */}
              <div className="absolute inset-0 bg-[#0A192F]/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col justify-end text-white border-t-2 border-[#D4AF37]">
                <div className="space-y-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37]">
                    {item.category}
                  </span>
                  <h4 className="text-base font-bold text-white">{item.title}</h4>
                  <p className="text-xs text-stone-300 leading-relaxed">{item.caption}</p>
                  <div className="pt-2 text-[10px] text-[#D4AF37] font-mono">
                    Local path: /public/{item.targetFileName}
                  </div>
                </div>
              </div>

              {/* Corner Badge */}
              <div className="absolute top-3 right-3 px-2 py-1 rounded bg-[#0A192F] border border-[#D4AF37] text-[10px] font-bold text-[#D4AF37] shadow-sm">
                Photo #{item.id}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
