'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useShopStore } from '../../lib/store';
import { INITIAL_SETTINGS, INITIAL_PINCODES } from '../../lib/seedData';
import QRPaymentSection from '../../components/checkout/QRPaymentSection';

import { ShieldCheck, QrCode, Ban } from 'lucide-react';
import { CustomerAddress, WebsiteSettings } from '../../types';

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { cart, cartSubtotal, clearCart } = useShopStore();
  const [storeSettings, setStoreSettings] = useState<WebsiteSettings>(INITIAL_SETTINGS);

  const [address, setAddress] = useState<CustomerAddress>({
    fullName: '',
    phone: '',
    email: '',
    street: '',
    landmark: '',
    city: 'Ongole',
    state: 'Andhra Pradesh',
    pincode: '523001',
  });

  const [paymentScreenshot, setPaymentScreenshot] = useState<string>('');
  const [pincodeMessage, setPincodeMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);

    async function loadSettings() {
      try {
        const res = await fetch('/api/settings');
        const json = await res.json();
        if (json.success && json.data) {
          setStoreSettings(json.data);
        }
      } catch (err) {
        console.warn("Using default store settings fallback");
      }
    }
    loadSettings();
  }, []);

  // Redirect to /cart if cart is empty and user opens /checkout directly
  useEffect(() => {
    if (mounted && cart.length === 0 && !isSubmitting) {
      router.push('/cart');
    }
  }, [mounted, cart.length, isSubmitting, router]);

  const deliveryFee = cartSubtotal > storeSettings.freeShippingThreshold ? 0 : 60;
  const grandTotal = cartSubtotal + deliveryFee;

  const handlePincodeCheck = (pin: string) => {
    setAddress({ ...address, pincode: pin });
    const match = INITIAL_PINCODES.find(p => p.pincode === pin && p.active);
    if (match) {
      setPincodeMessage(`✅ Direct delivery available in your area (${match.city}, Est: ${match.estimatedDays})`);
    } else if (pin.length === 6) {
      setPincodeMessage(`ℹ️ Express courier delivery available for your pincode (3-5 days).`);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address.fullName || !address.phone || !address.street) {
      alert("Please fill your full name, phone number, and address.");
      return;
    }

    if (!paymentScreenshot) {
      alert("Please upload your payment screenshot before placing the order.");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customerDetails: address,
        items: cart,
        paymentScreenshot,
        total: grandTotal,
        subtotal: cartSubtotal,
        deliveryFee,
        paymentMethod: 'QR Code / Bank Transfer',
        paymentStatus: 'Pending Verification',
        orderStatus: 'Payment Verification',
        storeNotice: 'No Cancellation | No Return | No Exchange',
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const json = await res.json();
      if (json.success && json.data) {
        clearCart();
        router.push(`/order-success?orderId=${json.data.orderId}`);
      } else {
        alert(json.message || "Failed to create order. Please try again.");
        setIsSubmitting(false);
      }
    } catch (err) {
      alert("Network error creating order. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (!mounted || cart.length === 0) {
    return (
      <div className="py-24 bg-maroon-950 text-gold-100 min-h-screen text-center flex items-center justify-center font-serif text-sm">
        Loading Checkout...
      </div>
    );
  }

  return (
    <div className="py-12 bg-maroon-950 text-gold-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs uppercase font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            Secure Checkout
          </span>
          <h1 className="text-3xl font-black text-white font-serif">ANITHA DRESSES Checkout</h1>
          <p className="text-xs text-amber-200/70">Complete your address details & verify payment via ICICI Bank QR.</p>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Delivery Address & Payment QR */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Customer Delivery Address Box */}
            <div className="bg-maroon-900/60 p-6 sm:p-8 rounded-3xl border border-amber-500/30 shadow-luxury space-y-4">
              <h2 className="text-lg font-bold text-white font-serif border-b border-amber-500/20 pb-3">
                1. Customer Delivery Address
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-gold-200 font-semibold mb-1">Full Name: <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full bg-maroon-950 border border-amber-500/30 rounded-xl p-3 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gold-200 font-semibold mb-1">Mobile Phone: <span className="text-red-400">*</span></label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile number"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="w-full bg-maroon-950 border border-amber-500/30 rounded-xl p-3 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-gold-200 font-semibold mb-1">Email Address:</label>
                  <input
                    type="email"
                    placeholder="name@gmail.com"
                    value={address.email}
                    onChange={(e) => setAddress({ ...address, email: e.target.value })}
                    className="w-full bg-maroon-950 border border-amber-500/30 rounded-xl p-3 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gold-200 font-semibold mb-1">Pincode: <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 523001"
                    value={address.pincode}
                    onChange={(e) => handlePincodeCheck(e.target.value)}
                    className="w-full bg-maroon-950 border border-amber-500/30 rounded-xl p-3 text-white font-mono focus:outline-none"
                  />
                </div>
              </div>

              {pincodeMessage && (
                <p className="text-xs text-amber-300 font-serif bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                  {pincodeMessage}
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-gold-200 font-semibold mb-1">Street Address: <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="Door No, Street Name..."
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    className="w-full bg-maroon-950 border border-amber-500/30 rounded-xl p-3 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gold-200 font-semibold mb-1">Landmark:</label>
                  <input
                    type="text"
                    placeholder="Landmark..."
                    value={address.landmark}
                    onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                    className="w-full bg-maroon-950 border border-amber-500/30 rounded-xl p-3 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-gold-200 font-semibold mb-1">City:</label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full bg-maroon-950 border border-amber-500/30 rounded-xl p-3 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gold-200 font-semibold mb-1">State:</label>
                  <input
                    type="text"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full bg-maroon-950 border border-amber-500/30 rounded-xl p-3 text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 2. Official QR Code Payment Section */}
            <div className="bg-maroon-900/60 p-6 sm:p-8 rounded-3xl border border-amber-500/30 shadow-luxury space-y-6">
              <h2 className="text-lg font-bold text-white font-serif border-b border-amber-500/20 pb-3 flex items-center gap-2">
                <QrCode className="w-5 h-5 text-amber-400" />
                <span>2. Payment Verification & Screenshot Proof</span>
              </h2>

              <QRPaymentSection
                settings={storeSettings}
                totalAmount={grandTotal}
                onScreenshotUpload={(url) => setPaymentScreenshot(url)}
              />
            </div>
          </div>

          {/* Right Column: Order Summary & Place Order CTA */}
          <div className="space-y-6">
            <div className="bg-maroon-900/60 p-6 rounded-3xl border border-amber-500/30 shadow-luxury space-y-4 text-xs">
              <h3 className="text-sm font-bold text-gold-200 border-b border-amber-500/20 pb-3">Order Summary</h3>

              <div className="divide-y divide-amber-500/10">
                {cart.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex justify-between">
                    <div>
                      <p className="font-bold text-gold-100 line-clamp-1">{item.product.name}</p>
                      <p className="text-[10px] text-amber-300">Qty: {item.quantity} ({item.selectedSize})</p>
                    </div>
                    <span className="font-mono font-bold text-amber-300">₹{item.product.offerPrice * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-3 border-t border-amber-500/20">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal:</span>
                  <span className="font-mono">₹{cartSubtotal}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Delivery Fee:</span>
                  <span className="font-mono text-emerald-400">{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                </div>
                <div className="flex justify-between text-base font-black text-amber-300 pt-2 border-t border-amber-500/20">
                  <span>Order Total:</span>
                  <span className="font-mono">₹{grandTotal}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-maroon-950 font-black py-4 rounded-xl hover:brightness-110 transition flex items-center justify-center gap-2 shadow-2xl text-xs uppercase tracking-wider disabled:opacity-50 mt-4"
              >
                <ShieldCheck className="w-5 h-5" />
                <span>{isSubmitting ? 'Placing Order...' : 'Place Order & Send Screenshot'}</span>
              </button>

              <div className="flex items-center gap-2 text-[10px] text-red-400 justify-center font-bold pt-2 border-t border-amber-500/10">
                <Ban className="w-3.5 h-3.5 shrink-0" />
                <span>No Cancellation | No Return | No Exchange</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
