import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Auth } from '../../services/auth';
import { OrderData } from '../../services/order';
import { FoodData } from '../../services/food';
import { Theme } from '../../services/theme';
import { Food } from '../../models/food.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, MatIconModule, UpperCasePipe],
  template: `
    <header class="sticky top-0 z-40 w-full bg-white/90 dark:bg-[#131f24]/90 backdrop-blur-md border-b border-orange-100 dark:border-white/10 transition-colors duration-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        <!-- Logo -->
        <a routerLink="/" class="flex items-center gap-3 shrink-0 group">
          <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#E76F51] to-[#F4A261] flex items-center justify-center text-white shadow-md shadow-[#E76F51]/20 group-hover:scale-105 transition-transform duration-200">
            <mat-icon class="text-2xl">restaurant</mat-icon>
          </div>
          <div class="flex flex-col">
            <span class="font-serif text-2xl font-bold tracking-tight text-[#264653] dark:text-white leading-none">
              SAVORIA
            </span>
            <span class="text-[10px] uppercase tracking-widest text-[#E76F51] font-semibold mt-0.5">
              Ristorante & Lounge
            </span>
          </div>
        </a>

        <!-- Desktop Navigation Links -->
        <nav class="hidden lg:flex items-center gap-1 xl:gap-2">
          <a routerLink="/" routerLinkActive="text-[#E76F51] font-bold after:scale-100" [routerLinkActiveOptions]="{exact: true}"
            class="relative px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-[#E76F51] dark:hover:text-[#E76F51] transition-colors after:content-[''] after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-[#E76F51] after:scale-0 after:transition-transform">
            Home
          </a>
          <a routerLink="/menu" routerLinkActive="text-[#E76F51] font-bold after:scale-100"
            class="relative px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-[#E76F51] dark:hover:text-[#E76F51] transition-colors after:content-[''] after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-[#E76F51] after:scale-0 after:transition-transform">
            Menu
          </a>
          <a routerLink="/book-table" routerLinkActive="text-[#E76F51] font-bold after:scale-100"
            class="relative px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-[#E76F51] dark:hover:text-[#E76F51] transition-colors after:content-[''] after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-[#E76F51] after:scale-0 after:transition-transform">
            Reserve Table
          </a>
          @if (auth.isLoggedIn()) {
            <a routerLink="/dashboard" routerLinkActive="text-[#E76F51] font-bold after:scale-100"
              class="relative px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-[#E76F51] dark:hover:text-[#E76F51] transition-colors after:content-[''] after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-[#E76F51] after:scale-0 after:transition-transform">
              Dashboard
            </a>
            <a routerLink="/orders" routerLinkActive="text-[#E76F51] font-bold after:scale-100"
              class="relative px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-[#E76F51] dark:hover:text-[#E76F51] transition-colors after:content-[''] after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-[#E76F51] after:scale-0 after:transition-transform">
              My Orders
            </a>
          }
          @if (auth.isAdmin()) {
            <a routerLink="/admin" routerLinkActive="bg-[#264653] text-white"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider bg-[#264653]/10 text-[#264653] dark:bg-white/10 dark:text-emerald-300 hover:bg-[#264653] hover:text-white transition-all">
              <mat-icon class="text-sm">admin_panel_settings</mat-icon>
              Admin Portal
            </a>
          }
        </nav>

        <!-- Search Bar (Desktop) -->
        <div class="relative hidden md:block max-w-xs w-full">
          <div class="relative flex items-center">
            <mat-icon class="absolute left-3 text-slate-400 text-lg pointer-events-none">search</mat-icon>
            <input 
              type="text" 
              placeholder="Search dishes, drinks..."
              [value]="globalSearchText()"
              (input)="onSearchInput($event)"
              (focus)="showSearchResults.set(true)"
              class="w-full pl-9 pr-4 py-2 bg-slate-100/80 dark:bg-slate-800/80 border border-transparent dark:border-slate-700 rounded-full text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E76F51]/50 focus:bg-white dark:focus:bg-slate-900 transition-all"
            />
            @if (globalSearchText()) {
              <button 
                type="button" 
                (click)="clearSearch()" 
                class="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer">
                <mat-icon class="text-sm">close</mat-icon>
              </button>
            }
          </div>

          <!-- Quick Search Dropdown -->
          @if (showSearchResults() && searchResults().length > 0) {
            <div class="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50 p-2 max-h-80 overflow-y-auto">
              <div class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 py-1.5">
                Dishes Matching "{{ globalSearchText() }}"
              </div>
              @for (food of searchResults(); track food.id) {
                <div 
                  (click)="goToFood(food)" 
                  class="flex items-center gap-3 p-2 hover:bg-orange-50 dark:hover:bg-slate-700/50 rounded-xl cursor-pointer transition-colors">
                  <img [src]="food.image" [alt]="food.name" referrerpolicy="no-referrer" class="w-10 h-10 rounded-lg object-cover" />
                  <div class="flex-1 min-w-0">
                    <p class="text-xs font-bold text-slate-800 dark:text-white truncate">{{ food.name }}</p>
                    <p class="text-[11px] text-slate-500 dark:text-slate-400">{{ food.category }} · \${{ food.price.toFixed(2) }}</p>
                  </div>
                  <mat-icon class="text-slate-300 text-sm">arrow_forward</mat-icon>
                </div>
              }
            </div>
          }
        </div>

        <!-- Action Buttons & Profile -->
        <div class="flex items-center gap-2 sm:gap-3">
          
          <!-- Theme Switcher -->
          <button 
            type="button"
            (click)="theme.toggle()"
            title="Toggle Light/Dark Theme"
            class="w-10 h-10 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
            @if (theme.currentTheme() === 'light') {
              <mat-icon class="text-amber-500">dark_mode</mat-icon>
            } @else {
              <mat-icon class="text-amber-400">light_mode</mat-icon>
            }
          </button>

          <!-- Cart Drawer Button -->
          <a 
            routerLink="/cart"
            class="relative w-10 h-10 rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-800 transition-colors">
            <mat-icon>shopping_bag</mat-icon>
            @if (orderData.cartCount() > 0) {
              <span class="absolute -top-1 -right-1 bg-[#E76F51] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                {{ orderData.cartCount() }}
              </span>
            }
          </a>

          <!-- Quick Role Switcher (Admin / Customer) -->
          <button 
            type="button"
            (click)="toggleDemoRole()"
            title="Switch Demo Role between Admin and Customer"
            class="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-orange-200 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
            <mat-icon class="text-xs text-[#2A9D8F]">swap_horiz</mat-icon>
            <span>Role: <strong class="text-[#E76F51]">{{ auth.isAdmin() ? 'Admin' : 'Customer' }}</strong></span>
          </button>

          <!-- User Menu / Login -->
          @if (auth.isLoggedIn()) {
            <div class="relative">
              <button 
                type="button"
                (click)="toggleUserDropdown()"
                class="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-[#E76F51]/30 transition-all cursor-pointer">
                <img 
                  [src]="auth.userAvatar()" 
                  [alt]="auth.userName()" 
                  referrerpolicy="no-referrer"
                  class="w-9 h-9 rounded-full object-cover border-2 border-[#E76F51]"
                />
              </button>

              <!-- User Dropdown Menu -->
              @if (isUserDropdownOpen()) {
                <div class="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 py-2 z-50">
                  <div class="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                    <p class="text-xs font-bold text-slate-800 dark:text-white truncate">{{ auth.userName() }}</p>
                    <p class="text-[11px] text-slate-500 dark:text-slate-400 truncate">{{ auth.currentUser()?.email }}</p>
                    <span class="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-orange-100 dark:bg-orange-950 text-[#E76F51]">
                      {{ auth.currentUser()?.role | uppercase }}
                    </span>
                  </div>

                  <a routerLink="/dashboard" (click)="closeUserDropdown()" class="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-700/50">
                    <mat-icon class="text-base text-slate-400">dashboard</mat-icon>
                    Dashboard
                  </a>
                  <a routerLink="/profile" (click)="closeUserDropdown()" class="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-700/50">
                    <mat-icon class="text-base text-slate-400">person</mat-icon>
                    My Profile
                  </a>
                  <a routerLink="/bookings" (click)="closeUserDropdown()" class="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-700/50">
                    <mat-icon class="text-base text-slate-400">event_seat</mat-icon>
                    My Reservations
                  </a>
                  <a routerLink="/orders" (click)="closeUserDropdown()" class="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-700/50">
                    <mat-icon class="text-base text-slate-400">receipt_long</mat-icon>
                    Order History
                  </a>

                  @if (auth.isAdmin()) {
                    <div class="border-t border-slate-100 dark:border-slate-700 my-1"></div>
                    <a routerLink="/admin" (click)="closeUserDropdown()" class="flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#2A9D8F] font-semibold hover:bg-emerald-50 dark:hover:bg-slate-700/50">
                      <mat-icon class="text-base">admin_panel_settings</mat-icon>
                      Admin Dashboard
                    </a>
                  }

                  <div class="border-t border-slate-100 dark:border-slate-700 my-1"></div>
                  <button 
                    type="button" 
                    (click)="logout()" 
                    class="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer">
                    <mat-icon class="text-base">logout</mat-icon>
                    Sign Out
                  </button>
                </div>
              }
            </div>
          } @else {
            <a 
              routerLink="/login" 
              class="px-4 py-2 rounded-xl bg-[#E76F51] hover:bg-[#D9593B] text-white text-xs font-semibold shadow-md shadow-[#E76F51]/20 transition-all flex items-center gap-1.5 cursor-pointer">
              <mat-icon class="text-sm">login</mat-icon>
              <span>Sign In</span>
            </a>
          }

          <!-- Mobile Hamburger -->
          <button 
            type="button"
            (click)="isMobileMenuOpen.set(!isMobileMenuOpen())"
            class="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            aria-label="Toggle navigation">
            <mat-icon>{{ isMobileMenuOpen() ? 'close' : 'menu' }}</mat-icon>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation Drawer -->
      @if (isMobileMenuOpen()) {
        <div class="lg:hidden bg-white dark:bg-[#131f24] border-b border-orange-100 dark:border-slate-800 px-4 pt-3 pb-6 space-y-2">
          <div class="relative mb-3">
            <mat-icon class="absolute left-3 top-2.5 text-slate-400 text-lg">search</mat-icon>
            <input 
              type="text" 
              placeholder="Search dishes..."
              [value]="globalSearchText()"
              (input)="onSearchInput($event)"
              class="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
            />
          </div>

          <a routerLink="/" (click)="closeMobileMenu()" class="block px-3 py-2 rounded-lg text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-800">Home</a>
          <a routerLink="/menu" (click)="closeMobileMenu()" class="block px-3 py-2 rounded-lg text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-800">Menu</a>
          <a routerLink="/book-table" (click)="closeMobileMenu()" class="block px-3 py-2 rounded-lg text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-800">Reserve Table</a>
          
          @if (auth.isLoggedIn()) {
            <a routerLink="/dashboard" (click)="closeMobileMenu()" class="block px-3 py-2 rounded-lg text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-800">Dashboard</a>
            <a routerLink="/orders" (click)="closeMobileMenu()" class="block px-3 py-2 rounded-lg text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-800">My Orders</a>
            <a routerLink="/bookings" (click)="closeMobileMenu()" class="block px-3 py-2 rounded-lg text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-800">My Bookings</a>
            <a routerLink="/profile" (click)="closeMobileMenu()" class="block px-3 py-2 rounded-lg text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-800">Profile</a>
          }

          @if (auth.isAdmin()) {
            <a routerLink="/admin" (click)="closeMobileMenu()" class="block px-3 py-2 rounded-lg text-sm font-bold text-[#2A9D8F] bg-emerald-50 dark:bg-slate-800">
              Admin Portal
            </a>
          }

          <div class="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <button 
              type="button" 
              (click)="toggleDemoRole()" 
              class="text-xs text-[#E76F51] font-semibold py-1">
              Switch to {{ auth.isAdmin() ? 'Customer' : 'Admin' }} Demo
            </button>
            @if (auth.isLoggedIn()) {
              <button 
                type="button" 
                (click)="logout()" 
                class="text-xs text-rose-500 font-semibold py-1">
                Sign Out
              </button>
            }
          </div>
        </div>
      }
    </header>
  `
})
export class NavbarComponent {
  auth = inject(Auth);
  orderData = inject(OrderData);
  foodData = inject(FoodData);
  theme = inject(Theme);
  private router = inject(Router);

