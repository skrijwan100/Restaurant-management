import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Booking } from '../../models/booking.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-booking-card',
  imports: [MatIconModule],
  template: `
    <div class="bg-white dark:bg-[#1b2a32] rounded-2xl border border-slate-200 dark:border-white/10 p-5 shadow-sm hover:shadow-md transition-all space-y-4">
      
      <!-- Top Row -->
      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-white/5 pb-3">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex flex-col items-center justify-center text-[#2A9D8F]">
            <span class="text-[9px] uppercase font-bold tracking-wider">Table</span>
            <span class="text-base font-extrabold leading-none">#{{ booking().tableNumber }}</span>
          </div>
          <div>
            <h4 class="text-sm font-bold text-slate-800 dark:text-white">
              {{ booking().customerName }}
              @if (booking().occasion) {
                <span class="text-xs text-[#E76F51] font-normal">({{ booking().occasion }})</span>
              }
            </h4>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              {{ booking().guests }} Guests · {{ booking().timeSlot }}
            </p>
          </div>
        </div>

        <!-- Status Badge -->
        <span 
          class="text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5"
          [class.bg-emerald-100]="booking().status === 'Approved'"
          [class.text-emerald-800]="booking().status === 'Approved'"
          [class.bg-amber-100]="booking().status === 'Pending'"
          [class.text-amber-800]="booking().status === 'Pending'"
          [class.bg-blue-100]="booking().status === 'Completed'"
          [class.text-blue-800]="booking().status === 'Completed'"
          [class.bg-rose-100]="booking().status === 'Cancelled' || booking().status === 'Rejected'"
          [class.text-rose-800]="booking().status === 'Cancelled' || booking().status === 'Rejected'">
          <span class="w-2 h-2 rounded-full" [class.bg-emerald-500]="booking().status === 'Approved'" [class.bg-amber-500]="booking().status === 'Pending'"></span>
          {{ booking().status }}
        </span>
      </div>

      <!-- Date & Reservation details -->
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl">
        <div>
          <span class="text-slate-400 block text-[10px] uppercase font-semibold">Reserved Date</span>
          <span class="font-bold text-slate-700 dark:text-slate-200">{{ booking().date }}</span>
        </div>
        <div>
          <span class="text-slate-400 block text-[10px] uppercase font-semibold">Time Slot</span>
          <span class="font-bold text-slate-700 dark:text-slate-200">{{ booking().timeSlot }}</span>
        </div>
        <div class="col-span-2 sm:col-span-1">
          <span class="text-slate-400 block text-[10px] uppercase font-semibold">Contact Phone</span>
          <span class="font-bold text-slate-700 dark:text-slate-200">{{ booking().customerPhone }}</span>
        </div>
      </div>

      <!-- Special Requests -->
      @if (booking().specialRequest) {
        <div class="text-xs bg-orange-50/60 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/40 p-2.5 rounded-xl text-slate-600 dark:text-slate-300">
          <strong class="text-[#E76F51]">Note:</strong> "{{ booking().specialRequest }}"
        </div>
      }

      @if (booking().cancellationReason) {
        <div class="text-xs bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 p-2.5 rounded-xl text-rose-700 dark:text-rose-300">
          <strong>Cancellation Note:</strong> {{ booking().cancellationReason }}
        </div>
      }

      <!-- Bottom Actions -->
      <div class="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-white/5 text-xs">
        <span class="text-slate-400 text-[11px]">
          Ref: {{ booking().id }}
        </span>

        @if (booking().status === 'Pending' || booking().status === 'Approved') {
          <button 
            type="button" 
            (click)="cancelBooking.emit(booking())"
            class="text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 hover:underline flex items-center gap-1 cursor-pointer font-medium">
            <mat-icon class="text-sm">cancel</mat-icon>
            Cancel Reservation
          </button>
        }
      </div>

    </div>
  `
})
export class BookingCardComponent {
  booking = input.required<Booking>();
  cancelBooking = output<Booking>();
}
