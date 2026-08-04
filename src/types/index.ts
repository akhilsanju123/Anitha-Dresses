export type SizeOption = 'S' | 'M' | 'L' | 'XL' | 'XXL' | '3XL' | 'Free Size' | '2-3Y' | '4-5Y' | '6-7Y' | '8-9Y' | '10-11Y' | '12-13Y' | string;

export type ProductLabel = 'new' | 'popular' | 'trending' | 'sale' | 'bestseller' | 'best_seller' | string;

export type UserRole = 'super_admin' | 'store_admin' | 'customer' | string;

export interface ProductVariant {
  size: SizeOption;
  color: string;
  stock: number;
}

export interface ColorOption {
  name: string;
  hex: string;
}

export interface Product {
  _id?: string;
  id: string;
  name: string;
  slug: string;
  category: string;
  subcategory?: string;
  brand: string;
  price: number;
  offerPrice: number;
  mrp: number;
  sku: string;
  barcode?: string;
  hsnCode?: string;
  description: string;
  specifications?: Record<string, string>;
  images: string[];
  sizes: SizeOption[];
  colors: ColorOption[];
  variants: ProductVariant[];
  stock: number;
  lowStockThreshold: number;
  labels: ProductLabel[];
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  rating: number;
  reviewsCount: number;
  createdAt: string;
}

export interface Category {
  _id?: string;
  id: string;
  name: string;
  slug: string;
  image: string;
  description?: string;
  subcategories: string[];
  itemCount?: number;
}

export interface Brand {
  _id?: string;
  id: string;
  name: string;
  logo?: string;
  description?: string;
}

export interface CartItem {
  product: Product;
  selectedSize: SizeOption;
  selectedColor: string;
  quantity: number;
}

export type PaymentMethod = 'qr_scanner' | 'upi';
export type PaymentStatus = 'Pending Verification' | 'Paid' | 'Failed';
export type OrderStatus = 'Pending' | 'Payment Verification' | 'Paid' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned';

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  category?: string;
  subcategory?: string;
  size: SizeOption | string;
  color: string;
  price: number;
  quantity: number;
  totalPrice?: number;
}

export interface CustomerAddress {
  fullName: string;
  phone: string;
  email: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  _id?: string;
  id: string;
  orderId: string;
  customerDetails: CustomerAddress;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: string;
  paymentScreenshot?: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  trackingNumber?: string;
  cancellationReason?: string;
  returnReason?: string;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType?: 'percentage' | 'fixed';
  discountValue?: number;
  minOrderAmount?: number;
  active: boolean;
  expiresAt?: string;
  type?: string;
  value?: number;
  minOrder?: number;
  expiryDate?: string;
}

export interface PincodeInfo {
  _id?: string;
  id?: string;
  pincode: string;
  city: string;
  state: string;
  estimatedDays: string;
  active: boolean;
  expressDelivery?: boolean;
  additionalDeliveryFee?: number;
}

export type ServiceablePincode = PincodeInfo;

export interface ProductReview {
  id: string;
  productId: string;
  productName?: string;
  customerName: string;
  rating: number;
  comment: string;
  status?: 'pending' | 'approved' | 'rejected' | string;
  approved?: boolean;
  createdAt: string;
}

export interface WebsiteSettings {
  storeName: string;
  storePhone?: string;
  storeEmail?: string;
  storeAddress?: string;
  freeShippingThreshold: number;
  upiId: string;
  upiQrCodeUrl?: string;
  bankAccountDetails?: {
    accountName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
  announcementText?: string;
  maintenanceMode?: boolean;
  banners?: {
    heroDesktop: string[];
    heroMobile?: string[];
    offerBanner?: string;
  };
  [key: string]: any;
}

export interface CMSBanner {
  id: string;
  title: string;
  image: string;
  link: string;
  tagline?: string;
  subtitle?: string;
  cta?: string;
  active: boolean;
}

export interface AnalyticsStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  pendingPaymentVerifications: number;
  totalProducts: number;
}
