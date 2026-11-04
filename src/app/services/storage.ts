import { Injectable } from '@angular/core';
import { Food } from '../models/food.model';
import { RestaurantTable } from '../models/table.model';
import { Booking } from '../models/booking.model';
import { Order } from '../models/order.model';
import { User } from '../models/user.model';
import { RestaurantSettings, Coupon } from '../models/restaurant.model';

const STORAGE_KEYS = {
  USERS: 'savoria_users_v1',
  CURRENT_USER: 'savoria_current_user_v1',
  TABLES: 'savoria_tables_v1',
  FOODS: 'savoria_foods_v1',
  ORDERS: 'savoria_orders_v1',
  BOOKINGS: 'savoria_bookings_v1',
  SETTINGS: 'savoria_settings_v1',
  WISHLIST: 'savoria_wishlist_v1',
  CART: 'savoria_cart_v1',
  THEME: 'savoria_theme_v1',
  RECENTLY_VIEWED: 'savoria_recent_v1'
};

@Injectable({
  providedIn: 'root'
})
export class Storage {
  private isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

  constructor() {
    this.seedInitialDataIfNeeded();
  }

  getItem<T>(key: string, defaultValue: T): T {
    if (!this.isBrowser) return defaultValue;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.warn(`Error reading key ${key} from localStorage:`, e);
      return defaultValue;
    }
  }

  setItem<T>(key: string, value: T): void {
    if (!this.isBrowser) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Error writing key ${key} to localStorage:`, e);
    }
  }

  removeItem(key: string): void {
    if (!this.isBrowser) return;
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn(`Error removing key ${key} from localStorage:`, e);
    }
  }

  // Fast accessors
  getUsers(): User[] { return this.getItem<User[]>(STORAGE_KEYS.USERS, []); }
  setUsers(users: User[]): void { this.setItem(STORAGE_KEYS.USERS, users); }

  getCurrentUser(): User | null { return this.getItem<User | null>(STORAGE_KEYS.CURRENT_USER, null); }
  setCurrentUser(user: User | null): void { this.setItem(STORAGE_KEYS.CURRENT_USER, user); }

  getTables(): RestaurantTable[] { return this.getItem<RestaurantTable[]>(STORAGE_KEYS.TABLES, []); }
  setTables(tables: RestaurantTable[]): void { this.setItem(STORAGE_KEYS.TABLES, tables); }

  getFoods(): Food[] { return this.getItem<Food[]>(STORAGE_KEYS.FOODS, []); }
  setFoods(foods: Food[]): void { this.setItem(STORAGE_KEYS.FOODS, foods); }

  getOrders(): Order[] { return this.getItem<Order[]>(STORAGE_KEYS.ORDERS, []); }
  setOrders(orders: Order[]): void { this.setItem(STORAGE_KEYS.ORDERS, orders); }

  getBookings(): Booking[] { return this.getItem<Booking[]>(STORAGE_KEYS.BOOKINGS, []); }
  setBookings(bookings: Booking[]): void { this.setItem(STORAGE_KEYS.BOOKINGS, bookings); }

  getSettings(): RestaurantSettings {
    return this.getItem<RestaurantSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  }
  setSettings(settings: RestaurantSettings): void { this.setItem(STORAGE_KEYS.SETTINGS, settings); }

  getCoupons(): Coupon[] {
    return DEFAULT_COUPONS;
  }

  getWishlist(): string[] { return this.getItem<string[]>(STORAGE_KEYS.WISHLIST, ['food-1', 'food-7', 'food-15']); }
  setWishlist(ids: string[]): void { this.setItem(STORAGE_KEYS.WISHLIST, ids); }

  getRecentlyViewed(): string[] { return this.getItem<string[]>(STORAGE_KEYS.RECENTLY_VIEWED, ['food-2', 'food-5', 'food-12']); }
  setRecentlyViewed(ids: string[]): void { this.setItem(STORAGE_KEYS.RECENTLY_VIEWED, ids); }

  getTheme(): 'light' | 'dark' {
    return this.getItem<'light' | 'dark'>(STORAGE_KEYS.THEME, 'light');
  }
  setTheme(theme: 'light' | 'dark'): void { this.setItem(STORAGE_KEYS.THEME, theme); }

  resetToDemoDefaults(): void {
    if (!this.isBrowser) return;
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.TABLES);
    localStorage.removeItem(STORAGE_KEYS.FOODS);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    this.seedInitialDataIfNeeded(true);
  }

  private seedInitialDataIfNeeded(force = false): void {
    if (!this.isBrowser) return;

    if (force || !localStorage.getItem(STORAGE_KEYS.FOODS)) {
      this.setItem(STORAGE_KEYS.FOODS, DEMO_FOODS);
    }
    if (force || !localStorage.getItem(STORAGE_KEYS.TABLES)) {
      this.setItem(STORAGE_KEYS.TABLES, DEMO_TABLES);
    }
    if (force || !localStorage.getItem(STORAGE_KEYS.USERS)) {
      this.setItem(STORAGE_KEYS.USERS, DEMO_USERS);
    }
    if (force || !localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      this.setItem(STORAGE_KEYS.ORDERS, DEMO_ORDERS);
    }
    if (force || !localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
      this.setItem(STORAGE_KEYS.BOOKINGS, DEMO_BOOKINGS);
    }
    if (force || !localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      this.setItem(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    }

    // Default logged in user for instant preview experience
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      this.setItem(STORAGE_KEYS.CURRENT_USER, DEMO_USERS[0]); // Customer user
    }
  }
}

export const DEFAULT_SETTINGS: RestaurantSettings = {
  name: 'Savoria Grand Ristorante',
  tagline: 'Artisanal Culinary Excellence & Mediterranean Soul',
  phone: '+1 (555) 749-3820',
  email: 'reservations@savoriagrand.com',
  address: '450 Harbor Boulevard, Suite 100, Marina Bay',
  openingHours: {
    weekdays: '11:30 AM - 10:30 PM',
    weekends: '10:00 AM - 11:30 PM'
  },
  currencySymbol: '$',
  taxRatePercent: 8,
  deliveryFee: 4.99,
  freeDeliveryThreshold: 45,
  emailNotifications: true,
  orderSmsAlerts: true,
  autoApproveBookings: false
};

export const DEFAULT_COUPONS: Coupon[] = [
  { code: 'WELCOME20', discountType: 'percentage', discountValue: 20, minOrder: 25, description: '20% off your entire meal' },
  { code: 'FEAST10', discountType: 'fixed', discountValue: 10, minOrder: 40, description: '$10 off orders above $40' },
  { code: 'SAVORIA5', discountType: 'percentage', discountValue: 15, minOrder: 30, description: '15% weekend celebratory offer' },
  { code: 'FREECHEF', discountType: 'fixed', discountValue: 5, minOrder: 20, description: '$5 off chef appetizers' }
];

// 8 DEMO USERS (1 Admin + 7 Customers)
export const DEMO_USERS: User[] = [
  {
    id: 'user-1',
    name: 'Elena Rostova',
    email: 'user@gourmet.com',
    password: 'user123',
    role: 'customer',
    phone: '+1 (555) 234-5678',
    address: '742 Evergreen Terrace, Apt 4B, Metro District',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2024-03-15',
    favoriteFoodIds: ['food-1', 'food-7', 'food-15', 'food-24'],
    loyaltyPoints: 340
  },
  {
    id: 'user-admin',
    name: 'Chef Marcus Vance',
    email: 'admin@gourmet.com',
    password: 'admin123',
    role: 'admin',
    phone: '+1 (555) 987-6543',
    address: 'Executive Suite 12, Savoria Headquarters',
    avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2023-01-10',
    favoriteFoodIds: ['food-2', 'food-11', 'food-28'],
    loyaltyPoints: 1200
  },
  {
    id: 'user-2',
    name: 'Julian Sterling',
    email: 'julian.sterling@gmail.com',
    password: 'password123',
    role: 'customer',
    phone: '+1 (555) 345-6789',
    address: '18 West End Avenue, New York, NY',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2024-05-20',
    favoriteFoodIds: ['food-3', 'food-10'],
    loyaltyPoints: 180
  },
  {
    id: 'user-3',
    name: 'Aria Chen',
    email: 'aria.chen@designco.io',
    password: 'password123',
    role: 'customer',
    phone: '+1 (555) 456-7890',
    address: '88 Beacon Street, Boston, MA',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2024-06-11',
    favoriteFoodIds: ['food-5', 'food-22', 'food-36'],
    loyaltyPoints: 520
  },
  {
    id: 'user-4',
    name: 'David Kalu',
    email: 'david.kalu@techcorp.com',
    password: 'password123',
    role: 'customer',
    phone: '+1 (555) 567-8901',
    address: '320 Pine Valley Rd, Seattle, WA',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2024-07-02',
    favoriteFoodIds: ['food-9', 'food-14'],
    loyaltyPoints: 95
  },
  {
    id: 'user-5',
    name: 'Sophia Laurent',
    email: 'sophia.l@artisan.fr',
    password: 'password123',
    role: 'customer',
    phone: '+1 (555) 678-9012',
    address: '12 Boulevard Saint-Germain, Paris',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2024-08-14',
    favoriteFoodIds: ['food-16', 'food-27', 'food-39'],
    loyaltyPoints: 410
  },
  {
    id: 'user-6',
    name: 'Mateo Morales',
    email: 'mateo.m@culinary.org',
    password: 'password123',
    role: 'customer',
    phone: '+1 (555) 789-0123',
    address: '900 Ocean Drive, Miami, FL',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2024-09-01',
    favoriteFoodIds: ['food-1', 'food-18'],
    loyaltyPoints: 215
  },
  {
    id: 'user-7',
    name: 'Clara Oswald',
    email: 'clara.oswald@star.co.uk',
    password: 'password123',
    role: 'customer',
    phone: '+1 (555) 890-1234',
    address: '42 Baker Street, London',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2024-10-05',
    favoriteFoodIds: ['food-8', 'food-32'],
    loyaltyPoints: 150
  }
];

// 15 RESTAURANT TABLES (Main Dining, Window View, Garden Patio, VIP Lounge, Rooftop)
export const DEMO_TABLES: RestaurantTable[] = [
  { id: 'tbl-1', tableNumber: 1, capacity: 2, zone: 'Window View', status: 'Available', isSmokingAllowed: false, shape: 'round', coordinates: { x: 12, y: 15 }, description: 'Romantic couple table overlooking the botanical gardens' },
  { id: 'tbl-2', tableNumber: 2, capacity: 2, zone: 'Window View', status: 'Reserved', isSmokingAllowed: false, shape: 'round', coordinates: { x: 28, y: 15 }, description: 'Corner window table with scenic natural morning light' },
  { id: 'tbl-3', tableNumber: 3, capacity: 4, zone: 'Window View', status: 'Available', isSmokingAllowed: false, shape: 'rectangle', coordinates: { x: 44, y: 15 }, description: 'Panoramic harbor view booth for small families' },
  { id: 'tbl-4', tableNumber: 4, capacity: 4, zone: 'Main Dining Hall', status: 'Available', isSmokingAllowed: false, shape: 'rectangle', coordinates: { x: 12, y: 45 }, description: 'Central dining setting near the live acoustic band' },
  { id: 'tbl-5', tableNumber: 5, capacity: 4, zone: 'Main Dining Hall', status: 'Occupied', isSmokingAllowed: false, shape: 'rectangle', coordinates: { x: 28, y: 45 }, description: 'Center stage dining table with plush velvet chairs' },
  { id: 'tbl-6', tableNumber: 6, capacity: 6, zone: 'Main Dining Hall', status: 'Available', isSmokingAllowed: false, shape: 'rectangle', coordinates: { x: 44, y: 45 }, description: 'Spacious banquet table suitable for dinner parties' },
  { id: 'tbl-7', tableNumber: 7, capacity: 8, zone: 'Main Dining Hall', status: 'Reserved', isSmokingAllowed: false, shape: 'rectangle', coordinates: { x: 60, y: 45 }, description: 'Large mahogany table for family gatherings and celebrations' },
  { id: 'tbl-8', tableNumber: 8, capacity: 2, zone: 'Garden Patio', status: 'Available', isSmokingAllowed: true, shape: 'round', coordinates: { x: 78, y: 15 }, description: 'Al fresco garden table nestled under fairy-lit olive trees' },
  { id: 'tbl-9', tableNumber: 9, capacity: 4, zone: 'Garden Patio', status: 'Available', isSmokingAllowed: true, shape: 'rectangle', coordinates: { x: 78, y: 45 }, description: 'Patio lounge with gentle sea breeze and heating lamp' },
  { id: 'tbl-10', tableNumber: 10, capacity: 6, zone: 'Garden Patio', status: 'Reserved', isSmokingAllowed: true, shape: 'rectangle', coordinates: { x: 78, y: 75 }, description: 'Outdoor pergola seating surrounded by fresh herbs' },
  { id: 'tbl-11', tableNumber: 11, capacity: 8, zone: 'VIP Lounge', status: 'Available', isSmokingAllowed: false, shape: 'rectangle', coordinates: { x: 12, y: 75 }, description: 'Private cellar suite with sommelier dedicated service' },
  { id: 'tbl-12', tableNumber: 12, capacity: 12, zone: 'VIP Lounge', status: 'Available', isSmokingAllowed: false, shape: 'rectangle', coordinates: { x: 34, y: 75 }, description: 'Executive boardroom dining with private audio and fireplace' },
  { id: 'tbl-13', tableNumber: 13, capacity: 2, zone: 'Rooftop Terrace', status: 'Available', isSmokingAllowed: true, shape: 'round', coordinates: { x: 55, y: 75 }, description: 'Skyline sunset table with bespoke cocktail bar access' },
  { id: 'tbl-14', tableNumber: 14, capacity: 4, zone: 'Rooftop Terrace', status: 'Reserved', isSmokingAllowed: true, shape: 'rectangle', coordinates: { x: 65, y: 20 }, description: 'Elevated terrace booth overlooking the city lights' },
  { id: 'tbl-15', tableNumber: 15, capacity: 6, zone: 'Rooftop Terrace', status: 'Available', isSmokingAllowed: false, shape: 'rectangle', coordinates: { x: 40, y: 30 }, description: 'Signature chef rooftop table with unobstructed starry views' }
];

// 40 REALISTIC, MOUTHWATERING FOOD ITEMS
export const DEMO_FOODS: Food[] = [
  // Starters (7)
  {
    id: 'food-1',
    name: 'Truffle Burrata & Heirloom Carpaccio',
    category: 'Starters',
    price: 18.50,
    description: 'Creamy Puglia burrata served with vine-ripened heritage tomatoes, aged balsamic reduction, roasted pine nuts, and micro basil.',
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6910a56e?w=600&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 142,
    isVeg: true,
    isAvailable: true,
    isPopular: true,
    isChefSpecial: true,
    preparationTimeMinutes: 12,
    calories: 380,
    spiceLevel: 'None',
    tags: ['Italian', 'Artisan Cheese', 'Gluten-Free Option']
  },
  {
    id: 'food-2',
    name: 'Crispy Calamari Fritti',
    category: 'Starters',
    price: 16.00,
    description: 'Golden lightly battered tender squid rings, served with charred lemon wedges and house-made saffron garlic aioli.',
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewsCount: 98,
    isVeg: false,
    isAvailable: true,
    isPopular: true,
    preparationTimeMinutes: 15,
    calories: 420,
    spiceLevel: 'Mild',
    tags: ['Seafood', 'Crispy', 'Snack']
  },
  {
    id: 'food-3',
    name: 'Wild Mushroom Arancini',
    category: 'Starters',
    price: 14.50,
    description: 'Crispy saffron risotto balls stuffed with porcini mushrooms and smoked scamorza, perched on marinara sauce.',
    image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?w=600&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 86,
    isVeg: true,
    isAvailable: true,
    preparationTimeMinutes: 14,
    calories: 340,
    spiceLevel: 'None',
    tags: ['Vegetarian', 'Truffle Oil']
  },
  {
    id: 'food-4',
    name: 'Smoked Salmon Crostini',
    category: 'Starters',
    price: 17.50,
    description: 'Toasted brioche topped with cold-smoked Norwegian salmon, whipped dill crème fraîche, caper berries, and pickled shallots.',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
    rating: 4.6,
    reviewsCount: 64,
    isVeg: false,
    isAvailable: true,
    preparationTimeMinutes: 10,
    calories: 290,
    spiceLevel: 'None',
    tags: ['Norwegian Salmon', 'Brioche']
  },
  {
    id: 'food-5',
    name: 'Artisanal Garlic Bruschetta',
    category: 'Starters',
    price: 11.50,
    description: 'Wood-fired sourdough rubbed with roasted garlic, marinated Roma tomatoes, extra virgin olive oil, and shaved Grana Padano.',
    image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=600&auto=format&fit=crop&q=80',
    rating: 4.5,
    reviewsCount: 110,
    isVeg: true,
    isAvailable: true,
    preparationTimeMinutes: 10,
    calories: 240,
    spiceLevel: 'None',
    tags: ['Classic', 'Vegetarian']
  },
  {
    id: 'food-6',
    name: 'Seared Scallops with Cauliflower Purée',
    category: 'Starters',
    price: 21.00,
    description: 'Pan-seared Atlantic jumbo scallops atop silky vanilla cauliflower velvet, crispy pancetta crisps, and herb oil.',
    image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=600&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 78,
    isVeg: false,
    isAvailable: true,
    isChefSpecial: true,
    preparationTimeMinutes: 15,
    calories: 310,
    spiceLevel: 'None',
    tags: ['Gourmet', 'Seafood']
  },
  {
    id: 'food-7',
    name: 'Roasted Pepper Tomato Soup',
    category: 'Starters',
    price: 10.50,
    description: 'Slow-simmered San Marzano tomatoes, charred bell peppers, fresh sweet cream, served with cheesy sourdough soldiers.',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewsCount: 92,
    isVeg: true,
    isAvailable: true,
    preparationTimeMinutes: 12,
    calories: 260,
    spiceLevel: 'Mild',
    tags: ['Comfort', 'Warm']
  },

  // Mains (8)
  {
    id: 'food-8',
    name: 'Slow-Braised Prime Short Rib',
    category: 'Mains',
    price: 34.00,
    description: '12-hour braised Angus beef rib glazed with Cabernet reduction, served over truffled potato mousseline and glazed baby carrots.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 210,
    isVeg: false,
    isAvailable: true,
    isPopular: true,
    isChefSpecial: true,
    preparationTimeMinutes: 25,
    calories: 780,
    spiceLevel: 'None',
    tags: ['Chef Signature', 'Angus Beef']
  },
  {
    id: 'food-9',
    name: 'Pan-Roasted Chilean Sea Bass',
    category: 'Mains',
    price: 38.50,
    description: 'Sustainable white sea bass filet with crispy skin, resting on saffron risotto, sautéed asparagus, and lemon caper emulsion.',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 165,
    isVeg: false,
    isAvailable: true,
    isChefSpecial: true,
    preparationTimeMinutes: 22,
    calories: 590,
    spiceLevel: 'None',
    tags: ['Wild Caught', 'Fine Dining']
  },
  {
    id: 'food-10',
    name: 'Herb-Crusted Rack of Lamb',
    category: 'Mains',
    price: 36.00,
    description: 'New Zealand lamb rack crusted with rosemary, thyme and pistachio, paired with fondant potatoes and blackberry jus.',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=600&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 130,
    isVeg: false,
    isAvailable: true,
    preparationTimeMinutes: 24,
    calories: 720,
    spiceLevel: 'None',
    tags: ['Premium Cut', 'Tender']
  },
  {
    id: 'food-11',
    name: 'Classic Chicken Piccata',
    category: 'Mains',
    price: 24.50,
    description: 'Pan-seared tender chicken breast deglazed with Pinot Grigio, butter, capers, fresh lemon zest, over buttered tagliolini.',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewsCount: 145,
    isVeg: false,
    isAvailable: true,
    isPopular: true,
    preparationTimeMinutes: 18,
    calories: 540,
    spiceLevel: 'None',
    tags: ['Italian Classic', 'Poultry']
  },
  {
    id: 'food-12',
    name: 'Roasted Butternut Squash Risotto',
    category: 'Mains',
    price: 22.00,
    description: 'Creamy Carnaroli rice simmered with roasted butternut squash, crispy sage, toasted pepitas, and goat cheese quenelle.',
    image: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?w=600&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewsCount: 88,
    isVeg: true,
    isAvailable: true,
    preparationTimeMinutes: 20,
    calories: 460,
    spiceLevel: 'None',
    tags: ['Vegetarian', 'Fall Flavors']
  },
  {
    id: 'food-13',
    name: 'Grilled Portobello & Polenta Steak',
    category: 'Mains',
    price: 21.50,
    description: 'Balsamic-marinated giant portobello caps over creamy parmesan polenta, sautéed Swiss chard, and caramelized shallot glaze.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
    rating: 4.6,
    reviewsCount: 72,
    isVeg: true,
    isAvailable: true,
    preparationTimeMinutes: 18,
    calories: 410,
    spiceLevel: 'None',
    tags: ['Plant-Forward', 'Earthy']
  },
  {
    id: 'food-14',
    name: 'Duck Confit with Cherry Glaze',
    category: 'Mains',
    price: 31.00,
    description: 'Crispy skin duck leg cooked in its own juices, paired with braised red cabbage, parsnip purée, and sour cherry reduction.',
    image: 'https://images.unsplash.com/photo-1514944298352-1fc7b9b7e716?w=600&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 94,
    isVeg: false,
    isAvailable: true,
    preparationTimeMinutes: 22,
    calories: 680,
    spiceLevel: 'None',
    tags: ['French Classic', 'Crispy']
  },
  {
    id: 'food-15',
    name: 'Dry-Aged Ribeye Steak (14oz)',
    category: 'Mains',
    price: 42.00,
    description: '28-day dry aged USDA prime ribeye seared on charcoal, basted with rosemary bone marrow butter, accompanied by roasted garlic bulb.',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=600&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 240,
    isVeg: false,
    isAvailable: true,
    isPopular: true,
    preparationTimeMinutes: 22,
    calories: 890,
    spiceLevel: 'None',
    tags: ['Prime Steak', 'Charcoal Grilled']
  },

  // Pizzas & Pastas (8)
  {
    id: 'food-16',
    name: 'Artisan Margherita D.O.P.',
    category: 'Pizzas & Pastas',
    price: 18.00,
    description: 'Fermented 72-hour sourdough crust, San Marzano tomatoes, Fior di Latte mozzarella, organic fresh basil leaves, and cold-pressed olive oil.',
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=600&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 310,
    isVeg: true,
    isAvailable: true,
    isPopular: true,
    preparationTimeMinutes: 14,
    calories: 650,
    spiceLevel: 'None',
    tags: ['Wood-Fired', 'Neapolitan']
  },
  {
    id: 'food-17',
    name: 'Black Truffle & Wild Funghi Pizza',
    category: 'Pizzas & Pastas',
    price: 23.50,
    description: 'White base with fontina, smoked provolone, sautéed chanterelles, porcini, finished with shaved black truffle and truffle honey.',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 189,
    isVeg: true,
    isAvailable: true,
    isChefSpecial: true,
    preparationTimeMinutes: 15,
    calories: 720,
    spiceLevel: 'None',
    tags: ['Truffle', 'Gourmet Pizza']
  },
  {
    id: 'food-18',
    name: 'Diavola Spicy Soppressata Pizza',
    category: 'Pizzas & Pastas',
    price: 21.00,
    description: 'Crushed tomato sauce, fresh mozzarella, artisanal spicy Calabrese salami, roasted hot honey drizzle, and fresh oregano.',
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=600&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 165,
    isVeg: false,
    isAvailable: true,
    isPopular: true,
    preparationTimeMinutes: 14,
    calories: 740,
    spiceLevel: 'Medium',
    tags: ['Hot Honey', 'Spicy']
  },
  {
    id: 'food-19',
    name: 'Prosciutto di Parma & Arugula Pizza',
    category: 'Pizzas & Pastas',
    price: 22.50,
    description: 'Crisp sourdough crust topped with melted fontina, 24-month aged Prosciutto di Parma, peppery wild baby arugula, and shaved parmesan.',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 142,
    isVeg: false,
    isAvailable: true,
    preparationTimeMinutes: 15,
    calories: 680,
    spiceLevel: 'None',
    tags: ['Parma Ham', 'Crisp']
  },
  {
    id: 'food-20',
    name: 'Lobster Fettuccine Al Limone',
    category: 'Pizzas & Pastas',
    price: 32.00,
    description: 'House-made egg fettuccine tossed with butter-poached Maine lobster tail, Meyer lemon cream, tarragon, and cracked pink peppercorns.',
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281180?w=600&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 175,
    isVeg: false,
    isAvailable: true,
    isChefSpecial: true,
    preparationTimeMinutes: 18,
    calories: 670,
    spiceLevel: 'Mild',
    tags: ['Maine Lobster', 'Handmade Pasta']
  },
  {
    id: 'food-21',
    name: 'Traditional Pappardelle Bolognese',
    category: 'Pizzas & Pastas',
    price: 25.00,
    description: 'Broad ribbons of pasta smothered in rich 8-hour braised beef and pork ragù, touched with whole milk and topped with 36-month Reggiano.',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 198,
    isVeg: false,
    isAvailable: true,
    isPopular: true,
    preparationTimeMinutes: 16,
    calories: 710,
    spiceLevel: 'None',
    tags: ['Hearty', 'Slow Cooked']
  },
  {
    id: 'food-22',
    name: 'Spaghetti Cacio e Pepe',
    category: 'Pizzas & Pastas',
    price: 19.50,
    description: 'Roman comfort perfection made with bronze-cut spaghetti, toasted Sarawak black peppercorns, and freshly grated Pecorino Romano.',
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewsCount: 154,
    isVeg: true,
    isAvailable: true,
    preparationTimeMinutes: 12,
    calories: 520,
    spiceLevel: 'Mild',
    tags: ['Roman', 'Classic Vegetarian']
  },
  {
    id: 'food-23',
    name: 'Squid Ink Linguine Frutti di Mare',
    category: 'Pizzas & Pastas',
    price: 28.50,
    description: 'Silky jet-black linguine sautéed with Manila clams, blue mussels, tiger prawns, and baby squid in a white wine garlic broth.',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 112,
    isVeg: false,
    isAvailable: true,
    preparationTimeMinutes: 18,
    calories: 580,
    spiceLevel: 'Mild',
    tags: ['Squid Ink', 'Seafood Feast']
  },

  // Grill & Seafood (6)
  {
    id: 'food-24',
    name: 'Grilled Mediterranean Tiger Prawns',
    category: 'Grill & Seafood',
    price: 29.00,
    description: 'Jumbo prawns grilled in their shells over open embers, basted with smoked paprika garlic butter and fresh parsley.',
    image: 'https://images.unsplash.com/photo-1559742811-822873691df8?w=600&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 135,
    isVeg: false,
    isAvailable: true,
    isPopular: true,
    preparationTimeMinutes: 16,
    calories: 450,
    spiceLevel: 'Mild',
    tags: ['Charcoal Grill', 'Tiger Prawns']
  },
  {
    id: 'food-25',
    name: 'Whole Roasted Branzino',
    category: 'Grill & Seafood',
    price: 35.00,
    description: 'Mediterranean sea bass stuffed with fresh lemon slices, thyme and rosemary, hearth-roasted and filleted tableside.',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 89,
    isVeg: false,
    isAvailable: true,
    isChefSpecial: true,
    preparationTimeMinutes: 25,
    calories: 490,
    spiceLevel: 'None',
    tags: ['Table-Side', 'Fresh Fish']
  },
  {
    id: 'food-26',
    name: 'Spanish Charred Octopus Tentacle',
    category: 'Grill & Seafood',
    price: 27.50,
    description: 'Tender sous-vide Galician octopus flash-grilled, served on crushed fingerling potatoes with smoked Pimentón and chimichurri.',
    image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 104,
    isVeg: false,
    isAvailable: true,
    preparationTimeMinutes: 18,
    calories: 390,
    spiceLevel: 'Mild',
    tags: ['Galician', 'Tender']
  },
  {
    id: 'food-27',
    name: 'Wagyu Beef Burger Gourmet',
    category: 'Grill & Seafood',
    price: 24.00,
    description: '8oz Wagyu beef patty, melted aged gruyère, bacon-onion jam, truffle aioli, on toasted brioche with rosemary fries.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 280,
    isVeg: false,
    isAvailable: true,
    isPopular: true,
    preparationTimeMinutes: 15,
    calories: 880,
    spiceLevel: 'None',
    tags: ['Wagyu', 'Burger']
  },
  {
    id: 'food-28',
    name: 'Grilled Tomahawk Rib Steak (Shareable)',
    category: 'Grill & Seafood',
    price: 85.00,
    description: '32oz bone-in tomahawk steak flame-grilled over hickory wood, accompanied by charred bone marrow, chimichurri, and roasted vine tomatoes.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    rating: 5.0,
    reviewsCount: 95,
    isVeg: false,
    isAvailable: true,
    isChefSpecial: true,
    preparationTimeMinutes: 30,
    calories: 1400,
    spiceLevel: 'None',
    tags: ['Shareable', 'Feast']
  },
  {
    id: 'food-29',
    name: 'Grilled Cedar Plank Atlantic Salmon',
    category: 'Grill & Seafood',
    price: 28.00,
    description: 'Fresh salmon roasted slowly on aromatic cedar wood with bourbon maple glaze and grilled broccolini.',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewsCount: 118,
    isVeg: false,
    isAvailable: true,
    preparationTimeMinutes: 20,
    calories: 560,
    spiceLevel: 'None',
    tags: ['Healthy', 'Cedar Smoked']
  },

  // Desserts (6)
  {
    id: 'food-30',
    name: 'Signature Venetian Tiramisu',
    category: 'Desserts',
    price: 12.00,
    description: 'Layered house-baked ladyfingers soaked in dark espresso and Marsala liqueur, whipped mascarpone custard, dusted with Valrhona cocoa.',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 340,
    isVeg: true,
    isAvailable: true,
    isPopular: true,
    preparationTimeMinutes: 8,
    calories: 420,
    spiceLevel: 'None',
    tags: ['House Specialty', 'Authentic']
  },
  {
    id: 'food-31',
    name: 'Madagascar Vanilla Crème Brûlée',
    category: 'Desserts',
    price: 11.50,
    description: 'Velvety rich custard infused with real Madagascar vanilla bean pods, crowned with a torch-caramelized glass sugar crust and fresh berries.',
    image: 'https://images.unsplash.com/photo-1470324161839-ce2bb6fa3bc3?w=600&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 160,
    isVeg: true,
    isAvailable: true,
    preparationTimeMinutes: 6,
    calories: 380,
    spiceLevel: 'None',
    tags: ['French', 'Vanilla Bean']
  },
  {
    id: 'food-32',
    name: 'Warm Belgian Chocolate Lava Cake',
    category: 'Desserts',
    price: 13.50,
    description: 'Decadent dark chocolate sponge cake with an oozing molten truffle center, paired with pistachio gelato and spun sugar.',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 275,
    isVeg: true,
    isAvailable: true,
    isPopular: true,
    preparationTimeMinutes: 12,
    calories: 540,
    spiceLevel: 'None',
    tags: ['Chocolate Lover', 'Molten']
  },
  {
    id: 'food-33',
    name: 'Sicilian Pistachio Cannoli (Trio)',
    category: 'Desserts',
    price: 11.00,
    description: 'Crispy fried pastry shells filled with sweetened sheep ricotta, candied orange peel, and dipped in crushed Bronte pistachios.',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewsCount: 88,
    isVeg: true,
    isAvailable: true,
    preparationTimeMinutes: 8,
    calories: 360,
    spiceLevel: 'None',
    tags: ['Sicilian', 'Pistachio']
  },
  {
    id: 'food-34',
    name: 'Wild Berry Panna Cotta',
    category: 'Desserts',
    price: 10.50,
    description: 'Silky smooth vanilla bean cream topped with tart raspberry coulis, fresh blackberries, and mint sprig.',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80',
    rating: 4.6,
    reviewsCount: 96,
    isVeg: true,
    isAvailable: true,
    preparationTimeMinutes: 6,
    calories: 310,
    spiceLevel: 'None',
    tags: ['Light', 'Berry']
  },
  {
    id: 'food-35',
    name: 'Artisanal Gelato Selection',
    category: 'Desserts',
    price: 9.50,
    description: 'Three scoops of handcrafted Italian gelato: Bronte Pistachio, Dark Chocolate Stracciatella, and Alphonso Mango Sorbet.',
    image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 140,
    isVeg: true,
    isAvailable: true,
    preparationTimeMinutes: 5,
    calories: 280,
    spiceLevel: 'None',
    tags: ['Refreshing', 'Handcrafted']
  },

  // Beverages (5)
  {
    id: 'food-36',
    name: 'Smoked Blood Orange Old Fashioned',
    category: 'Beverages',
    price: 15.00,
    description: 'Bourbon whiskey stirred with blood orange bitters, demerara syrup, smoked with charred rosemary under a glass cloche.',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 190,
    isVeg: true,
    isAvailable: true,
    isChefSpecial: true,
    preparationTimeMinutes: 5,
    calories: 190,
    spiceLevel: 'None',
    tags: ['Cocktail', 'Smoked']
  },
  {
    id: 'food-37',
    name: 'Amalfi Lemon Spritz',
    category: 'Beverages',
    price: 13.00,
    description: 'Limoncello di Capri, crisp Prosecco Superiore, sparkling soda water, finished with fresh mint and a spiral lemon twist.',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 155,
    isVeg: true,
    isAvailable: true,
    isPopular: true,
    preparationTimeMinutes: 4,
    calories: 150,
    spiceLevel: 'None',
    tags: ['Refreshing', 'Cocktail']
  },
  {
    id: 'food-38',
    name: 'Cold-Pressed Dragonfruit Lemonade',
    category: 'Beverages',
    price: 7.50,
    description: 'Vibrant non-alcoholic refresher with dragonfruit juice, fresh squeezed Eureka lemons, organic agave, and chia seed float.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewsCount: 88,
    isVeg: true,
    isAvailable: true,
    preparationTimeMinutes: 4,
    calories: 110,
    spiceLevel: 'None',
    tags: ['Mocktail', 'Organic']
  },
  {
    id: 'food-39',
    name: 'Artisan Pour-Over Ethiopian Yirgacheffe',
    category: 'Beverages',
    price: 6.50,
    description: 'Single-origin specialty brew with floral jasmine aroma, bergamot notes, and a silky clean peach finish.',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 120,
    isVeg: true,
    isAvailable: true,
    preparationTimeMinutes: 6,
    calories: 5,
    spiceLevel: 'None',
    tags: ['Specialty Coffee', 'Single Origin']
  },
  {
    id: 'food-40',
    name: 'Sparkling San Pellegrino Blood Orange (750ml)',
    category: 'Beverages',
    price: 6.00,
    description: 'Chilled natural sparkling mineral water from the Italian Alps, infused with fragrant Sicilian citrus zest.',
    image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=600&auto=format&fit=crop&q=80',
    rating: 4.6,
    reviewsCount: 65,
    isVeg: true,
    isAvailable: true,
    preparationTimeMinutes: 2,
    calories: 30,
    spiceLevel: 'None',
    tags: ['Italian Water', 'Chilled']
  }
];

// 15 REALISTIC DEMO ORDERS
export const DEMO_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'ORD-1001',
    userId: 'user-1',
    customerName: 'Elena Rostova',
    customerEmail: 'user@gourmet.com',
    customerPhone: '+1 (555) 234-5678',
    items: [
      { food: DEMO_FOODS[0], quantity: 1 }, // Truffle Burrata
      { food: DEMO_FOODS[15], quantity: 1 }, // Margherita Pizza
      { food: DEMO_FOODS[29], quantity: 1 }  // Venetian Tiramisu
    ],
    subtotal: 48.50,
    discount: 9.70,
    couponCode: 'WELCOME20',
    tax: 3.10,
    deliveryFee: 0,
    total: 41.90,
    status: 'Delivered',
    paymentMethod: 'Card',
    paymentStatus: 'Paid',
    orderType: 'Delivery',
    deliveryAddress: '742 Evergreen Terrace, Apt 4B, Metro District',
    createdAt: '2026-11-03T18:45:00.000Z',
    timeline: [
      { status: 'Pending', time: '18:45', description: 'Order confirmed and verified' },
      { status: 'Preparing', time: '18:50', description: 'Kitchen started food preparation' },
      { status: 'Ready', time: '19:12', description: 'Packaged in insulated thermal boxes' },
      { status: 'Delivered', time: '19:35', description: 'Delivered safely to doorstep' }
    ]
  },
  {
    id: 'ord-1002',
    orderNumber: 'ORD-1002',
    userId: 'user-2',
    customerName: 'Julian Sterling',
    customerEmail: 'julian.sterling@gmail.com',
    customerPhone: '+1 (555) 345-6789',
    items: [
      { food: DEMO_FOODS[7], quantity: 2 }, // Short Rib
      { food: DEMO_FOODS[35], quantity: 2 }  // Smoked Old Fashioned
    ],
    subtotal: 98.00,
    discount: 10.00,
    couponCode: 'FEAST10',
    tax: 7.04,
    deliveryFee: 0,
    total: 95.04,
    status: 'Ready',
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    orderType: 'Dine-In',
    tableNumber: 4,
    createdAt: '2026-11-04T12:15:00.000Z',
    timeline: [
      { status: 'Pending', time: '12:15', description: 'Order submitted by table waiter' },
      { status: 'Preparing', time: '12:20', description: 'Grill master preparing short rib' },
      { status: 'Ready', time: '12:44', description: 'Plated and staged at pass for serving' }
    ]
  },
  {
    id: 'ord-1003',
    orderNumber: 'ORD-1003',
    userId: 'user-3',
    customerName: 'Aria Chen',
    customerEmail: 'aria.chen@designco.io',
    customerPhone: '+1 (555) 456-7890',
    items: [
      { food: DEMO_FOODS[16], quantity: 1 }, // Truffle Pizza
      { food: DEMO_FOODS[19], quantity: 1 }, // Lobster Fettuccine
      { food: DEMO_FOODS[31], quantity: 1 }  // Lava Cake
    ],
    subtotal: 69.00,
    discount: 0,
    tax: 5.52,
    deliveryFee: 4.99,
    total: 79.51,
    status: 'Preparing',
    paymentMethod: 'Card',
    paymentStatus: 'Paid',
    orderType: 'Delivery',
    deliveryAddress: '88 Beacon Street, Boston, MA',
    createdAt: '2026-11-04T13:30:00.000Z',
    timeline: [
      { status: 'Pending', time: '13:30', description: 'Order paid online' },
      { status: 'Preparing', time: '13:35', description: 'Chefs tossing handmade pasta & pizza in oven' }
    ]
  },
  {
    id: 'ord-1004',
    orderNumber: 'ORD-1004',
    userId: 'user-1',
    customerName: 'Elena Rostova',
    customerEmail: 'user@gourmet.com',
    customerPhone: '+1 (555) 234-5678',
    items: [
      { food: DEMO_FOODS[14], quantity: 1 }, // Dry-Aged Ribeye
      { food: DEMO_FOODS[36], quantity: 1 }  // Amalfi Spritz
    ],
    subtotal: 55.00,
    discount: 0,
    tax: 4.40,
    deliveryFee: 0,
    total: 59.40,
    status: 'Pending',
    paymentMethod: 'Cash',
    paymentStatus: 'Pending',
    orderType: 'Takeaway',
    createdAt: '2026-11-04T14:02:00.000Z',
    timeline: [
      { status: 'Pending', time: '14:02', description: 'Waiting for kitchen acknowledgment' }
    ]
  },
  {
    id: 'ord-1005',
    orderNumber: 'ORD-1005',
    userId: 'user-4',
    customerName: 'David Kalu',
    customerEmail: 'david.kalu@techcorp.com',
    customerPhone: '+1 (555) 567-8901',
    items: [
      { food: DEMO_FOODS[26], quantity: 2 }, // Wagyu Burger
      { food: DEMO_FOODS[37], quantity: 2 }  // Dragonfruit Lemonade
    ],
    subtotal: 63.00,
    discount: 10.00,
    couponCode: 'FEAST10',
    tax: 4.24,
    deliveryFee: 4.99,
    total: 62.23,
    status: 'Delivered',
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    orderType: 'Delivery',
    deliveryAddress: '320 Pine Valley Rd, Seattle, WA',
    createdAt: '2026-11-02T20:10:00.000Z',
    timeline: [
      { status: 'Delivered', time: '20:55', description: 'Order completed' }
    ]
  },
  {
    id: 'ord-1006',
    orderNumber: 'ORD-1006',
    userId: 'user-5',
    customerName: 'Sophia Laurent',
    customerEmail: 'sophia.l@artisan.fr',
    customerPhone: '+1 (555) 678-9012',
    items: [
      { food: DEMO_FOODS[5], quantity: 1 }, // Seared Scallops
      { food: DEMO_FOODS[8], quantity: 1 }, // Chilean Sea Bass
      { food: DEMO_FOODS[30], quantity: 1 } // Creme Brulee
    ],
    subtotal: 71.00,
    discount: 14.20,
    couponCode: 'WELCOME20',
    tax: 4.54,
    deliveryFee: 0,
    total: 61.34,
    status: 'Delivered',
    paymentMethod: 'Card',
    paymentStatus: 'Paid',
    orderType: 'Dine-In',
    tableNumber: 1,
    createdAt: '2026-11-01T19:20:00.000Z',
    timeline: [
      { status: 'Delivered', time: '20:15', description: 'Completed dining service' }
    ]
  },
  {
    id: 'ord-1007',
    orderNumber: 'ORD-1007',
    userId: 'user-6',
    customerName: 'Mateo Morales',
    customerEmail: 'mateo.m@culinary.org',
    customerPhone: '+1 (555) 789-0123',
    items: [
      { food: DEMO_FOODS[20], quantity: 2 }, // Pappardelle Bolognese
      { food: DEMO_FOODS[38], quantity: 2 }  // Ethiopian Coffee
    ],
    subtotal: 63.00,
    discount: 0,
    tax: 5.04,
    deliveryFee: 4.99,
    total: 73.03,
    status: 'Delivered',
    paymentMethod: 'Card',
    paymentStatus: 'Paid',
    orderType: 'Delivery',
    deliveryAddress: '900 Ocean Drive, Miami, FL',
    createdAt: '2026-11-01T13:00:00.000Z',
    timeline: [
      { status: 'Delivered', time: '13:42', description: 'Delivered successfully' }
    ]
  },
  {
    id: 'ord-1008',
    orderNumber: 'ORD-1008',
    userId: 'user-7',
    customerName: 'Clara Oswald',
    customerEmail: 'clara.oswald@star.co.uk',
    customerPhone: '+1 (555) 890-1234',
    items: [
      { food: DEMO_FOODS[17], quantity: 1 }, // Diavola Pizza
      { food: DEMO_FOODS[2], quantity: 1 }   // Arancini
    ],
    subtotal: 35.50,
    discount: 5.00,
    couponCode: 'FREECHEF',
    tax: 2.44,
    deliveryFee: 4.99,
    total: 37.93,
    status: 'Delivered',
    paymentMethod: 'Cash',
    paymentStatus: 'Paid',
    orderType: 'Delivery',
    deliveryAddress: '42 Baker Street, London',
    createdAt: '2026-10-31T18:15:00.000Z',
    timeline: [
      { status: 'Delivered', time: '18:50', description: 'Delivered on time' }
    ]
  },
  {
    id: 'ord-1009',
    orderNumber: 'ORD-1009',
    userId: 'user-2',
    customerName: 'Julian Sterling',
    customerEmail: 'julian.sterling@gmail.com',
    customerPhone: '+1 (555) 345-6789',
    items: [
      { food: DEMO_FOODS[27], quantity: 1 }, // Tomahawk Rib Steak
      { food: DEMO_FOODS[35], quantity: 2 }  // Smoked Old Fashioned
    ],
    subtotal: 115.00,
    discount: 10.00,
    couponCode: 'FEAST10',
    tax: 8.40,
    deliveryFee: 0,
    total: 113.40,
    status: 'Delivered',
    paymentMethod: 'Card',
    paymentStatus: 'Paid',
    orderType: 'Dine-In',
    tableNumber: 12,
    createdAt: '2026-10-30T20:30:00.000Z',
    timeline: [
      { status: 'Delivered', time: '21:30', description: 'Fine dining service completed' }
    ]
  },
  {
    id: 'ord-1010',
    orderNumber: 'ORD-1010',
    userId: 'user-3',
    customerName: 'Aria Chen',
    customerEmail: 'aria.chen@designco.io',
    customerPhone: '+1 (555) 456-7890',
    items: [
      { food: DEMO_FOODS[1], quantity: 1 }, // Calamari
      { food: DEMO_FOODS[23], quantity: 1 } // Tiger Prawns
    ],
    subtotal: 45.00,
    discount: 0,
    tax: 3.60,
    deliveryFee: 4.99,
    total: 53.59,
    status: 'Delivered',
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    orderType: 'Delivery',
    deliveryAddress: '88 Beacon Street, Boston, MA',
    createdAt: '2026-10-29T19:00:00.000Z',
    timeline: [
      { status: 'Delivered', time: '19:40', description: 'Order finished' }
    ]
  },
  {
    id: 'ord-1011',
    orderNumber: 'ORD-1011',
    userId: 'user-1',
    customerName: 'Elena Rostova',
    customerEmail: 'user@gourmet.com',
    customerPhone: '+1 (555) 234-5678',
    items: [
      { food: DEMO_FOODS[11], quantity: 1 }, // Squash Risotto
      { food: DEMO_FOODS[33], quantity: 1 }  // Berry Panna Cotta
    ],
    subtotal: 32.50,
    discount: 5.00,
    couponCode: 'FREECHEF',
    tax: 2.20,
    deliveryFee: 4.99,
    total: 34.69,
    status: 'Delivered',
    paymentMethod: 'Card',
    paymentStatus: 'Paid',
    orderType: 'Delivery',
    deliveryAddress: '742 Evergreen Terrace, Apt 4B, Metro District',
    createdAt: '2026-10-28T12:30:00.000Z',
    timeline: [
      { status: 'Delivered', time: '13:05', description: 'Delivery dropped at door' }
    ]
  },
  {
    id: 'ord-1012',
    orderNumber: 'ORD-1012',
    userId: 'user-4',
    customerName: 'David Kalu',
    customerEmail: 'david.kalu@techcorp.com',
    customerPhone: '+1 (555) 567-8901',
    items: [
      { food: DEMO_FOODS[15], quantity: 2 }, // Margherita
      { food: DEMO_FOODS[36], quantity: 2 }  // Lemon Spritz
    ],
    subtotal: 62.00,
    discount: 10.00,
    couponCode: 'FEAST10',
    tax: 4.16,
    deliveryFee: 0,
    total: 56.16,
    status: 'Delivered',
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    orderType: 'Takeaway',
    createdAt: '2026-10-27T17:45:00.000Z',
    timeline: [
      { status: 'Delivered', time: '18:10', description: 'Customer picked up at counter' }
    ]
  },
  {
    id: 'ord-1013',
    orderNumber: 'ORD-1013',
    userId: 'user-5',
    customerName: 'Sophia Laurent',
    customerEmail: 'sophia.l@artisan.fr',
    customerPhone: '+1 (555) 678-9012',
    items: [
      { food: DEMO_FOODS[21], quantity: 1 }, // Cacio e Pepe
      { food: DEMO_FOODS[4], quantity: 1 }   // Garlic Bruschetta
    ],
    subtotal: 31.00,
    discount: 0,
    tax: 2.48,
    deliveryFee: 0,
    total: 33.48,
    status: 'Delivered',
    paymentMethod: 'Card',
    paymentStatus: 'Paid',
    orderType: 'Dine-In',
    tableNumber: 8,
    createdAt: '2026-10-26T13:10:00.000Z',
    timeline: [
      { status: 'Delivered', time: '13:40', description: 'Completed' }
    ]
  },
  {
    id: 'ord-1014',
    orderNumber: 'ORD-1014',
    userId: 'user-7',
    customerName: 'Clara Oswald',
    customerEmail: 'clara.oswald@star.co.uk',
    customerPhone: '+1 (555) 890-1234',
    items: [
      { food: DEMO_FOODS[18], quantity: 1 }, // Prosciutto Pizza
      { food: DEMO_FOODS[32], quantity: 1 }  // Pistachio Cannoli
    ],
    subtotal: 33.50,
    discount: 0,
    tax: 2.68,
    deliveryFee: 4.99,
    total: 41.17,
    status: 'Cancelled',
    paymentMethod: 'Cash',
    paymentStatus: 'Refunded',
    orderType: 'Delivery',
    deliveryAddress: '42 Baker Street, London',
    createdAt: '2026-10-25T19:50:00.000Z',
    timeline: [
      { status: 'Pending', time: '19:50', description: 'Order created' },
      { status: 'Cancelled', time: '19:55', description: 'Customer cancelled prior to dispatch' }
    ]
  },
  {
    id: 'ord-1015',
    orderNumber: 'ORD-1015',
    userId: 'user-6',
    customerName: 'Mateo Morales',
    customerEmail: 'mateo.m@culinary.org',
    customerPhone: '+1 (555) 789-0123',
    items: [
      { food: DEMO_FOODS[25], quantity: 1 }, // Charred Octopus
      { food: DEMO_FOODS[28], quantity: 1 }, // Cedar Salmon
      { food: DEMO_FOODS[34], quantity: 1 }  // Gelato Trio
    ],
    subtotal: 65.00,
    discount: 10.00,
    couponCode: 'FEAST10',
    tax: 4.40,
    deliveryFee: 0,
    total: 59.40,
    status: 'Delivered',
    paymentMethod: 'Card',
    paymentStatus: 'Paid',
    orderType: 'Dine-In',
    tableNumber: 3,
    createdAt: '2026-10-24T20:00:00.000Z',
    timeline: [
      { status: 'Delivered', time: '21:05', description: 'Service closed' }
    ]
  }
];

// 10 REALISTIC DEMO BOOKINGS
export const DEMO_BOOKINGS: Booking[] = [
  {
    id: 'bk-101',
    userId: 'user-1',
    customerName: 'Elena Rostova',
    customerEmail: 'user@gourmet.com',
    customerPhone: '+1 (555) 234-5678',
    tableId: 'tbl-1',
    tableNumber: 1,
    date: '2026-11-05',
    timeSlot: '19:30 - 21:30',
    guests: 2,
    specialRequest: 'Window seat with garden view for anniversary celebration. Can we have candles?',
    occasion: 'Anniversary',
    status: 'Approved',
    createdAt: '2026-11-03T10:00:00.000Z'
  },
  {
    id: 'bk-102',
    userId: 'user-2',
    customerName: 'Julian Sterling',
    customerEmail: 'julian.sterling@gmail.com',
    customerPhone: '+1 (555) 345-6789',
    tableId: 'tbl-7',
    tableNumber: 7,
    date: '2026-11-06',
    timeSlot: '20:00 - 22:30',
    guests: 6,
    specialRequest: 'High-profile business client meeting. Please keep wine pairing menu ready.',
    occasion: 'Business',
    status: 'Approved',
    createdAt: '2026-11-02T15:20:00.000Z'
  },
  {
    id: 'bk-103',
    userId: 'user-3',
    customerName: 'Aria Chen',
    customerEmail: 'aria.chen@designco.io',
    customerPhone: '+1 (555) 456-7890',
    tableId: 'tbl-14',
    tableNumber: 14,
    date: '2026-11-07',
    timeSlot: '18:00 - 20:00',
    guests: 4,
    specialRequest: 'Rooftop table preference for sunset golden hour photographs.',
    occasion: 'Birthday',
    status: 'Pending',
    createdAt: '2026-11-04T08:30:00.000Z'
  },
  {
    id: 'bk-104',
    userId: 'user-4',
    customerName: 'David Kalu',
    customerEmail: 'david.kalu@techcorp.com',
    customerPhone: '+1 (555) 567-8901',
    tableId: 'tbl-11',
    tableNumber: 11,
    date: '2026-11-08',
    timeSlot: '19:00 - 22:00',
    guests: 8,
    specialRequest: 'Private room booking with custom chef tasting menu for quarterly celebration.',
    occasion: 'Business',
    status: 'Approved',
    createdAt: '2026-11-01T11:45:00.000Z'
  },
  {
    id: 'bk-105',
    userId: 'user-5',
    customerName: 'Sophia Laurent',
    customerEmail: 'sophia.l@artisan.fr',
    customerPhone: '+1 (555) 678-9012',
    tableId: 'tbl-8',
    tableNumber: 8,
    date: '2026-11-04',
    timeSlot: '13:00 - 15:00',
    guests: 2,
    specialRequest: 'Quiet patio table with warm sun exposure.',
    occasion: 'Date Night',
    status: 'Completed',
    createdAt: '2026-10-31T09:10:00.000Z'
  },
  {
    id: 'bk-106',
    userId: 'user-6',
    customerName: 'Mateo Morales',
    customerEmail: 'mateo.m@culinary.org',
    customerPhone: '+1 (555) 789-0123',
    tableId: 'tbl-4',
    tableNumber: 4,
    date: '2026-11-09',
    timeSlot: '20:30 - 22:30',
    guests: 4,
    specialRequest: 'One guest has severe peanut and shellfish allergy.',
    occasion: 'Casual',
    status: 'Pending',
    createdAt: '2026-11-04T02:00:00.000Z'
  },
  {
    id: 'bk-107',
    userId: 'user-7',
    customerName: 'Clara Oswald',
    customerEmail: 'clara.oswald@star.co.uk',
    customerPhone: '+1 (555) 890-1234',
    tableId: 'tbl-13',
    tableNumber: 13,
    date: '2026-11-10',
    timeSlot: '19:00 - 21:00',
    guests: 2,
    specialRequest: 'Surprise birthday dessert with sparkler candle if possible!',
    occasion: 'Birthday',
    status: 'Approved',
    createdAt: '2026-10-30T16:15:00.000Z'
  },
  {
    id: 'bk-108',
    userId: 'user-1',
    customerName: 'Elena Rostova',
    customerEmail: 'user@gourmet.com',
    customerPhone: '+1 (555) 234-5678',
    tableId: 'tbl-6',
    tableNumber: 6,
    date: '2026-10-25',
    timeSlot: '19:00 - 21:30',
    guests: 5,
    specialRequest: 'Family dinner table',
    occasion: 'Casual',
    status: 'Completed',
    createdAt: '2026-10-20T14:00:00.000Z'
  },
  {
    id: 'bk-109',
    userId: 'user-2',
    customerName: 'Julian Sterling',
    customerEmail: 'julian.sterling@gmail.com',
    customerPhone: '+1 (555) 345-6789',
    tableId: 'tbl-12',
    tableNumber: 12,
    date: '2026-10-20',
    timeSlot: '18:30 - 21:30',
    guests: 10,
    specialRequest: 'Board of directors dinner',
    occasion: 'Business',
    status: 'Completed',
    createdAt: '2026-10-15T12:00:00.000Z'
  },
  {
    id: 'bk-110',
    userId: 'user-3',
    customerName: 'Aria Chen',
    customerEmail: 'aria.chen@designco.io',
    customerPhone: '+1 (555) 456-7890',
    tableId: 'tbl-2',
    tableNumber: 2,
    date: '2026-10-28',
    timeSlot: '12:00 - 14:00',
    guests: 2,
    specialRequest: 'Casual lunch date',
    occasion: 'Casual',
    status: 'Cancelled',
    createdAt: '2026-10-26T17:00:00.000Z',
    cancellationReason: 'Rescheduled due to travel conflict'
  }
];
