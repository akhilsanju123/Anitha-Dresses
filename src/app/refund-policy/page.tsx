import React from 'react';
import TeluguLogo from '../../components/brand/TeluguLogo';
import { Ban, ShieldAlert } from 'lucide-react';
import { constructMetadata } from '../../lib/seo';

export const metadata = constructMetadata({
  title: 'Refund & Cancellation Policy - ANITHA DRESSES',
  description: 'ANITHA DRESSES Store Policy: No Cancellation, No Returns, No Exchange after order placement.',
});

export default function RefundPolicyPage() {
  return (
    <div className="py-12 bg-maroon-950 text-gold-100 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <TeluguLogo size="lg" variant="gold" />
          <h1 className="text-3xl font-black text-white font-serif">
            Refund, Cancellation & Exchange Policy
          </h1>
          <p className="text-xs text-amber-200/80 font-serif">ANITHA DRESSES (Family Shopping Mall, Ongole)</p>
        </div>

        {/* Policy Box */}
        <div className="bg-gradient-to-r from-red-950 via-maroon-900 to-red-950 border border-red-500/40 p-6 rounded-3xl space-y-4 shadow-luxury">
          <div className="flex items-center gap-3 text-red-400">
            <Ban className="w-8 h-8 shrink-0" />
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-wider">STRICT STORE POLICY</h2>
              <p className="text-xs text-amber-200 font-mono">NO CANCELLATION | NO RETURN | NO EXCHANGE</p>
            </div>
          </div>
          <p className="text-xs text-amber-100 font-serif leading-relaxed">
            "Orders cannot be cancelled, returned, or exchanged after they are placed. Please verify your selected sizes, colors, and items carefully before confirming your purchase."
          </p>
        </div>

        {/* Policy Points */}
        <div className="bg-maroon-900/60 p-6 sm:p-8 rounded-3xl border border-amber-500/30 space-y-6 text-xs text-gold-200 leading-relaxed shadow-luxury">
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-amber-300 border-b border-amber-500/20 pb-2">1. No Order Cancellation</h3>
            <p>Once an order is created and payment details are submitted, the order is finalized and sent directly for verification and processing. Orders cannot be cancelled under any circumstances.</p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-amber-300 border-b border-amber-500/20 pb-2">2. No Return / No Exchange</h3>
            <p>Due to hygiene and quality standards at ANITHA DRESSES, we do not accept returns or offer size/color exchanges once items are dispatched.</p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-amber-300 border-b border-amber-500/20 pb-2">3. Defect Inspection</h3>
            <p>All items undergo strict quality inspection before dispatch. In the rare event of a transit defect, please contact our support team on WhatsApp at +91 8977969989 with an unboxing video within 24 hours of delivery.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
