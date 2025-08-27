
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Header } from './components/header/header';
import { ContentComponent } from './components/content/content.component';
import { Footer } from './components/footer/footer';
import { SettingsComponent } from './components/settings/settings.component';
import { UsersComponent } from './components/users/users.component';
import { UserContextService } from './services/user-context.service';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, Header, ContentComponent, Footer, SettingsComponent, UsersComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent implements OnInit {
  title = 'Angular Course';

  constructor(
    private userContextService: UserContextService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    // ThemeService will be initialized automatically
  }
}