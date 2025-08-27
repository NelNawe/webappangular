import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { UserContextService } from './user-context.service';

export type ThemeMode = 'light' | 'dark';

const GLOBAL_THEME_KEY = 'app_theme_mode';
const userKey = (userId: string) => `app_theme_mode_user_${userId}`;

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private themeSubject = new BehaviorSubject<ThemeMode>('light');
  readonly theme$ = this.themeSubject.asObservable();
  private userSub?: Subscription;

  constructor(private userContext: UserContextService) {
    // Initialize theme immediately
    this.initializeTheme();
    
    // Subscribe to user changes
    this.userSub = this.userContext.currentUser$.subscribe(user => {
      console.log('User changed in ThemeService:', user);
      if (user && user.id) {
        // User is logged in, try to load their theme
        const userTheme = localStorage.getItem(userKey(user.id)) as ThemeMode | null;
        if (userTheme === 'light' || userTheme === 'dark') {
          console.log('Loading user theme:', userTheme);
          this.setTheme(userTheme);
        } else {
          // No user theme found, try global theme
          const globalTheme = this.getGlobalTheme();
          if (globalTheme) {
            console.log('Loading global theme:', globalTheme);
            this.setTheme(globalTheme);
          }
        }
      } else {
        // No user, try global theme
        const globalTheme = this.getGlobalTheme();
        if (globalTheme) {
          console.log('Loading global theme:', globalTheme);
          this.setTheme(globalTheme);
        }
      }
    });
  }

  private initializeTheme(): void {
    try {
      const initialTheme = this.getInitialTheme();
      console.log('Initializing theme with:', initialTheme);
      this.themeSubject.next(initialTheme);
      this.applyThemeClass(initialTheme);
    } catch (error) {
      console.warn('Could not initialize theme, using default:', error);
      const defaultTheme: ThemeMode = 'light';
      this.themeSubject.next(defaultTheme);
      this.applyThemeClass(defaultTheme);
    }
  }

  getTheme(): ThemeMode {
    return this.themeSubject.value;
  }

  setTheme(mode: ThemeMode): void {
    if (mode !== 'light' && mode !== 'dark') return;
    
    console.log('Setting theme to:', mode);
    
    if (mode === this.themeSubject.value) {
      this.persistTheme(mode);
      return;
    }
    
    this.themeSubject.next(mode);
    this.persistTheme(mode);
    this.applyThemeClass(mode);
  }

  toggleTheme(): void {
    const next: ThemeMode = this.themeSubject.value === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
  }

  private getInitialTheme(): ThemeMode {
    try {
      const user = this.userContext?.getUser();
      if (user?.id) {
        const userTheme = localStorage.getItem(userKey(user.id)) as ThemeMode | null;
        if (userTheme === 'light' || userTheme === 'dark') {
          console.log('Found user theme:', userTheme);
          return userTheme;
        }
      }
      
      const globalTheme = this.getGlobalTheme();
      if (globalTheme) {
        console.log('Found global theme:', globalTheme);
        return globalTheme;
      }
      
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const systemTheme: ThemeMode = prefersDark ? 'dark' : 'light';
      console.log('Using system preference:', systemTheme);
      return systemTheme;
    } catch (error) {
      console.warn('Error getting initial theme:', error);
      return 'light';
    }
  }

  private getGlobalTheme(): ThemeMode | null {
    try {
      const persisted = localStorage.getItem(GLOBAL_THEME_KEY) as ThemeMode | null;
      return persisted === 'light' || persisted === 'dark' ? persisted : null;
    } catch (error) {
      console.warn('Error getting global theme:', error);
      return null;
    }
  }

  private persistTheme(mode: ThemeMode): void {
    try {
      const user = this.userContext?.getUser();
      if (user?.id) {
        const key = userKey(user.id);
        localStorage.setItem(key, mode);
        console.log('Saved theme for user', user.id, ':', mode, 'with key:', key);
      } else {
        localStorage.setItem(GLOBAL_THEME_KEY, mode);
        console.log('Saved global theme:', mode);
      }
    } catch (error) {
      console.warn('Error persisting theme:', error);
    }
  }

  private applyThemeClass(mode: ThemeMode): void {
    try {
      const root = document.documentElement;
      root.classList.remove('theme-light', 'theme-dark');
      root.classList.add(mode === 'dark' ? 'theme-dark' : 'theme-light');
      console.log('Applied theme class:', mode);
    } catch (error) {
      console.warn('Error applying theme class:', error);
    }
  }

  // Cleanup method to be called when service is destroyed
  destroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }
}
