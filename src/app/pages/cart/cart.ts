import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { OrderData } from '../../services/order';
import { Auth } from '../../services/auth';
import { Toast } from '../../services/toast';
import { PaymentMethod, OrderType } from '../../models/order.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-cart',
  imports: [RouterLink, MatIconModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
        <div>
          <span class="text-xs font-bold uppercase tracking-widest text-[#E76F51]">Dining Bag</span>
          <h1 class="font-serif text-3xl font-bold text-[#264653] dark:text-white">Your Cart</h1>
        </div>
        @if (orderData.cart().length > 0) {
          <button 
            type="button" 
            (click)="orderData.clearCart()" 
            class="text-xs text-rose-500 hover:text-rose-700 font-medium flex items-center gap-1 cursor-pointer">
            <mat-icon class="text-sm">delete_outline</mat-icon>
            Clear Bag
          </button>
        }
      </div>

      @if (orderData.cart().length > 0) {
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <!-- Items List (7 cols) -->
          <div class="lg:col-span-7 space-y-4">
            @for (item of orderData.cart(); track item.food.id) {
              <div class="p-4 rounded-2xl bg-white dark:bg-[#1b2a32] border border-slate-200 dark:border-white/10 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                
                <div class="flex items-center gap-3 min-w-0">
                  <img 
                    [src]="item.food.image" 
                    [alt]="item.food.name" 
                    referrerpolicy="no-referrer"
                    class="w-16 h-16 rounded-xl object-cover shrink-0" 
                  />
                  <div class="min-w-0">
                    <h4 class="text-sm font-bold text-slate-800 dark:text-white truncate">{{ item.food.name }}</h4>
                    <p class="text-xs text-slate-400">{{ item.food.category }}</p>
                    <span class="text-xs font-extrabold text-[#E76F51] block mt-1">
                      \${{ item.food.price.toFixed(2) }}
                    </span>
                  </div>
                </div>

                <!-- Quantity Controls and Line Total -->
                <div class="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                  
                  <div class="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
                    <button 
                      type="button" 
                      (click)="orderData.updateQuantity(item.food.id, -1)"
                      class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 cursor-pointer font-bold">
                      -
                    </button>
                    <span class="w-8 text-center text-xs font-bold text-slate-800 dark:text-white">
                      {{ item.quantity }}
                    </span>
                    <button 
                      type="button" 
                      (click)="orderData.updateQuantity(item.food.id, 1)"
                      class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 cursor-pointer font-bold">
                      +
                    </button>
                  </div>

                  <span class="text-sm font-bold text-slate-900 dark:text-white w-20 text-right">
                    \${{ (item.food.price * item.quantity).toFixed(2) }}
                  </span>

                  <button 
                    type="button" 
                    (click)="orderData.removeFromCart(item.food.id)"
                    class="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                    title="Remove item">
                    <mat-icon class="text-base">close</mat-icon>
                  </button>

                </div>

              </div>
            }

            <!-- Coupon Box -->
            <div class="p-5 rounded-2xl bg-white dark:bg-[#1b2a32] border border-slate-200 dark:border-white/10 shadow-sm space-y-3">
              <span class="text-xs font-bold text-slate-700 dark:text-slate-300 block">Apply Promotional Coupon</span>
              <div class="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Try WELCOME20 or FEAST10"
                  [value]="couponCodeInput()"
                  (input)="couponCodeInput.set($any($event.target).value)"
                  class="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs uppercase font-mono tracking-wider text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E76F51]"
                />
                <button 
                  type="button" 
                  (click)="onApplyCoupon()"
                  class="px-5 py-2 rounded-xl bg-[#264653] hover:bg-[#1A303A] text-white text-xs font-bold cursor-pointer transition-colors">
                  Apply
                </button>
              </div>

              @if (orderData.appliedCoupon(); as coup) {
                <div class="flex items-center justify-between text-xs bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-2.5 rounded-xl text-emerald-800 dark:text-emerald-200">
                  <div class="flex items-center gap-1.5">
                    <mat-icon class="text-sm text-emerald-600">check_circle</mat-icon>
                    <span>Coupon <strong>{{ coup.code }}</strong> applied: {{ coup.description }}</span>
                  </div>
                  <button 
                    type="button" 
                    (click)="orderData.removeCoupon()" 
                    class="text-emerald-700 font-bold hover:underline cursor-pointer">
                    Remove
                  </button>
                </div>
              }
            </div>

          </div>

          <!-- Checkout & Order Summary Form (5 cols) -->
          <div class="lg:col-span-5 bg-white dark:bg-[#1b2a32] rounded-3xl border border-slate-200 dark:border-white/10 p-6 shadow-xl space-y-6">
            
            <div class="border-b border-slate-100 dark:border-white/5 pb-3">
              <h3 class="font-serif text-lg font-bold text-[#264653] dark:text-white">Order & Delivery Details</h3>
            </div>

            <!-- Order Type -->
            <div class="space-y-2">
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300">Dining Mode</label>
              <div class="grid grid-cols-3 gap-2">
                <button 
                  type="button" 
                  (click)="orderType.set('Delivery')"
                  class="py-2 px-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer"
                  [class.bg-[#E76F51]]="orderType() === 'Delivery'"
                  [class.text-white]="orderType() === 'Delivery'"
                  [class.border-[#E76F51]]="orderType() === 'Delivery'">
                  <mat-icon class="text-sm">delivery_dining</mat-icon>
                  <span>Delivery</span>
                </button>
                <button 
                  type="button" 
                  (click)="orderType.set('Dine-In')"
                  class="py-2 px-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer"
                  [class.bg-[#E76F51]]="orderType() === 'Dine-In'"
                  [class.text-white]="orderType() === 'Dine-In'"
                  [class.border-[#E76F51]]="orderType() === 'Dine-In'">
                  <mat-icon class="text-sm">restaurant</mat-icon>
                  <span>Dine-In</span>
                </button>
                <button 
                  type="button" 
                  (click)="orderType.set('Takeaway')"
                  class="py-2 px-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer"
                  [class.bg-[#E76F51]]="orderType() === 'Takeaway'"
                  [class.text-white]="orderType() === 'Takeaway'"
                  [class.border-[#E76F51]]="orderType() === 'Takeaway'">
                  <mat-icon class="text-sm">takeout_dining</mat-icon>
                  <span>Takeaway</span>
                </button>
              </div>
            </div>

            <!-- Conditional input: Table Number for Dine-In or Address for Delivery -->
            @if (orderType() === 'Dine-In') {
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Your Table Number</label>
                <input 
                  type="number" 
                  min="1" 
                  max="15" 
                  placeholder="e.g. 4"
                  [value]="tableNumber()"
                  (input)="tableNumber.set(+$any($event.target).value)"
                  class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E76F51]"
                />
              </div>
            } @else if (orderType() === 'Delivery') {
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Delivery Address</label>
                <input 
                  type="text" 
                  placeholder="Street address, apartment or suite"
                  [value]="address()"
                  (input)="address.set($any($event.target).value)"
                  class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E76F51]"
                />
              </div>
            }

            <!-- Payment Method -->
            <div class="space-y-2">
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300">Payment Option</label>
              <div class="grid grid-cols-3 gap-2">
                <button 
                  type="button" 
                  (click)="paymentMethod.set('Card')"
                  class="py-2 px-2 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer"
                  [class.bg-[#2A9D8F]]="paymentMethod() === 'Card'"
                  [class.text-white]="paymentMethod() === 'Card'"
                  [class.border-[#2A9D8F]]="paymentMethod() === 'Card'">
                  <mat-icon class="text-sm">credit_card</mat-icon>
                  <span>Credit Card</span>
                </button>
                <button 
                  type="button" 
                  (click)="paymentMethod.set('UPI')"
                  class="py-2 px-2 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer"
                  [class.bg-[#2A9D8F]]="paymentMethod() === 'UPI'"
                  [class.text-white]="paymentMethod() === 'UPI'"
                  [class.border-[#2A9D8F]]="paymentMethod() === 'UPI'">
                  <mat-icon class="text-sm">qr_code_2</mat-icon>
                  <span>UPI / Wallet</span>
                </button>
                <button 
                  type="button" 
                  (click)="paymentMethod.set('Cash')"
                  class="py-2 px-2 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer"
                  [class.bg-[#2A9D8F]]="paymentMethod() === 'Cash'"
                  [class.text-white]="paymentMethod() === 'Cash'"
                  [class.border-[#2A9D8F]]="paymentMethod() === 'Cash'">
                  <mat-icon class="text-sm">payments</mat-icon>
                  <span>Cash / At Table</span>
                </button>
              </div>
            </div>

            <!-- Price Breakdown -->
            <div class="pt-4 border-t border-slate-100 dark:border-white/5 space-y-2 text-xs">
              <div class="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Subtotal ({{ orderData.cartCount() }} items):</span>
                <span>\${{ orderData.subtotal().toFixed(2) }}</span>
              </div>
              
              @if (orderData.discount() > 0) {
                <div class="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount:</span>
                  <span>-\${{ orderData.discount().toFixed(2) }}</span>
                </div>
              }

              <div class="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Estimated Tax (8%):</span>
                <span>\${{ orderData.tax().toFixed(2) }}</span>
              </div>

              @if (orderType() === 'Delivery') {
                <div class="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Delivery Fee:</span>
                  @if (orderData.deliveryFee() === 0) {
                    <span class="text-emerald-600 font-bold">FREE</span>
                  } @else {
                    <span>\${{ orderData.deliveryFee().toFixed(2) }}</span>
                  }
                </div>
              }

              <div class="pt-3 border-t border-slate-200 dark:border-white/10 flex justify-between text-base font-extrabold text-[#E76F51]">
                <span>Grand Total:</span>
                <span>\${{ orderData.grandTotal().toFixed(2) }}</span>
              </div>
            </div>

            <!-- Place Order Button -->
            <button 
              type="button" 
              (click)="onPlaceOrder()"
              class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#E76F51] to-[#F4A261] hover:opacity-95 text-white font-bold text-xs shadow-xl shadow-[#E76F51]/25 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer">
              <mat-icon class="text-sm">shopping_bag</mat-icon>
              <span>Place Order & Pay \${{ orderData.grandTotal().toFixed(2) }}</span>
            </button>

          </div>

        </div>
      } @else {
        <!-- Empty Cart -->
        <div class="text-center py-20 bg-white dark:bg-[#1b2a32] rounded-3xl border border-slate-200 dark:border-white/10 p-8 space-y-4 max-w-md mx-auto">
          <div class="w-16 h-16 rounded-2xl bg-orange-100 dark:bg-orange-950 flex items-center justify-center text-[#E76F51] mx-auto">
            <mat-icon class="text-3xl">shopping_cart</mat-icon>
          </div>
          <h3 class="font-serif text-xl font-bold text-slate-800 dark:text-white">Your Cart is Empty</h3>
          <p class="text-xs text-slate-500">
            Browse our artisanal menu to add delicious appetizers, mains, pizzas, and desserts.
          </p>
          <a 
            routerLink="/menu" 
            class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E76F51] text-white text-xs font-bold shadow-md hover:bg-[#D9593B] cursor-pointer">
            <mat-icon class="text-sm">restaurant_menu</mat-icon>
            <span>Explore Menu</span>
          </a>
        </div>
      }

    </div>
  `
})
export class CartPage {
  orderData = inject(OrderData);
  auth = inject(Auth);
  private toast = inject(Toast);
  private router = inject(Router);

  couponCodeInput = signal<string>('WELCOME20');
  orderType = signal<OrderType>('Delivery');
  paymentMethod = signal<PaymentMethod>('Card');
  address = signal<string>(this.auth.currentUser()?.address || '742 Evergreen Terrace, Apt 4B, Metro District');
  tableNumber = signal<number>(4);

  onApplyCoupon(): void {
    if (!this.couponCodeInput().trim()) return;
    this.orderData.applyCoupon(this.couponCodeInput());
  }

  onPlaceOrder(): void {
    const user = this.auth.currentUser();
    const order = this.orderData.placeOrder({
      customerName: user?.name || 'Valued Guest',
      customerEmail: user?.email || 'guest@example.com',
      customerPhone: user?.phone || '+1 (555) 234-5678',
      orderType: this.orderType(),
      deliveryAddress: this.orderType() === 'Delivery' ? this.address() : undefined,
      tableNumber: this.orderType() === 'Dine-In' ? this.tableNumber() : undefined,
      paymentMethod: this.paymentMethod()
    });

    if (order) {
      this.router.navigate(['/orders']);
    }
  }
}
