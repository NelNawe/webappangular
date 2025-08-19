import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <div class="home-container">
      <h2>Welcome to Home Page</h2>
      <p>This is the home page of our Angular application.</p>
    </div>
  `,
  styles: [`
    .home-container {
      text-align: center;
      padding: 20px;
    }
    h2 {
      color: #3f51b5;
    }
  `]
})
export class HomeComponent {}
