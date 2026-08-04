'use client';

import React, { useState } from 'react';
import { Star, CheckCircle2, MessageSquare } from 'lucide-react';
import { ProductReview } from '../../types';

interface ProductReviewsProps {
  productId: string;
}

const MOCK_REVIEWS: ProductReview[] = [
  {
    id: 'rev-1',
    productId: 'prod-l1',
    customerName: 'Radha Devi (Ongole)',
    rating: 5,
    comment: 'The Anarkali long dress fabric and zari work are amazing! High quality finish and fast order confirmation.',
    createdAt: '2026-07-28',
    approved: true,
  },
  {
    id: 'rev-2',
    productId: 'prod-l1',
    customerName: 'Saritha P.',
    rating: 5,
    comment: 'Great fitting and vibrant color. Delivered securely to Vijayawada.',
    createdAt: '2026-07-29',
    approved: true,
  }
];

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<ProductReview[]>(MOCK_REVIEWS);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !comment) return;

    const newRev: ProductReview = {
      id: `rev-${Date.now()}`,
      productId,
      customerName: name,
      rating,
      comment,
      createdAt: new Date().toISOString().split('T')[0],
      approved: true,
    };

    setReviews([newRev, ...reviews]);
    setName('');
    setComment('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="space-y-8 pt-8 border-t border-amber-500/20 text-gold-100">
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
        <div>
          <h3 className="text-xl font-bold text-white font-serif">Customer Reviews</h3>
          <p className="text-xs text-amber-200/70">Verified customer feedback for this product.</p>
        </div>
      </div>

      {/* Review List */}
      <div className="space-y-4">
        {reviews.map((rev) => (
          <div key={rev.id} className="bg-maroon-900/60 p-4 rounded-2xl border border-amber-500/20 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-white font-serif">{rev.customerName}</span>
              <span className="text-gray-400 font-mono text-[10px]">{rev.createdAt}</span>
            </div>
            <div className="flex gap-1 text-amber-400">
              {[...Array(rev.rating)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-gold-200 font-serif">{rev.comment}</p>
          </div>
        ))}
      </div>

      {/* Add Review Form */}
      <form onSubmit={handleSubmit} className="bg-maroon-950 p-6 rounded-2xl border border-amber-500/30 space-y-4 text-xs">
        <h4 className="text-sm font-bold text-amber-300">Write a Review:</h4>

        {submitted && (
          <div className="p-3 bg-emerald-950 text-emerald-300 rounded-xl border border-emerald-500/30 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Thank you! Your review has been published.</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gold-200 font-semibold mb-1">Your Name:</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-maroon-900 border border-amber-500/30 rounded-xl p-2.5 text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gold-200 font-semibold mb-1">Rating:</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full bg-maroon-900 border border-amber-500/30 rounded-xl p-2.5 text-amber-300 font-bold focus:outline-none"
            >
              <option value={5}>5 Stars - Excellent</option>
              <option value={4}>4 Stars - Very Good</option>
              <option value={3}>3 Stars - Good</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-gold-200 font-semibold mb-1">Review Comments:</label>
          <textarea
            rows={3}
            required
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full bg-maroon-900 border border-amber-500/30 rounded-xl p-2.5 text-white focus:outline-none"
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-amber-400 text-maroon-950 font-bold px-6 py-2.5 rounded-xl text-xs shadow-lg"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
}
