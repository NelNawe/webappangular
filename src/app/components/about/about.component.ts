import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  template: `
    <div class="about-container">
      <h2>About Page</h2>
    </div>
  `,
  styles: [`
    .about-container {
      text-align: center;
      padding: 20px;
    }
    h2 {
      color: #ff4081;
    }
  `]
})
export class AboutComponent {}
