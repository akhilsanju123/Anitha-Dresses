'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useShopStore } from '../../lib/store';
import { Product } from '../../types';
import { Search, X } from 'lucide-react';

export default function SearchModal() {
  const { isSearchOpen, setIsSearchOpen } = useShopStore();
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (isSearchOpen) {
      async function loadProducts() {
        try {
          const res = await fetch('/api/products', { cache: 'no-store' });
          const json = await res.json();
          if (json.success) {
            const list = Array.isArray(json.data) ? json.data : (json.data?.products || []);
            setProducts(list);
          }
        } catch (err) {
          console.warn("Error fetching search products", err);
        }
      }
      loadProducts();
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const filteredProducts = query.trim()
    ? products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        (p.subcategory && p.subcategory.toLowerCase().includes(query.toLowerCase())) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsSearchOpen(false)}></div>

      <div className="relative w-full max-w-2xl bg-maroon-950 text-gold-100 rounded-3xl border border-amber-500/40 shadow-2xl p-6 space-y-6 z-10">
        <div className="flex justify-between items-center border-b border-amber-500/20 pb-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
            <Search className="w-5 h-5" />
            <span>Search ANITHA DRESSES</span>
          </div>
          <button onClick={() => setIsSearchOpen(false)} className="p-1 text-gold-300 hover:text-amber-400">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Input Box */}
        <div className="relative">
          <input
            type="text"
            autoFocus
            placeholder="Search by dress name, category or style (e.g. Shirts, Anarkali, Frocks)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-maroon-900 border border-amber-500/40 rounded-2xl py-3.5 pl-4 pr-10 text-white placeholder-gold-200/50 text-sm focus:outline-none focus:border-amber-400"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-3 top-3.5 text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto space-y-3">
          {query && filteredProducts.length === 0 ? (
            <p className="text-center text-xs text-amber-200/70 py-8">
              No products found matching "{query}". Try searching for Shirts, Frocks, or Suits.
            </p>
          ) : (
            filteredProducts.map((p) => (
              <Link
                key={p.id}
                href={`/products/${p.id}`}
                onClick={() => setIsSearchOpen(false)}
                className="flex items-center gap-4 p-3 bg-maroon-900/60 rounded-2xl border border-amber-500/20 hover:border-amber-400 transition group"
              >
                <div className="relative w-12 h-14 rounded-xl overflow-hidden shrink-0 border border-amber-500/20 bg-maroon-950">
                  <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-xs text-white group-hover:text-amber-300 transition">{p.name}</h4>
                  <p className="text-[10px] text-amber-400 font-semibold">{p.category} {p.subcategory ? `• ${p.subcategory}` : ''}</p>
                </div>
                <span className="font-mono font-bold text-amber-300 text-xs">₹{p.offerPrice}</span>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
