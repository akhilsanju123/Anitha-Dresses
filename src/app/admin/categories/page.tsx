'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import { Plus, Trash2, Grid } from 'lucide-react';
import { Category } from '../../../types';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [newSubName, setNewSubName] = useState('');
  const [selectedCatId, setSelectedCatId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('anitha_admin_token') : '';
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/categories', { cache: 'no-store' });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setCategories(json.data);
        if (json.data.length > 0 && !selectedCatId) {
          setSelectedCatId(json.data[0].id);
        }
      }
    } catch (e) {
      console.warn("Error fetching categories from MongoDB:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const saveCategoriesToDb = async (updatedCategories: Category[]) => {
    setLoading(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedCategories),
      });
      const json = await res.json();
      if (json.success) {
        await fetchCategories();
      } else {
        alert(json.message || "Failed to persist category update to MongoDB");
      }
    } catch (e) {
      alert("Error saving category update to MongoDB. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMainCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const catNameUpper = newCatName.trim().toUpperCase();
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name: catNameUpper,
      slug: catNameUpper.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80",
      description: `${catNameUpper} collection at ANITHA DRESSES.`,
      subcategories: [],
      itemCount: 0,
    };
    await saveCategoriesToDb([...categories, newCat]);
    setNewCatName('');
  };

  const handleAddSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetCatId = selectedCatId || categories[0]?.id;
    if (!newSubName.trim() || !targetCatId) return;
    
    const subTrimmed = newSubName.trim();
    const updated = categories.map(cat => {
      if (cat.id === targetCatId) {
        if (!cat.subcategories.includes(subTrimmed)) {
          return { ...cat, subcategories: [...cat.subcategories, subTrimmed] };
        }
      }
      return cat;
    });

    await saveCategoriesToDb(updated);
    setNewSubName('');
  };

  const handleDeleteMainCategory = async (id: string) => {
    if (confirm("Are you sure you want to delete this category from MongoDB?")) {
      setLoading(true);
      try {
        const res = await fetch(`/api/categories/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
        });
        const json = await res.json();
        if (json.success) {
          await fetchCategories();
        } else {
          alert(json.message || "Failed to delete category");
        }
      } catch (err) {
        alert("Error deleting category from MongoDB.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteSubcategory = async (catId: string, subName: string) => {
    const updated = categories.map(cat => {
      if (cat.id === catId) {
        return { ...cat, subcategories: cat.subcategories.filter(s => s !== subName) };
      }
      return cat;
    });
    await saveCategoriesToDb(updated);
  };

  return (
    <div className="flex min-h-screen bg-maroon-950 text-gold-100">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-8 overflow-y-auto">
        <h1 className="text-2xl font-bold text-white font-serif border-b border-amber-500/20 pb-4">
          Categories & Subcategories Manager (MongoDB Persistence)
        </h1>

        {/* Create Forms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <form onSubmit={handleAddMainCategory} className="bg-maroon-900/60 p-6 rounded-2xl border border-amber-500/30 space-y-4 shadow-luxury">
            <h3 className="font-bold text-sm text-amber-300">Add Main Department Category</h3>
            <div>
              <label className="block text-xs font-bold text-gold-200 mb-1">Department Name (e.g. MEN, KIDS, INNERS):</label>
              <input
                type="text"
                required
                placeholder="e.g. INNERS"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="w-full bg-maroon-950 border border-amber-500/30 rounded-xl p-3 text-xs text-white"
              />
            </div>
            <button type="submit" disabled={loading} className="bg-amber-400 text-maroon-950 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1 shadow disabled:opacity-50">
              <Plus className="w-4 h-4" />
              <span>{loading ? 'Saving to MongoDB...' : 'Add Department Category'}</span>
            </button>
          </form>

          <form onSubmit={handleAddSubcategory} className="bg-maroon-900/60 p-6 rounded-2xl border border-amber-500/30 space-y-4 shadow-luxury">
            <h3 className="font-bold text-sm text-amber-300">Add Subcategory</h3>
            <div>
              <label className="block text-xs font-bold text-gold-200 mb-1">Select Parent Department:</label>
              <select
                value={selectedCatId || categories[0]?.id || ''}
                onChange={(e) => setSelectedCatId(e.target.value)}
                className="w-full bg-maroon-950 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-300 font-bold focus:outline-none"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gold-200 mb-1">Subcategory Name (e.g. Inners, Vests):</label>
              <input
                type="text"
                required
                placeholder="e.g. Inners"
                value={newSubName}
                onChange={(e) => setNewSubName(e.target.value)}
                className="w-full bg-maroon-950 border border-amber-500/30 rounded-xl p-3 text-xs text-white"
              />
            </div>

            <button type="submit" disabled={loading} className="bg-amber-400 text-maroon-950 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1 shadow disabled:opacity-50">
              <Plus className="w-4 h-4" />
              <span>{loading ? 'Saving to MongoDB...' : 'Add Subcategory'}</span>
            </button>
          </form>
        </div>

        {/* Existing Categories Tree */}
        <div className="space-y-6">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-maroon-900/60 p-6 rounded-3xl border border-amber-500/30 space-y-4 shadow-luxury">
              <div className="flex justify-between items-center border-b border-amber-500/20 pb-3">
                <div className="flex items-center gap-3">
                  <Grid className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-base text-white font-serif">{cat.name}</h3>
                </div>

                <button onClick={() => handleDeleteMainCategory(cat.id)} className="text-red-400 hover:text-red-300 p-2">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {cat.subcategories.map((sub, sIdx) => (
                  <span key={sIdx} className="bg-maroon-950 border border-amber-500/30 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-300 flex items-center gap-2">
                    <span>{sub}</span>
                    <button onClick={() => handleDeleteSubcategory(cat.id, sub)} className="text-red-400 hover:text-red-300">
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
