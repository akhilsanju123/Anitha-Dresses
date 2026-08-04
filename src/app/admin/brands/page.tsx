'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import { INITIAL_BRANDS } from '../../../lib/seedData';
import { Brand } from '../../../types';
import { Plus, Trash2 } from 'lucide-react';

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>(INITIAL_BRANDS);
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandDesc, setNewBrandDesc] = useState('');

  const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('anitha_admin_token') : '';
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
  };

  const fetchBrands = async () => {
    try {
      const res = await fetch('/api/brands');
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        setBrands(json.data);
      }
    } catch (e) {
      console.warn("Using local brands state");
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleAddBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName.trim()) return;

    const b: Brand = {
      id: `brand-${Date.now()}`,
      name: newBrandName.trim(),
      description: newBrandDesc.trim() || 'Official Brand Apparel',
    };

    setNewBrandName('');
    setNewBrandDesc('');

    try {
      const res = await fetch('/api/brands', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(b),
      });
      const json = await res.json();
      if (json.success) {
        fetchBrands();
      } else {
        setBrands([...brands, b]);
      }
    } catch (e) {
      setBrands([...brands, b]);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this brand?")) {
      try {
        await fetch(`/api/brands/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
        });
        fetchBrands();
      } catch (e) {
        setBrands(brands.filter(b => b.id !== id));
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-maroon-950 text-gold-100">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="border-b border-amber-500/20 pb-4">
          <h1 className="text-2xl font-bold text-white font-serif">Brand Management</h1>
          <p className="text-xs text-amber-200/70">Add and manage brand partners (Jockey, Prisma, Daisy Dee, Fly Birds, etc.)</p>
        </div>

        {/* Add Brand Form */}
        <form onSubmit={handleAddBrand} className="bg-maroon-900/60 p-4 rounded-2xl border border-amber-500/30 flex flex-col sm:flex-row gap-3 max-w-xl text-xs shadow-luxury">
          <input
            type="text"
            placeholder="Brand Name (e.g. Jockey, Prisma)"
            value={newBrandName}
            onChange={(e) => setNewBrandName(e.target.value)}
            className="flex-1 bg-maroon-950 border border-amber-500/30 rounded-xl p-2.5 text-white focus:outline-none"
          />
          <input
            type="text"
            placeholder="Brand Description..."
            value={newBrandDesc}
            onChange={(e) => setNewBrandDesc(e.target.value)}
            className="flex-1 bg-maroon-950 border border-amber-500/30 rounded-xl p-2.5 text-white focus:outline-none"
          />
          <button type="submit" className="bg-amber-400 text-maroon-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1 shadow shrink-0">
            <Plus className="w-4 h-4" />
            <span>Add Brand</span>
          </button>
        </form>

        {/* Brands Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {brands.map((b) => (
            <div key={b.id} className="bg-maroon-900/60 p-4 rounded-2xl border border-amber-500/20 flex justify-between items-center text-xs shadow">
              <div>
                <h4 className="font-bold text-white text-sm">{b.name}</h4>
                <p className="text-[11px] text-amber-200/70">{b.description}</p>
              </div>
              <button onClick={() => handleDelete(b.id)} className="text-red-400 hover:text-red-300 p-1.5 bg-maroon-950 rounded-lg border border-red-500/30">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
