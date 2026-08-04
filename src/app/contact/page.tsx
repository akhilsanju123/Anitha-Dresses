import React from 'react';
import TeluguLogo from '../../components/brand/TeluguLogo';
import { MapPin, Phone, Mail, Clock, MessageSquare, Navigation } from 'lucide-react';
import { constructMetadata } from '../../lib/seo';

export const metadata = constructMetadata({
  title: 'Contact Us & Store Location - ANITHA DRESSES Ongole',
  description: 'Visit ANITHA DRESSES in Ongole, Andhra Pradesh. Store address, Google Maps location, opening hours, and phone details.',
});

export default function ContactPage() {
  return (
    <div className="py-12 bg-maroon-950 text-gold-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <TeluguLogo size="lg" variant="gold" />
          <h1 className="text-3xl sm:text-4xl font-black text-white font-serif">
            Contact Us & Store Directions
          </h1>
          <p className="text-xs text-amber-200/80 font-serif leading-relaxed">
            Visit our physical shopping mall in Ongole or contact our customer support team for inquiries.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Store Info Box */}
          <div className="bg-maroon-900/60 p-8 rounded-3xl border border-amber-500/30 shadow-luxury space-y-6">
            <h2 className="text-xl font-bold text-white font-serif border-b border-amber-500/20 pb-3">
              ANITHA DRESSES Store Details
            </h2>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/30 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Store Address:</h4>
                  <p className="text-amber-200/80 font-serif pt-1">
                    Shop No. 62 & 77, Sri Balaji Market Road, Ongole, Andhra Pradesh
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/30 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Phone Number:</h4>
                  <p className="text-amber-300 font-mono font-bold">+91 8977969989</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/30 shrink-0">
                  <MessageSquare className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">WhatsApp Support:</h4>
                  <p className="text-emerald-400 font-mono font-bold">+91 8977969989</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/30 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Email Address:</h4>
                  <p className="text-amber-200/80 font-mono">support@anithadresses.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/30 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Store Hours:</h4>
                  <p className="text-amber-200/80 font-serif">Monday - Sunday: 10:00 AM - 9:00 PM</p>
                </div>
              </div>
            </div>

            {/* Directions Button */}
            <div className="pt-4 border-t border-amber-500/20">
              <a
                href="https://maps.google.com/?q=Shop+No.+62+%26+77,+Sri+Balaji+Market+Road,+Ongole,+Andhra+Pradesh"
                target="_blank"
                rel="noreferrer"
                className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-maroon-950 font-black py-3.5 rounded-xl hover:brightness-110 transition flex items-center justify-center gap-2 shadow-xl text-xs"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Google Maps Directions</span>
              </a>
            </div>
          </div>

          {/* Google Maps Embed Frame */}
          <div className="bg-maroon-900/60 p-4 rounded-3xl border border-amber-500/30 shadow-luxury h-[480px] overflow-hidden">
            <iframe
              title="ANITHA DRESSES Store Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15383.150493540348!2d80.038165!3d15.505723!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a4b0123456789ab%3A0x123456789abcdef!2sSri%20Balaji%20Market%20Road%2C%20Ongole%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, borderRadius: '1.25rem' }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
