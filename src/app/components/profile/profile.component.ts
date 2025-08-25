import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserProfile, UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { UserContextService, User } from '../../services/user-context.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: `./profile.component.html`,
  styleUrls: [`./profile.component.scss`],
  imports: [CommonModule, ReactiveFormsModule]
})
export class ProfileComponent implements OnInit, OnDestroy {
  profile: UserProfile | null = null;
  showUpdateModal = false;
  showDeleteModal = false;
  updateForm: FormGroup;
  currentUser: User | null = null;
  private userSubscription!: Subscription;

  constructor(
    private userService: UserService, 
    private authService: AuthService, 
    private userContextService: UserContextService,
    private router: Router, 
    private formBuilder: FormBuilder
  ) {
    this.updateForm = this.formBuilder.group({
      name: [''],
      email: ['', [Validators.email]],
      password: ['']
    });
  }

  ngOnInit(): void {
    // S'abonner aux changements de l'utilisateur connecté
    this.userSubscription = this.userContextService.currentUser$.subscribe(
      user => this.currentUser = user
    );
    
    this.loadProfile();
  }

  loadProfile(): void {
    this.userService.getProfile().subscribe({
      next: (user: UserProfile) => {
        this.profile = user;
      },
      error: (err: any) => {
        this.profile = null;
        console.error('Error loading profile:', err);
      }
    });
  }

  submitUpdate(): void {
    if (this.updateForm.invalid) {
      return;
    }
    const UserData = this.updateForm.value;
    this.userService.updateProfile(UserData).subscribe({
      next: (updatedUser: UserProfile) => {
        this.profile = updatedUser;
        
        // Mettre à jour le contexte utilisateur avec les nouvelles informations
        this.userContextService.updateUser({
          name: updatedUser.name,
          email: updatedUser.email
        });
        
        this.closeUpdateModal();
      },
      error: (err: any) => {
        console.error('Error updating profile:', err);
      }
    });
  }

  confirmDelete(): void {
    this.userService.deleteProfile().subscribe({
      next: () => {
        this.showDeleteModal = false;
        this.authService.logout();
        this.profile = null;
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        console.error('Error deleting profile:', err);
      }
    });
  }

  openUpdateModal(): void {
    if (this.profile) {
      this.updateForm.reset({
        name: this.profile.name || '',
        email: this.profile.email || '',
        password: ''
      });
    }
    this.showUpdateModal = true;
  }

  closeUpdateModal(): void {
    this.showUpdateModal = false;
    this.updateForm.reset();
  }

  openDeleteModal(): void {
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
