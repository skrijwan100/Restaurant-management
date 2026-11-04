import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Auth } from '../../services/auth';
import { Toast } from '../../services/toast';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-register',
  imports: [RouterLink, MatIconModule],
  template: `
    <div class="min-h-[85vh] flex items-center justify-center px-4 py-12 relative">
      <div class="absolute top-1/3 -left-12 w-80 h-80 bg-[#E76F51]/15 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-1/3 -right-12 w-80 h-80 bg-[#2A9D8F]/15 rounded-full blur-3xl pointer-events-none"></div>

      <div class="relative w-full max-w-lg bg-white/90 dark:bg-[#1b2a32]/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-orange-100 dark:border-white/10 p-8 space-y-6">
        
        <!-- Header -->
        <div class="text-center space-y-1">
          <h2 class="font-serif text-2xl font-bold text-[#264653] dark:text-white">Join Savoria Dining Club</h2>
          <p class="text-xs text-slate-500 dark:text-slate-400">Unlock priority table bookings, member offers, and instant delivery</p>
        </div>

        <form (submit)="onSubmit($event)" class="space-y-4">
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
              <input 
                type="text" 
                required 
                placeholder="Elena Rostova"
                [value]="name()"
                (input)="name.set($any($event.target).value)"
                class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E76F51]"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
              <input 
                type="tel" 
                required 
                placeholder="+1 (555) 234-5678"
                [value]="phone()"
                (input)="phone.set($any($event.target).value)"
                class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E76F51]"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
            <input 
              type="email" 
              required 
              placeholder="elena@example.com"
              [value]="email()"
              (input)="email.set($any($event.target).value)"
              class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E76F51]"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Delivery / Residential Address</label>
            <input 
              type="text" 
              required 
              placeholder="450 Harbor Blvd, Marina Bay, Suite 4B"
              [value]="address()"
              (input)="address.set($any($event.target).value)"
              class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E76F51]"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Password</label>
              <input 
                type="password" 
                required 
                placeholder="••••••••"
                [value]="password()"
                (input)="password.set($any($event.target).value)"
                class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E76F51]"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Confirm Password</label>
              <input 
                type="password" 
                required 
                placeholder="••••••••"
                [value]="confirmPassword()"
                (input)="confirmPassword.set($any($event.target).value)"
                class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E76F51]"
              />
            </div>
          </div>

          <div class="pt-2">
            <button 
              type="submit" 
              class="w-full py-3 rounded-2xl bg-[#E76F51] hover:bg-[#D9593B] text-white text-xs font-bold shadow-lg shadow-[#E76F51]/25 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer">
              <mat-icon class="text-sm">person_add</mat-icon>
              <span>Create Savoria Account</span>
            </button>
          </div>

        </form>

        <p class="text-center text-xs text-slate-500">
          Already have an account? 
          <a routerLink="/login" class="font-bold text-[#E76F51] hover:underline ml-1">
            Sign In Here
          </a>
        </p>

      </div>
    </div>
  `
})
export class RegisterPage {
  auth = inject(Auth);
  private toast = inject(Toast);
  private router = inject(Router);

  name = signal<string>('');
  phone = signal<string>('');
  email = signal<string>('');
  address = signal<string>('');
  password = signal<string>('');
  confirmPassword = signal<string>('');

  onSubmit(event: Event): void {
    event.preventDefault();

    if (this.password() !== this.confirmPassword()) {
      this.toast.error('Passwords do not match. Please re-enter.');
      return;
    }

    if (this.password().length < 6) {
      this.toast.warning('Password should be at least 6 characters long.');
      return;
    }

    const success = this.auth.register({
      name: this.name(),
      phone: this.phone(),
      email: this.email(),
      address: this.address(),
      password: this.password()
    });

    if (success) {
      this.router.navigate(['/dashboard']);
    }
  }
}
