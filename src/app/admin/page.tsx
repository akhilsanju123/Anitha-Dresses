'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AnalyticsDashboard from '../../components/admin/AnalyticsDashboard';
import LowStockWidget from '../../components/admin/LowStockWidget';
import { INITIAL_SETTINGS } from '../../lib/seedData';
import { Product } from '../../types';

interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalCustomers: number;
  pendingPayments: number;
  readyForDelivery: number;
  deliveredOrders: number;
}

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0,
    pendingPayments: 0,
    readyForDelivery: 0,
    deliveredOrders: 0,
  });

  useEffect(() => {
    async function loadAdminData() {
      const token = typeof window !== 'undefined' ? localStorage.getItem('anitha_admin_token') : '';
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      };

      try {
        const resStats = await fetch('/api/admin/stats', { headers, cache: 'no-store' });
        const jsonStats = await resStats.json();
        if (jsonStats.success && jsonStats.data) {
          setStats(jsonStats.data);
        }

        const resProd = await fetch('/api/products', { cache: 'no-store' });
        const jsonProd = await resProd.json();
        if (jsonProd.success) {
          const list = Array.isArray(jsonProd.data) ? jsonProd.data : (jsonProd.data?.products || []);
          setProducts(list);
        }
      } catch (e) {
        console.warn("Failed fetching admin data:", e);
      }
    }

    loadAdminData();
  }, []);

  return (
    <div className="flex min-h-screen bg-maroon-950 text-gold-100">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-8 overflow-y-auto">
        
        {/* Header */}
        <div className="border-b border-amber-500/20 pb-4">
          <h1 className="text-2xl font-extrabold text-white font-serif">Admin Control Dashboard</h1>
          <p className="text-xs text-amber-200/70">ANITHA DRESSES Store Analytics & Inventory Overview (Real MongoDB Data)</p>
        </div>

        {/* Analytics Top Widget Cards */}
        <AnalyticsDashboard
          totalOrders={stats.totalOrders}
          totalRevenue={stats.totalRevenue}
          totalProducts={stats.totalProducts || products.length}
          totalCustomers={stats.totalCustomers}
          pendingPayments={stats.pendingPayments}
          readyForDelivery={stats.readyForDelivery}
          deliveredOrders={stats.deliveredOrders}
        />

        {/* Low Stock Alerts & Quick Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <LowStockWidget products={products} />

          <div className="bg-maroon-900/60 p-6 rounded-2xl border border-amber-500/30 shadow-luxury space-y-4">
            <h3 className="font-bold text-base text-gold-200 border-b border-amber-500/20 pb-2">Active Store Payment Settings</h3>
            <div className="space-y-2 text-xs">
              <p>Official UPI ID: <strong className="font-mono text-amber-300">{INITIAL_SETTINGS.upiId}</strong></p>
              <p>Account Number: <strong className="font-mono text-amber-300">{INITIAL_SETTINGS.accountNumber} ({INITIAL_SETTINGS.bankName})</strong></p>
              <p>Store Phone: <strong className="font-mono text-white">{INITIAL_SETTINGS.phone}</strong></p>
              <p>Free Shipping Limit: <strong className="font-mono text-emerald-400">₹{INITIAL_SETTINGS.freeShippingThreshold}</strong></p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
