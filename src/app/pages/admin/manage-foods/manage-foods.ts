import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FoodData } from '../../../services/food';
import { Food, FoodCategory } from '../../../models/food.model';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-manage-foods',
  imports: [MatIconModule, ConfirmDialogComponent],
  template: `
    <div class="space-y-6">
      
      <!-- Top Bar -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
        <div>
          <span class="text-xs font-bold uppercase tracking-widest text-[#E76F51]">Gastronomy Inventory</span>
          <h1 class="font-serif text-3xl font-bold text-[#264653] dark:text-white">Manage Food & Dishes</h1>
        </div>

        <button 
          type="button" 
          (click)="openAddFoodModal()"
          class="px-5 py-2.5 rounded-xl bg-[#E76F51] hover:bg-[#D9593B] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer">
          <mat-icon class="text-sm">add</mat-icon>
          <span>Create New Dish</span>
        </button>
      </div>

      <!-- Search & Filters -->
      <div class="bg-white dark:bg-[#1b2a32] p-4 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="relative w-full sm:max-w-xs">
          <mat-icon class="absolute left-3 top-2.5 text-slate-400 text-lg">search</mat-icon>
          <input 
            type="text" 
            placeholder="Search dish by name..."
            [value]="searchQuery()"
            (input)="searchQuery.set($any($event.target).value)"
            class="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white"
          />
        </div>

        <div class="flex items-center gap-2 w-full sm:w-auto">
          <span class="text-xs text-slate-400 font-semibold">Category:</span>
          <select 
            [value]="selectedCat()"
            (change)="selectedCat.set($any($event.target).value)"
            class="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white">
            <option value="All">All Categories ({{ foodData.foods().length }})</option>
            <option value="Starters">Starters</option>
            <option value="Mains">Mains</option>
            <option value="Pizzas & Pastas">Pizzas & Pastas</option>
            <option value="Grill & Seafood">Grill & Seafood</option>
            <option value="Desserts">Desserts</option>
            <option value="Beverages">Beverages</option>
          </select>
        </div>
      </div>

      <!-- Foods Table List -->
      <div class="bg-white dark:bg-[#1b2a32] rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-white/10">
              <tr>
                <th class="py-3.5 px-4 font-bold">Dish</th>
                <th class="py-3.5 px-4 font-bold">Category</th>
                <th class="py-3.5 px-4 font-bold">Type</th>
                <th class="py-3.5 px-4 font-bold">Price</th>
                <th class="py-3.5 px-4 font-bold">Status</th>
                <th class="py-3.5 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-white/5">
              @for (food of displayedFoods(); track food.id) {
                <tr class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td class="py-3 px-4">
                    <div class="flex items-center gap-3">
                      <img [src]="food.image" [alt]="food.name" referrerpolicy="no-referrer" class="w-12 h-12 rounded-xl object-cover shrink-0" />
                      <div>
                        <p class="font-bold text-slate-800 dark:text-white">{{ food.name }}</p>
                        <p class="text-[11px] text-slate-400 line-clamp-1 max-w-xs">{{ food.description }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">
                    {{ food.category }}
                  </td>
                  <td class="py-3 px-4">
                    @if (food.isVeg) {
                      <span class="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Veg
                      </span>
                    } @else {
                      <span class="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded">
                        <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Non-Veg
                      </span>
                    }
                  </td>
                  <td class="py-3 px-4 font-extrabold text-[#E76F51]">
                    \${{ food.price.toFixed(2) }}
                  </td>
                  <td class="py-3 px-4">
                    <button 
                      type="button" 
                      (click)="foodData.toggleAvailability(food.id)"
                      class="px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-all"
                      [class.bg-emerald-100]="food.isAvailable"
                      [class.text-emerald-800]="food.isAvailable"
                      [class.bg-rose-100]="!food.isAvailable"
                      [class.text-rose-800]="!food.isAvailable">
                      {{ food.isAvailable ? 'In Stock' : 'Out of Stock' }}
                    </button>
                  </td>
                  <td class="py-3 px-4 text-right">
                    <div class="flex items-center justify-end gap-1">
                      <button 
                        type="button" 
                        (click)="openEditFoodModal(food)"
                        class="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                        title="Edit Dish">
                        <mat-icon class="text-base">edit</mat-icon>
                      </button>
                      <button 
                        type="button" 
                        (click)="promptDeleteFood(food)"
                        class="p-1.5 text-rose-400 hover:text-rose-600 cursor-pointer"
                        title="Delete Dish">
                        <mat-icon class="text-base">delete</mat-icon>
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add / Edit Food Modal -->
      @if (isFoodModalOpen()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div class="bg-white dark:bg-[#1b2a32] rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 dark:border-white/10 space-y-4">
            
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
              <h3 class="font-serif text-lg font-bold text-slate-800 dark:text-white">
                {{ editingFoodId() ? 'Edit Dish' : 'Add New Culinary Dish' }}
              </h3>
              <button type="button" (click)="isFoodModalOpen.set(false)" class="text-slate-400 hover:text-slate-600 cursor-pointer">
                <mat-icon class="text-sm">close</mat-icon>
              </button>
            </div>

            <form (submit)="onSaveFood($event)" class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Dish Name</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Truffle Pappardelle"
                  [value]="fName()"
                  (input)="fName.set($any($event.target).value)"
                  class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select 
                    [value]="fCategory()"
                    (change)="fCategory.set($any($event.target).value)"
                    class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white">
                    <option value="Starters">Starters</option>
                    <option value="Mains">Mains</option>
                    <option value="Pizzas & Pastas">Pizzas & Pastas</option>
                    <option value="Grill & Seafood">Grill & Seafood</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Beverages">Beverages</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Price ($ USD)</label>
                  <input 
                    type="number" 
                    step="0.5" 
                    required 
                    min="1"
                    [value]="fPrice()"
                    (input)="fPrice.set(+$any($event.target).value)"
                    class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Food Image URL</label>
                <input 
                  type="url" 
                  required
                  placeholder="https://images.unsplash.com/photo-..."
                  [value]="fImage()"
                  (input)="fImage.set($any($event.target).value)"
                  class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
                @if (fImage()) {
                  <img [src]="fImage()" alt="Preview" referrerpolicy="no-referrer" class="w-full h-32 rounded-xl object-cover mt-2 border border-slate-200" />
                }
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea 
                  rows="2" 
                  required
                  placeholder="Ingredients, origin, cooking method..."
                  [value]="fDesc()"
                  (input)="fDesc.set($any($event.target).value)"
                  class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white">
                </textarea>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div class="flex items-center gap-2 pt-2">
                  <input 
                    type="checkbox" 
                    id="veg" 
                    [checked]="fIsVeg()" 
                    (change)="fIsVeg.set($any($event.target).checked)"
                    class="w-4 h-4 text-emerald-600 rounded"
                  />
                  <label for="veg" class="text-xs font-bold text-slate-700 dark:text-slate-300">Pure Vegetarian</label>
                </div>
                <div class="flex items-center gap-2 pt-2">
                  <input 
                    type="checkbox" 
                    id="chef" 
                    [checked]="fIsChef()" 
                    (change)="fIsChef.set($any($event.target).checked)"
                    class="w-4 h-4 text-[#E76F51] rounded"
                  />
                  <label for="chef" class="text-xs font-bold text-slate-700 dark:text-slate-300">Chef Special</label>
                </div>
              </div>

              <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-white/10">
                <button 
                  type="button" 
                  (click)="isFoodModalOpen.set(false)"
                  class="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold cursor-pointer">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  class="px-5 py-2 rounded-xl bg-[#E76F51] text-white text-xs font-bold shadow-md cursor-pointer">
                  Save Dish
                </button>
              </div>
            </form>

          </div>
        </div>
      }

      <!-- Delete Confirmation -->
      <app-confirm-dialog 
        [isOpen]="isDeleteDialogOpen()"
        title="Delete Menu Dish"
        [message]="'Are you sure you want to remove ' + (foodToDelete()?.name || '') + ' from the dining menu?'"
        confirmLabel="Yes, Delete Dish"
        (confirm)="confirmDeleteFood()"
        (cancelled)="isDeleteDialogOpen.set(false)">
      </app-confirm-dialog>

    </div>
  `
})
export class ManageFoodsPage {
  foodData = inject(FoodData);

