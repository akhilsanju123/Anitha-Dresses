import React from 'react';
import Link from 'next/link';
import TeluguLogo from '../brand/TeluguLogo';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Youtube, Shield, Truck, Award, Ban } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-maroon-950 via-maroon-900 to-charcoal-950 text-gold-100 border-t border-amber-500/30 pt-16 pb-8">
      
      {/* Visible Store Policy Highlight Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="bg-gradient-to-r from-red-950 via-maroon-900 to-red-950 border border-amber-500/40 p-4 sm:p-6 rounded-3xl text-center shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <div className="p-3 bg-red-600/20 text-red-400 rounded-full border border-red-500/40 shrink-0">
              <Ban className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-white text-sm sm:text-base font-serif">Store Policy: No Cancellation & No Exchange</h4>
              <p className="text-xs text-amber-200/90 font-serif">Orders cannot be cancelled, returned, or exchanged after they are placed. Please verify your order carefully before confirming.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-maroon-950 px-4 py-2 rounded-2xl border border-amber-500/30 text-amber-300 text-xs font-bold shrink-0 font-mono">
            <Ban className="w-4 h-4 text-red-400" />
            <span>NO CANCELLATION | NO EXCHANGE</span>
          </div>
        </div>
      </div>

      {/* Brand Value Props Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-amber-500/20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="p-3 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-gold-200">100% Pure Quality</h4>
              <p className="text-xs text-amber-200/70">Boutique grade premium fabric</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="p-3 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-gold-200">Express Delivery</h4>
              <p className="text-xs text-amber-200/70">Across Andhra Pradesh & Telangana</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="p-3 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Ban className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-red-300">Strict Order Policy</h4>
              <p className="text-xs text-amber-200/70">No Cancellation / No Exchange</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="p-3 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-gold-200">Secure Payments</h4>
              <p className="text-xs text-amber-200/70">QR Scanner & UPI Bank Transfer</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand Summary */}
        <div className="space-y-4">
          <TeluguLogo size="lg" variant="gold" />
          <p className="text-xs text-amber-200/80 leading-relaxed font-serif pt-2">
            ANITHA DRESSES (Ongole) is a trusted family fashion shopping destination delivering premium attire for Men, Ladies, and Kids at boutique prices.
          </p>
          <div className="flex items-center space-x-3 pt-2">
            <a href="https://instagram.com/anithadresses" target="_blank" rel="noreferrer" className="p-2 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 transition">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="https://facebook.com/anithadresses" target="_blank" rel="noreferrer" className="p-2 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 transition">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="https://youtube.com/@anithadresses" target="_blank" rel="noreferrer" className="p-2 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 transition">
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider mb-4 border-b border-amber-500/30 pb-2 inline-block">
            Categories
          </h3>
          <ul className="space-y-2 text-xs text-gold-200">
            <li><Link href="/categories/men" className="hover:text-amber-400 transition">MEN'S WEAR</Link></li>
            <li><Link href="/categories/ladies" className="hover:text-amber-400 transition">LADIES WEAR</Link></li>
            <li><Link href="/categories/kids" className="hover:text-amber-400 transition">KIDS WEAR</Link></li>
            <li><Link href="/products" className="hover:text-amber-400 transition">Shop All Products</Link></li>
          </ul>
        </div>

        {/* Policy Links */}
        <div>
          <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider mb-4 border-b border-amber-500/30 pb-2 inline-block">
            Information & Help
          </h3>
          <ul className="space-y-2 text-xs text-gold-200">
            <li><Link href="/about" className="hover:text-amber-400 transition">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-amber-400 transition">Store Address & Map</Link></li>
            <li><Link href="/terms" className="hover:text-amber-400 transition">No Cancellation Policy</Link></li>
            <li><Link href="/privacy-policy" className="hover:text-amber-400 transition">Privacy Policy</Link></li>
            <li><Link href="/shipping-policy" className="hover:text-amber-400 transition">Shipping Policy</Link></li>
            <li><Link href="/terms" className="hover:text-amber-400 transition">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Store Contact & Address */}
        <div>
          <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider mb-4 border-b border-amber-500/30 pb-2 inline-block">
            Store Contact
          </h3>
          <ul className="space-y-3 text-xs text-gold-200">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>Shop No. 62 & 77, Sri Balaji Market Road, Ongole, Andhra Pradesh</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-amber-400 shrink-0" />
              <span>+91 8977969989</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-amber-400 shrink-0" />
              <span>support@anithadresses.com</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Mon - Sun: 10:00 AM - 9:00 PM</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-amber-500/20 text-center text-xs text-amber-200/60 font-serif">
        <p>© 2026 <strong>ANITHA DRESSES (Family Shopping Mall, Ongole)</strong>. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
