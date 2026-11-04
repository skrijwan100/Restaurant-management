export interface RestaurantSettings {
  name: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  openingHours: {
    weekdays: string;
    weekends: string;
  };
  currencySymbol: string;
  taxRatePercent: number;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  emailNotifications: boolean;
  orderSmsAlerts: boolean;
  autoApproveBookings: boolean;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrder: number;
  description: string;
}
