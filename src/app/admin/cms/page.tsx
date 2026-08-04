'use client';

import React, { useState } from 'react';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import { Save, Check } from 'lucide-react';

export default function AdminCMSPage() {
  const [heroTitle, setHeroTitle] = useState('ANITHA DRESSES - Family Shopping Mall');
  const [heroSubtitle, setHeroSubtitle] = useState('Shop premium boutique fashion collections for Men, Ladies, and Kids at wholesale prices.');
  const [aboutStory, setAboutStory] = useState('ANITHA DRESSES in Ongole is your ultimate family fashion destination for all occasion outfits.');
  const [saved, setSaved] = useState(false);

  const handleSaveCMS = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex min-h-screen bg-maroon-950 text-gold-100">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="flex justify-between items-center border-b border-amber-500/20 pb-4">
          <h1 className="text-2xl font-bold text-white font-serif">Content Management System (CMS)</h1>
          <button
            onClick={handleSaveCMS}
            className="bg-amber-400 text-maroon-950 font-bold px-6 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow"
          >
            {saved ? <Check className="w-4 h-4 text-maroon-950" /> : <Save className="w-4 h-4" />}
            <span>{saved ? 'Saved!' : 'Save Content'}</span>
          </button>
        </div>

        <form onSubmit={handleSaveCMS} className="bg-maroon-900/60 p-8 rounded-3xl border border-amber-500/30 space-y-6 text-xs shadow-luxury">
          <div>
            <label className="block text-amber-300 font-bold mb-1">Homepage Hero Banner Headline:</label>
            <input
              type="text"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className="w-full bg-maroon-950 border border-amber-500/30 rounded-xl p-3 text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-amber-300 font-bold mb-1">Hero Subtitle Description:</label>
            <textarea
              rows={3}
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              className="w-full bg-maroon-950 border border-amber-500/30 rounded-xl p-3 text-white focus:outline-none"
            ></textarea>
          </div>

          <div>
            <label className="block text-amber-300 font-bold mb-1">About Story Description:</label>
            <textarea
              rows={4}
              value={aboutStory}
              onChange={(e) => setAboutStory(e.target.value)}
              className="w-full bg-maroon-950 border border-amber-500/30 rounded-xl p-3 text-white focus:outline-none"
            ></textarea>
          </div>
        </form>
      </main>
    </div>
  );
}
