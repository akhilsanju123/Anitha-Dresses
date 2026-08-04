'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Category } from '../../types';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      try {
        setLoading(true);
        const res = await fetch('/api/categories', { cache: 'no-store' });
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setCategories(json.data);
        }
      } catch (err) {
        console.warn("Failed loading categories page from API", err);
      } finally {
        setLoading(false);
      }
    }
    loadCategories();
  }, []);

  return (
    <div className="py-12 bg-maroon-950 text-gold-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Departments</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white font-serif">
            All Product Categories
          </h1>
          <p className="text-sm text-gold-200/80 font-serif">
            Explore MEN, LADIES, and KIDS departments and their subcategories.
          </p>
        </div>

        {loading ? (
          <div className="py-16 text-center text-amber-300 font-serif text-sm">Loading database categories...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat) => (
              <Link
                key={cat.id || cat.slug}
                href={`/categories/${cat.slug}`}
                className="group bg-maroon-900/60 rounded-3xl border border-amber-500/30 overflow-hidden shadow-luxury transition-all duration-300 hover:-translate-y-1 hover:border-amber-400 flex flex-col justify-between"
              >
                <div className="relative h-64 w-full overflow-hidden bg-maroon-950">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-110 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-maroon-950 via-transparent to-transparent"></div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold text-white font-serif group-hover:text-amber-300 transition">
                      {cat.name}
                    </h3>
                    <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                      {cat.subcategories ? cat.subcategories.length : 0} Subcategories
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 font-serif leading-relaxed">{cat.description}</p>

                  <div className="pt-2 flex items-center text-xs font-bold text-amber-400 gap-1.5">
                    <span>Explore Department</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
