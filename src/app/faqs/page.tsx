import React from 'react';
import TeluguLogo from '../../components/brand/TeluguLogo';
import { constructMetadata } from '../../lib/seo';

export const metadata = constructMetadata({
  title: 'Frequently Asked Questions (FAQs) - ANITHA DRESSES',
  description: 'Frequently asked questions about payment methods, shipping, delivery times, and order policies.',
});

const FAQS = [
  {
    q: "What payment methods are supported at ANITHA DRESSES?",
    a: "We support official ICICI QR Code scanning and UPI Bank Transfer via PhonePe, Google Pay, PayTM, or any UPI app. Cash on Delivery (COD) is strictly not supported.",
  },
  {
    q: "How long does shipping take?",
    a: "Orders are processed within 24 hours and delivered across Andhra Pradesh & Telangana within 2 to 4 business days.",
  },
  {
    q: "Can I cancel or exchange my order after placing it?",
    a: "No. As per our strict store policy, orders cannot be cancelled, returned, or exchanged after they are confirmed.",
  },
  {
    q: "Is shipping free?",
    a: "Yes! Free delivery is automatically applied to all orders above ₹1,499.",
  }
];

export default function FAQsPage() {
  return (
    <div className="py-12 bg-maroon-950 text-gold-100 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <TeluguLogo size="lg" variant="gold" />
          <h1 className="text-3xl font-black text-white font-serif">
            Frequently Asked Questions (FAQs)
          </h1>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="bg-maroon-900/60 p-6 rounded-2xl border border-amber-500/30 space-y-2 shadow-luxury">
              <h3 className="font-bold text-white text-sm font-serif">{faq.q}</h3>
              <p className="text-xs text-amber-200/80 font-serif leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
