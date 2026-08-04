'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { QrCode, Upload, CheckCircle2, Copy, Check } from 'lucide-react';
import { WebsiteSettings } from '../../types';

interface QRPaymentSectionProps {
  settings: WebsiteSettings;
  totalAmount: number;
  onScreenshotUpload: (urlOrBase64: string) => void;
}

export default function QRPaymentSection({ settings, totalAmount, onScreenshotUpload }: QRPaymentSectionProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(settings.upiId);
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

  return (
    <div className="bg-maroon-900/60 p-6 rounded-2xl border border-amber-500/30 text-gold-100 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-amber-500/10 rounded-full border border-amber-500/30 text-amber-400">
          <QrCode className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-base text-gold-200">Official ICICI QR Code & UPI Payment</h3>
          <p className="text-xs text-amber-200/70">Scan the QR code or transfer via UPI, then upload the payment receipt screenshot.</p>
        </div>
      </div>

      {/* QR & Bank Box Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Dynamic Admin QR Display */}
        <div className="flex flex-col items-center bg-maroon-950 p-4 rounded-xl border border-amber-500/30 text-center">
          <p className="text-xs font-bold text-amber-300 mb-2">Scan & Pay (ICICI Official QR)</p>
          <div className="relative w-52 h-64 bg-white p-2 rounded-xl shadow-lg border border-amber-500/30">
            <Image
              src={settings.qrCodeUrl}
              alt="ICICI Payment QR Code"
              fill
              className="object-contain p-1"
            />
          </div>
          <p className="text-sm font-black text-amber-400 mt-3 font-mono">Amount Payable: ₹{totalAmount}</p>
        </div>

        {/* Dynamic Bank Account Details */}
        <div className="space-y-3 bg-maroon-950/80 p-4 rounded-xl border border-amber-500/20 text-xs">
          <p className="font-bold text-amber-300 uppercase tracking-wider text-[11px]">Bank Account Details:</p>
          <div>
            <span className="text-gray-400">Bank Name:</span>
            <p className="font-bold text-gold-100">{settings.bankName}</p>
          </div>
          <div>
            <span className="text-gray-400">Account Holder:</span>
            <p className="font-bold text-gold-100">{settings.accountHolder}</p>
          </div>
          <div>
            <span className="text-gray-400">Account Number:</span>
            <p className="font-mono font-bold text-amber-300 text-sm">{settings.accountNumber}</p>
          </div>
          <div>
            <span className="text-gray-400">IFSC Code:</span>
            <p className="font-mono font-bold text-gold-100">{settings.ifscCode}</p>
          </div>
          
          {/* Copy UPI Button */}
          <div className="pt-2 border-t border-amber-500/20">
            <span className="text-gray-400 block mb-1">Official UPI ID:</span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-amber-300 text-xs truncate">{settings.upiId}</span>
              <button
                type="button"
                onClick={handleCopyUPI}
                className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-3 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 shrink-0 border border-amber-500/30"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy UPI ID'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Screenshot Upload Component */}
      <div className="pt-4 border-t border-amber-500/20 space-y-3">
        <label className="block text-xs font-bold text-amber-300">
          Upload Payment Screenshot: <span className="text-red-400">*</span>
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
              {preview ? 'Click to change screenshot' : 'Click or drop payment screenshot image'}
            </p>
            <p className="text-[10px] text-amber-200/60">JPG, PNG, or WebP (Max 10MB)</p>
          </div>
        </div>

        {/* Preview status */}
        {preview && (
          <div className="flex items-center gap-3 p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-xs text-emerald-300">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>Payment screenshot attached. Order status will be set to "Payment Verification Pending".</span>
          </div>
        )}
      </div>
    </div>
  );
}
