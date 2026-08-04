import { NextRequest } from 'next/server';
import { connectDB, getMemoryStore } from '../../../../lib/db';
import Order from '../../../../lib/models/Order';
import Product from '../../../../lib/models/Product';
import { apiResponse, authenticateAdmin } from '../../../../lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const auth = authenticateAdmin(req);
    if (!auth.authorized) return auth.response!;

    await connectDB();

    let totalOrders = 0;
    let totalRevenue = 0;
    let totalProducts = 0;
    let totalCustomers = 0;
    let pendingPayments = 0;
    let readyForDelivery = 0;
    let deliveredOrders = 0;

    if (Order.db.readyState === 1) {
      totalOrders = await Order.countDocuments();
      totalProducts = await Product.countDocuments();

      const paidOrders = await Order.find({
        orderStatus: { $in: ['Paid', 'Packed', 'Shipped', 'Delivered'] }
      }).lean();

      totalRevenue = paidOrders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);

      const allOrders = await Order.find({}).lean();
      const uniqueCustomers = new Set(allOrders.map((o: any) => o.customerDetails?.phone || o.customerDetails?.email).filter(Boolean));
      totalCustomers = uniqueCustomers.size;

      pendingPayments = await Order.countDocuments({
        $or: [
          { orderStatus: 'Payment Verification' },
          { paymentStatus: 'Pending Verification' }
        ]
      });

      readyForDelivery = await Order.countDocuments({
        orderStatus: { $in: ['Shipped', 'Packed'] }
      });

      deliveredOrders = await Order.countDocuments({
        orderStatus: 'Delivered'
      });
    } else {
      const store = getMemoryStore();
      totalOrders = store.orders.length;
      totalProducts = store.products.length;
      totalRevenue = store.orders
        .filter(o => ['Paid', 'Packed', 'Shipped', 'Delivered'].includes(o.orderStatus))
        .reduce((sum, o) => sum + (o.total || 0), 0);
      totalCustomers = new Set(store.orders.map(o => o.customerDetails?.phone)).size;
      pendingPayments = store.orders.filter(o => o.orderStatus === 'Payment Verification').length;
      readyForDelivery = store.orders.filter(o => ['Shipped', 'Packed'].includes(o.orderStatus)).length;
      deliveredOrders = store.orders.filter(o => o.orderStatus === 'Delivered').length;
    }

    return apiResponse(true, {
      totalOrders,
      totalRevenue,
      totalProducts,
      totalCustomers,
      pendingPayments,
      readyForDelivery,
      deliveredOrders,
    }, 'Admin statistics retrieved from MongoDB');
  } catch (error: any) {
    return apiResponse(false, null, error.message || 'Failed to fetch admin stats', 500);
  }
}
