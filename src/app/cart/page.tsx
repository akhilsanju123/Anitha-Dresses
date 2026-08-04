'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useShopStore } from '../../lib/store';
import { Trash2, ShoppingBag, ArrowRight, Tag, ShieldCheck } from 'lucide-react';
import { INITIAL_COUPONS } from '../../lib/seedData';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartSubtotal } = useShopStore();
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponSuccessMessage, setCouponSuccessMessage] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const found = INITIAL_COUPONS.find(c => c.code.toLowerCase() === couponCode.trim().toLowerCase() && c.active);
    if (found) {
      const minVal = found.minOrder ?? found.minOrderAmount ?? 0;
      const val = found.value ?? found.discountValue ?? 0;
      if (cartSubtotal >= minVal) {
        const discountVal = found.type === 'percentage' || found.discountType === 'percentage' ? Math.round((cartSubtotal * val) / 100) : val;
        setAppliedDiscount(discountVal);
        setCouponSuccessMessage(`Coupon ${found.code} applied successfully! (₹${discountVal} OFF)`);
      } else {
        alert(`Minimum order value of ₹${minVal} is required for this coupon.`);
      }
    } else {
      alert("Invalid or expired coupon code.");
    }
  };

  const deliveryFee = cartSubtotal > 1499 || cart.length === 0 ? 0 : 60;
  const finalTotal = Math.max(0, cartSubtotal - appliedDiscount + deliveryFee);

  return (
    <div className="py-12 bg-maroon-950 text-gold-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-white font-serif mb-8 text-center sm:text-left">
          Shopping Cart
        </h1>

        {cart.length === 0 ? (
          <div className="bg-maroon-900/60 p-16 rounded-3xl border border-amber-500/30 text-center space-y-4 max-w-lg mx-auto shadow-2xl">
            <ShoppingBag className="w-16 h-16 text-amber-400/40 mx-auto" />
            <h2 className="text-xl font-bold text-white font-serif">Your cart is currently empty</h2>
            <p className="text-xs text-amber-200/70 font-serif">Explore the latest family fashion catalog at ANITHA DRESSES.</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-amber-400 text-maroon-950 font-extrabold px-8 py-3.5 rounded-full hover:brightness-110 shadow-xl text-sm"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Items Table / List */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item, idx) => (
                <div key={idx} className="bg-maroon-900/60 p-4 sm:p-6 rounded-2xl border border-amber-500/20 shadow-luxury flex gap-4 sm:gap-6 items-center">
                  <div className="relative w-20 h-24 sm:w-24 sm:h-32 rounded-xl overflow-hidden shrink-0 border border-amber-500/20">
                    <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <h3 className="text-sm sm:text-base font-bold text-gold-100 truncate">{item.product.name}</h3>
                    <p className="text-xs text-amber-300 font-serif">
                      Size: <strong>{item.selectedSize}</strong> | Color: <strong>{item.selectedColor}</strong>
                    </p>
                    <span className="text-sm font-extrabold text-amber-400 block pt-1">
                      ₹{item.product.offerPrice}
                    </span>
                  </div>

                  {/* Quantity & Delete */}
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex items-center border border-amber-500/30 rounded-xl overflow-hidden bg-maroon-950">
                      <button onClick={() => updateQuantity(idx, item.quantity - 1)} className="px-3 py-1 text-xs text-gold-200 hover:bg-amber-500/20">-</button>
                      <span className="px-3 text-xs font-bold text-white">{item.quantity}</span>
                      <button onClick={() => updateQuantity(idx, item.quantity + 1)} className="px-3 py-1 text-xs text-gold-200 hover:bg-amber-500/20">+</button>
                    </div>

                    <button onClick={() => removeFromCart(idx)} className="p-2 text-red-400 hover:text-red-300" aria-label="Remove Item">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary & Coupon Card */}
            <div className="space-y-6">
              
              {/* Coupon Input */}
              <div className="bg-maroon-900/60 p-6 rounded-2xl border border-amber-500/30 shadow-luxury space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <Tag className="w-4 h-4 text-amber-400" />
                  <span>Apply Coupon Code:</span>
                </div>

                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. ANITHA10, FESTIVAL200"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 bg-maroon-950 border border-amber-500/30 rounded-xl px-3 py-2 text-xs text-white uppercase font-mono"
                  />
                  <button type="submit" className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-4 py-2 rounded-xl text-xs font-bold border border-amber-500/40">
                    Apply
                  </button>
                </form>

                {couponSuccessMessage && (
                  <p className="text-xs text-emerald-400 font-semibold">{couponSuccessMessage}</p>
                )}
              </div>

              {/* Order Calculations */}
              <div className="bg-maroon-900/60 p-6 rounded-2xl border border-amber-500/30 shadow-luxury space-y-4 text-xs">
                <h3 className="text-sm font-bold text-gold-200 border-b border-amber-500/20 pb-3">Order Summary</h3>

                <div className="flex justify-between text-gold-200">
                  <span>Subtotal:</span>
                  <span className="font-mono font-bold">₹{cartSubtotal}</span>
                </div>

                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Discount Applied:</span>
                    <span className="font-mono">-₹{appliedDiscount}</span>
                  </div>
                )}

                <div className="flex justify-between text-gold-200">
                  <span>Shipping Charge:</span>
                  <span className="font-mono font-bold">{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                </div>

                <div className="flex justify-between text-sm font-black text-white pt-3 border-t border-amber-500/20">
                  <span>Grand Total:</span>
                  <span className="text-amber-300 font-mono text-lg">₹{finalTotal}</span>
                </div>

                <Link
                  href="/checkout"
                  className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-maroon-950 font-extrabold py-3.5 rounded-xl hover:brightness-110 transition flex items-center justify-center gap-2 shadow-xl text-sm mt-4"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Proceed to Checkout</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
