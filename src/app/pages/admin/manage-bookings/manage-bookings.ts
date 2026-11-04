import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BookingData } from '../../../services/booking';
import { Booking, BookingStatus } from '../../../models/booking.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-manage-bookings',
  imports: [MatIconModule],
  template: `
    <div class="space-y-6">
      
      <!-- Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
        <div>
          <span class="text-xs font-bold uppercase tracking-widest text-[#E76F51]">Table Orchestration</span>
          <h1 class="font-serif text-3xl font-bold text-[#264653] dark:text-white">Manage Bookings</h1>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-xs font-semibold text-slate-500">
            Total Reservations: <strong>{{ bookingData.bookings().length }}</strong>
          </span>
        </div>
      </div>

      <!-- Filters & Search -->
      <div class="bg-white dark:bg-[#1b2a32] p-4 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="relative w-full sm:max-w-xs">
          <mat-icon class="absolute left-3 top-2.5 text-slate-400 text-lg">search</mat-icon>
          <input 
            type="text" 
            placeholder="Search by customer name or phone..."
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
            <option value="ALL">All Reservations</option>
            <option value="Pending">Pending Approval</option>
            <option value="Approved">Approved</option>
            <option value="Completed">Completed</option>
            <option value="Rejected">Rejected</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <!-- Bookings Table -->
      <div class="bg-white dark:bg-[#1b2a32] rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-white/10">
              <tr>
                <th class="py-3.5 px-4 font-bold">Guest</th>
                <th class="py-3.5 px-4 font-bold">Table</th>
                <th class="py-3.5 px-4 font-bold">Date & Time</th>
                <th class="py-3.5 px-4 font-bold">Party Size</th>
                <th class="py-3.5 px-4 font-bold">Status</th>
                <th class="py-3.5 px-4 font-bold">Notes</th>
                <th class="py-3.5 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-white/5">
              @for (bk of displayedBookings(); track bk.id) {
                <tr class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  
                  <td class="py-3.5 px-4">
                    <p class="font-bold text-slate-800 dark:text-white">{{ bk.customerName }}</p>
                    <p class="text-[11px] text-slate-400">{{ bk.customerPhone }}</p>
                  </td>

                  <td class="py-3.5 px-4">
                    <span class="inline-flex items-center px-2 py-0.5 rounded-lg font-bold text-[#E76F51] bg-orange-50 dark:bg-orange-950">
                      Table #{{ bk.tableNumber }}
                    </span>
                  </td>

                  <td class="py-3.5 px-4">
                    <p class="font-semibold text-slate-800 dark:text-white">{{ bk.date }}</p>
                    <p class="text-[11px] text-slate-400">{{ bk.timeSlot }}</p>
                  </td>

                  <td class="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                    {{ bk.guests }} Guests
                    @if (bk.occasion) {
                      <span class="block text-[10px] text-[#2A9D8F]">({{ bk.occasion }})</span>
                    }
                  </td>

                  <td class="py-3.5 px-4">
                    <span 
                      class="px-2.5 py-1 rounded-full text-[10px] font-bold"
                      [class.bg-emerald-100]="bk.status === 'Approved'"
                      [class.text-emerald-800]="bk.status === 'Approved'"
                      [class.bg-amber-100]="bk.status === 'Pending'"
                      [class.text-amber-800]="bk.status === 'Pending'"
                      [class.bg-blue-100]="bk.status === 'Completed'"
                      [class.text-blue-800]="bk.status === 'Completed'"
                      [class.bg-rose-100]="bk.status === 'Rejected' || bk.status === 'Cancelled'"
                      [class.text-rose-800]="bk.status === 'Rejected' || bk.status === 'Cancelled'">
                      {{ bk.status }}
                    </span>
                  </td>

                  <td class="py-3.5 px-4 text-slate-500 max-w-xs truncate text-[11px]">
                    {{ bk.specialRequest || 'None' }}
                  </td>

                  <td class="py-3.5 px-4 text-right">
                    <div class="flex items-center justify-end gap-1.5">
                      @if (bk.status === 'Pending') {
                        <button 
                          type="button" 
                          (click)="updateStatus(bk.id, 'Approved')"
                          class="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-sm cursor-pointer">
                          Approve
                        </button>
                        <button 
                          type="button" 
                          (click)="updateStatus(bk.id, 'Rejected')"
                          class="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold shadow-sm cursor-pointer">
                          Reject
                        </button>
                      } @else if (bk.status === 'Approved') {
                        <button 
                          type="button" 
                          (click)="updateStatus(bk.id, 'Completed')"
                          class="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold shadow-sm cursor-pointer">
                          Complete
                        </button>
                      } @else {
                        <span class="text-[11px] text-slate-400">Archived</span>
                      }
                    </div>
                  </td>

                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `
})
export class ManageBookingsPage {
  bookingData = inject(BookingData);

  searchQuery = signal<string>('');
  selectedStatus = signal<string>('ALL');

  displayedBookings(): Booking[] {
    let list = this.bookingData.bookings();
    const query = this.searchQuery().toLowerCase().trim();
    const status = this.selectedStatus();

    if (query) {
      list = list.filter(b => 
        b.customerName.toLowerCase().includes(query) || 
        b.customerPhone.includes(query)
      );
    }

    if (status !== 'ALL') {
      list = list.filter(b => b.status === status);
    }

    return list;
  }

  updateStatus(id: string, status: BookingStatus): void {
    this.bookingData.updateBookingStatus(id, status);
  }
}
