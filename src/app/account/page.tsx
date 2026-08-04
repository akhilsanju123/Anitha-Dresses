'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Heart, MapPin, LogOut } from 'lucide-react';

export default function CustomerAccountDashboard() {
  return (
    <div className="py-12 bg-maroon-950 text-gold-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Welcome Header */}
        <div className="bg-maroon-900/60 p-8 rounded-3xl border border-amber-500/30 shadow-luxury flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              Customer Portal (ANITHA DRESSES)
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-serif mt-2">
              My Account
            </h1>
            <p className="text-xs text-amber-200/70">Manage your orders, saved items, and store location details.</p>
          </div>

          <Link href="/login" className="bg-maroon-950 text-red-300 hover:text-white px-4 py-2 rounded-xl text-xs font-bold border border-red-500/30 flex items-center gap-1.5">
            <LogOut className="w-4 h-4" />
            <span>Login / Account</span>
          </Link>
        </div>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Link href="/account/orders" className="bg-maroon-900/60 p-6 rounded-2xl border border-amber-500/30 shadow-luxury hover:border-amber-400 transition space-y-2 group">
            <ShoppingBag className="w-8 h-8 text-amber-400 group-hover:scale-110 transition duration-300" />
            <h3 className="font-bold text-base text-white font-serif">My Orders</h3>
            <p className="text-xs text-amber-200/70">View live order history and download PDF invoices.</p>
          </Link>

          <Link href="/account/wishlist" className="bg-maroon-900/60 p-6 rounded-2xl border border-amber-500/30 shadow-luxury hover:border-amber-400 transition space-y-2 group">
            <Heart className="w-8 h-8 text-amber-400 group-hover:scale-110 transition duration-300" />
            <h3 className="font-bold text-base text-white font-serif">Wishlist</h3>
            <p className="text-xs text-amber-200/70">Your saved dresses and favorite outfits.</p>
          </Link>

          <Link href="/contact" className="bg-maroon-900/60 p-6 rounded-2xl border border-amber-500/30 shadow-luxury hover:border-amber-400 transition space-y-2 group">
            <MapPin className="w-8 h-8 text-amber-400 group-hover:scale-110 transition duration-300" />
            <h3 className="font-bold text-base text-white font-serif">Store Location (Ongole)</h3>
            <p className="text-xs text-amber-200/70">Shop No. 62 & 77, Sri Balaji Market Road, Ongole.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
