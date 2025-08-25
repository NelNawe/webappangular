# Navbar Dynamique - Démonstration

## 🎯 Fonctionnalités

La navbar dynamique offre une expérience utilisateur moderne et responsive avec :

- **Logo animé** avec icône et texte stylisé
- **Navigation centrale** avec icônes et états actifs
- **Gestion des utilisateurs** connectés/non connectés
- **Menu utilisateur** avec avatar, nom et rôle
- **Notifications** avec badge de compteur
- **Menu déroulant** complet avec options
- **Design responsive** pour mobile et tablette
- **Animations fluides** et transitions

## 🚀 Utilisation

### 1. Structure HTML

```html
<nav class="navbar">
  <div class="navbar-container">
    <!-- Logo -->
    <div class="navbar-brand">
      <a routerLink="/" class="logo">
        <span class="logo-icon">🚀</span>
        <span class="logo-text">Angular</span>
      </a>
    </div>

    <!-- Navigation -->
    <div class="navbar-menu">
      <a routerLink="/home" routerLinkActive="active" class="nav-link">
        <i class="nav-icon">🏠</i>
        <span>Accueil</span>
      </a>
    </div>

    <!-- Utilisateur -->
    <div class="navbar-user">
      <!-- Contenu dynamique selon l'état d'authentification -->
    </div>
  </div>
</nav>
```

### 2. États d'affichage

#### **Utilisateur non connecté**
```html
<div class="auth-buttons">
  <a routerLink="/register" class="btn btn-outline">S'inscrire</a>
  <a routerLink="/login" class="btn btn-primary">Se connecter</a>
</div>
```

#### **Utilisateur connecté**
```html
<div class="user-profile">
  <!-- Notifications -->
  <button class="notification-btn">
    <i class="notification-icon">🔔</i>
    <span class="notification-badge">3</span>
  </button>

  <!-- Menu utilisateur -->
  <div class="user-menu">
    <div class="user-avatar">
      <img [src]="currentUser.avatar" [alt]="currentUser.name">
    </div>
    <div class="user-info">
      <span class="user-name">{{ currentUser.name }}</span>
      <span class="user-role">{{ currentUser.role }}</span>
    </div>
  </div>
</div>
```

## 🎨 Personnalisation

### Variables CSS personnalisables

```scss
:root {
  --navbar-bg: #ffffff;           // Couleur de fond
  --navbar-text: #333333;         // Couleur du texte
  --primary-color: #3b82f6;       // Couleur principale
  --success-color: #10b981;       // Couleur de succès
  --danger-color: #ef4444;        // Couleur de danger
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
```

### Thèmes personnalisés

#### **Thème sombre**
```scss
.navbar.dark-theme {
  --navbar-bg: #1f2937;
  --navbar-text: #f9fafb;
  --navbar-border: #374151;
}
```

#### **Thème coloré**
```scss
.navbar.colorful-theme {
  --primary-color: #ec4899;
  --success-color: #f59e0b;
}
```

## 📱 Responsive Design

### **Desktop (> 768px)**
- Navigation complète visible
- Menu utilisateur avec toutes les informations
- Boutons d'authentification visibles

### **Tablette (≤ 768px)**
- Navigation centrale masquée
- Informations utilisateur simplifiées
- Menu mobile activé

### **Mobile (≤ 480px)**
- Hauteur réduite de la navbar
- Avatar plus petit
- Bouton hamburger visible

## 🔧 Fonctionnalités avancées

### 1. Gestion des menus

```typescript
export class Header {
  isUserMenuOpen = false;
  isMobileMenuOpen = false;

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMenus(): void {
    this.isUserMenuOpen = false;
    this.isMobileMenuOpen = false;
  }
}
```

### 2. Fermeture automatique

```typescript
// Fermer le menu lors de la navigation
this.router.events.subscribe(() => {
  this.closeMenus();
});

// Fermer lors du clic à l'extérieur
@HostListener('document:click', ['$event'])
onDocumentClick(event: Event): void {
  const target = event.target as HTMLElement;
  if (!target.closest('.user-profile')) {
    this.isUserMenuOpen = false;
  }
}
```

### 3. Animations CSS

```scss
.dropdown-menu {
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.2s ease;

  &.open {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
}
```

## 🎭 Exemples d'utilisation

### **Utilisateur administrateur**
```typescript
const adminUser: User = {
  id: '1',
  name: 'Admin User',
  email: 'admin@example.com',
  avatar: '/assets/admin-avatar.jpg',
  role: 'Administrateur'
};
```

### **Utilisateur standard**
```typescript
const standardUser: User = {
  id: '2',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'Utilisateur'
  // Pas d'avatar - affichera l'initiale
};
```

### **Utilisateur premium**
```typescript
const premiumUser: User = {
  id: '3',
  name: 'Jane Smith',
  email: 'jane@example.com',
  avatar: '/assets/premium-avatar.jpg',
  role: 'Premium'
};
```

## 🧪 Tests

La navbar inclut une suite de tests complète :

- **Création du composant**
- **Gestion des états d'authentification**
- **Ouverture/fermeture des menus**
- **Navigation et déconnexion**
- **Gestion des clics extérieurs**

## 🚀 Améliorations futures

- **Thèmes dynamiques** avec sélecteur
- **Animations avancées** avec GSAP
- **Notifications en temps réel** avec WebSocket
- **Recherche globale** intégrée
- **Mode sombre/clair** automatique
- **Internationalisation** (i18n)
- **Accessibilité** améliorée (ARIA)

## 📚 Ressources

- [Angular Material](https://material.angular.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [CSS Variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)

