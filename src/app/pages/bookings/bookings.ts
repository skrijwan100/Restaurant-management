import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { BookingData } from '../../services/booking';
import { BookingCardComponent } from '../../components/booking-card/booking-card';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog';
import { Booking } from '../../models/booking.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-bookings',
  imports: [RouterLink, MatIconModule, BookingCardComponent, ConfirmDialogComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <!-- Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
        <div>
          <span class="text-xs font-bold uppercase tracking-widest text-[#E76F51]">Table Reservations</span>
          <h1 class="font-serif text-3xl font-bold text-[#264653] dark:text-white">Your Bookings</h1>
        </div>
        <a 
          routerLink="/book-table" 
          class="px-5 py-2.5 rounded-xl bg-[#E76F51] text-white text-xs font-bold shadow-md hover:bg-[#D9593B] transition-all flex items-center gap-1.5 cursor-pointer">
          <mat-icon class="text-sm">event_seat</mat-icon>
          <span>Reserve Another Table</span>
        </a>
      </div>

      <!-- Filters -->
      <div class="flex items-center gap-2">
        <button 
          type="button" 
          (click)="filterType.set('ALL')"
          class="px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
          [class.bg-[#E76F51]]="filterType() === 'ALL'"
          [class.text-white]="filterType() === 'ALL'"
          [class.bg-slate-100]="filterType() !== 'ALL'"
          [class.dark:bg-slate-800]="filterType() !== 'ALL'"
          [class.text-slate-600]="filterType() !== 'ALL'"
          [class.dark:text-slate-300]="filterType() !== 'ALL'">
          All Reservations ({{ bookingData.userBookings().length }})
        </button>
        <button 
          type="button" 
          (click)="filterType.set('UPCOMING')"
          class="px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
          [class.bg-[#E76F51]]="filterType() === 'UPCOMING'"
          [class.text-white]="filterType() === 'UPCOMING'"
          [class.bg-slate-100]="filterType() !== 'UPCOMING'"
          [class.dark:bg-slate-800]="filterType() !== 'UPCOMING'"
          [class.text-slate-600]="filterType() !== 'UPCOMING'"
          [class.dark:text-slate-300]="filterType() !== 'UPCOMING'">
          Upcoming ({{ bookingData.upcomingBookings().length }})
        </button>
      </div>

      <!-- Bookings Cards -->
      @if (filteredBookings().length > 0) {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          @for (bk of filteredBookings(); track bk.id) {
            <app-booking-card 
              [booking]="bk" 
              (cancelBooking)="promptCancelBooking($event)">
            </app-booking-card>
          }
        </div>
      } @else {
        <div class="text-center py-16 bg-white dark:bg-[#1b2a32] rounded-3xl border border-slate-200 dark:border-white/10 p-8 space-y-4 max-w-md mx-auto">
          <div class="w-16 h-16 rounded-2xl bg-orange-100 dark:bg-orange-950 flex items-center justify-center text-[#E76F51] mx-auto">
            <mat-icon class="text-3xl">event_seat</mat-icon>
          </div>
          <h3 class="font-serif text-lg font-bold text-slate-800 dark:text-white">No Reservations</h3>
          <p class="text-xs text-slate-500">
            You don't have any bookings in this view. Choose a table and schedule your next unforgettable dining experience.
          </p>
          <a routerLink="/book-table" class="inline-block px-5 py-2.5 rounded-xl bg-[#E76F51] text-white text-xs font-bold shadow-md">
            Book Table Now
          </a>
        </div>
      }

      <!-- Cancel Confirmation Dialog -->
      <app-confirm-dialog 
        [isOpen]="isCancelDialogOpen()"
        title="Cancel Table Reservation"
        [message]="'Are you sure you want to cancel your reservation for Table #' + (bookingToCancel()?.tableNumber || '') + ' on ' + (bookingToCancel()?.date || '') + '?'"
        confirmLabel="Yes, Cancel Booking"
        cancelLabel="Keep Reservation"
        (confirm)="confirmCancel()"
        (cancelled)="isCancelDialogOpen.set(false)">
      </app-confirm-dialog>

    </div>
  `
})
export class BookingsPage {
  bookingData = inject(BookingData);

  filterType = signal<'ALL' | 'UPCOMING'>('ALL');
  bookingToCancel = signal<Booking | null>(null);
  isCancelDialogOpen = signal<boolean>(false);

  filteredBookings(): Booking[] {
    if (this.filterType() === 'UPCOMING') {
      return this.bookingData.upcomingBookings();
    }
    return this.bookingData.userBookings();
  }

  promptCancelBooking(booking: Booking): void {
    this.bookingToCancel.set(booking);
    this.isCancelDialogOpen.set(true);
  }

  confirmCancel(): void {
    const target = this.bookingToCancel();
    if (target) {
      this.bookingData.cancelBooking(target.id);
    }
    this.isCancelDialogOpen.set(false);
    this.bookingToCancel.set(null);
  }
}
