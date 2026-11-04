import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SlicePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Auth } from '../../services/auth';
import { BookingData } from '../../services/booking';
import { OrderData } from '../../services/order';
import { FoodData } from '../../services/food';
import { DashboardCardComponent } from '../../components/dashboard-card/dashboard-card';
import { FoodCardComponent } from '../../components/food-card/food-card';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-dashboard',
  imports: [RouterLink, MatIconModule, DashboardCardComponent, FoodCardComponent, SlicePipe],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <!-- Welcome Hero Banner -->
      <div class="rounded-3xl bg-gradient-to-r from-[#264653] to-[#2A9D8F] p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-4">
          <img 
            [src]="auth.userAvatar()" 
            [alt]="auth.userName()" 
            referrerpolicy="no-referrer"
            class="w-16 h-16 rounded-2xl object-cover border-2 border-white/40 shadow-md shrink-0" 
          />
          <div>
            <span class="text-xs font-semibold text-[#F4A261] uppercase tracking-wider block">Customer Lounge</span>
            <h1 class="font-serif text-2xl sm:text-3xl font-bold">Welcome back, {{ auth.userName() }}!</h1>
            <p class="text-xs text-teal-100 mt-1">
              Member Tier: <strong>Epicurean Gold</strong> · Loyalty Balance: <strong>{{ auth.currentUser()?.loyaltyPoints || 340 }} Pts</strong>
            </p>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <a 
            routerLink="/book-table" 
            class="px-5 py-2.5 rounded-xl bg-[#E76F51] hover:bg-[#D9593B] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer">
            <mat-icon class="text-sm">event_seat</mat-icon>
            <span>Book Table</span>
          </a>
          <a 
            routerLink="/menu" 
            class="px-5 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer">
            <mat-icon class="text-sm">restaurant_menu</mat-icon>
            <span>Order Food</span>
          </a>
        </div>
      </div>

      <!-- Quick Metrics Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <app-dashboard-card 
          label="Upcoming Bookings" 
          [value]="bookingData.upcomingBookings().length" 
          icon="event_available" 
          color="orange"
          subtext="Active table holds">
        </app-dashboard-card>

        <app-dashboard-card 
          label="Orders Placed" 
          [value]="orderData.userOrders().length" 
          icon="receipt_long" 
          color="teal"
          subtext="Lifetime dining orders">
        </app-dashboard-card>

        <app-dashboard-card 
          label="Favorite Foods" 
          [value]="foodData.favorites().length" 
          icon="favorite" 
          color="blue"
          subtext="Saved culinary favorites">
        </app-dashboard-card>

        <app-dashboard-card 
          label="Loyalty Rewards" 
          [value]="auth.currentUser()?.loyaltyPoints || 340" 
          icon="stars" 
          color="purple"
          subtext="Redeemable points">
        </app-dashboard-card>
      </div>

      <!-- Two-Column Layout: Upcoming Bookings & Recent Orders -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <!-- Upcoming Bookings (6 cols) -->
        <div class="lg:col-span-6 bg-white dark:bg-[#1b2a32] p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3">
            <div class="flex items-center gap-2">
              <mat-icon class="text-[#E76F51]">calendar_today</mat-icon>
              <h3 class="font-serif text-base font-bold text-slate-800 dark:text-white">Upcoming Reservations</h3>
            </div>
            <a routerLink="/bookings" class="text-xs text-[#E76F51] font-bold hover:underline">View All</a>
          </div>

          @if (bookingData.upcomingBookings().length > 0) {
            <div class="space-y-3">
              @for (bk of bookingData.upcomingBookings().slice(0, 3); track bk.id) {
                <div class="p-3.5 rounded-2xl bg-orange-50/50 dark:bg-slate-800/60 border border-orange-100 dark:border-slate-700 flex items-center justify-between">
                  <div class="space-y-0.5">
                    <span class="text-xs font-bold text-slate-800 dark:text-white">Table #{{ bk.tableNumber }}</span>
                    <p class="text-[11px] text-slate-500">{{ bk.date }} · {{ bk.timeSlot }}</p>
                    <p class="text-[11px] text-[#2A9D8F] font-semibold">{{ bk.guests }} Guests · {{ bk.occasion }}</p>
                  </div>
                  <span class="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {{ bk.status }}
                  </span>
                </div>
              }
            </div>
          } @else {
            <p class="text-xs text-slate-400 py-6 text-center">No upcoming reservations scheduled.</p>
          }
        </div>

        <!-- Recent Orders (6 cols) -->
        <div class="lg:col-span-6 bg-white dark:bg-[#1b2a32] p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3">
            <div class="flex items-center gap-2">
              <mat-icon class="text-[#2A9D8F]">receipt</mat-icon>
              <h3 class="font-serif text-base font-bold text-slate-800 dark:text-white">Recent Orders</h3>
            </div>
            <a routerLink="/orders" class="text-xs text-[#E76F51] font-bold hover:underline">Order History</a>
          </div>

          @if (orderData.recentOrders().length > 0) {
            <div class="space-y-3">
              @for (ord of orderData.recentOrders().slice(0, 3); track ord.id) {
                <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <div class="space-y-0.5">
                    <span class="text-xs font-bold text-slate-800 dark:text-white">{{ ord.orderNumber }} ({{ ord.orderType }})</span>
                    <p class="text-[11px] text-slate-500">{{ ord.items.length }} dishes · \${{ ord.total.toFixed(2) }}</p>
                    <p class="text-[10px] text-slate-400">{{ ord.createdAt | slice:0:10 }}</p>
                  </div>
                  <span class="text-xs font-bold px-2.5 py-1 rounded-full bg-orange-100 text-[#E76F51] dark:bg-orange-950">
                    {{ ord.status }}
                  </span>
                </div>
              }
            </div>
          } @else {
            <p class="text-xs text-slate-400 py-6 text-center">No recent orders yet.</p>
          }
        </div>

      </div>

      <!-- Favorite Foods Section -->
      @if (foodData.favoriteFoods().length > 0) {
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="font-serif text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <mat-icon class="text-rose-500">favorite</mat-icon>
              <span>Your Favorite Dishes</span>
            </h3>
            <a routerLink="/menu" class="text-xs font-bold text-[#E76F51] hover:underline">Explore More</a>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            @for (food of foodData.favoriteFoods().slice(0, 4); track food.id) {
              <app-food-card [food]="food"></app-food-card>
            }
          </div>
        </div>
      }

    </div>
  `
})
export class DashboardPage {
  auth = inject(Auth);
  bookingData = inject(BookingData);
  orderData = inject(OrderData);
  foodData = inject(FoodData);
}
