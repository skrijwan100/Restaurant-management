import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Order, OrderStatus } from '../../models/order.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-tracking-modal',
  imports: [MatIconModule],
  template: `
    @if (order(); as ord) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div class="bg-white dark:bg-[#1b2a32] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-white/10 space-y-6">
          
          <!-- Header -->
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
            <div>
              <span class="text-[11px] font-bold text-[#E76F51] uppercase tracking-wider">Live Order Status</span>
              <h3 class="text-base font-bold text-slate-800 dark:text-white">Order {{ ord.orderNumber }}</h3>
            </div>
            <button 
              type="button" 
              (click)="closeModal.emit()" 
              class="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer">
              <mat-icon class="text-sm">close</mat-icon>
            </button>
          </div>

          <!-- Step Progression Bar -->
          <div class="relative py-2">
            <div class="grid grid-cols-4 gap-2 text-center">
              
              <!-- Step 1: Confirmed -->
              <div class="flex flex-col items-center">
                <div 
                  class="w-10 h-10 rounded-full flex items-center justify-center text-white mb-2 shadow-md transition-all"
                  [class.bg-emerald-500]="isStepActive(ord.status, 'Pending')"
                  [class.bg-slate-200]="!isStepActive(ord.status, 'Pending')"
                  [class.dark:bg-slate-700]="!isStepActive(ord.status, 'Pending')">
                  <mat-icon class="text-lg">check</mat-icon>
                </div>
                <span class="text-xs font-bold text-slate-800 dark:text-white">Received</span>
              </div>

              <!-- Step 2: Preparing -->
              <div class="flex flex-col items-center">
                <div 
                  class="w-10 h-10 rounded-full flex items-center justify-center text-white mb-2 shadow-md transition-all"
                  [class.bg-emerald-500]="isStepActive(ord.status, 'Preparing')"
                  [class.bg-slate-200]="!isStepActive(ord.status, 'Preparing')"
                  [class.dark:bg-slate-700]="!isStepActive(ord.status, 'Preparing')">
                  <mat-icon class="text-lg">soup_kitchen</mat-icon>
                </div>
                <span class="text-xs font-bold text-slate-800 dark:text-white">Kitchen</span>
              </div>

              <!-- Step 3: Ready -->
              <div class="flex flex-col items-center">
                <div 
                  class="w-10 h-10 rounded-full flex items-center justify-center text-white mb-2 shadow-md transition-all"
                  [class.bg-emerald-500]="isStepActive(ord.status, 'Ready')"
                  [class.bg-slate-200]="!isStepActive(ord.status, 'Ready')"
                  [class.dark:bg-slate-700]="!isStepActive(ord.status, 'Ready')">
                  <mat-icon class="text-lg">dinner_dining</mat-icon>
                </div>
                <span class="text-xs font-bold text-slate-800 dark:text-white">Ready</span>
              </div>

              <!-- Step 4: Delivered -->
              <div class="flex flex-col items-center">
                <div 
                  class="w-10 h-10 rounded-full flex items-center justify-center text-white mb-2 shadow-md transition-all"
                  [class.bg-emerald-500]="ord.status === 'Delivered'"
                  [class.bg-rose-500]="ord.status === 'Cancelled'"
                  [class.bg-slate-200]="ord.status !== 'Delivered' && ord.status !== 'Cancelled'"
                  [class.dark:bg-slate-700]="ord.status !== 'Delivered' && ord.status !== 'Cancelled'">
                  <mat-icon class="text-lg">{{ ord.status === 'Cancelled' ? 'close' : 'celebration' }}</mat-icon>
                </div>
                <span class="text-xs font-bold text-slate-800 dark:text-white">
                  {{ ord.status === 'Cancelled' ? 'Cancelled' : 'Enjoy!' }}
                </span>
              </div>

            </div>
          </div>

          <!-- Timeline log items -->
          <div class="space-y-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-white/5 max-h-56 overflow-y-auto">
            <h4 class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Live Activity Log</h4>
            <div class="space-y-3">
              @for (log of ord.timeline; track log.time) {
                <div class="flex items-start gap-3 text-xs">
                  <div class="w-2 h-2 rounded-full bg-[#E76F51] mt-1.5 shrink-0"></div>
                  <div class="flex-1">
                    <p class="font-bold text-slate-800 dark:text-white">{{ log.status }}</p>
                    <p class="text-slate-500 dark:text-slate-400 text-[11px]">{{ log.description }}</p>
                  </div>
                  <span class="text-[10px] text-slate-400 font-mono">{{ log.time }}</span>
                </div>
              }
            </div>
          </div>

          <!-- Bottom Summary -->
          <div class="flex items-center justify-between text-xs pt-2">
            <div>
              <span class="text-slate-400 block text-[10px]">Estimated Service</span>
              <strong class="text-slate-700 dark:text-slate-200">20 - 30 Minutes</strong>
            </div>
            <button 
              type="button" 
              (click)="closeModal.emit()" 
              class="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold cursor-pointer">
              Close Tracker
            </button>
          </div>

        </div>
      </div>
    }
  `
})
export class TrackingModalComponent {
  order = input<Order | null>(null);
  closeModal = output<void>();

  isStepActive(currentStatus: OrderStatus, step: 'Pending' | 'Preparing' | 'Ready' | 'Delivered'): boolean {
    const ranks: Record<OrderStatus, number> = {
      'Pending': 1,
      'Preparing': 2,
      'Ready': 3,
      'Delivered': 4,
      'Cancelled': 0
    };
    const stepRank = ranks[step];
    const currentRank = ranks[currentStatus];
    return currentRank >= stepRank;
  }
}
