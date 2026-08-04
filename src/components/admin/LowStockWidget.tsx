'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { Product } from '../../types';

interface LowStockWidgetProps {
  products: Product[];
}

export default function LowStockWidget({ products }: LowStockWidgetProps) {
  const lowStockItems = products.filter(p => p.stock <= (p.lowStockThreshold || 5));

  return (
    <div className="bg-maroon-900/60 p-6 rounded-2xl border border-amber-500/30 shadow-luxury space-y-4">
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <span>Low Stock Inventory Alerts</span>
        </div>
        <span className="bg-amber-500/20 text-amber-300 text-xs px-2.5 py-0.5 rounded-full font-mono font-bold">
          {lowStockItems.length} Items
        </span>
      </div>

      <div className="space-y-3">
        {lowStockItems.length === 0 ? (
          <p className="text-xs text-amber-200/60 py-4 text-center">All inventory stocks are healthy.</p>
        ) : (
          lowStockItems.map((prod) => (
            <div key={prod.id} className="flex justify-between items-center bg-maroon-950 p-3 rounded-xl border border-amber-500/10 text-xs">
              <div>
                <p className="font-bold text-white line-clamp-1">{prod.name}</p>
                <p className="text-[10px] text-gray-400">SKU: {prod.sku} | Category: {prod.category}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-red-400 font-extrabold text-xs">Stock Left: {prod.stock}</span>
                <Link href="/admin/products" className="text-amber-400 hover:text-white transition text-xs flex items-center">
                  Update &rarr;
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
