export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  phone: string;
  address: string;
  avatar: string;
  joinedDate: string;
  favoriteFoodIds: string[];
  loyaltyPoints?: number;
}
