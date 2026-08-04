import mongoose, { Schema, Document } from 'mongoose';
import { OrderItem, CustomerAddress, PaymentMethod, PaymentStatus, OrderStatus } from '../../types';

export interface IOrderDocument extends Document {
  id: string;
  orderId: string;
  customerDetails: CustomerAddress;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentScreenshot?: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  trackingNumber?: string;
  cancellationReason?: string;
  returnReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  size: { type: String, required: true },
  color: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const CustomerAddressSchema = new Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
});

const OrderSchema = new Schema<IOrderDocument>(
  {
    id: { type: String, required: true, unique: true },
    orderId: { type: String, required: true, unique: true, index: true },
    customerDetails: { type: CustomerAddressSchema, required: true },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    paymentScreenshot: { type: String },
    paymentStatus: { type: String, required: true },
    orderStatus: { type: String, required: true, index: true },
    trackingNumber: { type: String },
    cancellationReason: { type: String },
    returnReason: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model<IOrderDocument>('Order', OrderSchema);