  searchQuery = signal<string>('');
  selectedCat = signal<string>('All');

  isFoodModalOpen = signal<boolean>(false);
  isDeleteDialogOpen = signal<boolean>(false);
  editingFoodId = signal<string | null>(null);
  foodToDelete = signal<Food | null>(null);

  // Form signals
  fName = signal<string>('');
  fCategory = signal<FoodCategory>('Mains');
  fPrice = signal<number>(24.00);
  fDesc = signal<string>('');
  fImage = signal<string>('https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80');
  fIsVeg = signal<boolean>(false);
  fIsChef = signal<boolean>(false);

  displayedFoods(): Food[] {
    let list = this.foodData.foods();
    const query = this.searchQuery().toLowerCase().trim();
    const cat = this.selectedCat();

    if (query) {
      list = list.filter(f => f.name.toLowerCase().includes(query));
    }
    if (cat !== 'All') {
      list = list.filter(f => f.category === cat);
    }
    return list;
  }

  openAddFoodModal(): void {
    this.editingFoodId.set(null);
    this.fName.set('');
    this.fCategory.set('Mains');
    this.fPrice.set(24.00);
    this.fDesc.set('');
    this.fImage.set('https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80');
    this.fIsVeg.set(false);
    this.fIsChef.set(false);
    this.isFoodModalOpen.set(true);
  }

  openEditFoodModal(food: Food): void {
    this.editingFoodId.set(food.id);
    this.fName.set(food.name);
    this.fCategory.set(food.category);
    this.fPrice.set(food.price);
    this.fDesc.set(food.description);
    this.fImage.set(food.image);
    this.fIsVeg.set(food.isVeg);
    this.fIsChef.set(!!food.isChefSpecial);
    this.isFoodModalOpen.set(true);
  }

  onSaveFood(event: Event): void {
    event.preventDefault();
    const id = this.editingFoodId();

    if (id) {
      this.foodData.updateFood(id, {
        name: this.fName(),
        category: this.fCategory(),
        price: this.fPrice(),
        description: this.fDesc(),
        image: this.fImage(),
        isVeg: this.fIsVeg(),
        isChefSpecial: this.fIsChef()
      });
    } else {
      this.foodData.addFood({
        name: this.fName(),
        category: this.fCategory(),
        price: this.fPrice(),
        description: this.fDesc(),
        image: this.fImage(),
        rating: 4.8,
        reviewsCount: 1,
        isVeg: this.fIsVeg(),
        isAvailable: true,
        isChefSpecial: this.fIsChef(),
        preparationTimeMinutes: 15
      });
    }

    this.isFoodModalOpen.set(false);
  }

  promptDeleteFood(food: Food): void {
    this.foodToDelete.set(food);
    this.isDeleteDialogOpen.set(true);
  }

  confirmDeleteFood(): void {
    const target = this.foodToDelete();
    if (target) {
      this.foodData.deleteFood(target.id);
    }
    this.isDeleteDialogOpen.set(false);
    this.foodToDelete.set(null);
  }
}
