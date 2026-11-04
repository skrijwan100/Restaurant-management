import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BookingData } from '../../../services/booking';
import { RestaurantTable, TableStatus, TableZone } from '../../../models/table.model';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-manage-tables',
  imports: [MatIconModule, ConfirmDialogComponent],
  template: `
    <div class="space-y-6">
      
      <!-- Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
        <div>
          <span class="text-xs font-bold uppercase tracking-widest text-[#E76F51]">Seating Layout</span>
          <h1 class="font-serif text-3xl font-bold text-[#264653] dark:text-white">Manage Restaurant Tables</h1>
        </div>

        <button 
          type="button" 
          (click)="openAddTableModal()"
          class="px-5 py-2.5 rounded-xl bg-[#E76F51] hover:bg-[#D9593B] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer">
          <mat-icon class="text-sm">add</mat-icon>
          <span>Add New Table</span>
        </button>
      </div>

      <!-- Tables Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        @for (tbl of bookingData.tables(); track tbl.id) {
          <div class="p-5 rounded-2xl bg-white dark:bg-[#1b2a32] border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
            
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-950 flex flex-col items-center justify-center font-serif text-base font-extrabold text-[#E76F51]">
                  #{{ tbl.tableNumber }}
                </div>
                <div>
                  <h4 class="text-sm font-bold text-slate-800 dark:text-white">Table {{ tbl.tableNumber }}</h4>
                  <p class="text-xs text-slate-400">{{ tbl.zone }}</p>
                </div>
              </div>

              <!-- Quick Status Selector -->
              <select 
                [value]="tbl.status"
                (change)="onStatusChange(tbl.id, $any($event.target).value)"
                class="text-xs font-bold rounded-lg px-2 py-1 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white cursor-pointer">
                <option value="Available">Available</option>
                <option value="Reserved">Reserved</option>
                <option value="Occupied">Occupied</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>

            <div class="flex items-center justify-between text-xs bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl">
              <span class="text-slate-500">Capacity: <strong>{{ tbl.capacity }} Guests</strong></span>
              <span class="text-slate-500 capitalize">Shape: <strong>{{ tbl.shape }}</strong></span>
            </div>

            @if (tbl.description) {
              <p class="text-[11px] text-slate-500 italic line-clamp-1">"{{ tbl.description }}"</p>
            }

            <!-- Action buttons -->
            <div class="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-end gap-2">
              <button 
                type="button" 
                (click)="openEditTableModal(tbl)"
                class="px-3 py-1 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 cursor-pointer">
                <mat-icon class="text-xs">edit</mat-icon>
                <span>Edit</span>
              </button>
              <button 
                type="button" 
                (click)="promptDelete(tbl)"
                class="px-3 py-1 rounded-lg text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-1 cursor-pointer">
                <mat-icon class="text-xs">delete</mat-icon>
                <span>Delete</span>
              </button>
            </div>

          </div>
        }
      </div>

      <!-- Add/Edit Table Modal -->
      @if (isTableModalOpen()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div class="bg-white dark:bg-[#1b2a32] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-white/10 space-y-4">
            
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
              <h3 class="font-serif text-lg font-bold text-slate-800 dark:text-white">
                {{ editingTableId() ? 'Edit Table #' + formTableNumber() : 'Add New Restaurant Table' }}
              </h3>
              <button type="button" (click)="isTableModalOpen.set(false)" class="text-slate-400 hover:text-slate-600 cursor-pointer">
                <mat-icon class="text-sm">close</mat-icon>
              </button>
            </div>

            <form (submit)="onSaveTable($event)" class="space-y-4">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Table Number</label>
                  <input 
                    type="number" 
                    required 
                    min="1"
                    [value]="formTableNumber()"
                    (input)="formTableNumber.set(+$any($event.target).value)"
                    class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Guest Capacity</label>
                  <input 
                    type="number" 
                    required 
                    min="1" 
                    max="20"
                    [value]="formCapacity()"
                    (input)="formCapacity.set(+$any($event.target).value)"
                    class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Seating Zone</label>
                <select 
                  [value]="formZone()"
                  (change)="formZone.set($any($event.target).value)"
                  class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white">
                  <option value="Main Dining Hall">Main Dining Hall</option>
                  <option value="Window View">Window View</option>
                  <option value="Garden Patio">Garden Patio</option>
                  <option value="VIP Lounge">VIP Lounge</option>
                  <option value="Rooftop Terrace">Rooftop Terrace</option>
                </select>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Initial Status</label>
                  <select 
                    [value]="formStatus()"
                    (change)="formStatus.set($any($event.target).value)"
                    class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white">
                    <option value="Available">Available</option>
                    <option value="Reserved">Reserved</option>
                    <option value="Occupied">Occupied</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Shape</label>
                  <select 
                    [value]="formShape()"
                    (change)="formShape.set($any($event.target).value)"
                    class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white">
                    <option value="rectangle">Rectangle</option>
                    <option value="round">Round</option>
                    <option value="booth">Booth</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Atmosphere Description</label>
                <input 
                  type="text" 
                  placeholder="e.g. Scenic window seat overlooking the garden"
                  [value]="formDescription()"
                  (input)="formDescription.set($any($event.target).value)"
                  class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-white/10">
                <button 
                  type="button" 
                  (click)="isTableModalOpen.set(false)"
                  class="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold cursor-pointer">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  class="px-5 py-2 rounded-xl bg-[#E76F51] text-white text-xs font-bold cursor-pointer shadow-md">
                  Save Table
                </button>
              </div>
            </form>

          </div>
        </div>
      }

      <!-- Delete Confirmation Dialog -->
      <app-confirm-dialog 
        [isOpen]="isDeleteDialogOpen()"
        title="Delete Restaurant Table"
        [message]="'Are you sure you want to delete Table #' + (tableToDelete()?.tableNumber || '') + '? Any active reservation for this table will be affected.'"
        confirmLabel="Yes, Delete"
        cancelLabel="Keep Table"
        (confirm)="confirmDelete()"
        (cancelled)="isDeleteDialogOpen.set(false)">
      </app-confirm-dialog>

    </div>
  `
})
export class ManageTablesPage {
  bookingData = inject(BookingData);

