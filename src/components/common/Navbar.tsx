'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import TeluguLogo from '../brand/TeluguLogo';
import { useShopStore } from '../../lib/store';
import { Search, ShoppingBag, Heart, User, Menu, Phone, Sparkles, ChevronDown } from 'lucide-react';
import MobileMenu from './MobileMenu';
import SearchModal from './SearchModal';
import { Category } from '../../types';

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const { cart, wishlist, setIsCartOpen, setIsSearchOpen } = useShopStore();

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/categories', { cache: 'no-store' });
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setCategories(json.data);
        }
      } catch (err) {
        console.warn("Failed loading navbar categories from API", err);
      }
    }
    loadCategories();
  }, []);

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-maroon-950 via-maroon-900 to-maroon-950 text-gold-200 text-xs py-2 px-4 border-b border-amber-500/20 text-center flex items-center justify-between font-serif">
        <div className="hidden sm:flex items-center gap-2">
          <Phone className="w-3.5 h-3.5 text-amber-400" />
          <span>Shopping Inquiry: +91 8977969989</span>
        </div>
        <div className="mx-auto sm:mx-0 flex items-center gap-1.5 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Festive Special Offers | Free Delivery on Orders Above ₹1,499!</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-amber-300">
          <Link href="/about" className="hover:text-white transition">About Us</Link>
          <Link href="/contact" className="hover:text-white transition">Store Location</Link>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-maroon-950/95 backdrop-blur-md shadow-2xl py-2.5 border-b border-amber-500/30'
            : 'bg-maroon-900 py-3.5 border-b border-amber-500/20'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 text-gold-200 hover:text-amber-400 transition focus:outline-none"
            aria-label="Open Mobile Menu"
          >
            <Menu className="w-7 h-7" />
          </button>

          {/* Brand Logo Component */}
          <Link href="/" className="flex items-center">
            <TeluguLogo size={isScrolled ? 'sm' : 'md'} variant="gold" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8 font-medium text-sm text-gold-100">
            <Link href="/" className="hover:text-amber-400 transition-colors py-1 relative group">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            {/* Categories Mega Dropdown */}
            <div
              className="relative py-1 group"
              onMouseEnter={() => setIsCatDropdownOpen(true)}
              onMouseLeave={() => setIsCatDropdownOpen(false)}
            >
              <Link href="/categories" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                <span>Categories</span>
                <ChevronDown className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-180 transition-transform duration-200" />
              </Link>

              {/* Dynamic Mega Menu Overlay */}
              {isCatDropdownOpen && categories.length > 0 && (
                <div className="absolute top-full left-0 w-[680px] bg-maroon-950 text-gold-100 border border-amber-500/30 rounded-2xl shadow-2xl p-6 grid grid-cols-3 gap-6 z-50 backdrop-blur-md">
                  {categories.map((cat) => (
                    <div key={cat.id || cat.slug} className="space-y-3">
                      <Link
                        href={`/categories/${cat.slug}`}
                        className="font-extrabold text-amber-400 border-b border-amber-500/20 pb-1.5 text-sm block hover:underline"
                      >
                        {cat.name}
                      </Link>
                      <div className="space-y-1 text-xs">
                        {cat.subcategories && cat.subcategories.map((sub, sIdx) => (
                          <Link
                            key={sIdx}
                            href={`/products?category=${encodeURIComponent(cat.name)}&subcategory=${encodeURIComponent(sub)}`}
                            className="block text-gold-200/90 hover:text-white hover:translate-x-1 transition duration-150 py-0.5"
                          >
                            • {sub}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link href="/collections" className="hover:text-amber-400 transition-colors py-1 relative group">
              Collections
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            
            <Link href="/products" className="hover:text-amber-400 transition-colors py-1 relative group">
              Shop All
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            <Link href="/offers" className="hover:text-amber-400 transition-colors py-1 relative group text-amber-300 font-bold">
              Offers
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            <Link href="/contact" className="hover:text-amber-400 transition-colors py-1 relative group">
              Contact Us
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-4">
            
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-gold-200 hover:text-amber-400 transition duration-200 relative group"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Link */}
            <Link
              href="/account/wishlist"
              className="p-2 text-gold-200 hover:text-amber-400 transition duration-200 relative"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {mounted && wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-maroon-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-gold-200 hover:text-amber-400 transition duration-200 relative"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {mounted && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-400 text-maroon-950 font-extrabold text-[11px] w-4 h-4 rounded-full flex items-center justify-center animate-bounce shadow">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Account Profile Link */}
            <Link
              href="/account"
              className="hidden sm:flex items-center gap-1.5 p-2 bg-gradient-to-r from-amber-500/20 to-amber-600/10 border border-amber-500/30 rounded-full text-gold-200 hover:text-white hover:border-amber-400 transition text-xs font-semibold px-3"
            >
              <User className="w-4 h-4 text-amber-400" />
              <span>Account</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation Component */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      
      {/* Instant Search Overlay Modal */}
      <SearchModal />
    </>
  );
}
