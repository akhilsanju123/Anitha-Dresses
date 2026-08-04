import { NextRequest } from 'next/server';
import { connectDB, getMemoryStore } from '../../../lib/db';
import Order from '../../../lib/models/Order';
import Product from '../../../lib/models/Product';
import { apiResponse, authenticateAdmin } from '../../../lib/auth';
import { Order as OrderType, Product as ProductType, OrderItem } from '../../../types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const auth = authenticateAdmin(req);
    if (!auth.authorized) return auth.response!;

    await connectDB();

    if (Order.db.readyState === 1) {
      const orders = await Order.find({}).sort({ createdAt: -1 }).lean();
      return apiResponse(true, orders as unknown as OrderType[], 'Orders retrieved successfully');
    }

    const store = getMemoryStore();
    return apiResponse(true, store.orders, 'Orders retrieved successfully');
  } catch (error: any) {
    return apiResponse(false, null, error.message || 'Failed to fetch orders', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerDetails, items, paymentMethod, paymentScreenshot, subtotal, deliveryFee, discount, total } = body;

    if (!customerDetails?.fullName || !customerDetails?.phone || !customerDetails?.street) {
      return apiResponse(false, null, 'Customer name, phone, and address are required', 400);
    }

    if (!paymentScreenshot) {
      return apiResponse(false, null, 'Payment receipt screenshot is required before placing the order', 400);
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return apiResponse(false, null, 'Order must contain at least one item', 400);
    }

    // Build complete standalone snapshot for every purchased item
    const sanitizedItems: OrderItem[] = items.map((rawItem: any) => {
      const pObj = rawItem.product || rawItem;
      const unitPrice = Number(pObj.offerPrice || pObj.price || rawItem.price || 0);
      const safePrice = isNaN(unitPrice) ? 0 : unitPrice;
      const qty = Math.max(1, Number(rawItem.quantity || 1));
      const safeQty = isNaN(qty) ? 1 : qty;
      const itemTotal = safePrice * safeQty;

      const img = (pObj.images && Array.isArray(pObj.images) && pObj.images[0])
        ? pObj.images[0]
        : (rawItem.image || 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80');

      return {
        productId: pObj.id || rawItem.productId || `prod-${Date.now()}`,
        name: pObj.name || rawItem.name || 'ANITHA Fashion Item',
        image: img,
        category: pObj.category || rawItem.category || 'General',
        subcategory: pObj.subcategory || rawItem.subcategory || '',
        size: rawItem.selectedSize || rawItem.size || 'M',
        color: rawItem.selectedColor || rawItem.color || 'Standard',
        price: safePrice,
        quantity: safeQty,
        totalPrice: itemTotal,
      };
    });

    const computedSubtotal = sanitizedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const safeSubtotal = isNaN(Number(subtotal)) ? computedSubtotal : Number(subtotal);
    const safeDeliveryFee = isNaN(Number(deliveryFee)) ? 0 : Number(deliveryFee);
    const safeDiscount = isNaN(Number(discount)) ? 0 : Number(discount);
    const computedTotal = safeSubtotal + safeDeliveryFee - safeDiscount;
    const safeTotal = (isNaN(Number(total)) || Number(total) <= 0) ? computedTotal : Number(total);

    await connectDB();

    // Overselling protection & Inventory Deduction
    const store = getMemoryStore();
    for (const item of sanitizedItems) {
      let prod = null;
      if (Product.db.readyState === 1) {
        prod = await Product.findOne({ id: item.productId });
      } else {
        prod = store.products.find((p: ProductType) => p.id === item.productId);
      }

      if (prod && prod.stock < item.quantity) {
        return apiResponse(false, null, `Stock insufficient for product: ${prod.name} (Available: ${prod.stock})`, 400);
      }
    }

    // Deduct Stock
    for (const item of sanitizedItems) {
      if (Product.db.readyState === 1) {
        await Product.updateOne({ id: item.productId }, { $inc: { stock: -item.quantity } });
      }
      const memProd = store.products.find((p: ProductType) => p.id === item.productId);
      if (memProd) {
        memProd.stock = Math.max(0, memProd.stock - item.quantity);
      }
    }

    const orderId = `AD-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder: OrderType = {
      id: `ord-${Date.now()}`,
      orderId,
      customerDetails,
      items: sanitizedItems,
      subtotal: safeSubtotal,
      deliveryFee: safeDeliveryFee,
      discount: safeDiscount,
      total: safeTotal,
      paymentMethod: paymentMethod || 'QR Code / Bank Transfer',
      paymentScreenshot,
      paymentStatus: 'Pending Verification',
      orderStatus: 'Payment Verification',
      createdAt: new Date().toISOString(),
    };

    if (Order.db.readyState === 1) {
      await Order.create(newOrder);
    }
    store.orders.unshift(newOrder);

    return apiResponse(true, newOrder, 'Order placed successfully', 201);
  } catch (error: any) {
    return apiResponse(false, null, error.message || 'Failed to place order', 500);
  }
}
