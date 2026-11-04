import { CartItem } from './food.model';

export type OrderStatus = 'Pending' | 'Preparing' | 'Ready' | 'Delivered' | 'Cancelled';
export type PaymentMethod = 'Cash' | 'Card' | 'UPI';
export type OrderType = 'Dine-In' | 'Takeaway' | 'Delivery';

export interface Order {
  id: string;
  orderNumber: string; // e.g. "ORD-8421"
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  tax: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
  orderType: OrderType;
  deliveryAddress?: string;
  tableNumber?: number;
  specialNotes?: string;
  createdAt: string;
  timeline: {
    status: OrderStatus;
    time: string;
    description: string;
  }[];
}
