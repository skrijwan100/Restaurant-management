import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { OrderData } from '../../../services/order';
import { Order, OrderStatus } from '../../../models/order.model';
import { BillModalComponent } from '../../../components/bill-modal/bill-modal';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-manage-orders',
  imports: [MatIconModule, BillModalComponent],
  template: `
    <div class="space-y-6">
      
      <!-- Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
        <div>
          <span class="text-xs font-bold uppercase tracking-widest text-[#E76F51]">Live Fulfillment</span>
          <h1 class="font-serif text-3xl font-bold text-[#264653] dark:text-white">Manage Orders</h1>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-xs font-semibold text-slate-500">
            Total Orders: <strong>{{ orderData.orders().length }}</strong>
          </span>
        </div>
      </div>

      <!-- Filters & Search -->
      <div class="bg-white dark:bg-[#1b2a32] p-4 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="relative w-full sm:max-w-xs">
          <mat-icon class="absolute left-3 top-2.5 text-slate-400 text-lg">search</mat-icon>
          <input 
            type="text" 
            placeholder="Search by order # or customer..."
            [value]="searchQuery()"
            (input)="searchQuery.set($any($event.target).value)"
            class="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white"
          />
        </div>

        <div class="flex items-center gap-2 w-full sm:w-auto">
          <span class="text-xs text-slate-400 font-semibold">Status:</span>
          <select 
            [value]="selectedStatus()"
            (change)="selectedStatus.set($any($event.target).value)"
            class="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white">
            <option value="ALL">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Preparing">Preparing</option>
            <option value="Ready">Ready</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <!-- Orders Table -->
      <div class="bg-white dark:bg-[#1b2a32] rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-white/10">
              <tr>
                <th class="py-3.5 px-4 font-bold">Order #</th>
                <th class="py-3.5 px-4 font-bold">Customer</th>
                <th class="py-3.5 px-4 font-bold">Items</th>
                <th class="py-3.5 px-4 font-bold">Payment</th>
                <th class="py-3.5 px-4 font-bold">Total</th>
                <th class="py-3.5 px-4 font-bold">Current Status</th>
                <th class="py-3.5 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-white/5">
              @for (ord of displayedOrders(); track ord.id) {
                <tr class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  
                  <td class="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                    {{ ord.orderNumber }}
                    <span class="block text-[10px] text-slate-400 font-normal">{{ ord.orderType }}</span>
                  </td>

                  <td class="py-3.5 px-4">
                    <p class="font-bold text-slate-800 dark:text-white">{{ ord.customerName }}</p>
                    <p class="text-[11px] text-slate-400">{{ ord.customerPhone }}</p>
                  </td>

                  <td class="py-3.5 px-4">
                    <span class="font-medium text-slate-700 dark:text-slate-300">
                      {{ ord.items.length }} dishes
                    </span>
                    <span class="block text-[10px] text-slate-400 truncate max-w-xs">
                      {{ getItemsSummary(ord) }}
                    </span>
                  </td>

                  <td class="py-3.5 px-4">
                    <span class="font-semibold text-slate-700 dark:text-slate-200">{{ ord.paymentMethod }}</span>
                    <span class="block text-[10px] text-slate-400">({{ ord.paymentStatus }})</span>
                  </td>

                  <td class="py-3.5 px-4 font-extrabold text-[#E76F51]">
                    \${{ ord.total.toFixed(2) }}
                  </td>

                  <td class="py-3.5 px-4">
                    <select 
                      [value]="ord.status"
                      (change)="onStatusChange(ord.id, $any($event.target).value)"
                      class="text-xs font-bold rounded-lg px-2.5 py-1 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 cursor-pointer"
                      [class.text-amber-600]="ord.status === 'Pending'"
                      [class.text-blue-600]="ord.status === 'Preparing'"
                      [class.text-purple-600]="ord.status === 'Ready'"
                      [class.text-emerald-600]="ord.status === 'Delivered'"
                      [class.text-rose-600]="ord.status === 'Cancelled'">
                      <option value="Pending">Pending</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Ready">Ready</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>

                  <td class="py-3.5 px-4 text-right">
                    <button 
                      type="button" 
                      (click)="selectedBillOrder.set(ord)"
                      class="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer inline-flex items-center gap-1">
                      <mat-icon class="text-xs">receipt</mat-icon>
                      <span>Bill</span>
                    </button>
                  </td>

                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Bill / Invoice Modal -->
      <app-bill-modal 
        [order]="selectedBillOrder()" 
        (closeModal)="selectedBillOrder.set(null)">
      </app-bill-modal>

    </div>
  `
})
export class ManageOrdersPage {
  orderData = inject(OrderData);

  searchQuery = signal<string>('');
  selectedStatus = signal<string>('ALL');
  selectedBillOrder = signal<Order | null>(null);

  displayedOrders(): Order[] {
    let list = this.orderData.orders();
    const query = this.searchQuery().toLowerCase().trim();
    const status = this.selectedStatus();

    if (query) {
      list = list.filter(o => 
        o.orderNumber.toLowerCase().includes(query) || 
        o.customerName.toLowerCase().includes(query) ||
        o.customerPhone.includes(query)
      );
    }

    if (status !== 'ALL') {
      list = list.filter(o => o.status === status);
    }

    return list;
  }

  getItemsSummary(order: Order): string {
    return order.items.map(i => `${i.quantity}x ${i.food.name}`).join(', ');
  }

  onStatusChange(orderId: string, status: OrderStatus): void {
    this.orderData.updateOrderStatus(orderId, status);
  }
}
