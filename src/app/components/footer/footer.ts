import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Toast } from '../../services/toast';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-footer',
  imports: [RouterLink, MatIconModule],
  template: `
    <footer class="bg-[#264653] text-white pt-16 pb-12 border-t border-[#2A9D8F]/20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          <!-- Column 1: Brand -->
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#E76F51] to-[#F4A261] flex items-center justify-center text-white shadow-md">
                <mat-icon class="text-xl">restaurant</mat-icon>
              </div>
              <div>
                <h3 class="font-serif text-2xl font-bold tracking-tight">SAVORIA</h3>
                <p class="text-[10px] text-[#F4A261] uppercase tracking-widest font-semibold">Fine Dining & Bistro</p>
              </div>
            </div>
            <p class="text-xs text-slate-300 leading-relaxed">
              Curating unforgettable culinary moments with organic Mediterranean ingredients, aged cuts, hand-rolled pasta, and world-class hospitality.
            </p>
            <div class="flex items-center gap-3 pt-2">
              <a href="#" class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#E76F51] transition-colors">
                <i class="bi bi-instagram text-sm"></i>
              </a>
              <a href="#" class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#E76F51] transition-colors">
                <i class="bi bi-facebook text-sm"></i>
              </a>
              <a href="#" class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#E76F51] transition-colors">
                <i class="bi bi-twitter-x text-sm"></i>
              </a>
              <a href="#" class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#E76F51] transition-colors">
                <i class="bi bi-tripadvisor text-sm"></i>
              </a>
            </div>
          </div>

          <!-- Column 2: Hours & Reservations -->
          <div class="space-y-3">
            <h4 class="text-sm font-bold uppercase tracking-wider text-[#F4A261]">Service Hours</h4>
            <div class="space-y-2 text-xs text-slate-300">
              <div class="flex justify-between border-b border-white/10 pb-1.5">
                <span>Monday – Thursday</span>
                <span class="font-semibold text-white">11:30 AM – 10:30 PM</span>
              </div>
              <div class="flex justify-between border-b border-white/10 pb-1.5">
                <span>Friday & Saturday</span>
                <span class="font-semibold text-white">11:30 AM – 11:30 PM</span>
              </div>
              <div class="flex justify-between border-b border-white/10 pb-1.5">
                <span>Sunday Brunch</span>
                <span class="font-semibold text-white">10:00 AM – 10:00 PM</span>
              </div>
            </div>
            <div class="pt-2">
              <a routerLink="/book-table" class="inline-flex items-center gap-1.5 text-xs font-semibold text-[#E76F51] hover:text-[#F4A261] transition-colors">
                <span>Book Table Online</span>
                <mat-icon class="text-xs">arrow_forward</mat-icon>
              </a>
            </div>
          </div>

          <!-- Column 3: Quick Links -->
          <div class="space-y-3">
            <h4 class="text-sm font-bold uppercase tracking-wider text-[#F4A261]">Explore Savoria</h4>
            <ul class="space-y-2 text-xs text-slate-300">
              <li><a routerLink="/menu" class="hover:text-white transition-colors">A La Carte Menu</a></li>
              <li><a routerLink="/book-table" class="hover:text-white transition-colors">Table Floor Plan & Booking</a></li>
              <li><a routerLink="/dashboard" class="hover:text-white transition-colors">Customer Dashboard</a></li>
              <li><a routerLink="/orders" class="hover:text-white transition-colors">Order Tracking</a></li>
              <li><a routerLink="/login" class="hover:text-white transition-colors">Sign In / Demo Login</a></li>
              <li><a routerLink="/admin" class="hover:text-white transition-colors text-emerald-400 font-semibold">Admin Management Portal</a></li>
            </ul>
          </div>

          <!-- Column 4: Newsletter & Location -->
          <div class="space-y-3">
            <h4 class="text-sm font-bold uppercase tracking-wider text-[#F4A261]">Join the Tasting Club</h4>
            <p class="text-xs text-slate-300">
              Subscribe for secret seasonal tasting menus and private sommelier invitations.
            </p>
            <form (submit)="onSubscribe($event)" class="space-y-2">
              <div class="relative">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  [value]="newsletterEmail()"
                  (input)="newsletterEmail.set($any($event.target).value)"
                  class="w-full px-3 py-2 bg-white/10 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E76F51]"
                  required
                />
              </div>
              <button 
                type="submit" 
                class="w-full py-2 bg-[#E76F51] hover:bg-[#D9593B] text-white text-xs font-semibold rounded-xl shadow-md transition-all cursor-pointer">
                Subscribe
              </button>
            </form>
          </div>

        </div>

        <div class="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 Savoria Grand Ristorante. All rights reserved.</p>
          <div class="flex items-center gap-6">
            <span>Michelin Guide Selected 2025</span>
            <span>·</span>
            <span>Wine Spectator Best Award</span>
            <span>·</span>
            <span>Gourmet Excellence</span>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  private toast = inject(Toast);
  newsletterEmail = signal<string>('');

  onSubscribe(event: Event): void {
    event.preventDefault();
    if (!this.newsletterEmail().trim()) return;
    this.toast.success('Thank you for joining Savoria Tasting Club! Check your inbox for a special welcome coupon.', 'Welcome');
    this.newsletterEmail.set('');
  }
}
