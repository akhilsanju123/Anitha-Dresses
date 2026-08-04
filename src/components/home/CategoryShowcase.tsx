'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Category } from '../../types';

export default function CategoryShowcase() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHomeCategories() {
      try {
        setLoading(true);
        const res = await fetch('/api/categories', { cache: 'no-store' });
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setCategories(json.data);
        }
      } catch (err) {
        console.warn("Failed fetching home showcase categories", err);
      } finally {
        setLoading(false);
      }
    }
    fetchHomeCategories();
  }, []);

  return (
    <section className="py-20 bg-maroon-950 text-gold-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Family Shopping</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white font-serif">
            Shop by Department
          </h2>
          <p className="text-xs text-amber-200/80 font-serif">
            Explore complete collections for Men, Ladies, and Kids at ANITHA DRESSES.
          </p>
        </div>

        {loading ? (
          <div className="py-12 text-center text-amber-300 font-serif text-xs">Loading categories from database...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((cat) => (
              <div key={cat.id || cat.slug} className="bg-maroon-900/60 rounded-3xl border border-amber-500/30 overflow-hidden shadow-luxury space-y-4 p-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="relative h-64 rounded-2xl overflow-hidden border border-amber-500/20">
                    <Image src={cat.image} alt={cat.name} fill className="object-cover hover:scale-105 transition duration-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white font-serif">{cat.name}</h3>
                    <p className="text-xs text-amber-200/70 mt-1 font-serif">{cat.description}</p>
                  </div>
                </div>

                <Link
                  href={`/categories/${cat.slug}`}
                  className="w-full bg-maroon-950 hover:bg-amber-500/10 text-amber-300 border border-amber-500/30 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition"
                >
                  <span>View Department</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
