# UserContextService - Service de Contexte Utilisateur

## Description

Le `UserContextService` est un service Angular qui gère le contexte utilisateur de l'application. Il permet de stocker, récupérer et gérer les informations de l'utilisateur connecté de manière centralisée et réactive.

## Fonctionnalités

- **Stockage des informations utilisateur** : Stocke les données de l'utilisateur connecté
- **Observable réactif** : Fournit un observable pour réagir aux changements d'état utilisateur
- **Persistance locale** : Sauvegarde automatique dans le localStorage
- **Gestion du cycle de vie** : Initialisation automatique au démarrage de l'application

## Interface User

```typescript
export interface User {
  id: string;
  name: string;
  email: string;
}
```

## Méthodes disponibles

### `setUser(user: User): void`
Définit l'utilisateur connecté et le stocke dans le localStorage.

### `getUser(): User | null`
Récupère l'utilisateur actuellement connecté.

### `clearUser(): void`
Efface les informations de l'utilisateur connecté et les supprime du localStorage.

### `updateUser(updates: Partial<User>): void`
Met à jour partiellement les informations de l'utilisateur connecté.

### `isUserLoggedIn(): boolean`
Vérifie si un utilisateur est connecté.

## Propriétés observables

### `currentUser$: Observable<User | null>`
Observable qui émet les changements d'état de l'utilisateur connecté.

## Utilisation

### 1. Injection dans un composant

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserContextService, User } from './services/user-context.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-example',
  template: `
    <div *ngIf="currentUser">
      Bonjour, {{ currentUser.name }} !
    </div>
  `
})
export class ExampleComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  private userSubscription: Subscription;

  constructor(private userContextService: UserContextService) {
    this.userSubscription = this.userContextService.currentUser$.subscribe(
      user => this.currentUser = user
    );
  }

  ngOnInit(): void {
    // L'utilisateur est déjà récupéré via l'observable
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
```

### 2. Utilisation directe des méthodes

```typescript
// Récupérer l'utilisateur actuel
const user = this.userContextService.getUser();

// Vérifier si connecté
if (this.userContextService.isUserLoggedIn()) {
  // Faire quelque chose
}

// Effacer l'utilisateur (déconnexion)
this.userContextService.clearUser();

// Mettre à jour partiellement l'utilisateur
this.userContextService.updateUser({ name: 'Nouveau Nom' });
```

### 3. Intégration avec AuthService

Le service est automatiquement intégré avec `AuthService` :
- Lors de la connexion (`login`) : l'utilisateur est automatiquement défini
- Lors de l'inscription (`register`) : l'utilisateur est automatiquement défini
- Lors de la déconnexion (`logout`) : l'utilisateur est automatiquement effacé

## Initialisation automatique

Le service s'initialise automatiquement au démarrage de l'application en :
1. Vérifiant le localStorage pour des données utilisateur existantes
2. Restaurant l'état utilisateur si des données valides sont trouvées
3. Gérant gracieusement les erreurs de données corrompues

## Gestion des erreurs

Le service gère automatiquement :
- Les données JSON invalides dans le localStorage
- La suppression automatique des données corrompues
- La journalisation des erreurs dans la console

## Tests

Le service inclut une suite de tests complète couvrant :
- La création et l'injection du service
- La gestion des utilisateurs (set, get, clear)
- Les émissions d'observables
- L'initialisation depuis le localStorage
- La gestion des erreurs

## Bonnes pratiques

1. **Toujours se désabonner** des observables dans `ngOnDestroy`
2. **Utiliser l'observable** plutôt que les appels directs aux méthodes pour l'interface utilisateur
3. **Injecter le service** au niveau racine pour une utilisation globale
4. **Gérer les erreurs** lors de l'utilisation des données utilisateur

## Exemple complet d'intégration

```typescript
// Dans app.component.ts
export class AppComponent implements OnInit {
  constructor(private userContextService: UserContextService) {}

  ngOnInit(): void {
    // Le service s'initialise automatiquement
  }
}

// Dans un composant enfant
export class ChildComponent implements OnInit, OnDestroy {
  currentUser$ = this.userContextService.currentUser$;

  constructor(private userContextService: UserContextService) {}

  ngOnInit(): void {
    // Utiliser l'observable directement dans le template
  }

  ngOnDestroy(): void {
    // Pas besoin de se désabonner si on utilise l'observable directement
  }
}
```

```html
<!-- Dans le template -->
<div *ngIf="currentUser$ | async as user">
  <h2>Profil de {{ user.name }}</h2>
  <p>Email: {{ user.email }}</p>
</div>
```
