export type BookingStatus = 'Pending' | 'Approved' | 'Completed' | 'Rejected' | 'Cancelled';

export interface Booking {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  tableId: string;
  tableNumber: number;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "19:00 - 21:00"
  guests: number;
  specialRequest?: string;
  occasion?: 'Birthday' | 'Anniversary' | 'Business' | 'Casual' | 'Date Night';
  status: BookingStatus;
  createdAt: string;
  cancellationReason?: string;
}
