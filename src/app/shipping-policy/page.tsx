import React from 'react';
import TeluguLogo from '../../components/brand/TeluguLogo';
import { constructMetadata } from '../../lib/seo';

export const metadata = constructMetadata({
  title: 'Shipping & Delivery Policy - ANITHA DRESSES',
  description: 'Shipping charges, courier tracking, and estimated delivery times for ANITHA DRESSES.',
});

export default function ShippingPolicyPage() {
  return (
    <div className="py-12 bg-maroon-950 text-gold-100 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <TeluguLogo size="lg" variant="gold" />
          <h1 className="text-3xl font-black text-white font-serif">
            Shipping & Delivery Policy
          </h1>
        </div>

        <div className="bg-maroon-900/60 p-6 sm:p-8 rounded-3xl border border-amber-500/30 space-y-4 text-xs text-gold-200 leading-relaxed shadow-luxury">
          <p>
            We deliver products across Andhra Pradesh, Telangana, and all states in India.
          </p>

          <h3 className="font-bold text-amber-300 text-sm">1. Free Shipping:</h3>
          <p>Free express delivery is automatically applied on all orders worth ₹1,499 and above. Orders below ₹1,499 carry a flat ₹60 delivery fee.</p>

          <h3 className="font-bold text-amber-300 text-sm">2. Delivery Time:</h3>
          <p>Standard delivery takes 2 to 4 business days depending on location.</p>
        </div>
      </div>
    </div>
  );
}
