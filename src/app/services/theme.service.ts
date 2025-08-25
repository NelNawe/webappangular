import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ThemeMode = 'light' | 'dark';

const THEME_STORAGE_KEY = 'app_theme_mode';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private themeSubject = new BehaviorSubject<ThemeMode>(this.getInitialTheme());
  readonly theme$ = this.themeSubject.asObservable();

  constructor() {
    this.applyThemeClass(this.themeSubject.value);
  }

  getTheme(): ThemeMode {
    return this.themeSubject.value;
  }

  setTheme(mode: ThemeMode): void {
    if (mode === this.themeSubject.value) return;
    this.themeSubject.next(mode);
    localStorage.setItem(THEME_STORAGE_KEY, mode);
    this.applyThemeClass(mode);
  }

  toggleTheme(): void {
    const next: ThemeMode = this.themeSubject.value === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
  }

  private getInitialTheme(): ThemeMode {
    const persisted = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
    if (persisted === 'light' || persisted === 'dark') return persisted;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }

  private applyThemeClass(mode: ThemeMode): void {
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-dark');
    root.classList.add(mode === 'dark' ? 'theme-dark' : 'theme-light');
  }
}
