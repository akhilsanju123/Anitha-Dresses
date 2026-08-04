'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '../product/ProductCard';
import { Product } from '../../types';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function TrendingSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrending() {
      try {
        const res = await fetch('/api/products', { cache: 'no-store' });
        const json = await res.json();
        if (json.success) {
          const list = Array.isArray(json.data) ? json.data : (json.data?.products || []);
          setProducts(list.slice(0, 8));
        }
      } catch (err) {
        console.warn("Failed loading trending products", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTrending();
  }, []);

  return (
    <section className="py-20 bg-maroon-900/40 text-gold-100 relative border-t border-amber-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-amber-500/20 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Trending Fashion</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white font-serif">ANITHA DRESSES Trending Collection</h2>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition group"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="py-12 text-center text-amber-300 font-serif text-xs">Loading trending products...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
