'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import TeluguLogo from '../brand/TeluguLogo';
import { X, Home, ShoppingBag, Grid, Layers, Tag, PhoneCall, User, ShieldCheck, FileText, Ban, ChevronDown, ChevronRight } from 'lucide-react';
import { Category } from '../../types';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (isOpen) {
      async function fetchMobileCategories() {
        try {
          const res = await fetch('/api/categories', { cache: 'no-store' });
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            setCategories(json.data);
          }
        } catch (err) {
          console.warn("Failed fetching mobile menu categories", err);
        }
      }
      fetchMobileCategories();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop overlay */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>

      {/* Slide-out Menu Panel */}
      <div className="fixed top-0 bottom-0 left-0 w-4/5 max-w-sm bg-maroon-950 text-gold-100 border-r border-amber-500/30 flex flex-col justify-between shadow-2xl p-6 overflow-y-auto">
        <div>
          {/* Header & Close Button */}
          <div className="flex items-center justify-between pb-6 border-b border-amber-500/20">
            <TeluguLogo size="sm" variant="gold" />
            <button onClick={onClose} className="p-2 text-gold-300 hover:text-amber-400">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Links List */}
          <nav className="mt-6 space-y-3">
            <Link onClick={onClose} href="/" className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-amber-500/10 text-gold-200 font-medium">
              <Home className="w-5 h-5 text-amber-400" />
              <span>Home</span>
            </Link>

            {/* Categories Accordion */}
            <div className="space-y-1">
              <div className="flex items-center justify-between p-2.5 rounded-lg hover:bg-amber-500/10 text-gold-200 font-medium">
                <Link onClick={onClose} href="/categories" className="flex items-center gap-3">
                  <Grid className="w-5 h-5 text-amber-400" />
                  <span>Categories</span>
                </Link>
              </div>

              {/* Subcategory Accordion List */}
              <div className="pl-6 space-y-2 border-l border-amber-500/20 my-1">
                {categories.map((cat) => (
                  <div key={cat.id || cat.slug} className="space-y-1">
                    <button
                      onClick={() => setExpandedCat(expandedCat === cat.slug ? null : cat.slug)}
                      className="w-full flex items-center justify-between py-1 text-xs font-extrabold text-amber-300"
                    >
                      <span>{cat.name}</span>
                      {expandedCat === cat.slug ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </button>

                    {expandedCat === cat.slug && cat.subcategories && (
                      <div className="pl-3 space-y-1 text-[11px]">
                        {cat.subcategories.map((sub, sIdx) => (
                          <Link
                            key={sIdx}
                            onClick={onClose}
                            href={`/products?category=${encodeURIComponent(cat.name)}&subcategory=${encodeURIComponent(sub)}`}
                            className="block text-gold-200/80 hover:text-white py-0.5"
                          >
                            • {sub}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Link onClick={onClose} href="/collections" className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-amber-500/10 text-gold-200 font-medium">
              <Layers className="w-5 h-5 text-amber-400" />
              <span>Collections</span>
            </Link>

            <Link onClick={onClose} href="/products" className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-amber-500/10 text-gold-200 font-medium">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <span>Shop All Products</span>
            </Link>

            <Link onClick={onClose} href="/offers" className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-amber-500/10 text-amber-300 font-bold">
              <Tag className="w-5 h-5 text-amber-400" />
              <span>Special Offers</span>
            </Link>

            <Link onClick={onClose} href="/account" className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-amber-500/10 text-gold-200 font-medium">
              <User className="w-5 h-5 text-amber-400" />
              <span>My Account</span>
            </Link>

            <Link onClick={onClose} href="/contact" className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-amber-500/10 text-gold-200 font-medium">
              <PhoneCall className="w-5 h-5 text-amber-400" />
              <span>Contact Us</span>
            </Link>

            <div className="pt-4 border-t border-amber-500/20">
              <p className="text-xs text-amber-400 uppercase tracking-widest font-semibold mb-2">Store Policies</p>
              <Link onClick={onClose} href="/terms" className="flex items-center gap-2 py-1.5 text-xs text-red-300 hover:text-white font-bold">
                <Ban className="w-3.5 h-3.5 text-red-400" /> No Cancellation / No Exchange
              </Link>
              <Link onClick={onClose} href="/faqs" className="flex items-center gap-2 py-1.5 text-xs text-gold-300 hover:text-white">
                <FileText className="w-3.5 h-3.5" /> FAQs
              </Link>
              <Link onClick={onClose} href="/privacy-policy" className="flex items-center gap-2 py-1.5 text-xs text-gold-300 hover:text-white">
                <ShieldCheck className="w-3.5 h-3.5" /> Privacy Policy
              </Link>
            </div>
          </nav>
        </div>

        {/* Footer Info */}
        <div className="pt-6 border-t border-amber-500/20 text-center">
          <p className="text-xs text-amber-200/70 font-serif">ANITHA DRESSES (Family Shopping Mall)</p>
          <p className="text-[10px] text-amber-400/60 mt-1">© 2026 All Rights Reserved.</p>
        </div>
      </div>
    </div>
  );
}
