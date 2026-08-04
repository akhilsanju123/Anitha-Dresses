'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import LowStockWidget from '../../../components/admin/LowStockWidget';
import { Product } from '../../../types';

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchInventory() {
      try {
        const res = await fetch('/api/products');
        const json = await res.json();
        if (json.success) {
          const list = Array.isArray(json.data) ? json.data : (json.data?.products || []);
          setProducts(list);
        }
      } catch (e) {
        console.warn("Failed fetching inventory products", e);
      }
    }
    fetchInventory();
  }, []);

  return (
    <div className="flex min-h-screen bg-maroon-950 text-gold-100">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <h1 className="text-2xl font-bold text-white font-serif border-b border-amber-500/20 pb-4">
          Inventory & Low Stock Management
        </h1>

        <LowStockWidget products={products} />
      </main>
    </div>
  );
}
