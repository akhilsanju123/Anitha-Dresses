'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package, Printer, Ban, CheckCircle2, Truck, Gift, Clock, Check } from 'lucide-react';
import InvoicePDF from '../../../components/common/InvoicePDF';
import { Order } from '../../../types';

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await fetch('/api/orders', { cache: 'no-store' });
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setOrders(json.data);
        }
      } catch (err) {
        console.warn("Failed to fetch customer orders");
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  const getStepProgressIndex = (status: string) => {
    switch (status) {
      case 'Pending':
        return 1;
      case 'Payment Verification':
        return 2;
      case 'Paid':
        return 3;
      case 'Packed':
      case 'Shipped':
        return 4;
      case 'Delivered':
        return 5;
      default:
        return 2;
    }
  };

  const getNotificationBanner = (status: string) => {
    if (status === 'Paid') {
      return (
        <div className="flex items-center gap-2 p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-xs font-bold text-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Your payment has been verified successfully.</span>
        </div>
      );
    }
    if (status === 'Packed' || status === 'Shipped') {
      return (
        <div className="flex items-center gap-2 p-3 bg-blue-950/80 border border-blue-500/40 rounded-xl text-xs font-bold text-blue-300">
          <Truck className="w-4 h-4 text-blue-400 shrink-0" />
          <span>Your order is ready for delivery.</span>
        </div>
      );
    }
    if (status === 'Delivered') {
      return (
        <div className="flex items-center gap-2 p-3 bg-green-950/90 border border-green-600/50 rounded-xl text-xs font-bold text-green-300">
          <Gift className="w-4 h-4 text-green-400 shrink-0" />
          <span>Your order has been delivered successfully.</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 p-3 bg-maroon-950 border border-amber-500/20 rounded-xl text-xs font-semibold text-amber-200/80">
        <Clock className="w-4 h-4 text-amber-400 shrink-0" />
        <span>Payment Verification Pending (QR Screenshot received).</span>
      </div>
    );
  };

  const renderProgressTracker = (status: string) => {
    const activeStepIndex = getStepProgressIndex(status);

    const steps = [
      { step: 1, label: 'Order Placed' },
      { step: 2, label: 'Payment Verification' },
      { step: 3, label: 'Payment Confirmed' },
      { step: 4, label: 'Ready for Delivery' },
      { step: 5, label: 'Delivered' },
    ];

    return (
      <div className="py-4 border-y border-amber-500/10">
        <div className="grid grid-cols-5 gap-2 text-center relative">
          {steps.map((s) => {
            const isCompleted = activeStepIndex >= s.step;
            const isCurrent = activeStepIndex === s.step;

            return (
              <div key={s.step} className="flex flex-col items-center space-y-1.5 z-10">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    isCompleted
                      ? 'bg-amber-400 text-maroon-950 shadow-md ring-2 ring-amber-400/40'
                      : 'bg-maroon-950 text-gray-500 border border-amber-500/20'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : s.step}
                </div>
                <span
                  className={`text-[10px] font-semibold leading-tight ${
                    isCurrent
                      ? 'text-amber-300 font-bold underline'
                      : isCompleted
                      ? 'text-gold-200'
                      : 'text-gray-500'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="py-12 bg-maroon-950 text-gold-100 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <h1 className="text-3xl font-black text-white font-serif">My Orders & Live Status</h1>

        {/* Visible Store Order Policy Box */}
        <div className="bg-gradient-to-r from-red-950 via-maroon-900 to-red-950 border border-red-500/40 p-4 rounded-2xl flex items-center gap-3 text-xs shadow-luxury">
          <Ban className="w-5 h-5 text-red-400 shrink-0" />
          <div className="space-y-0.5">
            <p className="font-extrabold text-white uppercase tracking-wider">Store Policy:</p>
            <p className="text-amber-200/90 font-serif">
              "NO CANCELLATION | NO RETURN | NO EXCHANGE. Please verify your order carefully before placing."
            </p>
          </div>
        </div>

        {selectedInvoiceOrder ? (
          <div className="space-y-4">
            <button
              onClick={() => setSelectedInvoiceOrder(null)}
              className="text-xs font-bold text-amber-400 hover:underline"
            >
              &larr; Back to Order History List
            </button>
            <InvoicePDF order={selectedInvoiceOrder} />
          </div>
        ) : loading ? (
          <div className="text-center py-12 text-xs text-amber-300 font-serif">
            Loading order details...
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-maroon-900/60 p-12 rounded-3xl border border-amber-500/30 text-center space-y-4 shadow-luxury">
            <Package className="w-12 h-12 text-amber-400 mx-auto" />
            <h3 className="text-lg font-bold text-white font-serif">No Active Orders Found</h3>
            <p className="text-xs text-amber-200/70">Your order history and live shipping updates will appear here.</p>
            <Link
              href="/products"
              className="inline-block bg-gradient-to-r from-amber-400 to-amber-600 text-maroon-950 font-black px-6 py-3 rounded-xl hover:brightness-110 transition text-xs shadow-lg"
            >
              Shop Collection Now
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-maroon-900/60 p-6 rounded-3xl border border-amber-500/30 shadow-luxury space-y-4">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-amber-500/20 gap-2">
                  <div>
                    <span className="text-xs font-mono font-bold text-amber-300">Order #: {order.orderId}</span>
                    <p className="text-[11px] text-gray-400">Date: {new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                      order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered' || order.orderStatus === 'Paid'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {order.orderStatus}
                    </span>

                    <button
                      onClick={() => setSelectedInvoiceOrder(order)}
                      className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 border border-amber-500/30"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>PDF Invoice</span>
                    </button>
                  </div>
                </div>

                {/* Live Progress Tracker */}
                {renderProgressTracker(order.orderStatus)}

                {/* Status Notification Banner */}
                {getNotificationBanner(order.orderStatus)}

                {/* Items List */}
                <div className="space-y-3 pt-2">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex gap-4 items-center">
                      <div className="relative w-14 h-16 rounded-lg overflow-hidden shrink-0 border border-amber-500/20">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xs font-bold text-gold-100">{item.name}</h4>
                        <p className="text-[11px] text-amber-300">Size: {item.size} | Color: {item.color}</p>
                      </div>
                      <span className="text-xs font-bold text-amber-400">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
