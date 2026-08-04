'use client';

import React, { useState } from 'react';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import { INITIAL_COUPONS } from '../../../lib/seedData';
import { Plus, Trash2, Tag } from 'lucide-react';
import { Coupon } from '../../../types';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [code, setCode] = useState('');
  const [value, setValue] = useState(10);
  const [minOrder, setMinOrder] = useState(999);

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    const newCoupon: Coupon = {
      id: `coup-${Date.now()}`,
      code: code.toUpperCase(),
      type: 'percentage',
      value,
      minOrder,
      expiryDate: '2027-12-31',
      active: true,
    };

    setCoupons([newCoupon, ...coupons]);
    setCode('');
  };

  const handleDeleteCoupon = (id: string) => {
    setCoupons(coupons.filter(c => c.id !== id));
  };

  return (
    <div className="flex min-h-screen bg-maroon-950 text-gold-100">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <h1 className="text-2xl font-bold text-white font-serif border-b border-amber-500/20 pb-4">
          Discount Coupons Manager
        </h1>

        <form onSubmit={handleAddCoupon} className="bg-maroon-900/60 p-6 rounded-2xl border border-amber-500/30 flex flex-wrap gap-4 items-end shadow-luxury">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-bold text-amber-300 mb-1">Coupon Code:</label>
            <input
              type="text"
              required
              placeholder="e.g. FESTIVAL20"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-maroon-950 border border-amber-500/30 rounded-xl p-2.5 text-xs text-white uppercase font-mono"
            />
          </div>

          <div className="w-32">
            <label className="block text-xs font-bold text-amber-300 mb-1">Discount (%):</label>
            <input
              type="number"
              required
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className="w-full bg-maroon-950 border border-amber-500/30 rounded-xl p-2.5 text-xs text-white"
            />
          </div>

          <div className="w-36">
            <label className="block text-xs font-bold text-amber-300 mb-1">Min Order (₹):</label>
            <input
              type="number"
              required
              value={minOrder}
              onChange={(e) => setMinOrder(Number(e.target.value))}
              className="w-full bg-maroon-950 border border-amber-500/30 rounded-xl p-2.5 text-xs text-white"
            />
          </div>

          <button type="submit" className="bg-amber-400 text-maroon-950 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1 shadow">
            <Plus className="w-4 h-4" />
            <span>Add Coupon</span>
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((c) => (
            <div key={c.id} className="bg-maroon-900/60 p-6 rounded-2xl border border-amber-500/30 flex justify-between items-center shadow-luxury">
              <div>
                <span className="font-mono font-black text-amber-300 text-base">{c.code}</span>
                <p className="text-xs text-gold-200">{c.value}% OFF on orders above ₹{c.minOrder}</p>
              </div>

              <button onClick={() => handleDeleteCoupon(c.id)} className="text-red-400 hover:text-red-300 p-2">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
