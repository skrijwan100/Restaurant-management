import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-not-found',
  imports: [RouterLink, MatIconModule],
  template: `
    <div class="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div class="max-w-md w-full space-y-6">
        <div class="w-24 h-24 rounded-3xl bg-orange-100 dark:bg-orange-950 flex items-center justify-center text-[#E76F51] mx-auto shadow-inner">
          <mat-icon class="text-5xl">dinner_dining</mat-icon>
        </div>

        <div class="space-y-2">
          <span class="text-xs font-bold uppercase tracking-widest text-[#E76F51]">Error 404</span>
          <h1 class="font-serif text-3xl font-bold text-[#264653] dark:text-white">Recipe Not Found</h1>
          <p class="text-xs text-slate-500 leading-relaxed">
            The page you are looking for has been removed, renamed, or is temporarily out of service in the kitchen.
          </p>
        </div>

        <div class="flex items-center justify-center gap-3 pt-4">
          <a routerLink="/" class="px-6 py-2.5 rounded-xl bg-[#E76F51] text-white text-xs font-bold shadow-md hover:bg-[#D9593B]">
            Return Home
          </a>
          <a routerLink="/menu" class="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
            View Menu
          </a>
        </div>
      </div>
    </div>
  `
})
export class NotFoundPage {}
