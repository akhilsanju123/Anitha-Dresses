import React from 'react';
import { Sparkles } from 'lucide-react';

interface LuxuryBadgeProps {
  text: string;
  variant?: 'gold' | 'maroon' | 'glass';
}

export default function LuxuryBadge({ text, variant = 'gold' }: LuxuryBadgeProps) {
  const styles = {
    gold: 'bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-600/20 border-amber-500/40 text-amber-300',
    maroon: 'bg-maroon-900/90 border-amber-500/30 text-gold-200',
    glass: 'bg-white/10 backdrop-blur-md border-white/20 text-white',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase border shadow-sm ${styles[variant]}`}>
      <Sparkles className="w-3 h-3 text-amber-400" />
      {text}
    </span>
  );
}
