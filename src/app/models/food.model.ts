export type FoodCategory = 
  | 'All' 
  | 'Starters' 
  | 'Mains' 
  | 'Pizzas & Pastas' 
  | 'Grill & Seafood' 
  | 'Desserts' 
  | 'Beverages';

export interface Food {
  id: string;
  name: string;
  category: FoodCategory;
  price: number;
  description: string;
  image: string;
  rating: number;
  reviewsCount: number;
  isVeg: boolean;
  isAvailable: boolean;
  isPopular?: boolean;
  isChefSpecial?: boolean;
  preparationTimeMinutes: number;
  calories?: number;
  spiceLevel?: 'Mild' | 'Medium' | 'Hot' | 'None';
  tags?: string[];
}

export interface CartItem {
  food: Food;
  quantity: number;
  specialInstructions?: string;
}
