export type TableStatus = 'Available' | 'Reserved' | 'Occupied' | 'Maintenance';
export type TableZone = 'Main Dining Hall' | 'Window View' | 'Garden Patio' | 'VIP Lounge' | 'Rooftop Terrace';

export interface RestaurantTable {
  id: string;
  tableNumber: number;
  capacity: number;
  zone: TableZone;
  status: TableStatus;
  isSmokingAllowed: boolean;
  shape: 'round' | 'rectangle' | 'booth';
  coordinates?: { x: number; y: number }; // For visual floor plan positioning
  description?: string;
}
