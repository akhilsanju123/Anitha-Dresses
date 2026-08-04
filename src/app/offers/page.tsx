'use client';

import React from 'react';
import Link from 'next/link';
import TeluguLogo from '../../components/brand/TeluguLogo';
import { INITIAL_COUPONS } from '../../lib/seedData';
import { Sparkles, Tag, ArrowRight } from 'lucide-react';

export default function OffersPage() {
  return (
    <div className="py-12 bg-maroon-950 text-gold-100 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Special Offers</span>
          </div>
          <TeluguLogo size="lg" variant="gold" />
          <h1 className="text-3xl font-black text-white font-serif">
            Festive & Special Season Offers
          </h1>
          <p className="text-xs text-amber-200/80 font-serif">
            Apply special discount coupon codes during checkout to enjoy additional savings.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {INITIAL_COUPONS.map((coupon) => (
            <div key={coupon.id} className="bg-maroon-900/60 p-6 rounded-3xl border border-amber-500/30 shadow-luxury space-y-4 relative overflow-hidden">
              <div className="flex justify-between items-start border-b border-amber-500/20 pb-3">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-amber-400 font-bold">COUPON CODE</span>
                  <h3 className="text-xl font-black text-white font-mono">{coupon.code}</h3>
                </div>
                <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/30">
                  <Tag className="w-5 h-5" />
                </div>
              </div>

              <p className="text-xs text-gold-200 font-serif">
                Get {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `₹${coupon.value} FLAT OFF`} on orders above ₹{coupon.minOrder}.
              </p>

              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="text-emerald-400 font-bold">Active Offer</span>
                <Link href="/products" className="text-amber-400 font-bold hover:underline flex items-center gap-1">
                  <span>Shop Collection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
