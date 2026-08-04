'use client';

import React from 'react';
import { ShoppingBag, Package, Users, Clock, Truck, CheckCircle2 } from 'lucide-react';

interface AnalyticsProps {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalCustomers: number;
  pendingPayments?: number;
  readyForDelivery?: number;
  deliveredOrders?: number;
}

export default function AnalyticsDashboard({
  totalOrders = 0,
  totalProducts = 0,
  totalCustomers = 0,
  pendingPayments = 0,
  readyForDelivery = 0,
  deliveredOrders = 0,
}: AnalyticsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
      {/* 1. Live Total Orders */}
      <div className="bg-maroon-900/60 p-5 rounded-2xl border border-amber-500/30 shadow-luxury space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-[11px] text-amber-300 font-semibold uppercase">Total Orders</span>
          <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
            <ShoppingBag className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-black text-white font-mono">{totalOrders}</p>
        <p className="text-[10px] text-amber-200/70">Real customer orders</p>
      </div>

      {/* 2. Pending Payments */}
      <div className="bg-maroon-900/60 p-5 rounded-2xl border border-yellow-500/40 shadow-luxury space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-[11px] text-yellow-300 font-semibold uppercase">Pending Payments</span>
          <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-400">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-black text-yellow-300 font-mono">{pendingPayments}</p>
        <p className="text-[10px] text-yellow-200/80">Verification Queue</p>
      </div>

      {/* 3. Ready for Delivery */}
      <div className="bg-maroon-900/60 p-5 rounded-2xl border border-blue-500/40 shadow-luxury space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-[11px] text-blue-300 font-semibold uppercase">Ready for Delivery</span>
          <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
            <Truck className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-black text-blue-300 font-mono">{readyForDelivery}</p>
        <p className="text-[10px] text-blue-200/80">Dispatch Queue</p>
      </div>

      {/* 4. Delivered Orders */}
      <div className="bg-maroon-900/60 p-5 rounded-2xl border border-emerald-500/40 shadow-luxury space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-[11px] text-emerald-300 font-semibold uppercase">Delivered Orders</span>
          <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-black text-emerald-400 font-mono">{deliveredOrders}</p>
        <p className="text-[10px] text-emerald-200/80 font-semibold">Completed orders</p>
      </div>

      {/* 5. Total Customers */}
      <div className="bg-maroon-900/60 p-5 rounded-2xl border border-amber-500/30 shadow-luxury space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-[11px] text-amber-300 font-semibold uppercase">Total Customers</span>
          <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-black text-white font-mono">{totalCustomers}</p>
        <p className="text-[10px] text-amber-200/70">Unique buyers</p>
      </div>

      {/* 6. Total Products */}
      <div className="bg-maroon-900/60 p-5 rounded-2xl border border-amber-500/30 shadow-luxury space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-[11px] text-amber-300 font-semibold uppercase">Total Products</span>
          <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
            <Package className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-black text-white font-mono">{totalProducts}</p>
        <p className="text-[10px] text-amber-200/70">Active store catalog</p>
      </div>
    </div>
  );
}
