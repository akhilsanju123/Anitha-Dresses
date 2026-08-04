'use client';

import React, { useState } from 'react';
import { Product } from '../../types';
import { Share2, Copy, Check, X, MessageCircle } from 'lucide-react';

interface ShareModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareModal({ product, isOpen, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : `https://anithadresses.com/products/${product.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappMessage = encodeURIComponent(`Check out this product from ANITHA DRESSES: ${product.name} - ₹${product.offerPrice}\n${currentUrl}`);
  const whatsappShareUrl = `https://wa.me/?text=${whatsappMessage}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative w-full max-w-md bg-maroon-950 text-gold-100 rounded-3xl border border-amber-500/40 p-6 space-y-4 shadow-2xl z-10">
        <div className="flex justify-between items-center border-b border-amber-500/20 pb-3">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
            <Share2 className="w-4 h-4" />
            <span>Share Product</span>
          </div>
          <button onClick={onClose} className="text-gold-300 hover:text-amber-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 pt-2">
          <a
            href={whatsappShareUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Share via WhatsApp</span>
          </a>

          <div className="flex items-center gap-2 bg-maroon-900 border border-amber-500/30 rounded-xl p-2 text-xs">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="flex-1 bg-transparent text-amber-200 font-mono text-[11px] outline-none truncate"
            />
            <button
              onClick={handleCopy}
              className="bg-amber-400 text-maroon-950 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
