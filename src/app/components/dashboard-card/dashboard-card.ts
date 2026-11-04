import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-dashboard-card',
  imports: [MatIconModule],
  template: `
    <div class="p-5 rounded-2xl bg-white dark:bg-[#1b2a32] border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
      <div class="space-y-1">
        <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
          {{ label() }}
        </span>
        <div class="flex items-baseline gap-2">
          <span class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-serif">
            {{ value() }}
          </span>
          @if (trend()) {
            <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
              <mat-icon class="text-xs">trending_up</mat-icon>
              {{ trend() }}
            </span>
          }
        </div>
        @if (subtext()) {
          <p class="text-[11px] text-slate-400">{{ subtext() }}</p>
        }
      </div>

      <div 
        class="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
        [class.bg-orange-50]="color() === 'orange'"
        [class.text-[#E76F51]]="color() === 'orange'"
        [class.dark:bg-orange-950/60]="color() === 'orange'"
        [class.bg-teal-50]="color() === 'teal'"
        [class.text-[#2A9D8F]]="color() === 'teal'"
        [class.dark:bg-teal-950/60]="color() === 'teal'"
        [class.bg-blue-50]="color() === 'blue'"
        [class.text-blue-600]="color() === 'blue'"
        [class.dark:bg-blue-950/60]="color() === 'blue'"
        [class.bg-purple-50]="color() === 'purple'"
        [class.text-purple-600]="color() === 'purple'"
        [class.dark:bg-purple-950/60]="color() === 'purple'">
        <mat-icon class="text-2xl">{{ icon() }}</mat-icon>
      </div>
    </div>
  `
})
export class DashboardCardComponent {
  label = input.required<string>();
  value = input.required<string | number>();
  icon = input.required<string>();
  color = input<'orange' | 'teal' | 'blue' | 'purple'>('orange');
  trend = input<string>();
  subtext = input<string>();
}
