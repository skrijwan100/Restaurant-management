import { ChangeDetectionStrategy, Component, input, output, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Order } from '../../models/order.model';
import { Storage } from '../../services/storage';
import { Toast } from '../../services/toast';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-bill-modal',
  imports: [MatIconModule],
  template: `
    @if (order(); as ord) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div class="bg-white dark:bg-[#1b2a32] rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-white/10 p-6 space-y-6">
          
          <!-- Header Actions -->
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
            <div class="flex items-center gap-2 text-slate-800 dark:text-white font-bold text-sm">
              <mat-icon class="text-[#E76F51]">receipt_long</mat-icon>
              <span>Official Dining Invoice</span>
            </div>
            <div class="flex items-center gap-2">
              <button 
                type="button" 
                (click)="printBill()" 
                class="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                title="Print or Save PDF">
                <mat-icon class="text-sm">print</mat-icon>
              </button>
              <button 
                type="button" 
                (click)="closeModal.emit()" 
                class="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer">
                <mat-icon class="text-sm">close</mat-icon>
              </button>
            </div>
          </div>

          <!-- Invoice Paper Body -->
          <div class="bg-amber-50/40 dark:bg-slate-800/60 p-6 rounded-2xl border border-dashed border-amber-200 dark:border-slate-700 space-y-4 font-mono text-xs text-slate-800 dark:text-slate-200">
            
            <!-- Restaurant Info -->
            <div class="text-center space-y-1 pb-3 border-b border-dashed border-slate-300 dark:border-slate-700">
              <h2 class="font-serif text-lg font-bold text-[#264653] dark:text-white tracking-wider">
                {{ settings.name }}
              </h2>
              <p class="text-[11px] text-slate-500 dark:text-slate-400">{{ settings.address }}</p>
              <p class="text-[11px] text-slate-500 dark:text-slate-400">Tel: {{ settings.phone }} · GSTIN/Tax: US-92841029</p>
            </div>

            <!-- Order Metadata -->
            <div class="grid grid-cols-2 gap-2 text-[11px] pb-3 border-b border-dashed border-slate-300 dark:border-slate-700">
              <div>
                <span class="text-slate-400 block">Invoice No:</span>
                <strong>{{ ord.orderNumber }}</strong>
              </div>
              <div class="text-right">
                <span class="text-slate-400 block">Date & Time:</span>
                <span>{{ formatDate(ord.createdAt) }}</span>
              </div>
              <div>
                <span class="text-slate-400 block">Customer:</span>
                <span>{{ ord.customerName }}</span>
              </div>
              <div class="text-right">
                <span class="text-slate-400 block">Type:</span>
                <span class="uppercase font-bold text-[#E76F51]">{{ ord.orderType }}</span>
                @if (ord.tableNumber) {
                  <span>(T#{{ ord.tableNumber }})</span>
                }
              </div>
            </div>

            <!-- Items Table -->
            <div class="space-y-2 py-2">
              <div class="flex justify-between font-bold text-slate-500 dark:text-slate-400 text-[10px] uppercase border-b border-slate-200 dark:border-slate-700 pb-1">
                <span>Item & Description</span>
                <span class="text-right">Price</span>
              </div>

              @for (item of ord.items; track item.food.id) {
                <div class="flex justify-between items-center text-xs">
                  <div>
                    <span class="font-bold">{{ item.food.name }}</span>
                    <span class="text-slate-400 ml-1">x{{ item.quantity }}</span>
                  </div>
                  <span class="font-semibold text-right">
                    \${{ (item.food.price * item.quantity).toFixed(2) }}
                  </span>
                </div>
              }
            </div>

            <!-- Calculations -->
            <div class="pt-3 border-t border-dashed border-slate-300 dark:border-slate-700 space-y-1.5 text-xs">
              <div class="flex justify-between">
                <span class="text-slate-500 dark:text-slate-400">Subtotal:</span>
                <span>\${{ ord.subtotal.toFixed(2) }}</span>
              </div>

              @if (ord.discount > 0) {
                <div class="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Discount ({{ ord.couponCode }}):</span>
                  <span>-\${{ ord.discount.toFixed(2) }}</span>
                </div>
              }

              <div class="flex justify-between">
                <span class="text-slate-500 dark:text-slate-400">Tax ({{ settings.taxRatePercent }}%):</span>
                <span>\${{ ord.tax.toFixed(2) }}</span>
              </div>

              @if (ord.deliveryFee > 0) {
                <div class="flex justify-between">
                  <span class="text-slate-500 dark:text-slate-400">Delivery Fee:</span>
                  <span>\${{ ord.deliveryFee.toFixed(2) }}</span>
                </div>
              }

              <div class="flex justify-between pt-2 border-t border-slate-300 dark:border-slate-700 text-sm font-extrabold text-[#E76F51]">
                <span>GRAND TOTAL:</span>
                <span>\${{ ord.total.toFixed(2) }}</span>
              </div>

              <div class="pt-1 flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>Payment Mode:</span>
                <strong>{{ ord.paymentMethod }} ({{ ord.paymentStatus }})</strong>
              </div>
            </div>

            <!-- Footer Quote -->
            <div class="pt-4 text-center text-[10px] text-slate-400 border-t border-dashed border-slate-300 dark:border-slate-700">
              <p>*** Thank you for dining with Savoria! ***</p>
              <p>Follow us on Instagram &#64;savoria.ristorante</p>
            </div>

          </div>

          <!-- Bottom Button -->
          <div class="flex justify-end gap-3">
            <button 
              type="button" 
              (click)="printBill()" 
              class="px-5 py-2.5 rounded-xl bg-[#E76F51] hover:bg-[#D9593B] text-white text-xs font-bold shadow-md shadow-[#E76F51]/20 flex items-center gap-1.5 cursor-pointer">
              <mat-icon class="text-sm">download</mat-icon>
              <span>Download PDF Invoice</span>
            </button>
          </div>

        </div>
      </div>
    }
  `
})
export class BillModalComponent {
  order = input<Order | null>(null);
  closeModal = output<void>();

  private storage = inject(Storage);
  private toast = inject(Toast);
  settings = this.storage.getSettings();

  formatDate(isoString: string): string {
    return new Date(isoString).toLocaleString([], {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  }

  printBill(): void {
    if (typeof window !== 'undefined') {
      window.print();
    }
    this.toast.success('Invoice exported successfully', 'PDF Ready');
  }
}
