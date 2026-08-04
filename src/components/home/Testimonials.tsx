'use client';

import React from 'react';
import { Star, Quote, Sparkles } from 'lucide-react';

const REVIEWS = [
  {
    name: "Radha Devi",
    city: "Ongole",
    review: "Excellent silk quality! The Anarkali long gown I purchased from ANITHA DRESSES has a royal look and feel. After online payment, the order was confirmed instantly.",
    rating: 5,
  },
  {
    name: "Saritha P.",
    city: "Vijayawada",
    review: "Purchased pattu pavada for my daughter for festival. Fabric is extremely soft and design is grand. Trusted family fashion shopping mall in Ongole!",
    rating: 5,
  },
  {
    name: "Venkateswara Rao",
    city: "Ongole",
    review: "Bought complete family wear set. Perfect sizing and fitting for everyone. WhatsApp support was very helpful.",
    rating: 5,
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-maroon-950 text-gold-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Customer Testimonials</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white font-serif">
            Trusted by Families Across Andhra Pradesh
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((rev, idx) => (
            <div
              key={idx}
              className="bg-maroon-900/60 p-8 rounded-2xl border border-amber-500/20 shadow-luxury relative space-y-4 flex flex-col justify-between"
            >
              <Quote className="w-10 h-10 text-amber-500/20 absolute top-4 right-4" />

              <div className="flex gap-1 text-amber-400">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>

              <p className="text-xs text-gold-200/90 font-serif leading-relaxed italic">
                "{rev.review}"
              </p>

              <div className="pt-4 border-t border-amber-500/10">
                <h4 className="font-bold text-sm text-white font-serif">{rev.name}</h4>
                <p className="text-[11px] text-amber-400 font-serif">{rev.city}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
