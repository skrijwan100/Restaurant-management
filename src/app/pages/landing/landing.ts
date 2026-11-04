import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FoodData } from '../../services/food';
import { FoodCardComponent } from '../../components/food-card/food-card';
import { Toast } from '../../services/toast';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-landing',
  imports: [RouterLink, MatIconModule, FoodCardComponent],
  template: `
    <div class="space-y-20 pb-20 overflow-hidden">
      
      <!-- HERO SECTION -->
      <section class="relative min-h-[85vh] flex items-center justify-center bg-gradient-to-b from-orange-50/80 via-white to-white dark:from-[#131f24] dark:via-[#16252c] dark:to-[#131f24] pt-8 pb-16 px-4 sm:px-6 lg:px-8">
        <!-- Subtle Background Glows -->
        <div class="absolute top-10 left-1/4 w-96 h-96 bg-[#E76F51]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute bottom-10 right-1/4 w-96 h-96 bg-[#2A9D8F]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          <!-- Hero Text -->
          <div class="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800 text-xs font-bold text-[#E76F51]">
              <mat-icon class="text-sm">hotel_class</mat-icon>
              <span>Voted Best Fine Dining Restaurant & Lounge 2025</span>
            </div>

            <h1 class="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#264653] dark:text-white leading-[1.15]">
              Where Culinary Art Meets <span class="text-[#E76F51] underline decoration-[#F4A261]/60 underline-offset-8">Passion</span>
            </h1>

            <p class="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Immerse yourself in authentic Mediterranean gastronomy, wood-fired artisan recipes, hand-rolled pastas, and an exquisite wine cellar curated by award-winning sommeliers.
            </p>

            <!-- CTA Buttons -->
            <div class="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <a 
                routerLink="/book-table" 
                class="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#E76F51] to-[#F4A261] hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-[#E76F51]/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer">
                <mat-icon>event_seat</mat-icon>
                <span>Book a Table Now</span>
              </a>

              <a 
                routerLink="/menu" 
                class="px-8 py-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#E76F51] text-slate-800 dark:text-white font-bold text-sm shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer">
                <mat-icon class="text-[#2A9D8F]">restaurant_menu</mat-icon>
                <span>Explore Full Menu</span>
              </a>
            </div>

            <!-- Trust Badge Strip -->
            <div class="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200 dark:border-white/10 max-w-lg mx-auto lg:mx-0">
              <div>
                <span class="block font-serif text-2xl font-bold text-[#264653] dark:text-white">4.9 ★</span>
                <span class="text-xs text-slate-500">12,000+ Reviews</span>
              </div>
              <div>
                <span class="block font-serif text-2xl font-bold text-[#264653] dark:text-white">15+</span>
                <span class="text-xs text-slate-500">Master Chefs</span>
              </div>
              <div>
                <span class="block font-serif text-2xl font-bold text-[#264653] dark:text-white">100%</span>
                <span class="text-xs text-slate-500">Organic Fresh</span>
              </div>
            </div>

          </div>

          <!-- Hero Visual Gallery Cards -->
          <div class="lg:col-span-5 relative">
            <div class="relative mx-auto max-w-md lg:max-w-none">
              
              <!-- Main Feature Food Card -->
              <div class="rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 relative z-20 group">
                <img 
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80" 
                  alt="Slow Braised Prime Short Rib" 
                  referrerpolicy="no-referrer"
                  class="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                  <span class="text-xs uppercase font-bold text-[#F4A261] tracking-wider mb-1">Chef Signature</span>
                  <h3 class="font-serif text-xl font-bold">Slow-Braised Prime Short Rib</h3>
                  <div class="flex items-center justify-between mt-2">
                    <span class="text-lg font-extrabold text-[#E76F51]">\${{ (34.00).toFixed(2) }}</span>
                    <a routerLink="/menu" class="text-xs font-semibold bg-white/20 hover:bg-white/30 backdrop-blur-md px-3 py-1.5 rounded-full">
                      Order Today
                    </a>
                  </div>
                </div>
              </div>

              <!-- Floating Floating Badge 1 -->
              <div class="absolute -bottom-6 -left-6 z-30 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 flex items-center gap-3 animate-bounce duration-1000">
                <div class="w-10 h-10 rounded-xl bg-emerald-100 text-[#2A9D8F] flex items-center justify-center">
                  <mat-icon>verified</mat-icon>
                </div>
                <div>
                  <p class="text-xs font-bold text-slate-800 dark:text-white">Live Table Seating</p>
                  <p class="text-[11px] text-emerald-600 font-semibold">15 Tables Available</p>
                </div>
              </div>

              <!-- Floating Floating Badge 2 -->
              <div class="absolute -top-6 -right-6 z-30 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-orange-100 text-[#E76F51] flex items-center justify-center">
                  <mat-icon>local_fire_department</mat-icon>
                </div>
                <div>
                  <p class="text-xs font-bold text-slate-800 dark:text-white">20% Off Code</p>
                  <p class="text-[11px] text-[#E76F51] font-mono font-bold">WELCOME20</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      <!-- TODAY'S EXCLUSIVE OFFERS -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span class="text-xs font-bold uppercase tracking-widest text-[#E76F51]">Limited Dining Promotions</span>
          <h2 class="font-serif text-3xl font-bold text-[#264653] dark:text-white">Today's Special Offers</h2>
          <p class="text-xs text-slate-500">Apply these verified promo coupons during online checkout for immediate savings.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div class="p-6 rounded-3xl bg-gradient-to-br from-[#E76F51] to-[#F4A261] text-white shadow-lg relative overflow-hidden flex flex-col justify-between">
            <div class="space-y-2">
              <span class="text-xs font-bold bg-white/20 px-2.5 py-1 rounded-full uppercase tracking-wider">New Guest Welcome</span>
              <h3 class="font-serif text-2xl font-bold">20% OFF</h3>
              <p class="text-xs text-orange-50 leading-relaxed">Applicable across our complete a la carte dinner and lunch menu. Minimum $25 order.</p>
            </div>
            <div class="pt-6 flex items-center justify-between border-t border-white/20 mt-4">
              <div>
                <span class="text-[10px] uppercase tracking-wider text-orange-100 block">Coupon Code</span>
                <span class="font-mono text-sm font-bold tracking-widest bg-white/25 px-2.5 py-1 rounded-lg">WELCOME20</span>
              </div>
              <button 
                type="button" 
                (click)="copyCode('WELCOME20')" 
                class="px-3 py-1.5 rounded-xl bg-white text-[#E76F51] text-xs font-bold shadow-md hover:bg-orange-50 cursor-pointer">
                Copy Code
              </button>
            </div>
          </div>

          <div class="p-6 rounded-3xl bg-gradient-to-br from-[#264653] to-[#2A9D8F] text-white shadow-lg relative overflow-hidden flex flex-col justify-between">
            <div class="space-y-2">
              <span class="text-xs font-bold bg-white/20 px-2.5 py-1 rounded-full uppercase tracking-wider">Family Banquet</span>
              <h3 class="font-serif text-2xl font-bold">$10 FLAT OFF</h3>
              <p class="text-xs text-teal-100 leading-relaxed">Save $10 on orders above $40 for weekend group orders and wine tastings.</p>
            </div>
            <div class="pt-6 flex items-center justify-between border-t border-white/20 mt-4">
              <div>
                <span class="text-[10px] uppercase tracking-wider text-teal-100 block">Coupon Code</span>
                <span class="font-mono text-sm font-bold tracking-widest bg-white/25 px-2.5 py-1 rounded-lg">FEAST10</span>
              </div>
              <button 
                type="button" 
                (click)="copyCode('FEAST10')" 
                class="px-3 py-1.5 rounded-xl bg-white text-[#264653] text-xs font-bold shadow-md hover:bg-teal-50 cursor-pointer">
                Copy Code
              </button>
            </div>
          </div>

          <div class="p-6 rounded-3xl bg-gradient-to-br from-[#F4A261] to-[#E76F51] text-white shadow-lg relative overflow-hidden flex flex-col justify-between">
            <div class="space-y-2">
              <span class="text-xs font-bold bg-white/20 px-2.5 py-1 rounded-full uppercase tracking-wider">Chef Appetizer</span>
              <h3 class="font-serif text-2xl font-bold">$5 OFF APPETIZERS</h3>
              <p class="text-xs text-orange-50 leading-relaxed">Complimentary artisanal discount on burrata, arancini, and fritti starters.</p>
            </div>
            <div class="pt-6 flex items-center justify-between border-t border-white/20 mt-4">
              <div>
                <span class="text-[10px] uppercase tracking-wider text-orange-100 block">Coupon Code</span>
                <span class="font-mono text-sm font-bold tracking-widest bg-white/25 px-2.5 py-1 rounded-lg">FREECHEF</span>
              </div>
              <button 
                type="button" 
                (click)="copyCode('FREECHEF')" 
                class="px-3 py-1.5 rounded-xl bg-white text-[#E76F51] text-xs font-bold shadow-md hover:bg-orange-50 cursor-pointer">
                Copy Code
              </button>
            </div>
          </div>

        </div>
      </section>

      <!-- POPULAR DISHES -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <span class="text-xs font-bold uppercase tracking-widest text-[#E76F51]">Guest Favorites</span>
            <h2 class="font-serif text-3xl font-bold text-[#264653] dark:text-white">Most Loved Dishes</h2>
          </div>
          <a routerLink="/menu" class="text-xs font-bold text-[#E76F51] hover:text-[#D9593B] flex items-center gap-1 group">
            <span>View All 40+ Creations</span>
            <mat-icon class="text-sm group-hover:translate-x-1 transition-transform">arrow_forward</mat-icon>
          </a>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          @for (food of foodData.popularFoods(); track food.id) {
            <app-food-card [food]="food"></app-food-card>
          }
        </div>
      </section>

      <!-- MASTER CHEF SECTION -->
      <section class="bg-orange-50/50 dark:bg-[#16252c] py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div class="lg:col-span-6 grid grid-cols-2 gap-4">
              <img 
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&auto=format&fit=crop&q=80" 
                alt="Executive Chef Marcus Vance" 
                referrerpolicy="no-referrer"
                class="w-full h-72 rounded-3xl object-cover shadow-lg"
              />
              <img 
                src="https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=600&auto=format&fit=crop&q=80" 
                alt="Chef Preparing Fresh Pasta" 
                referrerpolicy="no-referrer"
                class="w-full h-72 rounded-3xl object-cover shadow-lg translate-y-6"
              />
            </div>

            <div class="lg:col-span-6 space-y-6">
              <span class="text-xs font-bold uppercase tracking-widest text-[#E76F51]">Master Culinary Artists</span>
              <h2 class="font-serif text-3xl sm:text-4xl font-bold text-[#264653] dark:text-white leading-tight">
                Crafted with Uncompromising Mastery & Heritage
              </h2>
              <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Led by Executive Chef Marcus Vance, our culinary team brings over two decades of fine dining experience across Florence, Naples, and the Basque coast. Every plate is an edible tribute to timeless traditions, modern technique, and sustainably sourced ingredients.
              </p>

              <div class="space-y-3">
                <div class="flex items-center gap-3 text-sm font-semibold text-slate-800 dark:text-white">
                  <mat-icon class="text-[#2A9D8F]">check_circle</mat-icon>
                  <span>100% Organic Flours imported directly from Molino Pasini, Italy</span>
                </div>
                <div class="flex items-center gap-3 text-sm font-semibold text-slate-800 dark:text-white">
                  <mat-icon class="text-[#2A9D8F]">check_circle</mat-icon>
                  <span>Charcoal hearth fired with seasoned white oak logs</span>
                </div>
                <div class="flex items-center gap-3 text-sm font-semibold text-slate-800 dark:text-white">
                  <mat-icon class="text-[#2A9D8F]">check_circle</mat-icon>
                  <span>Wine pairings by certified Master Sommelier</span>
                </div>
              </div>

              <div class="pt-2">
                <a routerLink="/book-table" class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#264653] hover:bg-[#1A303A] text-white text-xs font-bold shadow-md transition-all">
                  <span>Reserve a Table Near the Open Hearth</span>
                  <mat-icon class="text-sm">arrow_forward</mat-icon>
                </a>
              </div>

            </div>

          </div>
        </div>
      </section>

      <!-- RESTAURANT AMBIANCE GALLERY -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span class="text-xs font-bold uppercase tracking-widest text-[#E76F51]">Atmosphere & Space</span>
          <h2 class="font-serif text-3xl font-bold text-[#264653] dark:text-white">The Savoria Experience</h2>
          <p class="text-xs text-slate-500">From romantic candlelit corners to our panoramic rooftop terrace overlooking the bay.</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="group relative rounded-2xl overflow-hidden h-64 shadow-md">
            <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80" alt="Main Dining Hall" referrerpolicy="no-referrer" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4 text-white">
              <div>
                <p class="text-xs font-bold">Main Dining Hall</p>
                <p class="text-[10px] text-slate-300">Acoustic live jazz & velvet booths</p>
              </div>
            </div>
          </div>

          <div class="group relative rounded-2xl overflow-hidden h-64 shadow-md">
            <img src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=600&auto=format&fit=crop&q=80" alt="Garden Patio" referrerpolicy="no-referrer" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4 text-white">
              <div>
                <p class="text-xs font-bold">Garden Patio Pergola</p>
                <p class="text-[10px] text-slate-300">Under fairy-lit olive trees</p>
              </div>
            </div>
          </div>

          <div class="group relative rounded-2xl overflow-hidden h-64 shadow-md">
            <img src="https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&auto=format&fit=crop&q=80" alt="Private Wine Cellar" referrerpolicy="no-referrer" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4 text-white">
              <div>
                <p class="text-xs font-bold">VIP Cellar Lounge</p>
                <p class="text-[10px] text-slate-300">Sommelier dedicated private room</p>
              </div>
            </div>
          </div>

          <div class="group relative rounded-2xl overflow-hidden h-64 shadow-md">
            <img src="https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=600&auto=format&fit=crop&q=80" alt="Rooftop Terrace" referrerpolicy="no-referrer" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4 text-white">
              <div>
                <p class="text-xs font-bold">Rooftop Skyline Bar</p>
                <p class="text-[10px] text-slate-300">Sunset cocktails & harbor breezes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CUSTOMER REVIEWS -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span class="text-xs font-bold uppercase tracking-widest text-[#E76F51]">Testimonials</span>
          <h2 class="font-serif text-3xl font-bold text-[#264653] dark:text-white">Echoes of Delight</h2>
          <p class="text-xs text-slate-500">Read what food critics and loyal diners say about their evenings at Savoria.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div class="bg-white dark:bg-[#1b2a32] p-6 rounded-3xl border border-orange-100 dark:border-white/10 shadow-sm space-y-4">
            <div class="flex items-center gap-1 text-amber-500 text-sm">
              <mat-icon>star</mat-icon><mat-icon>star</mat-icon><mat-icon>star</mat-icon><mat-icon>star</mat-icon><mat-icon>star</mat-icon>
            </div>
            <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
              "The Truffle Burrata and Slow-Braised Short Rib were nothing short of transcendental. We celebrated our 10th anniversary on Table 1 overlooking the gardens and it was pure perfection."
            </p>
            <div class="flex items-center gap-3 pt-2 border-t border-slate-100 dark:border-white/5">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Elena" referrerpolicy="no-referrer" class="w-10 h-10 rounded-full object-cover" />
              <div>
                <h4 class="text-xs font-bold text-slate-800 dark:text-white">Elena Rostova</h4>
                <p class="text-[10px] text-slate-400">Verified Diner · 14 Visits</p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-[#1b2a32] p-6 rounded-3xl border border-orange-100 dark:border-white/10 shadow-sm space-y-4">
            <div class="flex items-center gap-1 text-amber-500 text-sm">
              <mat-icon>star</mat-icon><mat-icon>star</mat-icon><mat-icon>star</mat-icon><mat-icon>star</mat-icon><mat-icon>star</mat-icon>
            </div>
            <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
              "The online table booking system and live status tracking is the smoothest I have ever encountered in a restaurant app. And the lobster fettuccine is worthy of a Michelin star."
            </p>
            <div class="flex items-center gap-3 pt-2 border-t border-slate-100 dark:border-white/5">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Julian" referrerpolicy="no-referrer" class="w-10 h-10 rounded-full object-cover" />
              <div>
                <h4 class="text-xs font-bold text-slate-800 dark:text-white">Julian Sterling</h4>
                <p class="text-[10px] text-slate-400">Culinary Journalist</p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-[#1b2a32] p-6 rounded-3xl border border-orange-100 dark:border-white/10 shadow-sm space-y-4">
            <div class="flex items-center gap-1 text-amber-500 text-sm">
              <mat-icon>star</mat-icon><mat-icon>star</mat-icon><mat-icon>star</mat-icon><mat-icon>star</mat-icon><mat-icon>star</mat-icon>
            </div>
            <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
              "The Wood-Fired Margherita D.O.P. crust has the most authentic blistered char and chew. Plus, the smoked blood orange cocktail is a masterclass in craft mixology."
            </p>
            <div class="flex items-center gap-3 pt-2 border-t border-slate-100 dark:border-white/5">
              <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80" alt="Aria" referrerpolicy="no-referrer" class="w-10 h-10 rounded-full object-cover" />
              <div>
                <h4 class="text-xs font-bold text-slate-800 dark:text-white">Aria Chen</h4>
                <p class="text-[10px] text-slate-400">Design Director & Epicurean</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      <!-- RESERVATION BANNER -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="rounded-3xl bg-gradient-to-r from-[#264653] to-[#2A9D8F] p-8 sm:p-12 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div class="space-y-3 max-w-xl text-center md:text-left">
            <span class="text-xs uppercase font-bold text-[#F4A261] tracking-wider">Book Ahead for the Weekend</span>
            <h2 class="font-serif text-3xl font-bold">Reserve Your Table in Seconds</h2>
            <p class="text-xs text-teal-100 leading-relaxed">
              Explore our live interactive restaurant floor layout. Pick your preferred view, table capacity, and receive immediate reservation confirmation.
            </p>
          </div>
          <a 
            routerLink="/book-table" 
            class="px-8 py-4 rounded-2xl bg-[#E76F51] hover:bg-[#D9593B] text-white font-bold text-sm shadow-xl transition-all hover:scale-105 active:scale-95 shrink-0 cursor-pointer">
            Explore Seating Layout
          </a>
        </div>
      </section>

    </div>
  `
})
export class LandingPage {
  foodData = inject(FoodData);
  private toast = inject(Toast);

  copyCode(code: string): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      this.toast.success(`Coupon code ${code} copied to clipboard!`, 'Coupon Copied');
    } else {
      this.toast.info(`Coupon: ${code}`);
    }
  }
}
