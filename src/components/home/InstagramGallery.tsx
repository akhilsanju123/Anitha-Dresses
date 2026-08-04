'use client';

import React from 'react';
import Image from 'next/image';
import { Instagram, Sparkles } from 'lucide-react';

const INSTA_IMAGES = [
  'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&auto=format&fit=crop&q=80',
];

export default function InstagramGallery() {
  return (
    <section className="py-16 bg-maroon-950 text-gold-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
            <Instagram className="w-3.5 h-3.5" />
            <span>@anithadresses</span>
          </div>
          <h2 className="text-3xl font-black text-white font-serif">
            Follow Us on Instagram
          </h2>
          <p className="text-xs text-amber-200/80 font-serif">
            Stay updated with new arrivals and festive family fashion lookbooks.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {INSTA_IMAGES.map((img, i) => (
            <a
              key={i}
              href="https://instagram.com/anithadresses"
              target="_blank"
              rel="noreferrer"
              className="relative aspect-square rounded-2xl overflow-hidden border border-amber-500/30 group shadow-luxury block"
            >
              <Image src={img} alt="Instagram Post" fill className="object-cover group-hover:scale-110 transition duration-500" />
              <div className="absolute inset-0 bg-maroon-950/60 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                <Instagram className="w-8 h-8 text-amber-400" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
