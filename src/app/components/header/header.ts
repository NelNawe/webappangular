import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserContextService, User } from '../../services/user-context.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class Header implements OnInit, OnDestroy {
  currentUser: User | null = null;
  isUserMenuOpen = false;
  isMobileOpen = false;
  private userSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private userContextService: UserContextService
  ) {
    this.userSubscription = this.userContextService.currentUser$.subscribe(
      user => this.currentUser = user
    );
  }

  ngOnInit(): void {
    // L'utilisateur est déjà récupéré dans le constructeur via l'observable
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  toggleMobileMenu(): void {
    this.isMobileOpen = !this.isMobileOpen;
    if (this.isMobileOpen) {
      this.isUserMenuOpen = false;
    }
  }

  closeMobileMenu(): void {
    this.isMobileOpen = false;
  }

  closeUserMenu(): void {
    this.isUserMenuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    
    // Close user menu if clicking outside
    if (!target.closest('.user-menu')) {
      this.isUserMenuOpen = false;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.isUserMenuOpen = false;
    this.isMobileOpen = false;
  }
}
