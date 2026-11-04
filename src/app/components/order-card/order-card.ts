import { ChangeDetectionStrategy, Component, input, output, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Order } from '../../models/order.model';
import { OrderData } from '../../services/order';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-order-card',
  imports: [MatIconModule],
  template: `
    <div class="bg-white dark:bg-[#1b2a32] rounded-2xl border border-slate-200 dark:border-white/10 p-5 shadow-sm hover:shadow-md transition-all space-y-4">
      
      <!-- Top Header -->
      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-white/5 pb-3">
        <div class="flex items-center gap-2.5">
          <div class="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950 flex items-center justify-center text-[#E76F51]">
            <mat-icon class="text-xl">receipt</mat-icon>
          </div>
          <div>
            <h4 class="text-sm font-bold text-slate-800 dark:text-white">{{ order().orderNumber }}</h4>
            <p class="text-[11px] text-slate-400">
              {{ formatDate(order().createdAt) }} · {{ order().orderType }}
              @if (order().tableNumber) {
                <span>(Table #{{ order().tableNumber }})</span>
              }
            </p>
          </div>
        </div>

        <!-- Status Badge -->
        <div class="flex items-center gap-2">
          <span 
            class="text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5"
            [class.bg-amber-100]="order().status === 'Pending'"
            [class.text-amber-800]="order().status === 'Pending'"
            [class.bg-blue-100]="order().status === 'Preparing'"
            [class.text-blue-800]="order().status === 'Preparing'"
            [class.bg-purple-100]="order().status === 'Ready'"
            [class.text-purple-800]="order().status === 'Ready'"
            [class.bg-emerald-100]="order().status === 'Delivered'"
            [class.text-emerald-800]="order().status === 'Delivered'"
            [class.bg-rose-100]="order().status === 'Cancelled'"
            [class.text-rose-800]="order().status === 'Cancelled'">
            <span class="w-2 h-2 rounded-full animate-ping" [class.bg-amber-500]="order().status === 'Pending'" [class.bg-blue-500]="order().status === 'Preparing'" [class.bg-emerald-500]="order().status === 'Delivered'"></span>
            {{ order().status }}
          </span>
        </div>
      </div>

      <!-- Items List -->
      <div class="space-y-2">
        @for (item of order().items; track item.food.id) {
          <div class="flex items-center justify-between text-xs">
            <div class="flex items-center gap-2.5 min-w-0">
              <img [src]="item.food.image" [alt]="item.food.name" referrerpolicy="no-referrer" class="w-8 h-8 rounded-lg object-cover shrink-0" />
              <span class="font-medium text-slate-700 dark:text-slate-300 truncate">
                {{ item.food.name }}
              </span>
              <span class="text-slate-400">x{{ item.quantity }}</span>
            </div>
            <span class="font-semibold text-slate-800 dark:text-white shrink-0">
              \${{ (item.food.price * item.quantity).toFixed(2) }}
            </span>
          </div>
        }
      </div>

      <!-- Price Breakdown Summary -->
      <div class="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs">
        <div class="text-slate-500 dark:text-slate-400">
          Payment: <strong class="text-slate-700 dark:text-slate-200">{{ order().paymentMethod }} ({{ order().paymentStatus }})</strong>
        </div>
        <div class="text-right">
          <span class="text-[11px] text-slate-400 block">Total Amount</span>
          <span class="text-base font-extrabold text-[#E76F51]">
            \${{ order().total.toFixed(2) }}
          </span>
        </div>
      </div>

      <!-- Actions -->
      <div class="pt-2 flex flex-wrap items-center justify-end gap-2">
        <button 
          type="button" 
          (click)="viewTimeline.emit(order())"
          class="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer">
          <mat-icon class="text-sm text-[#2A9D8F]">timeline</mat-icon>
          Track Order
        </button>

        <button 
          type="button" 
          (click)="viewBill.emit(order())"
          class="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer">
          <mat-icon class="text-sm text-slate-500">description</mat-icon>
          Download Bill
        </button>

        <button 
          type="button" 
          (click)="orderData.repeatOrder(order())"
          class="px-3 py-1.5 rounded-lg bg-[#E76F51] hover:bg-[#D9593B] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1 cursor-pointer">
          <mat-icon class="text-sm">replay</mat-icon>
          Repeat Order
        </button>
      </div>

    </div>
  `
})
export class OrderCardComponent {
  order = input.required<Order>();
  viewBill = output<Order>();
  viewTimeline = output<Order>();

  orderData = inject(OrderData);

  formatDate(isoString: string): string {
    const d = new Date(isoString);
    return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  }
}
