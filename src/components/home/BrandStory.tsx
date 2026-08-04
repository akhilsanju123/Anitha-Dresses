'use client';

import React from 'react';
import TeluguLogo from '../brand/TeluguLogo';
import { Award, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export default function BrandStory() {
  return (
    <section className="py-20 bg-gradient-to-b from-maroon-950 via-maroon-900 to-maroon-950 text-gold-100 relative overflow-hidden border-y border-amber-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Decorative Image Stack */}
          <div className="relative space-y-4">
            <div className="relative h-96 w-full rounded-3xl overflow-hidden border-2 border-amber-500/30 shadow-2xl bg-maroon-950">
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1000&auto=format&fit=crop&q=85"
                alt="ANITHA DRESSES Showroom"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-maroon-950/80 via-transparent to-transparent"></div>
            </div>
          </div>

          {/* Right Story Text */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Our Brand Story</span>
            </div>

            <TeluguLogo size="lg" variant="gold" />

            <h2 className="text-3xl sm:text-4xl font-black text-white font-serif leading-tight">
              Ongole's Premier Family Fashion Shopping Destination - ANITHA DRESSES
            </h2>

            <p className="text-sm text-gold-200/90 font-serif leading-relaxed">
              ANITHA DRESSES (Ongole) has been a trusted family shopping mall for decades. We bring you high quality Anarkali long dresses, Prisma leggings, Men's kurta suits, kids party wear, and family combo outfits at wholesale boutique prices.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-3 bg-maroon-950/60 p-3.5 rounded-2xl border border-amber-500/20">
                <Award className="w-6 h-6 text-amber-400 shrink-0" />
                <div>
                  <h4 className="font-bold text-xs text-white">Wholesale Rates</h4>
                  <p className="text-[11px] text-amber-200/70">Boutique quality at affordable rates</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-maroon-950/60 p-3.5 rounded-2xl border border-amber-500/20">
                <ShieldCheck className="w-6 h-6 text-amber-400 shrink-0" />
                <div>
                  <h4 className="font-bold text-xs text-white">Direct QR Verification</h4>
                  <p className="text-[11px] text-amber-200/70">Simple & secure UPI checkout</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
