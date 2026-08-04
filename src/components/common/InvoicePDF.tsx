'use client';

import React from 'react';
import { Order } from '../../types';
import { Printer } from 'lucide-react';

interface InvoicePDFProps {
  order: Order;
}

export default function InvoicePDF({ order }: InvoicePDFProps) {
  const handlePrint = () => {
    window.print();
  };

  const safeSubtotal = isNaN(Number(order.subtotal)) ? Number(order.total || 0) : Number(order.subtotal);
  const safeTotal = isNaN(Number(order.total)) ? safeSubtotal : Number(order.total);
  const gstAmount = Math.round(safeSubtotal * 0.05); // 5% GST included calculation

  return (
    <div className="bg-white text-gray-900 p-8 rounded-xl shadow-2xl max-w-3xl mx-auto my-6 font-sans print:shadow-none print:m-0 print:p-4 border border-gray-200">
      {/* Printable Actions Bar */}
      <div className="flex justify-end gap-3 mb-6 print:hidden">
        <button
          onClick={handlePrint}
          className="bg-maroon-900 text-gold-200 hover:bg-maroon-950 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save Tax Invoice (PDF)</span>
        </button>
      </div>

      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-amber-500 pb-6">
        <div>
          <h1 className="text-2xl font-black text-maroon-950 font-serif">ANITHA DRESSES</h1>
          <p className="text-xs text-gray-600 font-bold">Family Fashion Shopping Mall - Ongole</p>
          <p className="text-[11px] text-gray-500 mt-1">Shop No. 62 & 77, Sri Balaji Market Road, Ongole, AP</p>
          <p className="text-[11px] text-gray-500">GSTIN: 37AAAFV1234A1Z5 | Phone: +91 8977969989</p>
        </div>
        <div className="text-right">
          <span className="bg-amber-100 text-amber-900 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
            TAX INVOICE
          </span>
          <p className="text-xs font-bold text-gray-800 mt-2">Invoice #: {order.orderId}</p>
          <p className="text-xs text-gray-500">Date: {new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
        </div>
      </div>

      {/* Addresses */}
      <div className="grid grid-cols-2 gap-6 py-6 border-b border-gray-200">
        <div>
          <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">Billed & Shipped To:</h3>
          <p className="text-xs font-bold text-gray-900">{order.customerDetails?.fullName || 'Valued Customer'}</p>
          <p className="text-xs text-gray-600">{order.customerDetails?.street}</p>
          <p className="text-xs text-gray-600">{order.customerDetails?.city}, {order.customerDetails?.state} - {order.customerDetails?.pincode}</p>
          <p className="text-xs text-gray-600">Phone: {order.customerDetails?.phone}</p>
        </div>
        <div>
          <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">Payment Details:</h3>
          <p className="text-xs text-gray-800">Method: <strong className="uppercase">{order.paymentMethod || 'QR Code'}</strong></p>
          <p className="text-xs text-gray-800">Status: <strong className="text-emerald-700">{order.paymentStatus}</strong></p>
          <p className="text-xs text-gray-800">Order Status: <strong>{order.orderStatus}</strong></p>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full text-left my-6 border-collapse">
        <thead>
          <tr className="bg-amber-50 text-amber-950 text-xs font-bold border-y border-amber-200">
            <th className="py-2.5 px-3">Item Description</th>
            <th className="py-2.5 px-3">Category</th>
            <th className="py-2.5 px-3">Size / Color</th>
            <th className="py-2.5 px-3 text-center">Qty</th>
            <th className="py-2.5 px-3 text-right">Unit Price</th>
            <th className="py-2.5 px-3 text-right">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 text-xs text-gray-800">
          {order.items?.map((item: any, idx) => {
            const pObj = item.product || item;
            const itemName = item.name || pObj.name || 'ANITHA Fashion Item';
            const itemCat = item.category || pObj.category || 'General';
            const itemSize = item.size || item.selectedSize || 'M';
            const itemColor = item.color || item.selectedColor || 'Standard';
            const itemPrice = isNaN(Number(item.price || pObj.offerPrice)) ? 0 : Number(item.price || pObj.offerPrice);
            const itemQty = isNaN(Number(item.quantity)) ? 1 : Number(item.quantity);
            const itemTotal = isNaN(Number(item.totalPrice)) ? (itemPrice * itemQty) : Number(item.totalPrice);

            return (
              <tr key={idx}>
                <td className="py-3 px-3 font-semibold">{itemName}</td>
                <td className="py-3 px-3 text-gray-600">{itemCat}</td>
                <td className="py-3 px-3">{itemSize} / {itemColor}</td>
                <td className="py-3 px-3 text-center">{itemQty}</td>
                <td className="py-3 px-3 text-right">₹{itemPrice}</td>
                <td className="py-3 px-3 text-right font-bold">₹{itemTotal}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Summary Totals */}
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <div className="w-64 space-y-2 text-xs">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal:</span>
            <span>₹{safeSubtotal}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>GST (Included 5%):</span>
            <span>₹{gstAmount}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Delivery Fee:</span>
            <span>{order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-700 font-bold">
              <span>Discount Applied:</span>
              <span>-₹{order.discount}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-black text-maroon-950 pt-2 border-t border-gray-300">
            <span>Grand Total:</span>
            <span>₹{safeTotal}</span>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-8 pt-4 border-t border-dashed border-gray-300 text-center text-[10px] text-gray-500">
        <p>Thank you for shopping at ANITHA DRESSES!</p>
        <p>This is a computer-generated GST tax invoice.</p>
        <p className="font-bold text-red-600 mt-1">NO CANCELLATION | NO RETURN | NO EXCHANGE</p>
      </div>
    </div>
  );
}
