import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AdminData } from '../../../services/admin';
import { BookingData } from '../../../services/booking';
import { OrderData } from '../../../services/order';
import { DashboardCardComponent } from '../../../components/dashboard-card/dashboard-card';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-admin-dashboard',
  imports: [RouterLink, MatIconModule, DashboardCardComponent],
  template: `
    <div class="space-y-8">
      
      <!-- Top Title Bar -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
        <div>
          <span class="text-xs font-bold uppercase tracking-widest text-[#E76F51]">Operations Control</span>
          <h1 class="font-serif text-3xl font-bold text-[#264653] dark:text-white">Admin Dashboard</h1>
        </div>

        <div class="flex items-center gap-2">
          <a routerLink="/admin/orders" class="px-4 py-2 rounded-xl bg-[#E76F51] text-white text-xs font-bold shadow-md hover:bg-[#D9593B] flex items-center gap-1.5">
            <mat-icon class="text-sm">receipt_long</mat-icon>
            <span>Live Orders</span>
          </a>
          <a routerLink="/admin/bookings" class="px-4 py-2 rounded-xl bg-[#2A9D8F] text-white text-xs font-bold shadow-md hover:bg-[#21867A] flex items-center gap-1.5">
            <mat-icon class="text-sm">event_seat</mat-icon>
            <span>Bookings</span>
          </a>
        </div>
      </div>

      <!-- KPI Statistics Cards (4) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <app-dashboard-card 
          label="Today's Revenue" 
          [value]="'$' + adminData.todayRevenue().toFixed(2)" 
          icon="attach_money" 
          color="orange"
          trend="+18.4%"
          subtext="Total lifetime: $' + adminData.totalRevenue().toFixed(2)">
        </app-dashboard-card>

        <app-dashboard-card 
          label="Today's Orders" 
          [value]="adminData.todayOrdersCount()" 
          icon="shopping_bag" 
          color="teal"
          trend="+12%"
          subtext="Across delivery & dine-in">
        </app-dashboard-card>

        <app-dashboard-card 
          label="Today's Bookings" 
          [value]="adminData.todayBookingsCount()" 
          icon="event_available" 
          color="blue"
          subtext="Table reservations">
        </app-dashboard-card>

        <app-dashboard-card 
          label="Total Customers" 
          [value]="adminData.totalCustomersCount()" 
          icon="people" 
          color="purple"
          trend="+5 new"
          subtext="Registered dining club members">
        </app-dashboard-card>
      </div>

      <!-- Two-Column Chart & Top Sellers Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <!-- Weekly Sales SVG Chart (7 cols) -->
        <div class="lg:col-span-7 bg-white dark:bg-[#1b2a32] p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm space-y-6">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3">
            <div>
              <h3 class="font-serif text-base font-bold text-slate-800 dark:text-white">Weekly Revenue Performance</h3>
              <p class="text-xs text-slate-400">Total volume for last 7 rolling business days</p>
            </div>
            <a routerLink="/admin/reports" class="text-xs font-bold text-[#E76F51] hover:underline">View Reports</a>
          </div>

          <!-- Interactive Bar Graph SVG Visualization -->
          <div class="space-y-4 pt-2">
            <div class="flex items-end justify-between gap-3 h-48 px-2">
              @for (day of adminData.weeklySales(); track day.date) {
                <div class="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <span class="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    \${{ day.amount }}
                  </span>
                  
                  <div 
                    class="w-full max-w-[40px] rounded-t-xl bg-gradient-to-t from-[#E76F51] to-[#F4A261] group-hover:brightness-110 transition-all shadow-sm"
                    [style.height.%]="getBarPercent(day.amount)">
                  </div>

                  <span class="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                    {{ day.label }}
                  </span>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Top Selling Dishes (5 cols) -->
        <div class="lg:col-span-5 bg-white dark:bg-[#1b2a32] p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3">
            <h3 class="font-serif text-base font-bold text-slate-800 dark:text-white">Top Culinary Best-Sellers</h3>
            <span class="text-xs text-slate-400">By Orders</span>
          </div>

          <div class="space-y-3">
            @for (item of adminData.topSellingFoods(); track item.food.id) {
              <div class="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <div class="flex items-center gap-3 min-w-0">
                  <img [src]="item.food.image" [alt]="item.food.name" referrerpolicy="no-referrer" class="w-10 h-10 rounded-lg object-cover shrink-0" />
                  <div class="min-w-0">
                    <p class="text-xs font-bold text-slate-800 dark:text-white truncate">{{ item.food.name }}</p>
                    <p class="text-[11px] text-slate-400">{{ item.count }} orders · \${{ item.revenue.toFixed(2) }}</p>
                  </div>
                </div>
                <span class="text-xs font-extrabold text-[#E76F51] shrink-0">
                  \${{ item.food.price.toFixed(2) }}
                </span>
              </div>
            }
          </div>
        </div>

      </div>

      <!-- Live Floor Seating Quick Overview -->
      <div class="bg-white dark:bg-[#1b2a32] p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3">
          <div>
            <h3 class="font-serif text-base font-bold text-slate-800 dark:text-white">Live Table Occupancy (15 Tables)</h3>
            <p class="text-xs text-slate-400">Current real-time status of all dining stations</p>
          </div>
          <a routerLink="/admin/tables" class="text-xs font-bold text-[#2A9D8F] hover:underline">Manage Tables</a>
        </div>

        <div class="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 gap-3">
          @for (tbl of bookingData.tables(); track tbl.id) {
            <div 
              class="p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center space-y-1"
              [class.bg-emerald-50]="tbl.status === 'Available'"
              [class.border-emerald-200]="tbl.status === 'Available'"
              [class.text-emerald-800]="tbl.status === 'Available'"
              [class.bg-amber-50]="tbl.status === 'Reserved'"
              [class.border-amber-200]="tbl.status === 'Reserved'"
              [class.text-amber-800]="tbl.status === 'Reserved'"
              [class.bg-rose-50]="tbl.status === 'Occupied' || tbl.status === 'Maintenance'"
              [class.border-rose-200]="tbl.status === 'Occupied' || tbl.status === 'Maintenance'"
              [class.text-rose-800]="tbl.status === 'Occupied' || tbl.status === 'Maintenance'">
              <span class="text-xs font-extrabold">T-{{ tbl.tableNumber }}</span>
              <span class="text-[9px] uppercase font-bold">{{ tbl.status }}</span>
            </div>
          }
        </div>
      </div>

    </div>
  `
})
export class AdminDashboardPage {
  adminData = inject(AdminData);
  bookingData = inject(BookingData);
  orderData = inject(OrderData);

  getBarPercent(amount: number): number {
    const max = 300;
    return Math.min(100, Math.max(15, (amount / max) * 100));
  }
}
