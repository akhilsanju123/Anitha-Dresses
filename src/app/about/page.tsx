import React from 'react';
import Image from 'next/image';
import TeluguLogo from '../../components/brand/TeluguLogo';
import { Award, ShieldCheck, HeartHandshake } from 'lucide-react';
import { constructMetadata } from '../../lib/seo';

export const metadata = constructMetadata({
  title: 'About Us - ANITHA DRESSES Ongole',
  description: 'Learn about ANITHA DRESSES, Ongole premier family shopping destination for Men, Ladies, and Kids fashion.',
});

export default function AboutPage() {
  return (
    <div className="py-16 bg-maroon-950 text-gold-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <TeluguLogo size="xl" variant="gold" />
          <h1 className="text-3xl sm:text-5xl font-black text-white font-serif mt-4">
            About ANITHA DRESSES
          </h1>
          <p className="text-sm text-gold-200/90 font-serif leading-relaxed">
            ANITHA DRESSES (Ongole) is a trusted family fashion shopping destination delivering premium attire for Men, Ladies, and Kids at boutique prices.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-maroon-900/60 p-8 sm:p-12 rounded-3xl border border-amber-500/30 shadow-luxury">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-amber-300 font-serif">Our Legacy & Quality Promise</h2>
            <p className="text-xs sm:text-sm text-gold-200/90 font-serif leading-relaxed">
              Our shopping mall caters to every member of your family. We offer Anarkali long dresses, Prisma leggings, Men's kurta suit sets, kids party frocks, and festive family combo outfits at wholesale boutique prices.
            </p>
            <p className="text-xs sm:text-sm text-gold-200/90 font-serif leading-relaxed">
              Customer satisfaction, pure fabric quality, and transparent pricing remain our core priorities.
            </p>
          </div>

          <div className="relative h-80 rounded-2xl overflow-hidden border border-amber-500/30 shadow-lg">
            <Image
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=900&auto=format&fit=crop&q=85"
              alt="Store Front"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-maroon-900/60 p-6 rounded-2xl border border-amber-500/20 text-center space-y-3">
            <Award className="w-8 h-8 text-amber-400 mx-auto" />
            <h3 className="font-bold text-base text-white font-serif">100% Pure Fabric Quality</h3>
            <p className="text-xs text-amber-200/70 font-serif">Durable colors, premium stitching, and soft touch materials.</p>
          </div>

          <div className="bg-maroon-900/60 p-6 rounded-2xl border border-amber-500/20 text-center space-y-3">
            <ShieldCheck className="w-8 h-8 text-amber-400 mx-auto" />
            <h3 className="font-bold text-base text-white font-serif">Wholesale Boutique Prices</h3>
            <p className="text-xs text-amber-200/70 font-serif">Direct-from-manufacturer wholesale rates without retail inflation.</p>
          </div>

          <div className="bg-maroon-900/60 p-6 rounded-2xl border border-amber-500/20 text-center space-y-3">
            <HeartHandshake className="w-8 h-8 text-amber-400 mx-auto" />
            <h3 className="font-bold text-base text-white font-serif">Direct WhatsApp Support</h3>
            <p className="text-xs text-amber-200/70 font-serif">Instant store assistant support for size guidance and order tracking.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
