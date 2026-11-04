import { Injectable, signal, inject } from '@angular/core';
import { Storage } from './storage';

@Injectable({
  providedIn: 'root'
})
export class Theme {
  private storage = inject(Storage);
  currentTheme = signal<'light' | 'dark'>('light');

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = this.storage.getTheme();
      this.currentTheme.set(saved);
      this.applyTheme(saved);
    }
  }

  toggle(): void {
    const next = this.currentTheme() === 'light' ? 'dark' : 'light';
    this.currentTheme.set(next);
    this.storage.setTheme(next);
    this.applyTheme(next);
  }

  setTheme(theme: 'light' | 'dark'): void {
    this.currentTheme.set(theme);
    this.storage.setTheme(theme);
    this.applyTheme(theme);
  }

  private applyTheme(theme: 'light' | 'dark'): void {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }
}
