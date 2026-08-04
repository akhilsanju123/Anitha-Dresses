'use client';

import React from 'react';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import { Ban, ShieldAlert } from 'lucide-react';

export default function AdminReturnsPage() {
  return (
    <div className="flex min-h-screen bg-maroon-950 text-gold-100">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <h1 className="text-2xl font-bold text-white font-serif border-b border-amber-500/20 pb-4">
          Returns & Exchanges (Disabled per Store Policy)
        </h1>

        <div className="bg-gradient-to-r from-red-950 via-maroon-900 to-red-950 border border-red-500/40 p-8 rounded-3xl space-y-4 shadow-luxury max-w-2xl">
          <div className="flex items-center gap-3 text-red-400">
            <Ban className="w-8 h-8 shrink-0" />
            <div>
              <h3 className="font-extrabold text-white text-base">STORE POLICY ENFORCEMENT ACTIVE</h3>
              <p className="text-xs text-amber-200 font-mono">NO CANCELLATION | NO RETURN | NO EXCHANGE</p>
            </div>
          </div>
          <p className="text-xs text-amber-100 font-serif leading-relaxed">
            As per ANITHA DRESSES official store policy, order cancellations and product returns are strictly disabled. Returns management actions are deactivated.
          </p>
        </div>
      </main>
    </div>
  );
}
