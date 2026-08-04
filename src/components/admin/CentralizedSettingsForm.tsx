'use client';

import React, { useState } from 'react';
import { WebsiteSettings } from '../../types';
import { Save, Check, QrCode, Building, Upload } from 'lucide-react';

interface CentralizedSettingsFormProps {
  initialSettings: WebsiteSettings;
  onSave: (updated: WebsiteSettings) => void;
}

export default function CentralizedSettingsForm({ initialSettings, onSave }: CentralizedSettingsFormProps) {
  const [form, setForm] = useState<WebsiteSettings>({ ...initialSettings });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingQr, setUploadingQr] = useState(false);

  const handleQrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingQr(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64, folder: 'anitha_payment_qr' }),
        });
        const json = await res.json();
        const url = json.success && json.data?.url ? json.data.url : base64;
        setForm(prev => ({ ...prev, qrCodeUrl: url }));
      } catch (err) {
        setForm(prev => ({ ...prev, qrCodeUrl: base64 }));
      } finally {
        setUploadingQr(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const json = await res.json();
      if (json.success && json.data) {
        onSave(json.data);
      } else {
        onSave(form);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      onSave(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-maroon-900/60 p-8 rounded-2xl border border-amber-500/30 shadow-luxury text-gold-100">
      
      {/* Form Header */}
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white font-serif">Centralized Payment & Store Settings</h2>
          <p className="text-xs text-amber-200/70">Update UPI ID, ICICI QR Code, Bank Account, and Store Details in real time.</p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-amber-400 to-amber-600 text-maroon-950 font-bold px-6 py-2.5 rounded-xl hover:brightness-110 transition flex items-center gap-2 text-xs shadow-lg disabled:opacity-50"
        >
          {saved ? <Check className="w-4 h-4 text-emerald-950" /> : <Save className="w-4 h-4" />}
          <span>{loading ? 'Saving...' : saved ? 'Saved!' : 'Save All Settings'}</span>
        </button>
      </div>

      {/* Payment Settings Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2 border-b border-amber-500/20 pb-2">
          <QrCode className="w-4 h-4" />
          <span>1. Official UPI & QR Code Settings</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-amber-200 font-semibold mb-1">Official Store UPI ID:</label>
            <input
              type="text"
              value={form.upiId}
              onChange={(e) => setForm({ ...form, upiId: e.target.value })}
              className="w-full bg-maroon-950 border border-amber-500/30 rounded-xl p-2.5 text-white font-mono focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-amber-200 font-semibold mb-1">QR Code Image Upload:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={form.qrCodeUrl}
                onChange={(e) => setForm({ ...form, qrCodeUrl: e.target.value })}
                className="flex-1 bg-maroon-950 border border-amber-500/30 rounded-xl p-2.5 text-white text-xs focus:outline-none"
              />
              <label className="bg-amber-400 text-maroon-950 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploadingQr ? 'Uploading...' : 'Upload QR'}</span>
                <input type="file" accept="image/*" onChange={handleQrUpload} disabled={uploadingQr} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* Bank Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
          <div>
            <label className="block text-amber-200 font-semibold mb-1">Bank Name:</label>
            <input
              type="text"
              value={form.bankName}
              onChange={(e) => setForm({ ...form, bankName: e.target.value })}
              className="w-full bg-maroon-950 border border-amber-500/30 rounded-xl p-2.5 text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-amber-200 font-semibold mb-1">Account Holder Name:</label>
            <input
              type="text"
              value={form.accountHolder}
              onChange={(e) => setForm({ ...form, accountHolder: e.target.value })}
              className="w-full bg-maroon-950 border border-amber-500/30 rounded-xl p-2.5 text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-amber-200 font-semibold mb-1">Account Number:</label>
            <input
              type="text"
              value={form.accountNumber}
              onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
              className="w-full bg-maroon-950 border border-amber-500/30 rounded-xl p-2.5 text-white font-mono focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-amber-200 font-semibold mb-1">IFSC Code:</label>
            <input
              type="text"
              value={form.ifscCode}
              onChange={(e) => setForm({ ...form, ifscCode: e.target.value })}
              className="w-full bg-maroon-950 border border-amber-500/30 rounded-xl p-2.5 text-white font-mono uppercase focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-amber-200 font-semibold mb-1">Branch Name:</label>
            <input
              type="text"
              value={form.branchName}
              onChange={(e) => setForm({ ...form, branchName: e.target.value })}
              className="w-full bg-maroon-950 border border-amber-500/30 rounded-xl p-2.5 text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-amber-200 font-semibold mb-1">GSTIN Number:</label>
            <input
              type="text"
              value={form.gstNumber}
              onChange={(e) => setForm({ ...form, gstNumber: e.target.value })}
              className="w-full bg-maroon-950 border border-amber-500/30 rounded-xl p-2.5 text-white font-mono uppercase focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Store Contact & Shipping Settings Section */}
      <div className="space-y-4 pt-4 border-t border-amber-500/20">
        <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2 border-b border-amber-500/20 pb-2">
          <Building className="w-4 h-4" />
          <span>2. Store Contact & Shipping Rates</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-amber-200 font-semibold mb-1">Store Phone Number:</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full bg-maroon-950 border border-amber-500/30 rounded-xl p-2.5 text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-amber-200 font-semibold mb-1">WhatsApp Support Number:</label>
            <input
              type="text"
              value={form.whatsappNumber}
              onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
              className="w-full bg-maroon-950 border border-amber-500/30 rounded-xl p-2.5 text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-amber-200 font-semibold mb-1">Support Email:</label>
            <input
              type="text"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-maroon-950 border border-amber-500/30 rounded-xl p-2.5 text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-amber-200 font-semibold mb-1">Default Shipping Fee (₹):</label>
            <input
              type="number"
              value={form.defaultShippingCharge}
              onChange={(e) => setForm({ ...form, defaultShippingCharge: Number(e.target.value) })}
              className="w-full bg-maroon-950 border border-amber-500/30 rounded-xl p-2.5 text-white font-mono focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-amber-200 font-semibold mb-1">Free Shipping Threshold (₹):</label>
            <input
              type="number"
              value={form.freeShippingThreshold}
              onChange={(e) => setForm({ ...form, freeShippingThreshold: Number(e.target.value) })}
              className="w-full bg-maroon-950 border border-amber-500/30 rounded-xl p-2.5 text-white font-mono focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-amber-200 font-semibold mb-1">Low Stock Threshold:</label>
            <input
              type="number"
              value={form.lowStockAlertThreshold}
              onChange={(e) => setForm({ ...form, lowStockAlertThreshold: Number(e.target.value) })}
              className="w-full bg-maroon-950 border border-amber-500/30 rounded-xl p-2.5 text-white font-mono focus:outline-none"
            />
          </div>
        </div>

        <div className="text-xs">
          <label className="block text-amber-200 font-semibold mb-1">Physical Store Address:</label>
          <input
            type="text"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full bg-maroon-950 border border-amber-500/30 rounded-xl p-2.5 text-white focus:outline-none"
          />
        </div>
      </div>
    </form>
  );
}
