'use client';

import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Smartphone, Upload, CheckCircle2 } from 'lucide-react';
import { generateUPIDeepLink } from '../../lib/payments/upiProvider';

interface UPIPaymentSectionProps {
  upiId: string;
  payeeName: string;
  totalAmount: number;
  onScreenshotUpload: (urlOrBase64: string) => void;
}

export default function UPIPaymentSection({ upiId, payeeName, totalAmount, onScreenshotUpload }: UPIPaymentSectionProps) {
  const [copied, setCopied] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        onScreenshotUpload(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const deepLink = generateUPIDeepLink(upiId, payeeName, totalAmount, 'AD-TEMP');

  return (
    <div className="bg-maroon-900/60 p-6 rounded-2xl border border-amber-500/30 text-gold-100 space-y-5">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-amber-500/10 rounded-full border border-amber-500/30 text-amber-400">
          <Smartphone className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-base text-gold-200">Direct UPI ID Payment</h3>
          <p className="text-xs text-amber-200/70">Pay via PhonePe, Google Pay, PayTM or any UPI app, then upload payment screenshot.</p>
        </div>
      </div>

      {/* Copy UPI Box */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-amber-300">Official UPI ID:</label>
        <div className="flex items-center bg-maroon-950 border border-amber-500/40 rounded-xl p-2.5">
          <span className="flex-1 font-mono font-bold text-sm text-gold-100 tracking-wider px-2">
            {upiId}
          </span>
          <button
            type="button"
            onClick={handleCopyUPI}
            className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy UPI ID'}</span>
          </button>
        </div>
      </div>

      {/* Direct UPI Pay Link */}
      <div className="pt-1">
        <a
          href={deepLink}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-3 rounded-xl hover:brightness-110 transition flex items-center justify-center gap-2 shadow-lg text-sm"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Open in UPI App (Pay ₹{totalAmount})</span>
        </a>
      </div>

      {/* Screenshot Upload Requirement */}
      <div className="pt-4 border-t border-amber-500/20 space-y-3">
        <label className="block text-xs font-bold text-amber-300">
          Upload Payment Screenshot Proof: <span className="text-red-400">*</span>
        </label>

        <div className="relative border-2 border-dashed border-amber-500/40 hover:border-amber-400 rounded-xl p-4 text-center cursor-pointer bg-maroon-950/50 transition">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center justify-center space-y-2">
            <Upload className="w-8 h-8 text-amber-400" />
            <p className="text-xs font-bold text-gold-200">
              {preview ? 'Click to change screenshot' : 'Upload payment proof screenshot'}
            </p>
            <p className="text-[10px] text-amber-200/60">JPG, PNG, or WebP (Max 10MB)</p>
          </div>
        </div>

        {preview && (
          <div className="flex items-center gap-3 p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-xs text-emerald-300">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>Payment proof uploaded successfully! (Status: Payment Verification Pending)</span>
          </div>
        )}
      </div>
    </div>
  );
}
