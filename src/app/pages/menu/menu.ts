import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FoodData } from '../../services/food';
import { FoodCardComponent } from '../../components/food-card/food-card';
import { FoodCategory } from '../../models/food.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-menu',
  imports: [MatIconModule, FoodCardComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <!-- Page Header -->
      <div class="text-center max-w-2xl mx-auto space-y-2">
        <span class="text-xs font-bold uppercase tracking-widest text-[#E76F51]">Artisanal Selections</span>
        <h1 class="font-serif text-3xl sm:text-4xl font-bold text-[#264653] dark:text-white">Our Gastronomic Menu</h1>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Crafted with locally sourced organic produce, prime dry-aged meats, wild-caught seafood, and authentic Mediterranean recipes.
        </p>
      </div>

      <!-- Controls & Filter Toolbar -->
      <div class="bg-white dark:bg-[#1b2a32] p-5 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm space-y-5">
        
        <!-- Search and Sort Row -->
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          
          <!-- Search input -->
          <div class="relative w-full md:max-w-md">
            <mat-icon class="absolute left-3.5 top-2.5 text-slate-400 text-lg">search</mat-icon>
            <input 
              type="text" 
              placeholder="Search by dish name, ingredient, or tag..."
              [value]="foodData.searchQuery()"
              (input)="foodData.searchQuery.set($any($event.target).value)"
              class="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E76F51]"
            />
            @if (foodData.searchQuery()) {
              <button 
                type="button" 
                (click)="foodData.searchQuery.set('')"
                class="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer">
                <mat-icon class="text-base">close</mat-icon>
              </button>
            }
          </div>

          <!-- Veg Toggle and Sort Selector -->
          <div class="flex flex-wrap items-center justify-end gap-3 w-full md:w-auto">
            
            <!-- Veg / Non-Veg Toggle -->
            <div class="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
              <button 
                type="button" 
                (click)="foodData.vegFilter.set('all')"
                class="px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                [class.bg-white]="foodData.vegFilter() === 'all'"
                [class.dark:bg-slate-700]="foodData.vegFilter() === 'all'"
                [class.text-slate-900]="foodData.vegFilter() === 'all'"
                [class.dark:text-white]="foodData.vegFilter() === 'all'"
                [class.shadow-sm]="foodData.vegFilter() === 'all'"
                [class.text-slate-500]="foodData.vegFilter() !== 'all'">
                All
              </button>
              <button 
                type="button" 
                (click)="foodData.vegFilter.set('veg')"
                class="px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                [class.bg-white]="foodData.vegFilter() === 'veg'"
                [class.dark:bg-slate-700]="foodData.vegFilter() === 'veg'"
                [class.text-emerald-600]="foodData.vegFilter() === 'veg'"
                [class.shadow-sm]="foodData.vegFilter() === 'veg'"
                [class.text-slate-500]="foodData.vegFilter() !== 'veg'">
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Pure Veg</span>
              </button>
              <button 
                type="button" 
                (click)="foodData.vegFilter.set('non-veg')"
                class="px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                [class.bg-white]="foodData.vegFilter() === 'non-veg'"
                [class.dark:bg-slate-700]="foodData.vegFilter() === 'non-veg'"
                [class.text-rose-600]="foodData.vegFilter() === 'non-veg'"
                [class.shadow-sm]="foodData.vegFilter() === 'non-veg'"
                [class.text-slate-500]="foodData.vegFilter() !== 'non-veg'">
                <span class="w-2 h-2 rounded-full bg-rose-500"></span>
                <span>Non-Veg</span>
              </button>
            </div>

            <!-- Sort By -->
            <div class="flex items-center gap-1.5">
              <span class="text-xs text-slate-400 font-medium">Sort:</span>
              <select 
                [value]="foodData.sortBy()"
                (change)="foodData.sortBy.set($any($event.target).value)"
                class="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#E76F51]">
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

          </div>

        </div>

        <!-- Category Filter Tabs -->
        <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          @for (category of foodData.categories; track category) {
            <button 
              type="button" 
              (click)="foodData.selectedCategory.set(category)"
              class="px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer"
              [class.bg-[#E76F51]]="foodData.selectedCategory() === category"
              [class.text-white]="foodData.selectedCategory() === category"
              [class.shadow-md]="foodData.selectedCategory() === category"
              [class.shadow-[#E76F51]/20]="foodData.selectedCategory() === category"
              [class.bg-slate-100]="foodData.selectedCategory() !== category"
              [class.dark:bg-slate-800]="foodData.selectedCategory() !== category"
              [class.text-slate-600]="foodData.selectedCategory() !== category"
              [class.dark:text-slate-300]="foodData.selectedCategory() !== category"
              [class.hover:bg-slate-200]="foodData.selectedCategory() !== category"
              [class.dark:hover:bg-slate-700]="foodData.selectedCategory() !== category">
              {{ category }}
            </button>
          }
        </div>

        <!-- Price Range Slider -->
        <div class="flex items-center gap-4 pt-2 border-t border-slate-100 dark:border-white/5">
          <span class="text-xs text-slate-500 dark:text-slate-400 font-semibold shrink-0">
            Max Price: <strong class="text-[#E76F51]">\${{ foodData.maxPrice() }}</strong>
          </span>
          <input 
            type="range" 
            min="10" 
            max="100" 
            step="5"
            [value]="foodData.maxPrice()"
            (input)="foodData.maxPrice.set(+$any($event.target).value)"
            class="w-full accent-[#E76F51] cursor-pointer"
          />
        </div>

      </div>

      <!-- Food Results Grid -->
      <div class="space-y-4">
        <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Showing <strong>{{ foodData.filteredFoods().length }}</strong> culinary creations</span>
          @if (foodData.selectedCategory() !== 'All' || foodData.searchQuery() || foodData.vegFilter() !== 'all' || foodData.maxPrice() < 100) {
            <button 
              type="button" 
              (click)="resetFilters()"
              class="text-[#E76F51] font-bold hover:underline cursor-pointer flex items-center gap-1">
              <mat-icon class="text-sm">restart_alt</mat-icon>
              Reset Filters
            </button>
          }
        </div>

        @if (foodData.filteredFoods().length > 0) {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            @for (food of foodData.filteredFoods(); track food.id) {
              <app-food-card [food]="food"></app-food-card>
            }
          </div>
        } @else {
          <!-- Empty State -->
          <div class="text-center py-16 bg-white dark:bg-[#1b2a32] rounded-3xl border border-slate-200 dark:border-white/10 p-8 space-y-4 max-w-md mx-auto">
            <div class="w-16 h-16 rounded-2xl bg-orange-100 dark:bg-orange-950 flex items-center justify-center text-[#E76F51] mx-auto">
              <mat-icon class="text-3xl">no_meals</mat-icon>
            </div>
            <h3 class="font-serif text-lg font-bold text-slate-800 dark:text-white">No Dishes Found</h3>
            <p class="text-xs text-slate-500">
              We couldn't find any dishes matching your current filter criteria. Try adjusting the category, veg option, or price cap.
            </p>
            <button 
              type="button" 
              (click)="resetFilters()" 
              class="px-5 py-2.5 rounded-xl bg-[#E76F51] text-white text-xs font-bold shadow-md cursor-pointer">
              Show All 40 Items
            </button>
          </div>
        }
      </div>

      <!-- Recently Viewed Foods Strip -->
      @if (foodData.recentFoods().length > 0) {
        <div class="pt-8 border-t border-slate-200 dark:border-white/10 space-y-4">
          <h3 class="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Recently Viewed Dishes</h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            @for (food of foodData.recentFoods(); track food.id) {
              <div 
                (click)="foodData.searchQuery.set(food.name)"
                class="bg-white dark:bg-[#1b2a32] p-2.5 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-[#E76F51] cursor-pointer transition-all space-y-2">
                <img [src]="food.image" [alt]="food.name" referrerpolicy="no-referrer" class="w-full h-24 rounded-xl object-cover" />
                <p class="text-xs font-bold text-slate-800 dark:text-white truncate">{{ food.name }}</p>
                <p class="text-xs font-bold text-[#E76F51]">\${{ food.price.toFixed(2) }}</p>
              </div>
            }
          </div>
        </div>
      }

    </div>
  `
})
export class MenuPage implements OnInit {
  foodData = inject(FoodData);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['search']) {
        this.foodData.searchQuery.set(params['search']);
      }
      if (params['category']) {
        this.foodData.selectedCategory.set(params['category'] as FoodCategory);
      }
    });
  }

  resetFilters(): void {
    this.foodData.selectedCategory.set('All');
    this.foodData.searchQuery.set('');
    this.foodData.vegFilter.set('all');
    this.foodData.maxPrice.set(100);
    this.foodData.sortBy.set('popular');
  }
}
