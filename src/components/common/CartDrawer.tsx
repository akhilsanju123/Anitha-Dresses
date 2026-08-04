'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useShopStore } from '../../lib/store';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartSubtotal } = useShopStore();

  if (!isCartOpen) return null;

  const deliveryFee = cartSubtotal > 1499 ? 0 : 60;
  const grandTotal = cartSubtotal + deliveryFee;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>

      {/* Slide Drawer */}
      <div className="fixed top-0 bottom-0 right-0 w-full max-w-md bg-maroon-950 text-gold-100 border-l border-amber-500/30 flex flex-col justify-between shadow-2xl p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-amber-500/20">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <h2 className="font-bold text-base text-white font-serif">
              Shopping Cart ({cart.length})
            </h2>
          </div>
          <button onClick={() => setIsCartOpen(false)} className="p-1 text-gold-300 hover:text-amber-400">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <ShoppingBag className="w-12 h-12 text-amber-500/40 mx-auto" />
              <p className="text-sm text-gold-200 font-serif">Your shopping cart is empty.</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="bg-amber-400 text-maroon-950 font-bold px-6 py-2.5 rounded-xl text-xs shadow-lg"
              >
                Shop Now
              </button>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={idx} className="flex gap-4 p-3 bg-maroon-900/60 rounded-xl border border-amber-500/20 items-center">
                <div className="relative w-16 h-20 rounded-lg overflow-hidden shrink-0 border border-amber-500/20">
                  <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                </div>

                <div className="flex-1 space-y-1">
                  <h4 className="text-xs font-bold text-gold-100 line-clamp-1">{item.product.name}</h4>
                  <p className="text-[11px] text-amber-300 font-mono">
                    Size: {item.selectedSize} | ₹{item.product.offerPrice}
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => updateQuantity(idx, item.quantity - 1)}
                      className="w-6 h-6 bg-maroon-950 border border-amber-500/30 text-amber-300 rounded font-bold text-xs"
                    >
                      -
                    </button>
                    <span className="text-xs font-mono font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(idx, item.quantity + 1)}
                      className="w-6 h-6 bg-maroon-950 border border-amber-500/30 text-amber-300 rounded font-bold text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(idx)}
                  className="text-red-400 hover:text-red-300 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary */}
        {cart.length > 0 && (
          <div className="pt-4 border-t border-amber-500/20 space-y-3">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-gold-200">
                <span>Subtotal:</span>
                <span className="font-mono font-bold">₹{cartSubtotal}</span>
              </div>
              <div className="flex justify-between text-gold-200">
                <span>Delivery Charge:</span>
                <span className="font-mono font-bold">{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-amber-500/20">
                <span>Grand Total:</span>
                <span className="text-amber-300 font-mono text-base">₹{grandTotal}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={() => setIsCartOpen(false)}
              className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-maroon-950 font-black py-3.5 rounded-xl hover:brightness-110 transition flex items-center justify-center gap-2 shadow-2xl text-xs"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
