import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RestaurantTable } from '../../models/table.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-table-card',
  imports: [MatIconModule],
  template: `
    <div 
      (click)="onSelectTable()"
      class="group relative p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between"
      [class.bg-white]="!isSelected()"
      [class.dark:bg-[#1b2a32]]="!isSelected()"
      [class.border-slate-200]="!isSelected()"
      [class.dark:border-white/10]="!isSelected()"
      [class.hover:border-[#E76F51]]="!isSelected()"
      [class.hover:shadow-lg]="!isSelected()"
      [class.bg-orange-50]="isSelected()"
      [class.dark:bg-orange-950/30]="isSelected()"
      [class.border-[#E76F51]]="isSelected()"
      [class.ring-2]="isSelected()"
      [class.ring-[#E76F51]/30]="isSelected()"
      [class.opacity-60]="table().status === 'Occupied' || table().status === 'Maintenance'">

      <!-- Top Row -->
      <div class="flex items-start justify-between gap-2">
        <div class="flex items-center gap-2.5">
          <div 
            class="w-10 h-10 rounded-xl flex items-center justify-center font-serif text-lg font-bold"
            [class.bg-emerald-100]="table().status === 'Available'"
            [class.text-emerald-800]="table().status === 'Available'"
            [class.dark:bg-emerald-950/60]="table().status === 'Available'"
            [class.dark:text-emerald-300]="table().status === 'Available'"
            [class.bg-amber-100]="table().status === 'Reserved'"
            [class.text-amber-800]="table().status === 'Reserved'"
            [class.dark:bg-amber-950/60]="table().status === 'Reserved'"
            [class.dark:text-amber-300]="table().status === 'Reserved'"
            [class.bg-rose-100]="table().status === 'Occupied' || table().status === 'Maintenance'"
            [class.text-rose-800]="table().status === 'Occupied' || table().status === 'Maintenance'">
            #{{ table().tableNumber }}
          </div>
          <div>
            <h4 class="text-xs font-bold text-slate-800 dark:text-white">Table {{ table().tableNumber }}</h4>
            <p class="text-[11px] text-slate-500 dark:text-slate-400">{{ table().zone }}</p>
          </div>
        </div>

        <!-- Status Tag -->
        <span 
          class="text-[10px] font-bold px-2 py-0.5 rounded-full"
          [class.bg-emerald-100]="table().status === 'Available'"
          [class.text-emerald-700]="table().status === 'Available'"
          [class.dark:bg-emerald-950]="table().status === 'Available'"
          [class.dark:text-emerald-300]="table().status === 'Available'"
          [class.bg-amber-100]="table().status === 'Reserved'"
          [class.text-amber-700]="table().status === 'Reserved'"
          [class.dark:bg-amber-950]="table().status === 'Reserved'"
          [class.dark:text-amber-300]="table().status === 'Reserved'"
          [class.bg-rose-100]="table().status === 'Occupied'"
          [class.text-rose-700]="table().status === 'Occupied'"
          [class.bg-slate-200]="table().status === 'Maintenance'"
          [class.text-slate-700]="table().status === 'Maintenance'">
          {{ table().status }}
        </span>
      </div>

      <!-- Center Graphic: Seats Visualization -->
      <div class="my-4 py-2 px-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex items-center justify-between">
        <div class="flex items-center gap-1.5">
          <mat-icon class="text-sm text-slate-400">group</mat-icon>
          <span class="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {{ table().capacity }} Guests Max
          </span>
        </div>

        <!-- Seat Dots -->
        <div class="flex items-center gap-1">
          @for (seat of getSeatArray(table().capacity); track $index) {
            <span class="w-2 h-2 rounded-full bg-[#E76F51]/70"></span>
          }
        </div>
      </div>

      <!-- Description / Extra details -->
      @if (table().description) {
        <p class="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 italic mb-2">
          "{{ table().description }}"
        </p>
      }

      <!-- Bottom Select Prompt -->
      <div class="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs">
        <span class="text-[11px] text-slate-400 capitalize">
          Shape: {{ table().shape }}
        </span>
        @if (table().status === 'Available') {
          <span class="font-bold text-[#E76F51] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
            <span>{{ isSelected() ? 'Selected' : 'Choose Table' }}</span>
            <mat-icon class="text-xs">chevron_right</mat-icon>
          </span>
        } @else {
          <span class="text-slate-400 font-medium">Currently Unavailable</span>
        }
      </div>

    </div>
  `
})
export class TableCardComponent {
  table = input.required<RestaurantTable>();
  isSelected = input<boolean>(false);
  selected = output<RestaurantTable>();

  getSeatArray(capacity: number): number[] {
    return Array(Math.min(capacity, 8)).fill(0);
  }

  onSelectTable(): void {
    if (this.table().status === 'Available') {
      this.selected.emit(this.table());
    }
  }
}
