import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { OrderData } from '../../services/order';
import { OrderCardComponent } from '../../components/order-card/order-card';
import { BillModalComponent } from '../../components/bill-modal/bill-modal';
import { TrackingModalComponent } from '../../components/tracking-modal/tracking-modal';
import { Order } from '../../models/order.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-orders',
  imports: [RouterLink, MatIconModule, OrderCardComponent, BillModalComponent, TrackingModalComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <!-- Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
        <div>
          <span class="text-xs font-bold uppercase tracking-widest text-[#E76F51]">Dining History</span>
          <h1 class="font-serif text-3xl font-bold text-[#264653] dark:text-white">Your Orders</h1>
        </div>
        <a 
          routerLink="/menu" 
          class="px-5 py-2.5 rounded-xl bg-[#E76F51] text-white text-xs font-bold shadow-md hover:bg-[#D9593B] transition-all flex items-center gap-1.5 cursor-pointer">
          <mat-icon class="text-sm">add</mat-icon>
          <span>Order More Food</span>
        </a>
      </div>

      <!-- Filter Buttons -->
      <div class="flex items-center gap-2 overflow-x-auto pb-1">
        <button 
          type="button" 
          (click)="filterStatus.set('ALL')"
          class="px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
          [class.bg-[#E76F51]]="filterStatus() === 'ALL'"
          [class.text-white]="filterStatus() === 'ALL'"
          [class.bg-slate-100]="filterStatus() !== 'ALL'"
          [class.dark:bg-slate-800]="filterStatus() !== 'ALL'"
          [class.text-slate-600]="filterStatus() !== 'ALL'"
          [class.dark:text-slate-300]="filterStatus() !== 'ALL'">
          All Orders ({{ orderData.userOrders().length }})
        </button>
        <button 
          type="button" 
          (click)="filterStatus.set('ACTIVE')"
          class="px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
          [class.bg-[#E76F51]]="filterStatus() === 'ACTIVE'"
          [class.text-white]="filterStatus() === 'ACTIVE'"
          [class.bg-slate-100]="filterStatus() !== 'ACTIVE'"
          [class.dark:bg-slate-800]="filterStatus() !== 'ACTIVE'"
          [class.text-slate-600]="filterStatus() !== 'ACTIVE'"
          [class.dark:text-slate-300]="filterStatus() !== 'ACTIVE'">
          In Progress
        </button>
        <button 
          type="button" 
          (click)="filterStatus.set('DELIVERED')"
          class="px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
          [class.bg-[#E76F51]]="filterStatus() === 'DELIVERED'"
          [class.text-white]="filterStatus() === 'DELIVERED'"
          [class.bg-slate-100]="filterStatus() !== 'DELIVERED'"
          [class.dark:bg-slate-800]="filterStatus() !== 'DELIVERED'"
          [class.text-slate-600]="filterStatus() !== 'DELIVERED'"
          [class.dark:text-slate-300]="filterStatus() !== 'DELIVERED'">
          Delivered
        </button>
      </div>

      <!-- Orders List -->
      @if (filteredOrders().length > 0) {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          @for (ord of filteredOrders(); track ord.id) {
            <app-order-card 
              [order]="ord"
              (viewBill)="selectedBillOrder.set($event)"
              (viewTimeline)="selectedTrackingOrder.set($event)">
            </app-order-card>
          }
        </div>
      } @else {
        <!-- Empty State -->
        <div class="text-center py-16 bg-white dark:bg-[#1b2a32] rounded-3xl border border-slate-200 dark:border-white/10 p-8 space-y-4 max-w-md mx-auto">
          <div class="w-16 h-16 rounded-2xl bg-orange-100 dark:bg-orange-950 flex items-center justify-center text-[#E76F51] mx-auto">
            <mat-icon class="text-3xl">receipt_long</mat-icon>
          </div>
          <h3 class="font-serif text-lg font-bold text-slate-800 dark:text-white">No Orders Found</h3>
          <p class="text-xs text-slate-500">
            You don't have any orders matching the selected filter.
          </p>
          <a routerLink="/menu" class="inline-block px-5 py-2.5 rounded-xl bg-[#E76F51] text-white text-xs font-bold shadow-md">
            Order From Our Menu
          </a>
        </div>
      }

      <!-- Modals -->
      <app-bill-modal 
        [order]="selectedBillOrder()" 
        (closeModal)="selectedBillOrder.set(null)">
      </app-bill-modal>

      <app-tracking-modal 
        [order]="selectedTrackingOrder()" 
        (closeModal)="selectedTrackingOrder.set(null)">
      </app-tracking-modal>

    </div>
  `
})
export class OrdersPage {
  orderData = inject(OrderData);

  filterStatus = signal<'ALL' | 'ACTIVE' | 'DELIVERED'>('ALL');
  selectedBillOrder = signal<Order | null>(null);
  selectedTrackingOrder = signal<Order | null>(null);

  filteredOrders(): Order[] {
    const list = this.orderData.userOrders();
    const filter = this.filterStatus();

    if (filter === 'ACTIVE') {
      return list.filter(o => o.status === 'Pending' || o.status === 'Preparing' || o.status === 'Ready');
    }
    if (filter === 'DELIVERED') {
      return list.filter(o => o.status === 'Delivered');
    }
    return list;
  }
}
