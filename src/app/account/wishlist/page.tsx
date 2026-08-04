'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '../../../components/product/ProductCard';
import { useShopStore } from '../../../lib/store';
import { Product } from '../../../types';
import { Heart } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist } = useShopStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWishlistProducts() {
      try {
        setLoading(true);
        const res = await fetch('/api/products');
        const json = await res.json();
        if (json.success) {
          const list = Array.isArray(json.data) ? json.data : (json.data?.products || []);
          setProducts(list);
        }
      } catch (err) {
        console.warn("Failed fetching wishlist products", err);
      } finally {
        setLoading(false);
      }
    }
    fetchWishlistProducts();
  }, []);

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="py-12 bg-maroon-950 text-gold-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <h1 className="text-3xl font-black text-white font-serif">Saved Wishlist Items</h1>

        {loading ? (
          <div className="py-12 text-center text-amber-300 font-serif text-xs">Loading saved items...</div>
        ) : wishlistedProducts.length === 0 ? (
          <div className="bg-maroon-900/60 p-12 rounded-3xl border border-amber-500/30 text-center space-y-4 shadow-luxury">
            <Heart className="w-12 h-12 text-amber-400 mx-auto" />
            <p className="text-sm font-bold text-amber-300">Your saved wishlist is empty.</p>
            <p className="text-xs text-amber-200/70">Click the heart icon on any product card to save your favorite outfits here.</p>
            <Link
              href="/products"
              className="inline-block bg-gradient-to-r from-amber-400 to-amber-600 text-maroon-950 font-black px-6 py-3 rounded-xl hover:brightness-110 transition text-xs shadow-lg"
            >
              Explore Products &rarr;
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistedProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
