'use client';

import React from 'react';
import { ShieldCheck, Award, QrCode, Headphones, Sparkles } from 'lucide-react';

const FEATURES = [
  {
    icon: Award,
    title: "100% Pure Fabric Quality",
    desc: "Boutique grade fabrics curated specifically for family occasions and daily wear.",
  },
  {
    icon: ShieldCheck,
    title: "Wholesale Boutique Pricing",
    desc: "Direct-to-customer pricing without intermediate retail markups.",
  },
  {
    icon: QrCode,
    title: "Official QR & UPI Payment",
    desc: "Seamless and transparent payment verification via official ICICI QR scanner.",
  },
  {
    icon: Headphones,
    title: "Dedicated WhatsApp Support",
    desc: "Direct store assistant support for size guidance, order tracking, and inquiries.",
  }
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-maroon-900/40 text-gold-100 border-t border-amber-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Why ANITHA DRESSES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white font-serif">
            The Family Shopping Standard
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="bg-maroon-950 p-6 rounded-3xl border border-amber-500/20 shadow-luxury space-y-3">
                <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl inline-block border border-amber-500/30">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-white text-base font-serif">{f.title}</h3>
                <p className="text-xs text-amber-200/70 font-serif leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
