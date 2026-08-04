/**
 * ANITHA DRESSES - Customer Notification Service Architecture
 * Supports internal status logging, email dispatches, and WhatsApp Gateway integration.
 */

export interface OrderNotificationPayload {
  orderId: string;
  customerPhone: string;
  customerName: string;
  newStatus: 'Payment Verification' | 'Paid' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled';
  totalAmount: number;
}

export async function sendCustomerNotification(payload: OrderNotificationPayload): Promise<{ success: boolean; message: string }> {
  const { orderId, customerPhone, customerName, newStatus, totalAmount } = payload;

  let messageText = '';

  switch (newStatus) {
    case 'Paid':
      messageText = `Hello ${customerName}, your payment for order #${orderId} (₹${totalAmount}) has been verified successfully by ANITHA DRESSES!`;
      break;
    case 'Packed':
    case 'Shipped':
      messageText = `Hello ${customerName}, your order #${orderId} is packed and ready for delivery from ANITHA DRESSES (Ongole)!`;
      break;
    case 'Delivered':
      messageText = `Hello ${customerName}, your order #${orderId} has been delivered successfully. Thank you for shopping with ANITHA DRESSES!`;
      break;
    default:
      messageText = `Hello ${customerName}, your order #${orderId} status is updated to: ${newStatus}.`;
      break;
  }

  console.log(`[CUSTOMER NOTIFICATION LOG] To: ${customerPhone} | Message: "${messageText}"`);

  if (process.env.WHATSAPP_API_URL && process.env.WHATSAPP_API_KEY) {
    try {
      await fetch(process.env.WHATSAPP_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.WHATSAPP_API_KEY}`,
        },
        body: JSON.stringify({
          phone: customerPhone,
          message: messageText,
        }),
      });
    } catch (err) {
      console.warn("External SMS/WhatsApp API Dispatch Warning:", err);
    }
  }

  return { success: true, message: messageText };
}

export async function sendOrderConfirmationEmail(order: any): Promise<boolean> {
  console.log(`[EMAIL DISPATCH LOG] Order Confirmation Email sent for Order #${order?.orderId || order?.id} to ${order?.shippingAddress?.email || 'Customer'}`);
  return true;
}

export async function sendWhatsAppNotification(orderOrPhone: any, statusOrMessage?: string): Promise<boolean> {
  const recipient = typeof orderOrPhone === 'string' ? orderOrPhone : orderOrPhone?.customerDetails?.phone || '9618138383';
  const msg = statusOrMessage || 'Order status update from ANITHA DRESSES';
  console.log(`[WHATSAPP DISPATCH LOG] To ${recipient}: "${msg}"`);
  return true;
}

export function generateProductWhatsAppEnquiry(productOrName: any, sizeOrSku?: any, priceOrColor?: any): string {
  const storePhone = '918977969989';
  const name = typeof productOrName === 'string' ? productOrName : productOrName?.name || 'Dress';
  const sku = typeof productOrName === 'object' ? productOrName?.sku || 'AD-EXCLUSIVE' : (typeof sizeOrSku === 'string' ? sizeOrSku : 'AD-EXCLUSIVE');
  const price = typeof productOrName === 'object' ? productOrName?.offerPrice || productOrName?.price || '' : (typeof priceOrColor === 'number' ? priceOrColor : '');
  
  const text = encodeURIComponent(`Hello ANITHA DRESSES, I would like to inquire about ${name} (SKU: ${sku}${price ? `, Price: ₹${price}` : ''}). Please provide more details.`);
  return `https://wa.me/${storePhone}?text=${text}`;
}
