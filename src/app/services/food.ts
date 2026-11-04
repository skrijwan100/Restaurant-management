import { Injectable, signal, computed, inject } from '@angular/core';
import { Storage } from './storage';
import { Food, FoodCategory } from '../models/food.model';
import { Toast } from './toast';

@Injectable({
  providedIn: 'root'
})
export class FoodData {
  private storage = inject(Storage);
  private toast = inject(Toast);

  foods = signal<Food[]>(this.storage.getFoods());
  favorites = signal<string[]>(this.storage.getWishlist());
  recentlyViewed = signal<string[]>(this.storage.getRecentlyViewed());

  // Filter signals
  selectedCategory = signal<FoodCategory>('All');
  searchQuery = signal<string>('');
  vegFilter = signal<'all' | 'veg' | 'non-veg'>('all');
  maxPrice = signal<number>(100);
  sortBy = signal<'popular' | 'rating' | 'price-asc' | 'price-desc'>('popular');

  categories: FoodCategory[] = [
    'All',
    'Starters',
    'Mains',
    'Pizzas & Pastas',
    'Grill & Seafood',
    'Desserts',
    'Beverages'
  ];

  filteredFoods = computed(() => {
    let list = this.foods();
    const cat = this.selectedCategory();
    const query = this.searchQuery().trim().toLowerCase();
    const veg = this.vegFilter();
    const priceCap = this.maxPrice();
    const sort = this.sortBy();

    if (cat !== 'All') {
      list = list.filter(f => f.category === cat);
    }

    if (query) {
      list = list.filter(f => 
        f.name.toLowerCase().includes(query) ||
        f.description.toLowerCase().includes(query) ||
        f.tags?.some(t => t.toLowerCase().includes(query))
      );
    }

    if (veg === 'veg') {
      list = list.filter(f => f.isVeg);
    } else if (veg === 'non-veg') {
      list = list.filter(f => !f.isVeg);
    }

    list = list.filter(f => f.price <= priceCap);

    // Sorting
    return [...list].sort((a, b) => {
      if (sort === 'popular') return (b.reviewsCount || 0) - (a.reviewsCount || 0);
      if (sort === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      return 0;
    });
  });

  popularFoods = computed(() => {
    return this.foods().filter(f => f.isPopular).slice(0, 8);
  });

  chefSpecials = computed(() => {
    return this.foods().filter(f => f.isChefSpecial).slice(0, 6);
  });

  favoriteFoods = computed(() => {
    const favIds = new Set(this.favorites());
    return this.foods().filter(f => favIds.has(f.id));
  });

  recentFoods = computed(() => {
    const recentIds = this.recentlyViewed();
    const map = new Map(this.foods().map(f => [f.id, f]));
    return recentIds.map(id => map.get(id)).filter((f): f is Food => !!f);
  });

  toggleFavorite(foodId: string): void {
    const current = this.favorites();
    let updated: string[];
    if (current.includes(foodId)) {
      updated = current.filter(id => id !== foodId);
      this.toast.info('Removed from your favorites');
    } else {
      updated = [...current, foodId];
      this.toast.success('Saved to your favorites', 'Favorited');
    }
    this.favorites.set(updated);
    this.storage.setWishlist(updated);
  }

  isFavorite(foodId: string): boolean {
    return this.favorites().includes(foodId);
  }

  recordView(foodId: string): void {
    const current = this.recentlyViewed().filter(id => id !== foodId);
    const updated = [foodId, ...current].slice(0, 8);
    this.recentlyViewed.set(updated);
    this.storage.setRecentlyViewed(updated);
  }

  // Admin CRUD
  addFood(food: Omit<Food, 'id'>): void {
    const newFood: Food = {
      ...food,
      id: `food-${Date.now()}`
    };
    const updated = [newFood, ...this.foods()];
    this.foods.set(updated);
    this.storage.setFoods(updated);
    this.toast.success(`Dish "${food.name}" added to menu`, 'Menu Updated');
  }

  updateFood(id: string, updates: Partial<Food>): void {
    const updated = this.foods().map(f => f.id === id ? { ...f, ...updates } : f);
    this.foods.set(updated);
    this.storage.setFoods(updated);
    this.toast.success('Menu item updated successfully');
  }

  deleteFood(id: string): void {
    const target = this.foods().find(f => f.id === id);
    const updated = this.foods().filter(f => f.id !== id);
    this.foods.set(updated);
    this.storage.setFoods(updated);
    this.toast.warning(`Deleted "${target?.name ?? 'item'}" from menu`);
  }

  toggleAvailability(id: string): void {
    const food = this.foods().find(f => f.id === id);
    if (!food) return;
    this.updateFood(id, { isAvailable: !food.isAvailable });
  }
}
