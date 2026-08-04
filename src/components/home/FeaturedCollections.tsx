'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { INITIAL_CATEGORIES } from '../../lib/seedData';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function FeaturedCollections() {
  return (
    <section className="py-20 bg-maroon-950 text-gold-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-amber-500/20 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Main Categories</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white font-serif">
              ANITHA DRESSES Categories
            </h2>
          </div>
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {INITIAL_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group relative h-96 rounded-3xl overflow-hidden border-2 border-amber-500/30 shadow-luxury hover:border-amber-400 transition-all duration-500 flex flex-col justify-end p-6"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-maroon-950 via-maroon-950/40 to-transparent"></div>

              <div className="relative z-10 space-y-2">
                <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  {cat.subcategories.length} Subcategories
                </span>
                <h3 className="text-2xl font-black text-white font-serif group-hover:text-amber-300 transition">
                  {cat.name}
                </h3>
                <p className="text-xs text-amber-200/80 line-clamp-2 font-serif">
                  {cat.description}
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs font-bold text-amber-400 group-hover:underline">
                  <span>Explore {cat.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
