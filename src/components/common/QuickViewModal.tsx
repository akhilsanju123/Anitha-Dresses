'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useShopStore } from '../../lib/store';
import { X, ShoppingBag, Heart, Star, Check } from 'lucide-react';

export default function QuickViewModal() {
  const { quickViewProduct, setQuickViewProduct, addToCart, wishlist, toggleWishlist } = useShopStore();

  if (!quickViewProduct) return null;

  const [selectedSize, setSelectedSize] = useState(quickViewProduct.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(quickViewProduct.colors[0]?.name || 'Standard');
  const [added, setAdded] = useState(false);

  const isWishlisted = wishlist.includes(quickViewProduct.id);

  const handleAddToCart = () => {
    addToCart(quickViewProduct, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setQuickViewProduct(null)}></div>

      <div className="relative w-full max-w-3xl bg-maroon-950 text-gold-100 rounded-3xl border border-amber-500/40 shadow-2xl p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-6 z-10">
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 p-2 text-gold-300 hover:text-amber-400 z-20"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Product Image */}
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-amber-500/30 bg-maroon-900">
          <Image
            src={quickViewProduct.images[0]}
            alt={quickViewProduct.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
              {quickViewProduct.category} {quickViewProduct.subcategory ? `• ${quickViewProduct.subcategory}` : ''}
            </span>
            <h2 className="text-xl font-bold text-white font-serif">{quickViewProduct.name}</h2>

            <div className="flex items-center gap-2 text-amber-400 text-xs">
              <Star className="w-4 h-4 fill-amber-400" />
              <span className="font-bold text-white">{quickViewProduct.rating}</span>
              <span className="text-gray-400">({quickViewProduct.reviewsCount} reviews)</span>
            </div>

            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-2xl font-black text-amber-300 font-mono">₹{quickViewProduct.offerPrice}</span>
              <span className="text-sm text-gray-400 line-through">₹{quickViewProduct.mrp}</span>
            </div>
          </div>

          {/* Size Selector */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gold-200">Select Size:</p>
            <div className="flex flex-wrap gap-2">
              {quickViewProduct.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                    selectedSize === s
                      ? 'bg-amber-400 text-maroon-950 border-amber-400 shadow-md'
                      : 'bg-maroon-900 text-gold-200 border-amber-500/30 hover:border-amber-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-4 border-t border-amber-500/20">
            <button
              onClick={handleAddToCart}
              className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-maroon-950 font-black py-3.5 rounded-xl hover:brightness-110 transition flex items-center justify-center gap-2 text-xs shadow-lg"
            >
              {added ? <Check className="w-4 h-4 text-maroon-950" /> : <ShoppingBag className="w-4 h-4" />}
              <span>{added ? 'Added to Cart!' : 'Add to Cart'}</span>
            </button>

            <button
              onClick={() => toggleWishlist(quickViewProduct.id)}
              className="w-full bg-maroon-900 border border-amber-500/30 text-gold-200 hover:text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-amber-400 text-amber-400' : ''}`} />
              <span>{isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
