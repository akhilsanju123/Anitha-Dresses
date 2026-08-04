'use client';

import React, { useState } from 'react';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import CentralizedSettingsForm from '../../../components/admin/CentralizedSettingsForm';
import { INITIAL_SETTINGS } from '../../../lib/seedData';
import { WebsiteSettings } from '../../../types';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<WebsiteSettings>(INITIAL_SETTINGS);

  const handleSave = (updated: WebsiteSettings) => {
    setSettings(updated);
  };

  return (
    <div className="flex min-h-screen bg-maroon-950 text-gold-100">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <CentralizedSettingsForm initialSettings={settings} onSave={handleSave} />
      </main>
    </div>
  );
}
