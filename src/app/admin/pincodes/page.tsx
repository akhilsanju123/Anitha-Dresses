'use client';

import React, { useState } from 'react';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import { INITIAL_PINCODES } from '../../../lib/seedData';
import { Plus, Trash2, MapPin } from 'lucide-react';
import { ServiceablePincode } from '../../../types';

export default function AdminPincodesPage() {
  const [pincodes, setPincodes] = useState<ServiceablePincode[]>(INITIAL_PINCODES);
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('');
  const [days, setDays] = useState('2-3 Days');

  const handleAddPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || !city) return;

    const newPin: ServiceablePincode = {
      pincode,
      city,
      state: 'Andhra Pradesh',
      estimatedDays: days,
      additionalDeliveryFee: 0,
      active: true,
    };

    setPincodes([newPin, ...pincodes]);
    setPincode('');
    setCity('');
  };

  const handleDeletePincode = (pincodeVal: string) => {
    setPincodes(pincodes.filter(p => p.pincode !== pincodeVal));
  };

  return (
    <div className="flex min-h-screen bg-maroon-950 text-gold-100">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <h1 className="text-2xl font-bold text-white font-serif border-b border-amber-500/20 pb-4">
          Pincode Delivery Serviceability Manager
        </h1>

        <form onSubmit={handleAddPincode} className="bg-maroon-900/60 p-6 rounded-2xl border border-amber-500/30 flex flex-wrap gap-4 items-end shadow-luxury">
          <div className="w-36">
            <label className="block text-xs font-bold text-amber-300 mb-1">Pincode:</label>
            <input
              type="text"
              required
              maxLength={6}
              placeholder="e.g. 523001"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              className="w-full bg-maroon-950 border border-amber-500/30 rounded-xl p-2.5 text-xs text-white font-mono"
            />
          </div>

          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs font-bold text-amber-300 mb-1">City Name:</label>
            <input
              type="text"
              required
              placeholder="e.g. Ongole"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-maroon-950 border border-amber-500/30 rounded-xl p-2.5 text-xs text-white"
            />
          </div>

          <div className="w-36">
            <label className="block text-xs font-bold text-amber-300 mb-1">Est. Days:</label>
            <input
              type="text"
              required
              value={days}
              onChange={(e) => setDays(e.target.value)}
              className="w-full bg-maroon-950 border border-amber-500/30 rounded-xl p-2.5 text-xs text-white"
            />
          </div>

          <button type="submit" className="bg-amber-400 text-maroon-950 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1 shadow">
            <Plus className="w-4 h-4" />
            <span>Add Pincode</span>
          </button>
        </form>

        <div className="bg-maroon-900/60 rounded-2xl border border-amber-500/30 overflow-hidden shadow-luxury">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-maroon-950 text-amber-300 border-b border-amber-500/20 font-bold">
                <th className="p-3.5">Pincode</th>
                <th className="p-3.5">City & State</th>
                <th className="p-3.5">Est. Delivery</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-500/10 text-gold-200">
              {pincodes.map((pin) => (
                <tr key={pin.pincode}>
                  <td className="p-3.5 font-mono font-bold text-amber-300">{pin.pincode}</td>
                  <td className="p-3.5 font-bold text-white">{pin.city}, {pin.state}</td>
                  <td className="p-3.5 text-emerald-400 font-semibold">{pin.estimatedDays}</td>
                  <td className="p-3.5 text-right">
                    <button onClick={() => handleDeletePincode(pin.pincode)} className="text-red-400 hover:text-red-300">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
