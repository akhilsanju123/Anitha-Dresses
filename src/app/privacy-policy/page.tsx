import React from 'react';
import TeluguLogo from '../../components/brand/TeluguLogo';
import { constructMetadata } from '../../lib/seo';

export const metadata = constructMetadata({
  title: 'Privacy Policy - ANITHA DRESSES',
  description: 'Privacy policy and data protection terms for ANITHA DRESSES.',
});

export default function PrivacyPolicyPage() {
  return (
    <div className="py-12 bg-maroon-950 text-gold-100 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <TeluguLogo size="lg" variant="gold" />
          <h1 className="text-3xl font-black text-white font-serif">
            Privacy Policy
          </h1>
        </div>

        <div className="bg-maroon-900/60 p-6 sm:p-8 rounded-3xl border border-amber-500/30 space-y-4 text-xs text-gold-200 leading-relaxed shadow-luxury">
          <p>
            ANITHA DRESSES respects your privacy. All customer data collected during checkout is stored securely for processing and delivering your orders.
          </p>

          <h3 className="font-bold text-amber-300 text-sm">1. Data Collection:</h3>
          <p>We collect customer name, phone number, shipping address, and payment screenshot proof for order verification and shipping purposes.</p>

          <h3 className="font-bold text-amber-300 text-sm">2. Data Security:</h3>
          <p>Your information is never sold, shared, or leased to unauthorized third parties.</p>
        </div>
      </div>
    </div>
  );
}
