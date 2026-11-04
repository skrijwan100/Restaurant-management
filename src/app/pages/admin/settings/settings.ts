import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Storage } from '../../../services/storage';
import { Toast } from '../../../services/toast';
import { RestaurantSettings } from '../../../models/restaurant.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-settings',
  imports: [MatIconModule],
  template: `
    <div class="max-w-4xl space-y-8">
      
      <!-- Header -->
      <div class="border-b border-slate-200 dark:border-white/10 pb-4">
        <span class="text-xs font-bold uppercase tracking-widest text-[#E76F51]">System Configuration</span>
        <h1 class="font-serif text-3xl font-bold text-[#264653] dark:text-white">Restaurant Settings</h1>
      </div>

      <div class="bg-white dark:bg-[#1b2a32] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm space-y-6">
        
        <form (submit)="onSaveSettings($event)" class="space-y-6">
          
          <!-- General Details -->
          <div class="space-y-4">
            <h3 class="font-serif text-base font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-white/5 pb-2">
              Restaurant Branding & Contact
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Restaurant Name</label>
                <input 
                  type="text" 
                  required
                  [value]="name()"
                  (input)="name.set($any($event.target).value)"
                  class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E76F51]"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Brand Tagline</label>
                <input 
                  type="text" 
                  required
                  [value]="tagline()"
                  (input)="tagline.set($any($event.target).value)"
                  class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E76F51]"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Contact Phone</label>
                <input 
                  type="tel" 
                  required
                  [value]="phone()"
                  (input)="phone.set($any($event.target).value)"
                  class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E76F51]"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Reservation Email</label>
                <input 
                  type="email" 
                  required
                  [value]="email()"
                  (input)="email.set($any($event.target).value)"
                  class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E76F51]"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Physical Address</label>
              <input 
                type="text" 
                required
                [value]="address()"
                (input)="address.set($any($event.target).value)"
                class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E76F51]"
              />
            </div>
          </div>

          <!-- Service Hours & Financials -->
          <div class="space-y-4">
            <h3 class="font-serif text-base font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-white/5 pb-2">
              Hours & Taxation
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Weekday Hours (Mon-Thu)</label>
                <input 
                  type="text" 
                  required
                  [value]="hoursWeekdays()"
                  (input)="hoursWeekdays.set($any($event.target).value)"
                  class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E76F51]"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Weekend Hours (Fri-Sun)</label>
                <input 
                  type="text" 
                  required
                  [value]="hoursWeekends()"
                  (input)="hoursWeekends.set($any($event.target).value)"
                  class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E76F51]"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Tax Rate (%)</label>
                <input 
                  type="number" 
                  min="0" 
                  max="30"
                  [value]="taxRate()"
                  (input)="taxRate.set(+$any($event.target).value)"
                  class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E76F51]"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Standard Delivery Fee ($)</label>
                <input 
                  type="number" 
                  step="0.5" 
                  min="0"
                  [value]="deliveryFee()"
                  (input)="deliveryFee.set(+$any($event.target).value)"
                  class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E76F51]"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Free Delivery Over ($)</label>
                <input 
                  type="number" 
                  min="0"
                  [value]="freeDeliveryOver()"
                  (input)="freeDeliveryOver.set(+$any($event.target).value)"
                  class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E76F51]"
                />
              </div>
            </div>

            <!-- Auto Approve Toggle -->
            <div class="flex items-center gap-3 pt-2">
              <input 
                type="checkbox" 
                id="autoApprove" 
                [checked]="autoApprove()" 
                (change)="autoApprove.set($any($event.target).checked)"
                class="w-4 h-4 rounded text-[#2A9D8F] focus:ring-[#2A9D8F]"
              />
              <label for="autoApprove" class="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                Automatically approve online table reservations without manual review
              </label>
            </div>
          </div>

          <div class="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
            <button 
              type="button" 
              (click)="onResetDemoData()"
              class="px-4 py-2 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors flex items-center gap-1 cursor-pointer">
              <mat-icon class="text-xs">restore</mat-icon>
              <span>Reset to Demo Data Defaults</span>
            </button>

            <button 
              type="submit" 
              class="px-6 py-2.5 rounded-xl bg-[#E76F51] hover:bg-[#D9593B] text-white text-xs font-bold shadow-md shadow-[#E76F51]/20 transition-all flex items-center gap-1.5 cursor-pointer">
              <mat-icon class="text-sm">save</mat-icon>
              <span>Save Restaurant Settings</span>
            </button>
          </div>

        </form>

      </div>

    </div>
  `
})
export class SettingsPage {
  private storage = inject(Storage);
  private toast = inject(Toast);

  current = this.storage.getSettings();

  name = signal<string>(this.current.name);
  tagline = signal<string>(this.current.tagline);
  phone = signal<string>(this.current.phone);
  email = signal<string>(this.current.email);
  address = signal<string>(this.current.address);
  hoursWeekdays = signal<string>(this.current.openingHours.weekdays);
  hoursWeekends = signal<string>(this.current.openingHours.weekends);
  taxRate = signal<number>(this.current.taxRatePercent);
  deliveryFee = signal<number>(this.current.deliveryFee);
  freeDeliveryOver = signal<number>(this.current.freeDeliveryThreshold);
  autoApprove = signal<boolean>(this.current.autoApproveBookings);

  onSaveSettings(event: Event): void {
    event.preventDefault();
    const updated: RestaurantSettings = {
      ...this.current,
      name: this.name(),
      tagline: this.tagline(),
      phone: this.phone(),
      email: this.email(),
      address: this.address(),
      openingHours: {
        weekdays: this.hoursWeekdays(),
        weekends: this.hoursWeekends()
      },
      taxRatePercent: this.taxRate(),
      deliveryFee: this.deliveryFee(),
      freeDeliveryThreshold: this.freeDeliveryOver(),
      autoApproveBookings: this.autoApprove()
    };

    this.storage.setSettings(updated);
    this.toast.success('Restaurant configuration updated successfully', 'Settings Saved');
  }

  onResetDemoData(): void {
    this.storage.resetToDemoDefaults();
    this.toast.success('LocalStorage restored to original 15 tables, 40 foods, 8 users, 15 orders, and 10 bookings.', 'Demo Data Reset');
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    }, 1000);
  }
}
