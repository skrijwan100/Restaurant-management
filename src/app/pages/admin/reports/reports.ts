import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AdminData } from '../../../services/admin';
import { OrderData } from '../../../services/order';
import { BookingData } from '../../../services/booking';
import { Toast } from '../../../services/toast';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-reports',
  imports: [MatIconModule],
  template: `
    <div class="space-y-8">
      
      <!-- Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
        <div>
          <span class="text-xs font-bold uppercase tracking-widest text-[#E76F51]">Analytics & Intelligence</span>
          <h1 class="font-serif text-3xl font-bold text-[#264653] dark:text-white">Business Sales Reports</h1>
        </div>

        <button 
          type="button" 
          (click)="exportReportPDF()"
          class="px-5 py-2.5 rounded-xl bg-[#264653] hover:bg-[#1A303A] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer">
          <mat-icon class="text-sm">picture_as_pdf</mat-icon>
          <span>Export Executive PDF</span>
        </button>
      </div>

      <!-- Financial Metrics Cards (3) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="p-6 rounded-3xl bg-white dark:bg-[#1b2a32] border border-slate-200 dark:border-white/10 shadow-sm space-y-2">
          <span class="text-xs font-bold uppercase text-slate-400 tracking-wider">Today's Sales</span>
          <p class="font-serif text-3xl font-extrabold text-[#E76F51]">\${{ adminData.todayRevenue().toFixed(2) }}</p>
          <p class="text-xs text-slate-500">{{ adminData.todayOrdersCount() }} processed transactions today</p>
        </div>

        <div class="p-6 rounded-3xl bg-white dark:bg-[#1b2a32] border border-slate-200 dark:border-white/10 shadow-sm space-y-2">
          <span class="text-xs font-bold uppercase text-slate-400 tracking-wider">Last 7 Days Sales</span>
          <p class="font-serif text-3xl font-extrabold text-[#2A9D8F]">\${{ getWeeklyTotal().toFixed(2) }}</p>
          <p class="text-xs text-slate-500">Weekly average daily sales: \${{ (getWeeklyTotal() / 7).toFixed(0) }}</p>
        </div>

        <div class="p-6 rounded-3xl bg-white dark:bg-[#1b2a32] border border-slate-200 dark:border-white/10 shadow-sm space-y-2">
          <span class="text-xs font-bold uppercase text-slate-400 tracking-wider">Total Cumulative Revenue</span>
          <p class="font-serif text-3xl font-extrabold text-[#264653] dark:text-white">\${{ adminData.totalRevenue().toFixed(2) }}</p>
          <p class="text-xs text-slate-500">{{ orderData.orders().length }} lifetime orders fulfilled</p>
        </div>
      </div>

      <!-- Two-Column Breakdown: Top Foods & Most Reserved Tables -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <!-- Top Revenue Generating Foods -->
        <div class="bg-white dark:bg-[#1b2a32] p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
          <h3 class="font-serif text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <mat-icon class="text-[#E76F51]">restaurant</mat-icon>
            <span>Top Revenue Generating Dishes</span>
          </h3>

          <div class="space-y-3">
            @for (item of adminData.topSellingFoods(); track item.food.id) {
              <div class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <img [src]="item.food.image" [alt]="item.food.name" referrerpolicy="no-referrer" class="w-10 h-10 rounded-xl object-cover shrink-0" />
                  <div>
                    <h4 class="text-xs font-bold text-slate-800 dark:text-white">{{ item.food.name }}</h4>
                    <p class="text-[11px] text-slate-400">{{ item.count }} orders recorded</p>
                  </div>
                </div>
                <div class="text-right">
                  <span class="text-xs font-extrabold text-[#2A9D8F] block">\${{ item.revenue.toFixed(2) }}</span>
                  <span class="text-[10px] text-slate-400">Total Sales</span>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Most Reserved Tables -->
        <div class="bg-white dark:bg-[#1b2a32] p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
          <h3 class="font-serif text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <mat-icon class="text-[#2A9D8F]">event_seat</mat-icon>
            <span>Most Reserved Tables</span>
          </h3>

          <div class="space-y-3">
            @for (tbl of getMostReservedTables(); track tbl.table.id) {
              <div class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 text-[#2A9D8F] font-serif font-bold text-sm flex items-center justify-center">
                    #{{ tbl.table.tableNumber }}
                  </div>
                  <div>
                    <h4 class="text-xs font-bold text-slate-800 dark:text-white">Table {{ tbl.table.tableNumber }} ({{ tbl.table.zone }})</h4>
                    <p class="text-[11px] text-slate-400">{{ tbl.table.capacity }} Guests · {{ tbl.table.shape }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <span class="text-xs font-extrabold text-[#E76F51] block">{{ tbl.count }} Bookings</span>
                  <span class="text-[10px] text-slate-400">Reservations</span>
                </div>
              </div>
            }
          </div>
        </div>

      </div>

    </div>
  `
})
export class ReportsPage {
  adminData = inject(AdminData);
  orderData = inject(OrderData);
  bookingData = inject(BookingData);
  private toast = inject(Toast);

  getWeeklyTotal(): number {
    return this.adminData.weeklySales().reduce((sum, d) => sum + d.amount, 0);
  }

  getMostReservedTables() {
    const counts: Record<number, number> = {};
    for (const b of this.bookingData.bookings()) {
      counts[b.tableNumber] = (counts[b.tableNumber] || 0) + 1;
    }

    const tables = this.bookingData.tables();
    return Object.entries(counts)
      .map(([numStr, count]) => {
        const num = parseInt(numStr, 10);
        const table = tables.find(t => t.tableNumber === num) || tables[0];
        return { table, count };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  exportReportPDF(): void {
    if (typeof window !== 'undefined') {
      window.print();
    }
    this.toast.success('Executive Report successfully formatted and ready to print/save.', 'Report Exported');
  }
}
