import { Component, OnInit, OnDestroy } from '@angular/core';
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

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
