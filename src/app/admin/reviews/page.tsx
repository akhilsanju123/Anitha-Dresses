'use client';

import React, { useState } from 'react';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import { Star, CheckCircle2, XCircle } from 'lucide-react';
import { ProductReview } from '../../../types';

const INITIAL_REVIEWS: ProductReview[] = [
  {
    id: 'rev-101',
    productId: 'prod-l1',
    customerName: 'Radha Devi (Ongole)',
    rating: 5,
    comment: 'The Anarkali long dress fabric and zari work are amazing! High quality finish and fast order confirmation.',
    createdAt: '2026-07-28',
    approved: true,
  },
  {
    id: 'rev-102',
    productId: 'prod-m1',
    customerName: 'Saritha P. (Vijayawada)',
    rating: 5,
    comment: 'Great fitting and vibrant color. Delivered securely to Vijayawada.',
    createdAt: '2026-07-29',
    approved: false,
  }
];

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ProductReview[]>(INITIAL_REVIEWS);

  const toggleApproval = (id: string) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, approved: !r.approved } : r));
  };

  return (
    <div className="flex min-h-screen bg-maroon-950 text-gold-100">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <h1 className="text-2xl font-bold text-white font-serif border-b border-amber-500/20 pb-4">
          Product Reviews Approval Queue
        </h1>

        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="bg-maroon-900/60 p-6 rounded-2xl border border-amber-500/30 flex justify-between items-center shadow-luxury">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-white text-sm font-serif">{r.customerName}</span>
                  <div className="flex gap-1 text-amber-400">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gold-200">{r.comment}</p>
                <p className="text-[10px] text-gray-400 font-mono">Submitted on: {r.createdAt}</p>
              </div>

              <button
                onClick={() => toggleApproval(r.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                  r.approved
                    ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                    : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30'
                }`}
              >
                {r.approved ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                <span>{r.approved ? 'Approved' : 'Pending Approval'}</span>
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