  isUserDropdownOpen = signal<boolean>(false);
  isMobileMenuOpen = signal<boolean>(false);
  globalSearchText = signal<string>('');
  showSearchResults = signal<boolean>(false);
  searchResults = signal<Food[]>([]);

  onSearchInput(event: Event): void {
    const text = (event.target as HTMLInputElement).value;
    this.globalSearchText.set(text);
    if (!text.trim()) {
      this.searchResults.set([]);
      this.showSearchResults.set(false);
      return;
    }

    const matches = this.foodData.foods()
      .filter(f => f.name.toLowerCase().includes(text.toLowerCase()) || f.category.toLowerCase().includes(text.toLowerCase()))
      .slice(0, 5);
    this.searchResults.set(matches);
    this.showSearchResults.set(true);
  }

  clearSearch(): void {
    this.globalSearchText.set('');
    this.searchResults.set([]);
    this.showSearchResults.set(false);
  }

  goToFood(food: Food): void {
    this.clearSearch();
    this.router.navigate(['/menu'], { queryParams: { search: food.name } });
  }

  toggleUserDropdown(): void {
    this.isUserDropdownOpen.update(v => !v);
  }

  closeUserDropdown(): void {
    this.isUserDropdownOpen.set(false);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  toggleDemoRole(): void {
    if (this.auth.isAdmin()) {
      this.auth.demoLogin('customer');
    } else {
      this.auth.demoLogin('admin');
    }
    this.closeUserDropdown();
  }

  logout(): void {
    this.closeUserDropdown();
    this.closeMobileMenu();
    this.auth.logout();
  }
}
