import React from 'react';
import TeluguLogo from '../../components/brand/TeluguLogo';
import { Ban } from 'lucide-react';
import { constructMetadata } from '../../lib/seo';

export const metadata = constructMetadata({
  title: 'Terms & Conditions - ANITHA DRESSES',
  description: 'Terms and conditions for shopping at ANITHA DRESSES in Ongole, Andhra Pradesh.',
});

export default function TermsPage() {
  return (
    <div className="py-12 bg-maroon-950 text-gold-100 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <TeluguLogo size="lg" variant="gold" />
          <h1 className="text-3xl font-black text-white font-serif">
            Terms & Conditions
          </h1>
          <p className="text-xs text-amber-200/80 font-serif">ANITHA DRESSES (Family Shopping Mall, Ongole)</p>
        </div>

        {/* Policy Box */}
        <div className="bg-gradient-to-r from-red-950 via-maroon-900 to-red-950 border border-red-500/40 p-6 rounded-3xl space-y-4 shadow-luxury">
          <div className="flex items-center gap-3 text-red-400">
            <Ban className="w-8 h-8 shrink-0" />
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-wider">STORE ORDER POLICY</h2>
              <p className="text-xs text-amber-200 font-mono">NO CANCELLATION | NO RETURN | NO EXCHANGE</p>
            </div>
          </div>
          <p className="text-xs text-amber-100 font-serif leading-relaxed">
            "By accessing or shopping on ANITHA DRESSES, you agree to comply with our store policies."
          </p>
        </div>

        <div className="bg-maroon-900/60 p-6 sm:p-8 rounded-3xl border border-amber-500/30 space-y-6 text-xs text-gold-200 leading-relaxed shadow-luxury">
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-amber-300 border-b border-amber-500/20 pb-2">1. General Terms</h3>
            <p>ANITHA DRESSES provides family apparel at wholesale boutique rates. All orders are subject to item availability and payment verification.</p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-amber-300 border-b border-amber-500/20 pb-2">2. Payment & Verification</h3>
            <p>We support payments via ICICI QR Scanner and official UPI Bank Transfer. Orders enter 'Payment Verification Pending' status until payment proof is verified by the store admin.</p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-amber-300 border-b border-amber-500/20 pb-2">3. Shipping & Delivery</h3>
            <p>Express courier delivery is provided across Andhra Pradesh, Telangana, and all major regions in India within 2-5 business days.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
