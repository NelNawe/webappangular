// Update app.ts to import the Content component and RouterModule
import { Component } from '@angular/core';
import { Header } from './components/header/header';
import { ContentComponent } from './components/content/content.component';
import { Footer } from './components/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Header, ContentComponent, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {
  title = 'Angular Course';
}