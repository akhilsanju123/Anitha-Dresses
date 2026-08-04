import { Order, PaymentMethod } from '../../types';

export interface PaymentProcessResult {
  success: boolean;
  transactionId?: string;
  orderStatus: Order['orderStatus'];
  paymentStatus: Order['paymentStatus'];
  message: string;
}

export interface PaymentGatewayAdapter {
  id: string;
  name: string;
  processPayment(order: Order, payload?: any): Promise<PaymentProcessResult>;
}

export async function executeOrderPayment(
  method: PaymentMethod,
  order: Order,
  payload?: any
): Promise<PaymentProcessResult> {
  switch (method) {
    case 'upi':
      return {
        success: true,
        orderStatus: 'Payment Verification',
        paymentStatus: 'Pending Verification',
        message: 'UPI payment screenshot uploaded. Awaiting Admin verification.',
      };
    case 'qr_scanner':
      return {
        success: true,
        orderStatus: 'Payment Verification',
        paymentStatus: 'Pending Verification',
        message: 'QR Payment screenshot uploaded. Awaiting Admin verification.',
      };
    default:
      return {
        success: false,
        orderStatus: 'Pending',
        paymentStatus: 'Failed',
        message: 'Invalid payment method selected.',
      };
  }
}
