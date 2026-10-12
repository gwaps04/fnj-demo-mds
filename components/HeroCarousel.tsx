"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, Pause, Play, CheckCircle2 } from "lucide-react";

interface HeroCarouselProps {
  onOpenBooking: () => void;
}

export function HeroCarousel({ onOpenBooking }: HeroCarouselProps) {
  // 7 slides corresponding to hero1.jpg through hero7.jpg
  const slides = [
    {
      id: 1,
      fileName: "hero1.jpg",
      title: "Main Coworking Hall",
      tagline: "Spacious ergonomic workstations bathed in gentle natural lighting.",
      badge: "High Productivity",
    },
    {
      id: 2,
      fileName: "hero2.jpg",
      title: "Dedicated Focus Desks",
      tagline: "Individual partitioned cubicles engineered for uninterrupted sprint sessions.",
      badge: "Quiet Zone",
    },
    {
      id: 3,
      fileName: "hero3.jpg",
      title: "Executive Conference Suite",
      tagline: "10-seater boardroom with 4K presentation display for client pitches.",
      badge: "Meeting Room",
    },
    {
      id: 4,
      fileName: "hero4.jpg",
      title: "Hot Desk Flex Lounge",
      tagline: "Comfortable seating with power strips at every seat and high-speed Wi-Fi.",
      badge: "Flex Pass",
    },
    {
      id: 5,
      fileName: "hero5.jpg",
      title: "Coffee Bar & Pantry Corner",
      tagline: "Unlimited fresh brewed coffee and refreshments to power your day.",
      badge: "Bottomless Brew",
    },
    {
      id: 6,
      fileName: "hero6.jpg",
      title: "Private Acoustic Call Booth",
      tagline: "Sound-isolated corner for client Zoom meetings and private interviews.",
      badge: "Crystal Audio",
    },
    {
      id: 7,
      fileName: "hero7.jpg",
      title: "3rd Floor Indoor Pickleball",
      tagline: "Take an active midday break with Albay's premier indoor pickleball court.",
      badge: "Work & Play",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5500);
    return () => clearInterval(timer);
  }, [isPlaying, nextSlide]);

  return (
    <section className="relative w-full overflow-hidden bg-[#F5F5DC] border-b-4 border-[#0A192F]">
      {/* Full-width Carousel Frame */}
      <div className="relative w-full min-h-[560px] sm:min-h-[640px] lg:min-h-[700px] flex items-center justify-center">
        {/* Animated Slide Background */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            {/* 
              ========================================================================
              [IMAGE PLACEHOLDER: CAROUSEL SLIDE]
              Currently configured for slide index: {currentIndex + 1} of 7.
              TO REPLACE:
              Put your images into /public/{slides[currentIndex].fileName}
              e.g. hero1.jpg, hero2.jpg, hero3.jpg, hero4.jpg, hero5.jpg, hero6.jpg, hero7.jpg
              Then change the placeholder below to:
              <img
                src={`/${slides[currentIndex].fileName}`}
                alt={slides[currentIndex].title}
                className="w-full h-full object-cover"
              />
              ========================================================================
            */}
            <div className="relative w-full h-full bg-[#0A192F] overflow-hidden">
              {/* Actual Hero Image loaded from /public/hero1.jpg to /public/hero7.jpg */}
              <img
                src={`/${slides[currentIndex].fileName}`}
                alt={slides[currentIndex].title}
                className="w-full h-full object-cover object-center transition-transform duration-1000 scale-100"
                loading={currentIndex === 0 ? "eager" : "lazy"}
              />

              {/* Contrast Overlays for Text Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/90 via-[#0A192F]/55 to-[#0A192F]/35 pointer-events-none" />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Content Overlay (Z-Pattern Flow) */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="max-w-4xl mx-auto space-y-6"
          >
            {/* Top Pill / Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0A192F]/90 border border-[#D4AF37] text-stone-200 shadow-lg backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-xs sm:text-sm font-semibold tracking-wide text-white">
                Daraga’s Modern Coworking Hub • 2nd Floor Biak Realty Corp.
              </span>
            </div>

            {/* Required Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white uppercase drop-shadow-xl leading-[1.05]">
              WORK.{" "}
              <span className="text-[#D4AF37] underline decoration-[#D4AF37]/50 underline-offset-8">
                FOCUS.
              </span>{" "}
              ACHIEVE.
            </h1>

            {/* Required Subheadline */}
            <p className="text-lg sm:text-2xl md:text-3xl font-medium text-stone-200 drop-shadow-md tracking-wide">
              Your space. Your time. Your success.
            </p>

            <p className="max-w-2xl mx-auto text-sm sm:text-base text-stone-300 leading-relaxed drop-shadow">
              Escape home distractions, fluctuating power, and unreliable Wi-Fi in Albay.
              Enjoy air-conditioned productivity, backup generator electricity, ergonomic seating,
              and bottomless brewed coffee.
            </p>

            {/* Required Overlaid Navy Blue CTA Button with Gold Accents */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onOpenBooking}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#0A192F] hover:bg-[#112442] text-white font-extrabold text-sm sm:text-base uppercase tracking-wider border-2 border-[#D4AF37] shadow-2xl hover:shadow-[#D4AF37]/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer group"
              >
                <span>Book Your Space Today!</span>
                <ArrowRight className="w-5 h-5 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#pricing"
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-[#F5F5DC]/90 hover:bg-[#F5F5DC] text-[#0A192F] font-bold text-sm sm:text-base border-2 border-[#0A192F] shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>View Rates & Passes</span>
              </a>
            </div>

            {/* Current Slide Caption Bar */}
            <div className="pt-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-black/40 backdrop-blur-sm border border-white/20 text-xs text-stone-300">
                <span className="font-bold text-[#D4AF37]">Slide {currentIndex + 1} of 7:</span>
                <span>{slides[currentIndex].title} — {slides[currentIndex].tagline}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Carousel Navigation Arrows */}
        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          className="absolute left-4 sm:left-8 z-30 p-3 rounded-full bg-[#0A192F]/80 hover:bg-[#0A192F] text-white border-2 border-[#D4AF37] transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-xl"
        >
          <ChevronLeft className="w-5 h-5 text-[#D4AF37]" />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute right-4 sm:right-8 z-30 p-3 rounded-full bg-[#0A192F]/80 hover:bg-[#0A192F] text-white border-2 border-[#D4AF37] transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-xl"
        >
          <ChevronRight className="w-5 h-5 text-[#D4AF37]" />
        </button>

        {/* Slide Indicator Dots & Play/Pause Control (7 slots for hero1.jpg - hero7.jpg) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-4 py-2 rounded-full bg-[#0A192F]/85 border border-[#D4AF37]/50 backdrop-blur-md shadow-2xl">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? "Pause autoplay" : "Start autoplay"}
            className="p-1 rounded text-stone-300 hover:text-[#D4AF37] transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <div className="h-4 w-px bg-white/20 mx-1" />

          {slides.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Jump to slide ${idx + 1} (${slide.fileName})`}
              className={`transition-all rounded-full ${
                currentIndex === idx
                  ? "w-8 h-2.5 bg-[#D4AF37] shadow-sm"
                  : "w-2.5 h-2.5 bg-white/40 hover:bg-white/80"
              }`}
              title={`${slide.fileName}: ${slide.title}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
