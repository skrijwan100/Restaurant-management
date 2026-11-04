import { Injectable, computed, inject } from '@angular/core';
import { Storage } from './storage';
import { OrderData } from './order';
import { BookingData } from './booking';
import { FoodData } from './food';
import { Auth } from './auth';
import { Toast } from './toast';
import { RestaurantSettings } from '../models/restaurant.model';

import { Food } from '../models/food.model';

@Injectable({
  providedIn: 'root'
})
export class AdminData {
  private storage = inject(Storage);
  private orderData = inject(OrderData);
  private bookingData = inject(BookingData);
  private foodData = inject(FoodData);
  private auth = inject(Auth);
  private toast = inject(Toast);

  // Computed KPIs
  totalRevenue = computed(() => {
    return this.orderData.orders()
      .filter(o => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.total, 0);
  });

  todayRevenue = computed(() => {
    const today = new Date().toISOString().split('T')[0];
    return this.orderData.orders()
      .filter(o => o.status !== 'Cancelled' && o.createdAt.startsWith(today))
      .reduce((sum, o) => sum + o.total, 0);
  });

  todayOrdersCount = computed(() => {
    const today = new Date().toISOString().split('T')[0];
    return this.orderData.orders().filter(o => o.createdAt.startsWith(today)).length;
  });

  todayBookingsCount = computed(() => {
    const today = new Date().toISOString().split('T')[0];
    return this.bookingData.bookings().filter(b => b.date === today && b.status !== 'Cancelled').length;
  });

  totalCustomersCount = computed(() => {
    return this.auth.users().filter(u => u.role === 'customer').length;
  });

  pendingBookingsCount = computed(() => {
    return this.bookingData.bookings().filter(b => b.status === 'Pending').length;
  });

  activeOrdersCount = computed(() => {
    return this.orderData.orders().filter(o => o.status === 'Pending' || o.status === 'Preparing' || o.status === 'Ready').length;
  });

  // Top selling foods computed from all orders
  topSellingFoods = computed(() => {
    const countMap: Record<string, { food: Food; count: number; revenue: number }> = {};
    for (const order of this.orderData.orders()) {
      if (order.status === 'Cancelled') continue;
      for (const item of order.items) {
        if (!countMap[item.food.id]) {
          countMap[item.food.id] = { food: item.food, count: 0, revenue: 0 };
        }
        countMap[item.food.id].count += item.quantity;
        countMap[item.food.id].revenue += item.food.price * item.quantity;
      }
    }
    return Object.values(countMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  });

  // Weekly sales data (Last 7 days)
  weeklySales = computed(() => {
    const days: { label: string; date: string; amount: number; ordersCount: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = d.toLocaleDateString([], { weekday: 'short' });
      
      const orders = this.orderData.orders().filter(o => o.createdAt.startsWith(dateStr) && o.status !== 'Cancelled');
      const amount = orders.reduce((sum, o) => sum + o.total, 0);

      days.push({
        label: dayLabel,
        date: dateStr,
        amount: Number(amount.toFixed(2)),
        ordersCount: orders.length
      });
    }
    return days;
  });

  // Customer metrics
  customersList = computed(() => {
    const orders = this.orderData.orders();
    const bookings = this.bookingData.bookings();
    return this.auth.users()
      .filter(u => u.role === 'customer')
      .map(user => {
        const userOrders = orders.filter(o => o.userId === user.id || o.customerEmail.toLowerCase() === user.email.toLowerCase());
        const userBookings = bookings.filter(b => b.userId === user.id || b.customerEmail.toLowerCase() === user.email.toLowerCase());
        const totalSpent = userOrders.filter(o => o.status !== 'Cancelled').reduce((sum, o) => sum + o.total, 0);

        return {
          user,
          ordersCount: userOrders.length,
          bookingsCount: userBookings.length,
          totalSpent: Number(totalSpent.toFixed(2))
        };
      });
  });

  deleteCustomer(userId: string): void {
    const users = this.auth.users().filter(u => u.id !== userId);
    this.auth.users.set(users);
    this.storage.setUsers(users);
    this.toast.info('Customer account removed');
  }

  updateSettings(settings: RestaurantSettings): void {
    this.storage.setSettings(settings);
    this.toast.success('Restaurant configuration updated', 'Settings Saved');
  }
}
