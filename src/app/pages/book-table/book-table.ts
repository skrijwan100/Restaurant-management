import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { BookingData } from '../../services/booking';
import { Auth } from '../../services/auth';
import { TableCardComponent } from '../../components/table-card/table-card';
import { RestaurantTable } from '../../models/table.model';
import { Booking } from '../../models/booking.model';
import confetti from 'canvas-confetti';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-book-table',
  imports: [MatIconModule, TableCardComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      <!-- Header -->
      <div class="text-center max-w-2xl mx-auto space-y-2">
        <span class="text-xs font-bold uppercase tracking-widest text-[#E76F51]">Live Dining Reservations</span>
        <h1 class="font-serif text-3xl sm:text-4xl font-bold text-[#264653] dark:text-white">Reserve Your Table</h1>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Select your ideal dining zone, review live seating availability on our architectural floor plan, and customize your evening.
        </p>
      </div>

      <!-- Live Floor Plan View & Controls -->
      <div class="bg-white dark:bg-[#1b2a32] rounded-3xl border border-slate-200 dark:border-white/10 p-6 shadow-sm space-y-6">
        
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-white/5 pb-4">
          <div>
            <h3 class="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <mat-icon class="text-[#2A9D8F]">map</mat-icon>
              <span>Architectural Floor Seating Plan</span>
            </h3>
            <p class="text-xs text-slate-500 dark:text-slate-400">Click any green table on the layout or select from the directory below</p>
          </div>

          <!-- Zone Badges Legend -->
          <div class="flex flex-wrap items-center gap-3 text-xs">
            <span class="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span class="w-3 h-3 rounded-full bg-emerald-500"></span> Available
            </span>
            <span class="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span class="w-3 h-3 rounded-full bg-amber-500"></span> Reserved
            </span>
            <span class="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span class="w-3 h-3 rounded-full bg-rose-500"></span> Occupied
            </span>
          </div>
        </div>

        <!-- Interactive Map Floor Canvas -->
        <div class="relative bg-slate-100/80 dark:bg-slate-900/80 rounded-2xl p-6 min-h-[380px] border border-slate-200 dark:border-slate-800 overflow-x-auto">
          
          <!-- Zones Layout Guide Overlays -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <!-- Section 1: Window View & Garden Patio -->
            <div class="p-4 rounded-xl border border-dashed border-teal-300/60 dark:border-teal-700/60 bg-teal-50/20 dark:bg-teal-950/20 space-y-3">
              <div class="flex items-center justify-between text-xs font-bold text-[#2A9D8F]">
                <span>Window View & Patio</span>
                <mat-icon class="text-sm">nature_people</mat-icon>
              </div>
              <div class="grid grid-cols-2 gap-2">
                @for (t of getTablesByZone('Window View'); track t.id) {
                  <button 
                    type="button" 
                    (click)="selectTable(t)"
                    [disabled]="t.status !== 'Available'"
                    class="p-2.5 rounded-xl border text-xs font-bold text-center transition-all flex flex-col items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    [class.bg-emerald-500]="t.status === 'Available' && selectedTable()?.id !== t.id"
                    [class.text-white]="t.status === 'Available' && selectedTable()?.id !== t.id"
                    [class.bg-[#E76F51]]="selectedTable()?.id === t.id"
                    [class.ring-2]="selectedTable()?.id === t.id"
                    [class.ring-[#E76F51]]="selectedTable()?.id === t.id"
                    [class.text-white]="selectedTable()?.id === t.id"
                    [class.bg-amber-100]="t.status === 'Reserved'"
                    [class.text-amber-800]="t.status === 'Reserved'"
                    [class.bg-rose-100]="t.status === 'Occupied'"
                    [class.text-rose-800]="t.status === 'Occupied'">
                    <span>T-{{ t.tableNumber }}</span>
                    <span class="text-[10px] font-normal opacity-90">{{ t.capacity }} seats</span>
                  </button>
                }
              </div>
            </div>

            <!-- Section 2: Main Dining Hall -->
            <div class="p-4 rounded-xl border border-dashed border-orange-300/60 dark:border-orange-700/60 bg-orange-50/20 dark:bg-orange-950/20 space-y-3">
              <div class="flex items-center justify-between text-xs font-bold text-[#E76F51]">
                <span>Main Dining Hall</span>
                <mat-icon class="text-sm">restaurant</mat-icon>
              </div>
              <div class="grid grid-cols-2 gap-2">
                @for (t of getTablesByZone('Main Dining Hall'); track t.id) {
                  <button 
                    type="button" 
                    (click)="selectTable(t)"
                    [disabled]="t.status !== 'Available'"
                    class="p-2.5 rounded-xl border text-xs font-bold text-center transition-all flex flex-col items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    [class.bg-emerald-500]="t.status === 'Available' && selectedTable()?.id !== t.id"
                    [class.text-white]="t.status === 'Available' && selectedTable()?.id !== t.id"
                    [class.bg-[#E76F51]]="selectedTable()?.id === t.id"
                    [class.ring-2]="selectedTable()?.id === t.id"
                    [class.ring-[#E76F51]]="selectedTable()?.id === t.id"
                    [class.text-white]="selectedTable()?.id === t.id"
                    [class.bg-amber-100]="t.status === 'Reserved'"
                    [class.text-amber-800]="t.status === 'Reserved'"
                    [class.bg-rose-100]="t.status === 'Occupied'"
                    [class.text-rose-800]="t.status === 'Occupied'">
                    <span>T-{{ t.tableNumber }}</span>
                    <span class="text-[10px] font-normal opacity-90">{{ t.capacity }} seats</span>
                  </button>
                }
              </div>
            </div>

            <!-- Section 3: VIP Lounge & Rooftop -->
            <div class="p-4 rounded-xl border border-dashed border-purple-300/60 dark:border-purple-700/60 bg-purple-50/20 dark:bg-purple-950/20 space-y-3">
              <div class="flex items-center justify-between text-xs font-bold text-purple-600 dark:text-purple-300">
                <span>VIP Lounge & Rooftop</span>
                <mat-icon class="text-sm">star</mat-icon>
              </div>
              <div class="grid grid-cols-2 gap-2">
                @for (t of getTablesByZone('VIP & Rooftop'); track t.id) {
                  <button 
                    type="button" 
                    (click)="selectTable(t)"
                    [disabled]="t.status !== 'Available'"
                    class="p-2.5 rounded-xl border text-xs font-bold text-center transition-all flex flex-col items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    [class.bg-emerald-500]="t.status === 'Available' && selectedTable()?.id !== t.id"
                    [class.text-white]="t.status === 'Available' && selectedTable()?.id !== t.id"
                    [class.bg-[#E76F51]]="selectedTable()?.id === t.id"
                    [class.ring-2]="selectedTable()?.id === t.id"
                    [class.ring-[#E76F51]]="selectedTable()?.id === t.id"
                    [class.text-white]="selectedTable()?.id === t.id"
                    [class.bg-amber-100]="t.status === 'Reserved'"
                    [class.text-amber-800]="t.status === 'Reserved'"
                    [class.bg-rose-100]="t.status === 'Occupied'"
                    [class.text-rose-800]="t.status === 'Occupied'">
                    <span>T-{{ t.tableNumber }}</span>
                    <span class="text-[10px] font-normal opacity-90">{{ t.capacity }} seats</span>
                  </button>
                }
              </div>
            </div>

          </div>
        </div>

      </div>

      <!-- Main Two-Column Layout: Table Directory + Reservation Form -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Left Column: Tables Cards (7 cols) -->
        <div class="lg:col-span-7 space-y-6">
          
          <!-- Filters for Table List -->
          <div class="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-[#1b2a32] p-4 rounded-2xl border border-slate-200 dark:border-white/10">
            <div class="flex items-center gap-2">
              <span class="text-xs text-slate-500 font-medium">Zone:</span>
              <select 
                [value]="bookingData.selectedZone()"
                (change)="bookingData.selectedZone.set($any($event.target).value)"
                class="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-white">
                <option value="All">All Zones (15 Tables)</option>
                <option value="Main Dining Hall">Main Dining Hall</option>
                <option value="Window View">Window View</option>
                <option value="Garden Patio">Garden Patio</option>
                <option value="VIP Lounge">VIP Lounge</option>
                <option value="Rooftop Terrace">Rooftop Terrace</option>
              </select>
            </div>

            <div class="flex items-center gap-2">
              <span class="text-xs text-slate-500 font-medium">Min Seats:</span>
              <select 
                [value]="bookingData.selectedCapacity()"
                (change)="bookingData.selectedCapacity.set($any($event.target).value === 'All' ? 'All' : +$any($event.target).value)"
                class="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-white">
                <option value="All">Any Size</option>
                <option value="2">2+ Guests</option>
                <option value="4">4+ Guests</option>
                <option value="6">6+ Guests</option>
                <option value="8">8+ Guests</option>
              </select>
            </div>
          </div>

          <!-- Cards Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            @for (tbl of bookingData.filteredTables(); track tbl.id) {
              <app-table-card 
                [table]="tbl" 
                [isSelected]="selectedTable()?.id === tbl.id"
                (selected)="selectTable($event)">
              </app-table-card>
            }
          </div>

        </div>

        <!-- Right Column: Reservation Form Drawer (5 cols) -->
        <div class="lg:col-span-5 bg-white dark:bg-[#1b2a32] rounded-3xl border border-slate-200 dark:border-white/10 p-6 shadow-xl sticky top-24 space-y-6">
          
          <div class="border-b border-slate-100 dark:border-white/5 pb-4">
            <span class="text-[10px] font-bold uppercase tracking-wider text-[#E76F51]">Reservation Details</span>
            <h3 class="font-serif text-xl font-bold text-[#264653] dark:text-white">
              Confirm Your Booking
            </h3>
          </div>

          <!-- Selected Table Summary Box -->
          @if (selectedTable(); as table) {
            <div class="p-4 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 flex items-center justify-between">
              <div>
                <span class="text-xs font-bold text-[#E76F51]">Table #{{ table.tableNumber }} Selected</span>
                <p class="text-[11px] text-slate-600 dark:text-slate-300">{{ table.zone }} · Max {{ table.capacity }} Guests</p>
              </div>
              <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg shadow-sm">
                Available
              </span>
            </div>
          } @else {
            <div class="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200 flex items-center gap-2">
              <mat-icon class="text-base text-amber-600">info</mat-icon>
              <span>Please select an available table from the floor layout.</span>
            </div>
          }

          <form (submit)="onConfirmBooking($event)" class="space-y-4">
            
            <!-- Date & Time Slot -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Reservation Date</label>
                <input 
                  type="date" 
                  required
                  [min]="minDate"
                  [value]="bookingDate()"
                  (input)="bookingDate.set($any($event.target).value)"
                  class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E76F51]"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Time Slot</label>
                <select 
                  [value]="selectedTimeSlot()"
                  (change)="selectedTimeSlot.set($any($event.target).value)"
                  class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E76F51]">
                  @for (slot of bookingData.timeSlots; track slot) {
                    <option [value]="slot">{{ slot }}</option>
                  }
                </select>
              </div>
            </div>

            <!-- Number of Guests & Occasion -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Guests: <strong class="text-[#E76F51]">{{ guestsCount() }}</strong>
                </label>
                <div class="flex items-center gap-2">
                  <input 
                    type="range" 
                    min="1" 
                    [max]="selectedTable() ? selectedTable()!.capacity : 8" 
                    [value]="guestsCount()"
                    (input)="guestsCount.set(+$any($event.target).value)"
                    class="w-full accent-[#E76F51]"
                  />
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Dining Occasion</label>
                <select 
                  [value]="occasion()"
                  (change)="occasion.set($any($event.target).value)"
                  class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E76F51]">
                  <option value="Casual">Casual Dining</option>
                  <option value="Date Night">Romantic Date Night</option>
                  <option value="Birthday">Birthday Celebration</option>
                  <option value="Anniversary">Anniversary</option>
                  <option value="Business">Business Dinner</option>
                </select>
              </div>
            </div>

            <!-- Guest Contact Info -->
            <div class="space-y-3 pt-2 border-t border-slate-100 dark:border-white/5">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Guest Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="Your Name"
                  [value]="guestName()"
                  (input)="guestName.set($any($event.target).value)"
                  class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E76F51]"
                />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Phone</label>
                  <input 
                    type="tel" 
                    required
                    placeholder="+1 (555) 000-0000"
                    [value]="guestPhone()"
                    (input)="guestPhone.set($any($event.target).value)"
                    class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E76F51]"
                  />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email</label>
                  <input 
                    type="email" 
                    required
                    placeholder="guest@example.com"
                    [value]="guestEmail()"
                    (input)="guestEmail.set($any($event.target).value)"
                    class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E76F51]"
                  />
                </div>
              </div>
            </div>

            <!-- Special Requests -->
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Special Requests (Optional)</label>
              <textarea 
                rows="2" 
                placeholder="Allergies, high chair, floral arrangement or candlelight request..."
                [value]="specialRequest()"
                (input)="specialRequest.set($any($event.target).value)"
                class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E76F51]">
              </textarea>
            </div>

            <!-- Submit Button -->
            <button 
              type="submit" 
              [disabled]="!selectedTable()"
              class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#E76F51] to-[#F4A261] hover:opacity-95 disabled:opacity-40 text-white font-bold text-xs shadow-lg shadow-[#E76F51]/25 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer">
              <mat-icon class="text-sm">check_circle</mat-icon>
              <span>Confirm Table Reservation</span>
            </button>

          </form>

        </div>

      </div>

      <!-- SUCCESS CONFIRMATION DIALOG -->
      @if (lastBooked(); as booking) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div class="bg-white dark:bg-[#1b2a32] rounded-3xl max-w-md w-full p-6 text-center shadow-2xl border border-slate-200 dark:border-white/10 space-y-5 animate-in zoom-in-95">
            <div class="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 mx-auto flex items-center justify-center">
              <mat-icon class="text-3xl">celebration</mat-icon>
            </div>
            
            <div class="space-y-1">
              <h3 class="font-serif text-2xl font-bold text-slate-900 dark:text-white">Reservation Confirmed!</h3>
              <p class="text-xs text-slate-500">We look forward to hosting you at Savoria.</p>
            </div>

            <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 text-left text-xs space-y-2 border border-slate-100 dark:border-slate-800">
              <div class="flex justify-between">
                <span class="text-slate-400">Booking Ref:</span>
                <span class="font-mono font-bold">{{ booking.id }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Table:</span>
                <span class="font-bold text-[#E76F51]">Table #{{ booking.tableNumber }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Date & Slot:</span>
                <span>{{ booking.date }} ({{ booking.timeSlot }})</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Guests:</span>
                <span>{{ booking.guests }} People</span>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <button 
                type="button" 
                (click)="lastBooked.set(null)"
                class="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 cursor-pointer">
                Close
              </button>
              <button 
                type="button" 
                (click)="goToBookings()"
                class="flex-1 py-2.5 rounded-xl bg-[#E76F51] text-white text-xs font-bold shadow-md cursor-pointer">
                View My Bookings
              </button>
            </div>

          </div>
        </div>
      }

    </div>
  `
})
export class BookTablePage {
  bookingData = inject(BookingData);
  auth = inject(Auth);
  private router = inject(Router);

  selectedTable = signal<RestaurantTable | null>(null);
  bookingDate = signal<string>(new Date().toISOString().split('T')[0]);
  minDate = new Date().toISOString().split('T')[0];
  selectedTimeSlot = signal<string>(this.bookingData.timeSlots[2]);
  guestsCount = signal<number>(2);
  occasion = signal<string>('Casual');
  specialRequest = signal<string>('');
  lastBooked = signal<Booking | null>(null);

  guestName = signal<string>(this.auth.currentUser()?.name || 'Elena Rostova');
  guestPhone = signal<string>(this.auth.currentUser()?.phone || '+1 (555) 234-5678');
  guestEmail = signal<string>(this.auth.currentUser()?.email || 'user@gourmet.com');

  getTablesByZone(zoneGroup: string): RestaurantTable[] {
    const all = this.bookingData.tables();
    if (zoneGroup === 'Window View') {
      return all.filter(t => t.zone === 'Window View' || t.zone === 'Garden Patio').slice(0, 5);
    }
    if (zoneGroup === 'Main Dining Hall') {
      return all.filter(t => t.zone === 'Main Dining Hall').slice(0, 5);
    }
    return all.filter(t => t.zone === 'VIP Lounge' || t.zone === 'Rooftop Terrace').slice(0, 5);
  }

  selectTable(table: RestaurantTable): void {
    this.selectedTable.set(table);
    this.guestsCount.set(Math.min(2, table.capacity));
  }

  onConfirmBooking(event: Event): void {
    event.preventDefault();
    const table = this.selectedTable();
    if (!table) return;

    const res = this.bookingData.createBooking({
      tableId: table.id,
      tableNumber: table.tableNumber,
      date: this.bookingDate(),
      timeSlot: this.selectedTimeSlot(),
      guests: this.guestsCount(),
      specialRequest: this.specialRequest(),
      occasion: this.occasion() as 'Birthday' | 'Anniversary' | 'Business' | 'Casual' | 'Date Night',
      customerName: this.guestName(),
      customerPhone: this.guestPhone(),
      customerEmail: this.guestEmail()
    });

    this.lastBooked.set(res);

    if (typeof window !== 'undefined') {
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // Confetti fallback
      }
    }
  }

  goToBookings(): void {
    this.lastBooked.set(null);
    this.router.navigate(['/bookings']);
  }
}
