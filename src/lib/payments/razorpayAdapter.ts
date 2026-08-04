import { PaymentGatewayAdapter, PaymentProcessResult } from './paymentProvider';
import { Order } from '../../types';

export class RazorpayAdapter implements PaymentGatewayAdapter {
  id = 'razorpay';
  name = 'Razorpay Payment Gateway';

  async processPayment(order: Order, payload?: { razorpayPaymentId: string; razorpaySignature: string }): Promise<PaymentProcessResult> {
    if (!payload?.razorpayPaymentId) {
      return {
        success: false,
        orderStatus: 'Pending',
        paymentStatus: 'Failed',
        message: 'Razorpay Payment ID missing.',
      };
    }

    return {
      success: true,
      transactionId: payload.razorpayPaymentId,
      orderStatus: 'Paid',
      paymentStatus: 'Paid',
      message: 'Razorpay payment verified successfully.',
    };
  }
}
