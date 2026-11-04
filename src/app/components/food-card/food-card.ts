import { ChangeDetectionStrategy, Component, input, signal, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Food } from '../../models/food.model';
import { FoodData } from '../../services/food';
import { OrderData } from '../../services/order';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-food-card',
  imports: [MatIconModule],
  template: `
    <div 
      class="group relative bg-white dark:bg-[#1b2a32] rounded-2xl border border-orange-100/70 dark:border-white/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden h-full">
      
      <!-- Image Container -->
      <div class="relative w-full h-48 sm:h-52 overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img 
          [src]="food().image" 
          [alt]="food().name" 
          loading="lazy"
          referrerpolicy="no-referrer"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <!-- Gradient Overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

        <!-- Veg / Non-Veg Indicator -->
        <div class="absolute top-3 left-3 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md p-1 rounded-md shadow-md flex items-center justify-center">
          @if (food().isVeg) {
            <div class="w-3.5 h-3.5 border-2 border-emerald-600 flex items-center justify-center rounded-sm">
              <div class="w-1.5 h-1.5 rounded-full bg-emerald-600"></div>
            </div>
          } @else {
            <div class="w-3.5 h-3.5 border-2 border-rose-600 flex items-center justify-center rounded-sm">
              <div class="w-1.5 h-1.5 rounded-full bg-rose-600"></div>
            </div>
          }
        </div>

        <!-- Favorite Heart Button -->
        <button 
          type="button" 
          (click)="onFavoriteClick($event)"
          title="Add to Wishlist"
          class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md flex items-center justify-center text-slate-400 hover:text-rose-500 shadow-md transition-colors cursor-pointer"
          [class.text-rose-500]="foodData.isFavorite(food().id)">
          <mat-icon class="text-lg">
            {{ foodData.isFavorite(food().id) ? 'favorite' : 'favorite_border' }}
          </mat-icon>
        </button>

        <!-- Category & Chef Special Kicker -->
        <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white">
          <span class="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md font-medium">
            {{ food().category }}
          </span>
          @if (food().isChefSpecial) {
            <span class="bg-[#E76F51] px-2 py-0.5 rounded-md font-bold shadow-sm">
              Chef Special
            </span>
          }
        </div>
      </div>

      <!-- Card Body -->
      <div class="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <!-- Title & Rating -->
          <div class="flex items-start justify-between gap-2 mb-1">
            <h3 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug line-clamp-1 group-hover:text-[#E76F51] transition-colors">
              {{ food().name }}
            </h3>
            <div class="shrink-0 flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded">
              <mat-icon class="text-xs">star</mat-icon>
              <span>{{ food().rating }}</span>
            </div>
          </div>

          <!-- Description -->
          <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {{ food().description }}
          </p>

          <!-- Tags & Prep Time -->
          <div class="flex items-center gap-2 mt-2 text-[11px] text-slate-400 dark:text-slate-500">
            <span class="flex items-center gap-0.5">
              <mat-icon class="text-xs">schedule</mat-icon>
              {{ food().preparationTimeMinutes }} min
            </span>
            @if (food().calories) {
              <span>·</span>
              <span>{{ food().calories }} kcal</span>
            }
            @if (food().spiceLevel && food().spiceLevel !== 'None') {
              <span>·</span>
              <span class="text-rose-500 font-medium">{{ food().spiceLevel }} Spicy</span>
            }
          </div>
        </div>

        <!-- Price & Action Button -->
        <div class="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-2">
          <div class="flex flex-col">
            <span class="text-[10px] uppercase text-slate-400 font-semibold tracking-wider">Price</span>
            <span class="text-base sm:text-lg font-extrabold text-[#E76F51]">
              \${{ food().price.toFixed(2) }}
            </span>
          </div>

          <!-- Quantity selector and Add button -->
          <div class="flex items-center gap-1.5">
            <div class="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
              <button 
                type="button" 
                (click)="decrementQty()" 
                [disabled]="quantity() <= 1"
                class="w-6 h-6 rounded flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 cursor-pointer">
                -
              </button>
              <span class="w-6 text-center text-xs font-bold text-slate-800 dark:text-white">
                {{ quantity() }}
              </span>
              <button 
                type="button" 
                (click)="incrementQty()" 
                class="w-6 h-6 rounded flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 cursor-pointer">
                +
              </button>
            </div>

            <button 
              type="button" 
              (click)="onAddToCart()" 
              [disabled]="!food().isAvailable"
              class="px-3 py-1.5 rounded-xl bg-[#E76F51] hover:bg-[#D9593B] disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white text-xs font-bold shadow-md shadow-[#E76F51]/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-1 cursor-pointer">
              <mat-icon class="text-sm">shopping_cart</mat-icon>
              <span>Add</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  `
})
export class FoodCardComponent {
  food = input.required<Food>();
  quantity = signal<number>(1);

  foodData = inject(FoodData);
  orderData = inject(OrderData);

  incrementQty(): void {
    this.quantity.update(q => q + 1);
  }

  decrementQty(): void {
    this.quantity.update(q => Math.max(1, q - 1));
  }

  onFavoriteClick(event: Event): void {
    event.stopPropagation();
    this.foodData.toggleFavorite(this.food().id);
  }

  onAddToCart(): void {
    this.orderData.addToCart(this.food(), this.quantity());
    this.quantity.set(1);
  }
}