  isTableModalOpen = signal<boolean>(false);
  isDeleteDialogOpen = signal<boolean>(false);
  editingTableId = signal<string | null>(null);
  tableToDelete = signal<RestaurantTable | null>(null);

  formTableNumber = signal<number>(16);
  formCapacity = signal<number>(4);
  formZone = signal<TableZone>('Main Dining Hall');
  formStatus = signal<TableStatus>('Available');
  formShape = signal<'round' | 'rectangle' | 'booth'>('rectangle');
  formDescription = signal<string>('');

  openAddTableModal(): void {
    const nextNum = Math.max(...this.bookingData.tables().map(t => t.tableNumber), 0) + 1;
    this.editingTableId.set(null);
    this.formTableNumber.set(nextNum);
    this.formCapacity.set(4);
    this.formZone.set('Main Dining Hall');
    this.formStatus.set('Available');
    this.formShape.set('rectangle');
    this.formDescription.set('');
    this.isTableModalOpen.set(true);
  }

  openEditTableModal(table: RestaurantTable): void {
    this.editingTableId.set(table.id);
    this.formTableNumber.set(table.tableNumber);
    this.formCapacity.set(table.capacity);
    this.formZone.set(table.zone);
    this.formStatus.set(table.status);
    this.formShape.set(table.shape);
    this.formDescription.set(table.description || '');
    this.isTableModalOpen.set(true);
  }

  onSaveTable(event: Event): void {
    event.preventDefault();
    const id = this.editingTableId();

    if (id) {
      this.bookingData.updateTable(id, {
        tableNumber: this.formTableNumber(),
        capacity: this.formCapacity(),
        zone: this.formZone(),
        status: this.formStatus(),
        shape: this.formShape(),
        description: this.formDescription()
      });
    } else {
      this.bookingData.addTable({
        tableNumber: this.formTableNumber(),
        capacity: this.formCapacity(),
        zone: this.formZone(),
        status: this.formStatus(),
        shape: this.formShape(),
        isSmokingAllowed: false,
        description: this.formDescription()
      });
    }

    this.isTableModalOpen.set(false);
  }

  onStatusChange(tableId: string, status: TableStatus): void {
    this.bookingData.setTableStatus(tableId, status);
  }

  promptDelete(table: RestaurantTable): void {
    this.tableToDelete.set(table);
    this.isDeleteDialogOpen.set(true);
  }

  confirmDelete(): void {
    const target = this.tableToDelete();
    if (target) {
      this.bookingData.deleteTable(target.id);
    }
    this.isDeleteDialogOpen.set(false);
    this.tableToDelete.set(null);
  }
}
