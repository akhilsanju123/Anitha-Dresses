'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, ArrowRight, Ban, Package, Clock, ShieldCheck } from 'lucide-react';
import InvoicePDF from '../../components/common/InvoicePDF';
import { Order } from '../../types';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (orderId) {
      const mockPlacedOrder: Order = {
        id: `ord-${Date.now()}`,
        orderId: orderId,
        customerDetails: {
          fullName: "Customer",
          phone: "8977969989",
          email: "customer@anithadresses.com",
          street: "Shop No. 62 & 77, Sri Balaji Market Road",
          city: "Ongole",
          state: "Andhra Pradesh",
          pincode: "523001",
        },
        items: [],
        subtotal: 0,
        deliveryFee: 0,
        discount: 0,
        total: 0,
        paymentMethod: 'qr_scanner',
        paymentStatus: 'Pending Verification',
        orderStatus: 'Payment Verification',
        createdAt: new Date().toISOString(),
      };
      setOrder(mockPlacedOrder);
    }
  }, [orderId]);

  return (
    <div className="py-16 bg-maroon-950 text-gold-100 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Celebration Header */}
        <div className="bg-gradient-to-b from-maroon-900/90 via-maroon-900/60 to-maroon-950 p-8 sm:p-12 rounded-3xl border border-amber-500/40 text-center space-y-6 shadow-2xl">
          <div className="relative inline-block">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center border-2 border-emerald-400 mx-auto">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-pulse" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-black text-white font-serif">
              Order Placed Successfully!
            </h1>
            <p className="text-sm text-amber-300 font-serif">
              Order Reference Number: <strong className="text-white font-mono text-lg">{orderId || 'AD-SUCCESS'}</strong>
            </p>
          </div>

          {/* Timeline & Status Notice */}
          <div className="bg-maroon-950/80 p-4 rounded-2xl border border-amber-500/20 max-w-lg mx-auto grid grid-cols-3 gap-2 text-xs">
            <div className="text-center space-y-1">
              <Clock className="w-5 h-5 text-amber-400 mx-auto" />
              <p className="font-bold text-white text-[11px]">Placed</p>
              <p className="text-[10px] text-gray-400">Order Placed</p>
            </div>
            <div className="text-center space-y-1 border-x border-amber-500/20">
              <ShieldCheck className="w-5 h-5 text-amber-400 mx-auto" />
              <p className="font-bold text-white text-[11px]">Verification</p>
              <p className="text-[10px] text-gray-400">Payment Check</p>
            </div>
            <div className="text-center space-y-1">
              <Package className="w-5 h-5 text-amber-400 mx-auto" />
              <p className="font-bold text-white text-[11px]">Dispatch</p>
              <p className="text-[10px] text-gray-400">Processing</p>
            </div>
          </div>

          {/* Policy Reminder */}
          <div className="bg-red-950/80 border border-red-500/40 p-4 rounded-2xl max-w-xl mx-auto text-xs text-amber-200 text-left space-y-1">
            <p className="font-extrabold text-white uppercase flex items-center gap-1.5">
              <Ban className="w-4 h-4 text-red-400" />
              <span>Store Order Policy:</span>
            </p>
            <p className="font-serif">
              "Orders cannot be cancelled, returned, or exchanged after they are placed. Please verify your order carefully before confirming."
            </p>
          </div>
        </div>

        {/* Invoice Component */}
        {order && <InvoicePDF order={order} />}

        {/* Actions */}
        <div className="text-center space-x-4 pt-4">
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-2 bg-maroon-900 border border-amber-500/40 text-gold-200 font-bold px-6 py-3.5 rounded-full hover:bg-amber-500/10 text-xs transition"
          >
            <span>View My Orders</span>
          </Link>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-maroon-950 font-extrabold px-8 py-3.5 rounded-full hover:brightness-110 shadow-xl text-xs transition"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-amber-300 font-serif">Loading order details...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
