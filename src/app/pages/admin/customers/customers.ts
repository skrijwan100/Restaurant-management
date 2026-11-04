import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AdminData } from '../../../services/admin';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-customers',
  imports: [MatIconModule, ConfirmDialogComponent],
  template: `
    <div class="space-y-6">
      
      <!-- Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
        <div>
          <span class="text-xs font-bold uppercase tracking-widest text-[#E76F51]">Dining Club Directory</span>
          <h1 class="font-serif text-3xl font-bold text-[#264653] dark:text-white">Customer Management</h1>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-xs font-semibold text-slate-500">
            Registered Patrons: <strong>{{ adminData.customersList().length }}</strong>
          </span>
        </div>
      </div>

      <!-- Search Input -->
      <div class="bg-white dark:bg-[#1b2a32] p-4 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm flex items-center justify-between">
        <div class="relative w-full sm:max-w-xs">
          <mat-icon class="absolute left-3 top-2.5 text-slate-400 text-lg">search</mat-icon>
          <input 
            type="text" 
            placeholder="Search patron by name or email..."
            [value]="searchQuery()"
            (input)="searchQuery.set($any($event.target).value)"
            class="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white"
          />
        </div>
      </div>

      <!-- Customer Cards / Table Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        @for (item of displayedCustomers(); track item.user.id) {
          <div class="p-5 rounded-2xl bg-white dark:bg-[#1b2a32] border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
            
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-3 min-w-0">
                <img [src]="item.user.avatar" [alt]="item.user.name" referrerpolicy="no-referrer" class="w-12 h-12 rounded-full object-cover border-2 border-orange-200 dark:border-slate-700 shrink-0" />
                <div class="min-w-0">
                  <h4 class="text-sm font-bold text-slate-800 dark:text-white truncate">{{ item.user.name }}</h4>
                  <p class="text-xs text-slate-400 truncate">{{ item.user.email }}</p>
                  <p class="text-[11px] text-slate-500">{{ item.user.phone }}</p>
                </div>
              </div>

              <button 
                type="button" 
                (click)="promptDelete(item.user.id, item.user.name)"
                class="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                title="Remove Customer">
                <mat-icon class="text-base">delete</mat-icon>
              </button>
            </div>

            <!-- Stats strip -->
            <div class="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl text-center text-xs">
              <div>
                <span class="text-slate-400 block text-[10px] uppercase">Orders</span>
                <strong class="text-slate-800 dark:text-white">{{ item.ordersCount }}</strong>
              </div>
              <div>
                <span class="text-slate-400 block text-[10px] uppercase">Bookings</span>
                <strong class="text-slate-800 dark:text-white">{{ item.bookingsCount }}</strong>
              </div>
              <div>
                <span class="text-slate-400 block text-[10px] uppercase">Total Spent</span>
                <strong class="text-[#E76F51]">\${{ item.totalSpent.toFixed(0) }}</strong>
              </div>
            </div>

            <div class="text-[11px] text-slate-400 truncate">
              <mat-icon class="text-xs align-middle">location_on</mat-icon>
              <span>{{ item.user.address }}</span>
            </div>

          </div>
        }
      </div>

      <!-- Delete Confirmation -->
      <app-confirm-dialog 
        [isOpen]="isDeleteDialogOpen()"
        title="Remove Customer Account"
        [message]="'Are you sure you want to remove patron account for ' + targetUserName() + '?'"
        confirmLabel="Yes, Remove"
        (confirm)="confirmDelete()"
        (cancelled)="isDeleteDialogOpen.set(false)">
      </app-confirm-dialog>

    </div>
  `
})
export class CustomersPage {
  adminData = inject(AdminData);

  searchQuery = signal<string>('');
  isDeleteDialogOpen = signal<boolean>(false);
  targetUserId = signal<string>('');
  targetUserName = signal<string>('');

  displayedCustomers() {
    let list = this.adminData.customersList();
    const q = this.searchQuery().toLowerCase().trim();
    if (q) {
      list = list.filter(c => 
        c.user.name.toLowerCase().includes(q) || 
        c.user.email.toLowerCase().includes(q) ||
        c.user.phone.includes(q)
      );
    }
    return list;
  }

  promptDelete(id: string, name: string): void {
    this.targetUserId.set(id);
    this.targetUserName.set(name);
    this.isDeleteDialogOpen.set(true);
  }

  confirmDelete(): void {
    this.adminData.deleteCustomer(this.targetUserId());
    this.isDeleteDialogOpen.set(false);
  }
}
