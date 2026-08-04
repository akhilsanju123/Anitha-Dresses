'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import Image from 'next/image';
import { Eye, X, Printer, ShieldCheck, Search, CheckCircle2, Truck, Lock, User, MapPin, CreditCard, ShoppingBag, FileText } from 'lucide-react';
import { Order, OrderStatus } from '../../../types';
import InvoicePDF from '../../../components/common/InvoicePDF';
import { sendOrderConfirmationEmail, sendWhatsAppNotification } from '../../../lib/notifications';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('anitha_admin_token') : '';
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/orders', { headers: getAuthHeaders(), cache: 'no-store' });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setOrders(json.data);
      }
    } catch (err) {
      console.warn("Using order list fallback");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    const targetOrder = orders.find(o => o.orderId === orderId || o.id === orderId);
    if (targetOrder && newStatus === 'Paid') {
      sendOrderConfirmationEmail(targetOrder);
      sendWhatsAppNotification(targetOrder, 'Payment Confirmed');
    }

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        await fetchOrders();
        if (selectedOrder) {
          setSelectedOrder({
            ...selectedOrder,
            orderStatus: newStatus,
            paymentStatus: (newStatus === 'Paid' || newStatus === 'Shipped' || newStatus === 'Delivered') ? 'Paid' : selectedOrder.paymentStatus
          });
        }
      }
    } catch (e) {
      setOrders(orders.map(o => (o.orderId === orderId || o.id === orderId) ? { ...o, orderStatus: newStatus } : o));
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Payment Verification':
      case 'Pending':
        return (
          <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 rounded-full font-bold text-[11px] uppercase">
            Yellow: Payment Pending
          </span>
        );
      case 'Paid':
        return (
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full font-bold text-[11px] uppercase">
            Green: Payment Confirmed (Paid)
          </span>
        );
      case 'Shipped':
      case 'Packed':
        return (
          <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/40 rounded-full font-bold text-[11px] uppercase">
            Blue: Ready for Delivery
          </span>
        );
      case 'Delivered':
        return (
          <span className="px-3 py-1 bg-green-800/40 text-green-300 border border-green-600 rounded-full font-bold text-[11px] uppercase">
            Dark Green: Delivered
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full font-bold text-[11px] uppercase">
            {status}
          </span>
        );
    }
  };

  const filteredOrders = orders.filter(o => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      o.orderId.toLowerCase().includes(q) ||
      o.customerDetails?.fullName?.toLowerCase().includes(q) ||
      o.customerDetails?.phone?.toLowerCase().includes(q) ||
      o.orderStatus?.toLowerCase().includes(q) ||
      o.paymentStatus?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex min-h-screen bg-maroon-950 text-gold-100">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-amber-500/20 pb-4 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white font-serif">Order Details & Delivery Management</h1>
            <p className="text-xs text-amber-200/70">Verify QR payment screenshots, inspect full order snapshots, and manage delivery statuses.</p>
          </div>
        </div>

        {/* Search Toolbar */}
        <div className="bg-maroon-900/60 p-4 rounded-2xl border border-amber-500/30 shadow-luxury flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search by Order ID, Customer Name, Phone, Status..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-maroon-950 border border-amber-500/30 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-gold-200/50 focus:outline-none"
            />
            <Search className="w-4 h-4 text-amber-400 absolute left-3 top-3" />
          </div>

          <span className="text-xs text-amber-300 font-bold">Total Orders: {filteredOrders.length}</span>
        </div>

        {selectedInvoiceOrder ? (
          <div className="space-y-4">
            <button onClick={() => setSelectedInvoiceOrder(null)} className="text-xs font-bold text-amber-400 hover:underline">
              &larr; Back to Order List
            </button>
            <InvoicePDF order={selectedInvoiceOrder} />
          </div>
        ) : (
          <div className="bg-maroon-900/60 rounded-2xl border border-amber-500/30 overflow-x-auto shadow-luxury">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-maroon-950 text-amber-300 border-b border-amber-500/20 font-bold">
                  <th className="p-3.5">Order ID</th>
                  <th className="p-3.5">Customer Name & Phone</th>
                  <th className="p-3.5">Total Amount</th>
                  <th className="p-3.5">Payment Proof</th>
                  <th className="p-3.5">Live Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-500/10 text-gold-200">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-amber-300 font-serif">
                      {loading ? 'Loading orders from MongoDB...' : 'No orders found matching search criteria.'}
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((o) => {
                    const displayTotal = isNaN(Number(o.total)) ? 0 : Number(o.total);

                    return (
                      <tr key={o.id} className="hover:bg-amber-500/5 transition">
                        <td className="p-3.5 font-mono font-bold text-amber-300">{o.orderId}</td>
                        <td className="p-3.5">
                          <p className="font-bold text-white">{o.customerDetails?.fullName || 'Valued Customer'}</p>
                          <p className="text-[10px] text-gray-400">{o.customerDetails?.phone} | {o.customerDetails?.city}</p>
                        </td>
                        <td className="p-3.5 font-mono font-bold text-emerald-400">₹{displayTotal}</td>
                        <td className="p-3.5">
                          {o.orderStatus === 'Paid' || o.orderStatus === 'Shipped' || o.orderStatus === 'Delivered' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Payment Proof Verified</span>
                            </span>
                          ) : o.paymentScreenshot ? (
                            <button
                              onClick={() => setSelectedOrder(o)}
                              className="bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 px-3 py-1 rounded-lg text-[11px] font-bold border border-amber-500/30 flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Proof</span>
                            </button>
                          ) : (
                            <span className="text-gray-500 text-[10px]">No Proof</span>
                          )}
                        </td>
                        <td className="p-3.5">
                          {getStatusBadge(o.orderStatus)}
                        </td>
                        <td className="p-3.5 text-right space-x-2">
                          <button
                            onClick={() => setSelectedOrder(o)}
                            className="px-2.5 py-1.5 bg-maroon-950 hover:bg-amber-500/20 text-amber-300 font-bold text-[11px] rounded-lg border border-amber-500/30"
                          >
                            View Details
                          </button>
                          
                          {o.orderStatus === 'Payment Verification' || o.orderStatus === 'Pending' ? (
                            <button
                              onClick={() => handleUpdateStatus(o.orderId, 'Paid')}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded-lg shadow"
                            >
                              Approve Payment
                            </button>
                          ) : o.orderStatus === 'Paid' ? (
                            <button
                              onClick={() => handleUpdateStatus(o.orderId, 'Shipped')}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] rounded-lg shadow flex items-center gap-1 inline-flex"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              <span>Ready for Delivery</span>
                            </button>
                          ) : o.orderStatus === 'Shipped' || o.orderStatus === 'Packed' ? (
                            <button
                              onClick={() => handleUpdateStatus(o.orderId, 'Delivered')}
                              className="px-3 py-1.5 bg-green-800 hover:bg-green-700 text-white font-bold text-[11px] rounded-lg shadow"
                            >
                              Mark Delivered
                            </button>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-400 bg-gray-900/60 px-2 py-1 rounded border border-gray-700">
                              <Lock className="w-3 h-3 text-emerald-400" /> Locked
                            </span>
                          )}

                          <button
                            onClick={() => setSelectedInvoiceOrder(o)}
                            className="p-1.5 bg-maroon-950 hover:bg-amber-500/20 text-amber-300 rounded-lg border border-amber-500/30"
                            title="Print PDF Invoice"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Comprehensive Order Details Drawer Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}></div>
          
          <div className="relative w-full max-w-3xl bg-maroon-950 text-gold-100 rounded-3xl border border-amber-500/40 p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto z-10">
            
            {/* Header */}
            <div className="flex justify-between items-center border-b border-amber-500/20 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-amber-300">Order ID: {selectedOrder.orderId}</span>
                <p className="text-[11px] text-gray-400">Date: {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-gold-300 hover:text-amber-400">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Live Status Banner */}
            <div className="flex items-center justify-between p-4 bg-maroon-900/80 rounded-2xl border border-amber-500/30">
              <div>
                <p className="text-[10px] text-amber-400 uppercase tracking-widest font-bold">Current Order Status:</p>
                <div className="mt-1">{getStatusBadge(selectedOrder.orderStatus)}</div>
              </div>

              {/* Status Action Buttons */}
              <div className="flex items-center gap-2">
                {selectedOrder.orderStatus === 'Payment Verification' || selectedOrder.orderStatus === 'Pending' ? (
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.orderId, 'Paid')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Approve Payment</span>
                  </button>
                ) : selectedOrder.orderStatus === 'Paid' ? (
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.orderId, 'Shipped')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5"
                  >
                    <Truck className="w-4 h-4" />
                    <span>Ready for Delivery</span>
                  </button>
                ) : selectedOrder.orderStatus === 'Shipped' || selectedOrder.orderStatus === 'Packed' ? (
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.orderId, 'Delivered')}
                    className="px-4 py-2 bg-green-800 hover:bg-green-700 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mark Delivered</span>
                  </button>
                ) : (
                  <span className="px-3 py-1.5 bg-gray-900 text-gray-300 rounded-xl text-xs font-bold border border-gray-700 flex items-center gap-1">
                    <Lock className="w-4 h-4 text-emerald-400" /> Completed & Locked
                  </span>
                )}
              </div>
            </div>

            {/* Customer Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              
              {/* Delivery Address Box */}
              <div className="bg-maroon-900/60 p-4 rounded-2xl border border-amber-500/20 space-y-2">
                <h4 className="font-bold text-amber-300 flex items-center gap-1.5 text-sm border-b border-amber-500/20 pb-2">
                  <User className="w-4 h-4" />
                  <span>Customer Information</span>
                </h4>
                <p className="font-bold text-white text-sm">{selectedOrder.customerDetails?.fullName}</p>
                <p className="text-gray-300">📞 Phone: <span className="font-mono text-amber-300 font-bold">{selectedOrder.customerDetails?.phone}</span></p>
                <p className="text-gray-300">✉ Email: {selectedOrder.customerDetails?.email || 'N/A'}</p>
                <div className="pt-2 border-t border-amber-500/10 space-y-1">
                  <p className="font-bold text-amber-200 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" /> Delivery Address:
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    {selectedOrder.customerDetails?.street}, {selectedOrder.customerDetails?.landmark && `Near ${selectedOrder.customerDetails?.landmark}, `}
                    {selectedOrder.customerDetails?.city}, {selectedOrder.customerDetails?.state} - {selectedOrder.customerDetails?.pincode}
                  </p>
                </div>
              </div>

              {/* Payment Details Box */}
              <div className="bg-maroon-900/60 p-4 rounded-2xl border border-amber-500/20 space-y-3">
                <h4 className="font-bold text-amber-300 flex items-center gap-1.5 text-sm border-b border-amber-500/20 pb-2">
                  <CreditCard className="w-4 h-4" />
                  <span>Payment Information</span>
                </h4>
                <p className="text-gray-300">Method: <span className="font-bold text-white uppercase">{selectedOrder.paymentMethod || 'QR Code'}</span></p>
                <p className="text-gray-300">Status: <span className="font-bold text-emerald-400">{selectedOrder.paymentStatus}</span></p>
                <p className="text-gray-300">Total Amount: <span className="font-mono font-bold text-amber-300 text-sm">₹{isNaN(Number(selectedOrder.total)) ? 0 : Number(selectedOrder.total)}</span></p>

                {/* Screenshot Preview */}
                {selectedOrder.paymentScreenshot ? (
                  <div className="space-y-1.5 pt-2">
                    <p className="text-[11px] font-bold text-amber-200">QR Payment Proof Screenshot:</p>
                    <div className="relative w-full h-44 rounded-xl overflow-hidden border border-amber-500/30 bg-black">
                      <Image src={selectedOrder.paymentScreenshot} alt="Payment Proof" fill className="object-contain" />
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-[11px] italic">No payment screenshot attached.</p>
                )}
              </div>
            </div>

            {/* Ordered Products Table */}
            <div className="space-y-3">
              <h4 className="font-bold text-amber-300 flex items-center gap-1.5 text-sm">
                <ShoppingBag className="w-4 h-4" />
                <span>Purchased Items Snapshot ({selectedOrder.items?.length || 0})</span>
              </h4>

              <div className="bg-maroon-900/60 rounded-2xl border border-amber-500/20 overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-maroon-950 text-amber-300 border-b border-amber-500/20 font-bold text-[11px]">
                      <th className="p-3">Product Item</th>
                      <th className="p-3">Category / Subcategory</th>
                      <th className="p-3">Size & Color</th>
                      <th className="p-3">Unit Price</th>
                      <th className="p-3 text-right">Total Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-500/10 text-gold-200">
                    {selectedOrder.items?.map((item: any, idx) => {
                      const pObj = item.product || item;
                      const itemName = item.name || pObj.name || 'ANITHA Fashion Item';
                      const itemImg = item.image || pObj.images?.[0] || 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80';
                      const itemCat = item.category || pObj.category || 'General';
                      const itemSubcat = item.subcategory || pObj.subcategory || '';
                      const itemSize = item.size || item.selectedSize || 'M';
                      const itemColor = item.color || item.selectedColor || 'Standard';
                      const itemPrice = isNaN(Number(item.price || pObj.offerPrice)) ? 0 : Number(item.price || pObj.offerPrice);
                      const itemQty = isNaN(Number(item.quantity)) ? 1 : Number(item.quantity);
                      const itemTotalPrice = isNaN(Number(item.totalPrice)) ? (itemPrice * itemQty) : Number(item.totalPrice);

                      return (
                        <tr key={idx}>
                          <td className="p-3 flex items-center gap-3">
                            <div className="relative w-12 h-14 rounded-lg overflow-hidden border border-amber-500/20 shrink-0 bg-maroon-950">
                              <Image src={itemImg} alt={itemName} fill className="object-cover" />
                            </div>
                            <div>
                              <p className="font-bold text-white">{itemName}</p>
                              <p className="text-[10px] text-gray-400 font-mono">ID: {item.productId || pObj.id || 'N/A'}</p>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/20 font-semibold text-[10px]">
                              {itemCat}
                            </span>
                            {itemSubcat && <p className="text-[10px] text-gray-400 mt-0.5">{itemSubcat}</p>}
                          </td>
                          <td className="p-3">
                            <p className="text-amber-300 font-semibold">Size: {itemSize}</p>
                            <p className="text-gray-400">Color: {itemColor}</p>
                          </td>
                          <td className="p-3 font-mono">
                            ₹{itemPrice} &times; {itemQty}
                          </td>
                          <td className="p-3 text-right font-mono font-bold text-amber-300">
                            ₹{itemTotalPrice}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Order Financial Summary */}
              <div className="bg-maroon-900/40 p-4 rounded-2xl border border-amber-500/20 flex justify-end text-xs font-serif">
                <div className="w-64 space-y-1.5">
                  <div className="flex justify-between text-gray-300">
                    <span>Items Subtotal:</span>
                    <span className="font-mono">₹{isNaN(Number(selectedOrder.subtotal)) ? Number(selectedOrder.total || 0) : Number(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Delivery Charges:</span>
                    <span className="font-mono text-emerald-400">{selectedOrder.deliveryFee === 0 ? 'FREE' : `₹${selectedOrder.deliveryFee}`}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-bold">
                      <span>Discount Applied:</span>
                      <span className="font-mono">-₹{selectedOrder.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-black text-amber-300 pt-2 border-t border-amber-500/20">
                    <span>Grand Total:</span>
                    <span className="font-mono">₹{isNaN(Number(selectedOrder.total)) ? 0 : Number(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
