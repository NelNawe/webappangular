import { Component, OnInit } from '@angular/core';
import { UserProfile, UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: `./profile.component.html`,
  styleUrls: [`./profile.component.scss`],
  imports: [CommonModule, ReactiveFormsModule]
})
export class ProfileComponent implements OnInit {
  profile: UserProfile | null = null;
  showUpdateModal = false;
  showDeleteModal = false;
  updateForm: FormGroup;

  constructor(private userService: UserService, private authService: AuthService, private router: Router, private formBuilder: FormBuilder) {
    this.updateForm = this.formBuilder.group({
      name: [''],
      email: ['', [Validators.email]],
      password: ['']
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.userService.getProfile().subscribe({
      next: (user) => {
        this.profile = user;
      },
      error: (err) => {
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
      next: (updatedUser) => {
        this.profile = updatedUser;
        this.closeUpdateModal();
      },
      error: (err) => {
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
      error: (err) => {
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
      })
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

}
