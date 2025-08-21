import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  template: `
    <div class="profile-container">
      <h2>Welcome to profile Page</h2>
      <p>This is the profile page of our Angular application.</p>
    </div>
  `,
  styles: [`
    .profile {
        padding: 1rem;
    }
  `]
})
export class ProfileComponent {}
