import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Auth } from '../../services/auth';
import { BookingData } from '../../services/booking';
import { OrderData } from '../../services/order';
import { Toast } from '../../services/toast';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-profile',
  imports: [MatIconModule],
  template: `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <!-- Header -->
      <div class="border-b border-slate-200 dark:border-white/10 pb-4">
        <span class="text-xs font-bold uppercase tracking-widest text-[#E76F51]">User Profile</span>
        <h1 class="font-serif text-3xl font-bold text-[#264653] dark:text-white">Account Settings</h1>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        <!-- Left: Avatar Card (4 cols) -->
        <div class="md:col-span-4 bg-white dark:bg-[#1b2a32] rounded-3xl border border-slate-200 dark:border-white/10 p-6 text-center shadow-sm space-y-4">
          <div class="relative w-28 h-28 mx-auto">
            <img 
              [src]="avatarUrl()" 
              [alt]="auth.userName()" 
              referrerpolicy="no-referrer"
              class="w-full h-full rounded-full object-cover border-4 border-[#E76F51] shadow-lg"
            />
          </div>

          <div>
            <h3 class="font-serif text-lg font-bold text-slate-800 dark:text-white">{{ name() }}</h3>
            <p class="text-xs text-slate-400">{{ email() }}</p>
            <span class="inline-block mt-2 text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950 text-[#E76F51]">
              {{ auth.currentUser()?.role || 'Customer' }}
            </span>
          </div>

          <!-- Avatar Preset Chooser -->
          <div class="pt-2 border-t border-slate-100 dark:border-white/5 space-y-2">
            <span class="text-[11px] font-semibold text-slate-500 block">Choose Avatar</span>
            <div class="flex items-center justify-center gap-2">
              @for (av of avatarPresets; track av) {
                <button 
                  type="button" 
                  (click)="avatarUrl.set(av)"
                  class="w-8 h-8 rounded-full overflow-hidden border-2 transition-all cursor-pointer"
                  [class.border-[#E76F51]]="avatarUrl() === av"
                  [class.scale-110]="avatarUrl() === av"
                  [class.border-transparent]="avatarUrl() !== av">
                  <img [src]="av" alt="preset" referrerpolicy="no-referrer" class="w-full h-full object-cover" />
                </button>
              }
            </div>
          </div>

          <!-- Stats Pill -->
          <div class="pt-4 border-t border-slate-100 dark:border-white/5 grid grid-cols-2 gap-2 text-center text-xs">
            <div class="bg-slate-50 dark:bg-slate-900 p-2 rounded-xl">
              <span class="text-slate-400 block text-[10px]">Reservations</span>
              <strong class="text-[#E76F51] text-sm">{{ bookingData.userBookings().length }}</strong>
            </div>
            <div class="bg-slate-50 dark:bg-slate-900 p-2 rounded-xl">
              <span class="text-slate-400 block text-[10px]">Orders</span>
              <strong class="text-[#2A9D8F] text-sm">{{ orderData.userOrders().length }}</strong>
            </div>
          </div>

        </div>

        <!-- Right: Editable Form (8 cols) -->
        <div class="md:col-span-8 bg-white dark:bg-[#1b2a32] rounded-3xl border border-slate-200 dark:border-white/10 p-6 shadow-sm space-y-6">
          <div class="border-b border-slate-100 dark:border-white/5 pb-3">
            <h3 class="font-serif text-lg font-bold text-[#264653] dark:text-white">Contact & Preferences</h3>
          </div>

          <form (submit)="onSave($event)" class="space-y-4">
            
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
              <input 
                type="text" 
                required
                [value]="name()"
                (input)="name.set($any($event.target).value)"
                class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E76F51]"
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email</label>
                <input 
                  type="email" 
                  required
                  [value]="email()"
                  (input)="email.set($any($event.target).value)"
                  class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E76F51]"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  required
                  [value]="phone()"
                  (input)="phone.set($any($event.target).value)"
                  class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E76F51]"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Delivery Address</label>
              <textarea 
                rows="2" 
                [value]="address()"
                (input)="address.set($any($event.target).value)"
                class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E76F51]">
              </textarea>
            </div>

            <div class="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-white/5">
              <button 
                type="button" 
                (click)="auth.logout()" 
                class="text-xs text-rose-500 hover:text-rose-700 font-semibold flex items-center gap-1 cursor-pointer">
                <mat-icon class="text-sm">logout</mat-icon>
                <span>Sign Out</span>
              </button>

              <button 
                type="submit" 
                class="px-6 py-2.5 rounded-xl bg-[#E76F51] hover:bg-[#D9593B] text-white text-xs font-bold shadow-md shadow-[#E76F51]/20 transition-all flex items-center gap-1.5 cursor-pointer">
                <mat-icon class="text-sm">save</mat-icon>
                <span>Save Changes</span>
              </button>
            </div>

          </form>

        </div>

      </div>

    </div>
  `
})
export class ProfilePage {
  auth = inject(Auth);
  bookingData = inject(BookingData);
  orderData = inject(OrderData);
  private toast = inject(Toast);

  name = signal<string>(this.auth.currentUser()?.name || 'Elena Rostova');
  email = signal<string>(this.auth.currentUser()?.email || 'user@gourmet.com');
  phone = signal<string>(this.auth.currentUser()?.phone || '+1 (555) 234-5678');
  address = signal<string>(this.auth.currentUser()?.address || '742 Evergreen Terrace, Apt 4B, Metro District');
  avatarUrl = signal<string>(this.auth.userAvatar());

  avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&auto=format&fit=crop&q=80'
  ];

  onSave(event: Event): void {
    event.preventDefault();
    this.auth.updateProfile({
      name: this.name(),
      email: this.email(),
      phone: this.phone(),
      address: this.address(),
      avatar: this.avatarUrl()
    });
  }
}
