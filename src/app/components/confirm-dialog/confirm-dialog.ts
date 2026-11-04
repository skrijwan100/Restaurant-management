import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-confirm-dialog',
  imports: [MatIconModule],
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
        <div class="bg-white dark:bg-[#1b2a32] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-white/10 space-y-4 animate-in fade-in zoom-in-95 duration-200">
          
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center shrink-0">
              <mat-icon class="text-2xl">{{ icon() }}</mat-icon>
            </div>
            <div>
              <h3 class="text-base font-bold text-slate-900 dark:text-white">{{ title() }}</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{{ message() }}</p>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-white/5">
            <button 
              type="button" 
              (click)="cancelled.emit()" 
              class="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
              {{ cancelLabel() }}
            </button>
            <button 
              type="button" 
              (click)="confirm.emit()" 
              class="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition-all cursor-pointer">
              {{ confirmLabel() }}
            </button>
          </div>

        </div>
      </div>
    }
  `
})
export class ConfirmDialogComponent {
  isOpen = input<boolean>(false);
  title = input<string>('Confirm Action');
  message = input<string>('Are you sure you want to proceed? This cannot be undone.');
  confirmLabel = input<string>('Confirm');
  cancelLabel = input<string>('Cancel');
  icon = input<string>('warning');

  confirm = output<void>();
  cancelled = output<void>();
}
