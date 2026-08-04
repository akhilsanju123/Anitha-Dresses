import { NextRequest } from 'next/server';
import { connectDB, getMemoryStore } from '../../../../lib/db';
import Order from '../../../../lib/models/Order';
import { apiResponse, authenticateAdmin } from '../../../../lib/auth';
import { Order as OrderType } from '../../../../types';
import { sendCustomerNotification } from '../../../../lib/notifications';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();

    if (Order.db.readyState === 1) {
      const order = await Order.findOne({ $or: [{ id }, { orderId: id }] }).lean();
      if (order) return apiResponse(true, order, 'Order details retrieved');
    }

    const store = getMemoryStore();
    const order = store.orders.find((o: OrderType) => o.id === id || o.orderId === id);
    if (!order) return apiResponse(false, null, 'Order not found', 404);

    return apiResponse(true, order, 'Order details retrieved');
  } catch (error: any) {
    return apiResponse(false, null, error.message || 'Error fetching order', 500);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = authenticateAdmin(req);
    if (!auth.authorized) return auth.response!;

    const { id } = await params;
    const body = await req.json();
    const { orderStatus, paymentStatus } = body;

    await connectDB();

    const isPaid = orderStatus === 'Paid' || orderStatus === 'Packed' || orderStatus === 'Shipped' || orderStatus === 'Delivered';
    const updatePayload: any = {
      orderStatus,
      paymentStatus: isPaid ? 'Paid' : paymentStatus || 'Pending Verification',
      updatedAt: new Date().toISOString(),
    };

    let targetOrder: any = null;

    if (Order.db.readyState === 1) {
      targetOrder = await Order.findOneAndUpdate(
        { $or: [{ id }, { orderId: id }] },
        updatePayload,
        { new: true }
      ).lean();
    }

    const store = getMemoryStore();
    const idx = store.orders.findIndex((o: OrderType) => o.id === id || o.orderId === id);
    if (idx !== -1) {
      store.orders[idx] = { ...store.orders[idx], ...updatePayload };
      if (!targetOrder) targetOrder = store.orders[idx];
    }

    // Trigger Notification Service architecture
    if (targetOrder) {
      await sendCustomerNotification({
        orderId: targetOrder.orderId || id,
        customerPhone: targetOrder.customerDetails?.phone || targetOrder.phone || '9618138383',
        customerName: targetOrder.customerDetails?.fullName || targetOrder.fullName || 'Valued Customer',
        newStatus: orderStatus,
        totalAmount: targetOrder.total || targetOrder.totalAmount || 0,
      });
    }

    return apiResponse(true, updatePayload, 'Order status updated successfully');
  } catch (error: any) {
    return apiResponse(false, null, error.message || 'Failed to update order status', 500);
  }
}
