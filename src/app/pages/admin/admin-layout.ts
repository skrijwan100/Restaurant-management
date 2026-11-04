import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Auth } from '../../services/auth';
import { AdminData } from '../../services/admin';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule],
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-[#131f24] flex flex-col md:flex-row">
      
      <!-- Mobile Top Bar for Admin -->
      <div class="md:hidden bg-[#1e2f38] text-white p-4 flex items-center justify-between border-b border-white/10">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-[#E76F51] flex items-center justify-center text-white">
            <mat-icon class="text-sm">admin_panel_settings</mat-icon>
          </div>
          <span class="font-bold text-sm">SAVORIA ADMIN</span>
        </div>
        <button 
          type="button" 
          (click)="isMobileNavOpen.set(!isMobileNavOpen())"
          class="p-1 rounded-lg text-slate-300 hover:text-white cursor-pointer">
          <mat-icon>{{ isMobileNavOpen() ? 'close' : 'menu' }}</mat-icon>
        </button>
      </div>

      <!-- Dark Sidebar (Desktop & Mobile Drawer) -->
      <aside 
        class="w-full md:w-64 bg-[#1e2f38] text-slate-200 flex flex-col justify-between shrink-0 border-r border-white/10 transition-all z-30"
        [class.hidden]="!isMobileNavOpen()"
        [class.block]="isMobileNavOpen()"
        [class.md:block]="true">
        
        <div class="p-6 space-y-6">
          <!-- Logo & Brand Header -->
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#E76F51] to-[#F4A261] flex items-center justify-center text-white shadow-md">
              <mat-icon class="text-xl">restaurant</mat-icon>
            </div>
            <div>
              <h2 class="font-serif text-lg font-bold text-white tracking-wide">SAVORIA</h2>
              <span class="text-[10px] text-[#2A9D8F] font-bold uppercase tracking-widest block">Executive Management</span>
            </div>
          </div>

          <!-- Quick Return to Diner View -->
          <a routerLink="/" class="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all">
            <mat-icon class="text-sm text-[#E76F51]">arrow_back</mat-icon>
            <span>Exit to Customer Site</span>
          </a>

          <!-- Navigation Links -->
          <nav class="space-y-1.5 pt-2">
            
            <a 
              routerLink="/admin" 
              [routerLinkActiveOptions]="{exact: true}"
              routerLinkActive="bg-[#E76F51] text-white shadow-md shadow-[#E76F51]/20"
              class="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold hover:bg-white/5 transition-all text-slate-300 hover:text-white">
              <div class="flex items-center gap-3">
                <mat-icon class="text-lg">dashboard</mat-icon>
                <span>Dashboard</span>
              </div>
            </a>

            <a 
              routerLink="/admin/orders" 
              routerLinkActive="bg-[#E76F51] text-white shadow-md shadow-[#E76F51]/20"
              class="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold hover:bg-white/5 transition-all text-slate-300 hover:text-white">
              <div class="flex items-center gap-3">
                <mat-icon class="text-lg">receipt_long</mat-icon>
                <span>Manage Orders</span>
              </div>
              @if (adminData.activeOrdersCount() > 0) {
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#2A9D8F] text-white">
                  {{ adminData.activeOrdersCount() }}
                </span>
              }
            </a>

            <a 
              routerLink="/admin/bookings" 
              routerLinkActive="bg-[#E76F51] text-white shadow-md shadow-[#E76F51]/20"
              class="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold hover:bg-white/5 transition-all text-slate-300 hover:text-white">
              <div class="flex items-center gap-3">
                <mat-icon class="text-lg">event_seat</mat-icon>
                <span>Manage Bookings</span>
              </div>
              @if (adminData.pendingBookingsCount() > 0) {
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                  {{ adminData.pendingBookingsCount() }}
                </span>
              }
            </a>

            <a 
              routerLink="/admin/foods" 
              routerLinkActive="bg-[#E76F51] text-white shadow-md shadow-[#E76F51]/20"
              class="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold hover:bg-white/5 transition-all text-slate-300 hover:text-white">
              <div class="flex items-center gap-3">
                <mat-icon class="text-lg">restaurant_menu</mat-icon>
                <span>Manage Foods</span>
              </div>
            </a>

            <a 
              routerLink="/admin/tables" 
              routerLinkActive="bg-[#E76F51] text-white shadow-md shadow-[#E76F51]/20"
              class="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold hover:bg-white/5 transition-all text-slate-300 hover:text-white">
              <div class="flex items-center gap-3">
                <mat-icon class="text-lg">table_restaurant</mat-icon>
                <span>Manage Tables</span>
              </div>
            </a>

            <a 
              routerLink="/admin/customers" 
              routerLinkActive="bg-[#E76F51] text-white shadow-md shadow-[#E76F51]/20"
              class="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold hover:bg-white/5 transition-all text-slate-300 hover:text-white">
              <div class="flex items-center gap-3">
                <mat-icon class="text-lg">people</mat-icon>
                <span>Customers</span>
              </div>
            </a>

            <a 
              routerLink="/admin/reports" 
              routerLinkActive="bg-[#E76F51] text-white shadow-md shadow-[#E76F51]/20"
              class="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold hover:bg-white/5 transition-all text-slate-300 hover:text-white">
              <div class="flex items-center gap-3">
                <mat-icon class="text-lg">analytics</mat-icon>
                <span>Sales Reports</span>
              </div>
            </a>

            <a 
              routerLink="/admin/settings" 
              routerLinkActive="bg-[#E76F51] text-white shadow-md shadow-[#E76F51]/20"
              class="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold hover:bg-white/5 transition-all text-slate-300 hover:text-white">
              <div class="flex items-center gap-3">
                <mat-icon class="text-lg">settings</mat-icon>
                <span>Settings</span>
              </div>
            </a>

          </nav>
        </div>

        <!-- Admin Profile Footer in Sidebar -->
        <div class="p-4 border-t border-white/10 flex items-center justify-between">
          <div class="flex items-center gap-2.5 min-w-0">
            <img [src]="auth.userAvatar()" alt="Admin" referrerpolicy="no-referrer" class="w-8 h-8 rounded-full object-cover border border-[#E76F51]" />
            <div class="min-w-0">
              <p class="text-xs font-bold text-white truncate">{{ auth.userName() }}</p>
              <p class="text-[10px] text-emerald-400">Executive Admin</p>
            </div>
          </div>
          <button 
            type="button" 
            (click)="auth.logout()" 
            class="text-slate-400 hover:text-rose-400 p-1 cursor-pointer"
            title="Sign Out">
            <mat-icon class="text-lg">logout</mat-icon>
          </button>
        </div>

      </aside>

      <!-- Main Content Outlet Area -->
      <main class="flex-1 p-4 sm:p-8 overflow-y-auto">
        <router-outlet></router-outlet>
      </main>

    </div>
  `
})
export class AdminLayout {
  auth = inject(Auth);
  adminData = inject(AdminData);
  isMobileNavOpen = signal<boolean>(false);
}
