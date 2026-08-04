'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '../../types';
import { useShopStore } from '../../lib/store';
import { Heart, Eye, ShoppingBag, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { wishlist, toggleWishlist, addToCart, setQuickViewProduct } = useShopStore();

  const isWishlisted = wishlist.includes(product.id);
  const discountPercent = Math.round(((product.mrp - product.offerPrice) / product.mrp) * 100);

  return (
    <div className="group bg-maroon-950/80 rounded-2xl border border-amber-500/20 shadow-luxury overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/50">
      
      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-maroon-900">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />

        {/* Labels Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {discountPercent > 0 && (
            <span className="bg-amber-400 text-maroon-950 font-black text-[10px] uppercase px-2.5 py-1 rounded-full shadow">
              {discountPercent}% OFF
            </span>
          )}
          {product.labels.includes('best_seller') && (
            <span className="bg-maroon-900 text-gold-200 border border-amber-500/40 text-[9px] font-bold uppercase px-2 py-0.5 rounded-full backdrop-blur-md">
              BEST SELLER
            </span>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="bg-red-600 text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded-full">
              ONLY {product.stock} LEFT
            </span>
          )}
        </div>

        {/* Floating Quick Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => toggleWishlist(product.id)}
            className="p-2 rounded-full bg-maroon-950/80 text-gold-200 hover:text-amber-400 border border-amber-500/30 backdrop-blur-md transition"
            aria-label="Wishlist"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>
          
          <button
            onClick={() => setQuickViewProduct(product)}
            className="p-2 rounded-full bg-maroon-950/80 text-gold-200 hover:text-amber-400 border border-amber-500/30 backdrop-blur-md transition"
            aria-label="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Add to Cart Bar on Hover */}
        <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-maroon-950 via-maroon-950/80 to-transparent transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center">
          <button
            onClick={() => addToCart(product, product.sizes[0], product.colors[0]?.name || 'Standard')}
            className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-maroon-950 font-bold text-xs py-2.5 rounded-xl hover:brightness-110 shadow-lg flex items-center justify-center gap-1.5"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
        <div>
          <span className="text-[10px] text-amber-400/80 uppercase font-semibold tracking-wider">
            {product.category} {product.subcategory ? `• ${product.subcategory}` : ''}
          </span>
          <Link href={`/products/${product.id}`} className="block">
            <h3 className="text-sm font-bold text-gold-100 line-clamp-1 group-hover:text-amber-300 transition">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Rating & Stock */}
        <div className="flex items-center justify-between text-xs pt-1">
          <div className="flex items-center gap-1 text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span className="font-bold text-gold-100">{product.rating}</span>
            <span className="text-gray-400 text-[10px]">({product.reviewsCount})</span>
          </div>

          <div className="flex gap-1">
            {product.colors.slice(0, 3).map((c, i) => (
              <span key={i} className="w-2.5 h-2.5 rounded-full border border-white/20" style={{ backgroundColor: c.hex }}></span>
            ))}
          </div>
        </div>

        {/* Price Row */}
        <div className="flex items-baseline justify-between pt-2 border-t border-amber-500/10">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-extrabold text-amber-300">₹{product.offerPrice}</span>
            <span className="text-xs text-gray-400 line-through">₹{product.mrp}</span>
          </div>
          <Link
            href={`/products/${product.id}`}
            className="text-xs font-bold text-amber-400 hover:text-white transition"
          >
            Details &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
