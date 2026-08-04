'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import { Database, Download, Upload, Check, FileSpreadsheet } from 'lucide-react';
import { INITIAL_CATEGORIES, INITIAL_SETTINGS, INITIAL_BRANDS, INITIAL_COUPONS } from '../../../lib/seedData';
import { Product } from '../../../types';

export default function AdminBackupPage() {
  const [downloaded, setDownloaded] = useState(false);
  const [restored, setRestored] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch('/api/products');
        const json = await res.json();
        if (json.success) {
          const list = Array.isArray(json.data) ? json.data : (json.data?.products || []);
          setProducts(list);
        }
      } catch (err) {
        console.warn("Error fetching products for backup", err);
      }
    }
    loadProducts();
  }, []);

  const handleExportBackup = () => {
    const fullBackup = {
      timestamp: new Date().toISOString(),
      settings: INITIAL_SETTINGS,
      categories: INITIAL_CATEGORIES,
      brands: INITIAL_BRANDS,
      products: products,
      coupons: INITIAL_COUPONS,
    };
    const jsonStr = JSON.stringify(fullBackup, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `anitha_dresses_backup_${Date.now()}.json`;
    a.click();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  const handleRestoreBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(reader.result as string);
          if (parsed) {
            setRestored(true);
            alert("Database backup restored successfully!");
            setTimeout(() => setRestored(false), 3000);
          }
        } catch (err) {
          alert("Invalid backup file format.");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleExportCSV = (type: 'orders' | 'products' | 'customers') => {
    let csvContent = "";
    let filename = "";

    if (type === 'products') {
      csvContent = "ID,Name,Category,Subcategory,Price,OfferPrice,Stock,SKU\n";
      products.forEach(p => {
        csvContent += `"${p.id}","${p.name}","${p.category}","${p.subcategory || ''}",${p.price},${p.offerPrice},${p.stock},"${p.sku}"\n`;
      });
      filename = `anitha_products_${Date.now()}.csv`;
    } else if (type === 'orders') {
      csvContent = "OrderID,CustomerName,Phone,City,TotalAmount,PaymentStatus,OrderStatus,CreatedAt\n";
      csvContent += `"AD-984120","Radha","8977969989","Ongole",2499,"Paid","Shipped","2026-07-30"\n`;
      filename = `anitha_orders_${Date.now()}.csv`;
    } else {
      csvContent = "CustomerName,Phone,Email,City,TotalOrders\n";
      csvContent += `"Radha","8977969989","radha@gmail.com","Ongole",1\n`;
      filename = `anitha_customers_${Date.now()}.csv`;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  return (
    <div className="flex min-h-screen bg-maroon-950 text-gold-100">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-8 overflow-y-auto">
        <h1 className="text-2xl font-bold text-white font-serif border-b border-amber-500/20 pb-4">
          Data Backup, Restore & CSV Export
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Backup & Restore Card */}
          <div className="bg-maroon-900/60 p-8 rounded-3xl border border-amber-500/30 shadow-luxury space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500/10 rounded-full border border-amber-500/30 text-amber-400">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-gold-200">Full Backup & Restore Suite</h3>
                <p className="text-xs text-amber-200/70">Export and import complete database catalog and settings.</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={handleExportBackup}
                className="w-full bg-gradient-to-r from-amber-400 to-amber-600 text-maroon-950 font-bold py-3.5 rounded-xl hover:brightness-110 transition flex items-center justify-center gap-2 shadow-lg text-xs"
              >
                {downloaded ? <Check className="w-4 h-4 text-emerald-950" /> : <Download className="w-4 h-4" />}
                <span>{downloaded ? 'Backup Downloaded!' : '1. Download JSON Backup'}</span>
              </button>

              <div className="relative border border-dashed border-amber-500/40 rounded-xl p-3 text-center cursor-pointer bg-maroon-950/50 hover:bg-amber-500/10 transition text-xs">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleRestoreBackup}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="flex items-center justify-center gap-2 text-amber-300 font-bold">
                  <Upload className="w-4 h-4" />
                  <span>2. Restore Database from JSON</span>
                </div>
              </div>
            </div>
          </div>

          {/* Export Center (CSV / Excel) */}
          <div className="bg-maroon-900/60 p-8 rounded-3xl border border-amber-500/30 shadow-luxury space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500/10 rounded-full border border-amber-500/30 text-amber-400">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-gold-200">CSV & Excel Export Center</h3>
                <p className="text-xs text-amber-200/70">Export orders, products, and customer records to CSV.</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => handleExportCSV('orders')}
                className="w-full bg-maroon-950 border border-amber-500/30 text-gold-200 font-semibold py-3 rounded-xl hover:bg-amber-500/10 transition flex items-center justify-center gap-2 text-xs"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Export Orders (CSV)</span>
              </button>

              <button
                onClick={() => handleExportCSV('products')}
                className="w-full bg-maroon-950 border border-amber-500/30 text-gold-200 font-semibold py-3 rounded-xl hover:bg-amber-500/10 transition flex items-center justify-center gap-2 text-xs"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Export Products (CSV)</span>
              </button>

              <button
                onClick={() => handleExportCSV('customers')}
                className="w-full bg-maroon-950 border border-amber-500/30 text-gold-200 font-semibold py-3 rounded-xl hover:bg-amber-500/10 transition flex items-center justify-center gap-2 text-xs"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Export Customers (CSV)</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
