import { Injectable, signal, computed, inject } from '@angular/core';
import { Storage } from './storage';
import { Order, OrderStatus, PaymentMethod, OrderType } from '../models/order.model';
import { CartItem, Food } from '../models/food.model';
import { Coupon } from '../models/restaurant.model';
import { Toast } from './toast';
import { Auth } from './auth';
import confetti from 'canvas-confetti';

@Injectable({
  providedIn: 'root'
})
export class OrderData {
  private storage = inject(Storage);
  private toast = inject(Toast);
  private auth = inject(Auth);

  orders = signal<Order[]>(this.storage.getOrders());
  cart = signal<CartItem[]>([]);
  appliedCoupon = signal<Coupon | null>(null);

  // Computed Cart metrics
  cartCount = computed(() => {
    return this.cart().reduce((sum, item) => sum + item.quantity, 0);
  });

  subtotal = computed(() => {
    return Number(this.cart().reduce((sum, item) => sum + item.food.price * item.quantity, 0).toFixed(2));
  });

  discount = computed(() => {
    const coupon = this.appliedCoupon();
    const sub = this.subtotal();
    if (!coupon) return 0;

    if (sub < coupon.minOrder) return 0;

    let disc = 0;
    if (coupon.discountType === 'percentage') {
      disc = (sub * coupon.discountValue) / 100;
    } else {
      disc = coupon.discountValue;
    }
    return Number(Math.min(disc, sub).toFixed(2));
  });

  deliveryFee = computed(() => {
    const settings = this.storage.getSettings();
    const sub = this.subtotal();
    if (sub === 0) return 0;
    return sub >= settings.freeDeliveryThreshold ? 0 : settings.deliveryFee;
  });

  tax = computed(() => {
    const settings = this.storage.getSettings();
    const taxableAmount = Math.max(0, this.subtotal() - this.discount());
    return Number(((taxableAmount * settings.taxRatePercent) / 100).toFixed(2));
  });

  grandTotal = computed(() => {
    const total = this.subtotal() - this.discount() + this.tax() + this.deliveryFee();
    return Number(Math.max(0, total).toFixed(2));
  });

  userOrders = computed(() => {
    const user = this.auth.currentUser();
    if (!user) return [];
    return this.orders()
      .filter(o => o.userId === user.id || o.customerEmail.toLowerCase() === user.email.toLowerCase())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  });

  recentOrders = computed(() => {
    return this.userOrders().slice(0, 5);
  });

  // Cart operations
  addToCart(food: Food, quantity = 1): void {
    if (!food.isAvailable) {
      this.toast.warning(`Sorry, "${food.name}" is currently sold out.`);
      return;
    }

    const current = this.cart();
    const existingIndex = current.findIndex(item => item.food.id === food.id);

    if (existingIndex > -1) {
      const updated = [...current];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: updated[existingIndex].quantity + quantity
      };
      this.cart.set(updated);
      this.toast.success(`Updated quantity of "${food.name}" (${updated[existingIndex].quantity})`);
    } else {
      this.cart.set([...current, { food, quantity }]);
      this.toast.success(`Added "${food.name}" to cart!`, 'Cart Updated');
    }
  }

  updateQuantity(foodId: string, delta: number): void {
    const current = this.cart();
    const existing = current.find(item => item.food.id === foodId);
    if (!existing) return;

    const newQty = existing.quantity + delta;
    if (newQty <= 0) {
      this.removeFromCart(foodId);
    } else {
      const updated = current.map(item => 
        item.food.id === foodId ? { ...item, quantity: newQty } : item
      );
      this.cart.set(updated);
    }
  }

  removeFromCart(foodId: string): void {
    const current = this.cart();
    const item = current.find(i => i.food.id === foodId);
    this.cart.set(current.filter(i => i.food.id !== foodId));
    if (item) {
      this.toast.info(`Removed "${item.food.name}" from cart`);
    }
  }

  clearCart(): void {
    this.cart.set([]);
    this.appliedCoupon.set(null);
  }

  applyCoupon(code: string): boolean {
    const coupons = this.storage.getCoupons();
    const match = coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase());

    if (!match) {
      this.toast.error('Invalid coupon code. Try WELCOME20 or FEAST10', 'Coupon Error');
      return false;
    }

    if (this.subtotal() < match.minOrder) {
      this.toast.warning(`This coupon requires a minimum subtotal of $${match.minOrder}.`);
      return false;
    }

    this.appliedCoupon.set(match);
    this.toast.success(`Coupon "${match.code}" applied! ${match.description}`, 'Coupon Applied');
    return true;
  }

  removeCoupon(): void {
    this.appliedCoupon.set(null);
    this.toast.info('Coupon removed');
  }

  // Place Order
  placeOrder(details: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    orderType: OrderType;
    deliveryAddress?: string;
    tableNumber?: number;
    paymentMethod: PaymentMethod;
    specialNotes?: string;
  }): Order | null {
    if (this.cart().length === 0) {
      this.toast.error('Your cart is empty.');
      return null;
    }

    const user = this.auth.currentUser();
    const orderNum = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      userId: user?.id ?? 'guest',
      customerName: details.customerName,
      customerEmail: details.customerEmail,
      customerPhone: details.customerPhone,
      items: [...this.cart()],
      subtotal: this.subtotal(),
      discount: this.discount(),
      couponCode: this.appliedCoupon()?.code,
      tax: this.tax(),
      deliveryFee: details.orderType === 'Delivery' ? this.deliveryFee() : 0,
      total: this.grandTotal(),
      status: 'Pending',
      paymentMethod: details.paymentMethod,
      paymentStatus: details.paymentMethod === 'Cash' ? 'Pending' : 'Paid',
      orderType: details.orderType,
      deliveryAddress: details.deliveryAddress,
      tableNumber: details.tableNumber,
      specialNotes: details.specialNotes,
      createdAt: new Date().toISOString(),
      timeline: [
        {
          status: 'Pending',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          description: 'Order placed and waiting for chef confirmation'
        }
      ]
    };

    const updated = [newOrder, ...this.orders()];
    this.orders.set(updated);
    this.storage.setOrders(updated);

    // Empty cart
    this.clearCart();

    // Trigger celebratory confetti
    if (typeof window !== 'undefined') {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore in tests
      }
    }

    this.toast.success(`Order #${orderNum} has been received!`, 'Order Placed');
    return newOrder;
  }

  repeatOrder(order: Order): void {
    let count = 0;
    for (const item of order.items) {
      if (item.food.isAvailable) {
        this.addToCart(item.food, item.quantity);
        count++;
      }
    }
    if (count > 0) {
      this.toast.success(`Added ${count} items from order #${order.orderNumber} to cart!`, 'Order Repeated');
    } else {
      this.toast.warning('The items in this previous order are currently unavailable.');
    }
  }

  updateOrderStatus(orderId: string, status: OrderStatus): void {
    const updated = this.orders().map(o => {
      if (o.id !== orderId) return o;
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      let desc = '';
      switch (status) {
        case 'Preparing': desc = 'Kitchen started cooking your dishes'; break;
        case 'Ready': desc = 'Order plated and ready for serving or pickup'; break;
        case 'Delivered': desc = 'Delivered and enjoyed by guest'; break;
        case 'Cancelled': desc = 'Order cancelled'; break;
        default: desc = 'Status updated';
      }
      return {
        ...o,
        status,
        timeline: [
          ...o.timeline,
          { status, time: now, description: desc }
        ]
      };
    });

    this.orders.set(updated);
    this.storage.setOrders(updated);
    this.toast.success(`Order status updated to ${status}`);
  }
}
