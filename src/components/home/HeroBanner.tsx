'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Award } from 'lucide-react';
import TeluguLogo from '../brand/TeluguLogo';

interface BannerSlide {
  id?: string;
  image: string;
  tagline: string;
  title: string;
  subtitle: string;
  cta: string;
  link: string;
}

const DEFAULT_SLIDES: BannerSlide[] = [
  {
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1600&auto=format&fit=crop&q=85",
    tagline: "Royal Family Fashion Experience",
    title: "ANITHA DRESSES SHOPPING MALL",
    subtitle: "High quality fashion apparel for Men, Ladies, and Kids at wholesale boutique prices.",
    cta: "Explore Collection",
    link: "/products",
  },
  {
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=85",
    tagline: "Festive & Ethnic Special Edition",
    title: "Traditional & Modern Fashion",
    subtitle: "Discover perfect fashion collections for every member of your family at ANITHA DRESSES!",
    cta: "View Offers",
    link: "/offers",
  }
];

export default function HeroBanner() {
  const [slides, setSlides] = useState<BannerSlide[]>(DEFAULT_SLIDES);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    async function fetchBanners() {
      try {
        const res = await fetch('/api/banners', { cache: 'no-store' });
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setSlides(json.data);
        }
      } catch (err) {
        console.warn("Failed fetching dynamic hero banners", err);
      }
    }
    fetchBanners();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentSlide] || slides[0] || DEFAULT_SLIDES[0];

  return (
    <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden bg-maroon-950">
      {/* Background Image Carousel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority
            className="object-cover object-center opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-maroon-950 via-maroon-950/70 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-maroon-950 via-transparent to-maroon-950/80"></div>
        </motion.div>
      </AnimatePresence>

      {/* Hero Content Box */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
        
        {/* Animated Brand Emblem */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs font-semibold mb-6 backdrop-blur-md shadow-lg"
        >
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>{slide.tagline}</span>
        </motion.div>

        {/* English Brand Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-4"
        >
          <TeluguLogo size="xl" variant="gold" />
        </motion.div>

        {/* Dynamic Title */}
        <motion.h1
          key={slide.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-3xl sm:text-5xl lg:text-6xl font-black text-white font-serif tracking-wide leading-tight drop-shadow-md"
        >
          {slide.title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          key={slide.subtitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-sm sm:text-lg text-gold-200/90 max-w-2xl mx-auto mt-4 font-serif leading-relaxed"
        >
          {slide.subtitle}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href={slide.link}
            className="w-full sm:w-auto bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-maroon-950 font-bold px-8 py-4 rounded-full hover:brightness-110 transition duration-300 shadow-xl flex items-center justify-center gap-2 group text-base"
          >
            <span>{slide.cta}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition duration-300" />
          </Link>

          <Link
            href="/contact"
            className="w-full sm:w-auto bg-maroon-900/80 border border-amber-500/40 text-gold-200 font-semibold px-8 py-4 rounded-full hover:bg-amber-500/10 hover:text-white transition duration-300 backdrop-blur-md text-base"
          >
            Visit Store (Ongole)
          </Link>
        </motion.div>

        {/* Trust Indicators */}
        <div className="mt-12 pt-8 border-t border-amber-500/20 grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-xl mx-auto text-xs text-amber-200/80 font-serif">
          <div className="flex items-center justify-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>100% Pure Fabric</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Wholesale Prices</span>
          </div>
          <div className="flex items-center justify-center gap-2 col-span-2 sm:col-span-1">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Festive Specials</span>
          </div>
        </div>
      </div>
    </section>
  );
}
