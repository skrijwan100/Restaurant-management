import { Injectable, signal, computed, inject } from '@angular/core';
import { Storage } from './storage';
import { Booking, BookingStatus } from '../models/booking.model';
import { RestaurantTable, TableStatus, TableZone } from '../models/table.model';
import { Toast } from './toast';
import { Auth } from './auth';

@Injectable({
  providedIn: 'root'
})
export class BookingData {
  private storage = inject(Storage);
  private toast = inject(Toast);
  private auth = inject(Auth);

  tables = signal<RestaurantTable[]>(this.storage.getTables());
  bookings = signal<Booking[]>(this.storage.getBookings());

  // Filter signals for booking
  selectedZone = signal<TableZone | 'All'>('All');
  selectedCapacity = signal<number | 'All'>('All');

  timeSlots = [
    '12:00 - 14:00',
    '14:00 - 16:00',
    '17:30 - 19:30',
    '19:30 - 21:30',
    '21:30 - 23:30'
  ];

  filteredTables = computed(() => {
    let list = this.tables();
    const zone = this.selectedZone();
    const cap = this.selectedCapacity();

    if (zone !== 'All') {
      list = list.filter(t => t.zone === zone);
    }
    if (cap !== 'All') {
      list = list.filter(t => t.capacity >= cap);
    }
    return list;
  });

  availableTablesCount = computed(() => {
    return this.tables().filter(t => t.status === 'Available').length;
  });

  userBookings = computed(() => {
    const user = this.auth.currentUser();
    if (!user) return [];
    return this.bookings()
      .filter(b => b.userId === user.id || b.customerEmail.toLowerCase() === user.email.toLowerCase())
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });

  upcomingBookings = computed(() => {
    return this.userBookings().filter(b => b.status === 'Approved' || b.status === 'Pending');
  });

  createBooking(bookingInput: {
    tableId: string;
    tableNumber: number;
    date: string;
    timeSlot: string;
    guests: number;
    specialRequest?: string;
    occasion?: 'Birthday' | 'Anniversary' | 'Business' | 'Casual' | 'Date Night';
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
  }): Booking {
    const user = this.auth.currentUser();
    const settings = this.storage.getSettings();

    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      userId: user?.id ?? 'guest',
      customerName: bookingInput.customerName || user?.name || 'Valued Guest',
      customerEmail: bookingInput.customerEmail || user?.email || 'guest@example.com',
      customerPhone: bookingInput.customerPhone || user?.phone || '+1 555-000-0000',
      tableId: bookingInput.tableId,
      tableNumber: bookingInput.tableNumber,
      date: bookingInput.date,
      timeSlot: bookingInput.timeSlot,
      guests: bookingInput.guests,
      specialRequest: bookingInput.specialRequest,
      occasion: bookingInput.occasion || 'Casual',
      status: settings.autoApproveBookings ? 'Approved' : 'Pending',
      createdAt: new Date().toISOString()
    };

    const updated = [newBooking, ...this.bookings()];
    this.bookings.set(updated);
    this.storage.setBookings(updated);

    // Update table status to Reserved
    this.setTableStatus(bookingInput.tableId, 'Reserved');

    this.toast.success(
      `Table #${bookingInput.tableNumber} booked for ${bookingInput.date} (${bookingInput.timeSlot})`,
      'Reservation Requested'
    );

    return newBooking;
  }

  cancelBooking(id: string, reason = 'Cancelled by guest'): void {
    const booking = this.bookings().find(b => b.id === id);
    if (!booking) return;

    const updated = this.bookings().map(b => 
      b.id === id ? { ...b, status: 'Cancelled' as BookingStatus, cancellationReason: reason } : b
    );
    this.bookings.set(updated);
    this.storage.setBookings(updated);

    // Free up table if no other active reservation
    this.setTableStatus(booking.tableId, 'Available');
    this.toast.info('Your booking has been cancelled.');
  }

  updateBookingStatus(id: string, status: BookingStatus): void {
    const updated = this.bookings().map(b => b.id === id ? { ...b, status } : b);
    this.bookings.set(updated);
    this.storage.setBookings(updated);
    this.toast.success(`Booking status changed to ${status}`);
  }

  // Table management
  setTableStatus(tableId: string, status: TableStatus): void {
    const updated = this.tables().map(t => t.id === tableId ? { ...t, status } : t);
    this.tables.set(updated);
    this.storage.setTables(updated);
  }

  addTable(table: Omit<RestaurantTable, 'id'>): void {
    const newTable: RestaurantTable = {
      ...table,
      id: `tbl-${Date.now()}`
    };
    const updated = [...this.tables(), newTable];
    this.tables.set(updated);
    this.storage.setTables(updated);
    this.toast.success(`Table #${table.tableNumber} added`, 'Table Created');
  }

  updateTable(id: string, updates: Partial<RestaurantTable>): void {
    const updated = this.tables().map(t => t.id === id ? { ...t, ...updates } : t);
    this.tables.set(updated);
    this.storage.setTables(updated);
    this.toast.success('Table configuration updated');
  }

  deleteTable(id: string): void {
    const table = this.tables().find(t => t.id === id);
    const updated = this.tables().filter(t => t.id !== id);
    this.tables.set(updated);
    this.storage.setTables(updated);
    this.toast.warning(`Table #${table?.tableNumber} deleted`);
  }
}
