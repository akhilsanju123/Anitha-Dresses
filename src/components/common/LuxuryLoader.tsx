import React from 'react';
import TeluguLogo from '../brand/TeluguLogo';

export default function LuxuryLoader() {
  return (
    <div className="fixed inset-0 z-50 bg-maroon-950 flex flex-col items-center justify-center space-y-6">
      <div className="relative">
        <TeluguLogo size="xl" variant="gold" />
        <div className="absolute -inset-4 border-2 border-amber-500/30 rounded-full animate-ping opacity-30"></div>
      </div>
      <p className="text-amber-300 font-serif text-sm tracking-widest uppercase animate-pulse">
        Loading ANITHA DRESSES...
      </p>
    </div>
  );
}
