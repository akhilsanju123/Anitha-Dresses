'use client';

import React, { useState } from 'react';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import Image from 'next/image';
import { INITIAL_SETTINGS } from '../../../lib/seedData';
import { Plus, Trash2, Upload } from 'lucide-react';

export default function AdminBannersPage() {
  const [heroDesktop, setHeroDesktop] = useState<string[]>(INITIAL_SETTINGS.banners?.heroDesktop || []);
  const [uploading, setUploading] = useState(false);

  const saveBannersToSettings = async (updatedBanners: string[]) => {
    setHeroDesktop(updatedBanners);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...INITIAL_SETTINGS,
          banners: { ...(INITIAL_SETTINGS.banners || {}), heroDesktop: updatedBanners },
        }),
      });
    } catch (e) {
      console.warn("Failed to persist settings");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64, folder: 'anitha_banners' }),
        });
        const json = await res.json();
        const url = json.success && json.data?.url ? json.data.url : base64;
        saveBannersToSettings([...heroDesktop, url]);
      } catch (err) {
        saveBannersToSettings([...heroDesktop, base64]);
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveBanner = (index: number) => {
    if (confirm("Remove this hero banner image?")) {
      saveBannersToSettings(heroDesktop.filter((_, idx) => idx !== index));
    }
  };

  return (
    <div className="flex min-h-screen bg-maroon-950 text-gold-100">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="flex justify-between items-center border-b border-amber-500/20 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-white font-serif">Homepage Banner Manager</h1>
            <p className="text-xs text-amber-200/70">Upload family fashion banners directly from your computer.</p>
          </div>

          <label className="bg-gradient-to-r from-amber-400 to-amber-600 text-maroon-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow">
            <Upload className="w-4 h-4" />
            <span>{uploading ? 'Uploading...' : 'Upload New Banner'}</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading} className="hidden" />
          </label>
        </div>

        {/* Banners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {heroDesktop.map((img, i) => (
            <div key={i} className="relative h-64 rounded-2xl overflow-hidden border border-amber-500/30 group bg-maroon-900 shadow-luxury">
              <Image src={img} alt={`Hero Banner ${i}`} fill className="object-cover" />
              <button
                onClick={() => handleRemoveBanner(i)}
                className="absolute top-3 right-3 p-2.5 bg-red-600 text-white rounded-full opacity-90 hover:opacity-100 transition shadow"
                title="Delete Banner"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
