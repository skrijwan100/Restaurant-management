import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Toast } from '../../services/toast';
import { MatIconModule } from '@angular/material/icon';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-toast',
  imports: [MatIconModule],
  template: `
    <div class="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      @for (toast of toastService.toasts(); track toast.id) {
        <div 
          class="pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-xl border backdrop-blur-md transition-all duration-300 transform translate-y-0"
          [class.bg-white]="toast.type === 'info'"
          [class.text-dark]="toast.type === 'info'"
          [class.border-slate-200]="toast.type === 'info'"
          [class.dark:bg-slate-800]="toast.type === 'info'"
          [class.dark:text-white]="toast.type === 'info'"
          [class.dark:border-slate-700]="toast.type === 'info'"
          [class.bg-emerald-50]="toast.type === 'success'"
          [class.border-emerald-200]="toast.type === 'success'"
          [class.text-emerald-950]="toast.type === 'success'"
          [class.dark:bg-emerald-950/80]="toast.type === 'success'"
          [class.dark:text-emerald-100]="toast.type === 'success'"
          [class.bg-rose-50]="toast.type === 'error'"
          [class.border-rose-200]="toast.type === 'error'"
          [class.text-rose-950]="toast.type === 'error'"
          [class.dark:bg-rose-950/80]="toast.type === 'error'"
          [class.dark:text-rose-100]="toast.type === 'error'"
          [class.bg-amber-50]="toast.type === 'warning'"
          [class.border-amber-200]="toast.type === 'warning'"
          [class.text-amber-950]="toast.type === 'warning'"
          [class.dark:bg-amber-950/80]="toast.type === 'warning'"
          [class.dark:text-amber-100]="toast.type === 'warning'">
          
          <div class="shrink-0 mt-0.5">
            @if (toast.type === 'success') {
              <mat-icon class="text-emerald-600 dark:text-emerald-400">check_circle</mat-icon>
            } @else if (toast.type === 'error') {
              <mat-icon class="text-rose-600 dark:text-rose-400">error</mat-icon>
            } @else if (toast.type === 'warning') {
              <mat-icon class="text-amber-600 dark:text-amber-400">warning</mat-icon>
            } @else {
              <mat-icon class="text-[#2A9D8F]">info</mat-icon>
            }
          </div>

          <div class="flex-1 min-w-0">
            @if (toast.title) {
              <h4 class="text-sm font-semibold mb-0.5">{{ toast.title }}</h4>
            }
            <p class="text-xs leading-relaxed opacity-90">{{ toast.message }}</p>
          </div>

          <button 
            type="button"
            (click)="toastService.dismiss(toast.id)"
            class="shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            aria-label="Dismiss">
            <mat-icon class="text-sm">close</mat-icon>
          </button>
        </div>
      }
    </div>
  `
})
export class ToastComponent {
  toastService = inject(Toast);
}
