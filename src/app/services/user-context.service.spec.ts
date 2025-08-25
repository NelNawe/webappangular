import { TestBed } from '@angular/core/testing';
import { UserContextService, User } from './user-context.service';

describe('UserContextService', () => {
  let service: UserContextService;
  let mockUser: User;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserContextService]
    });
    service = TestBed.inject(UserContextService);
    
    // Nettoyer le localStorage avant chaque test
    localStorage.clear();
    
    mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://example.com/avatar.jpg',
      role: 'admin'
    };
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with no user', () => {
    expect(service.getUser()).toBeNull();
    expect(service.isUserLoggedIn()).toBeFalse();
  });

  it('should set user correctly', () => {
    service.setUser(mockUser);
    
    expect(service.getUser()).toEqual(mockUser);
    expect(service.isUserLoggedIn()).toBeTrue();
    
    // Vérifier que l'utilisateur est stocké dans le localStorage
    const storedUser = localStorage.getItem('currentUser');
    expect(storedUser).toBe(JSON.stringify(mockUser));
  });

  it('should clear user correctly', () => {
    service.setUser(mockUser);
    service.clearUser();
    
    expect(service.getUser()).toBeNull();
    expect(service.isUserLoggedIn()).toBeFalse();
    
    // Vérifier que l'utilisateur est supprimé du localStorage
    const storedUser = localStorage.getItem('currentUser');
    expect(storedUser).toBeNull();
  });

  it('should emit user changes through observable', (done) => {
    service.currentUser$.subscribe(user => {
      expect(user).toEqual(mockUser);
      done();
    });
    
    service.setUser(mockUser);
  });

  it('should emit null when user is cleared', (done) => {
    service.setUser(mockUser);
    
    service.currentUser$.subscribe(user => {
      if (user === null) {
        done();
      }
    });
    
    service.clearUser();
  });

  it('should initialize user from localStorage on service creation', () => {
    // Simuler un utilisateur stocké dans le localStorage
    localStorage.setItem('currentUser', JSON.stringify(mockUser));
    
    // Créer une nouvelle instance du service
    const newService = TestBed.inject(UserContextService);
    
    expect(newService.getUser()).toEqual(mockUser);
    expect(newService.isUserLoggedIn()).toBeTrue();
  });

  it('should handle invalid localStorage data gracefully', () => {
    // Simuler des données invalides dans le localStorage
    localStorage.setItem('currentUser', 'invalid-json');
    
    // Créer une nouvelle instance du service
    const newService = TestBed.inject(UserContextService);
    
    expect(newService.getUser()).toBeNull();
    expect(newService.isUserLoggedIn()).toBeFalse();
    
    // Vérifier que les données invalides sont supprimées
    const storedUser = localStorage.getItem('currentUser');
    expect(storedUser).toBeNull();
  });

  it('should update user partially', () => {
    service.setUser(mockUser);
    
    // Mettre à jour seulement le nom
    service.updateUser({ name: 'Jane Doe' });
    
    const updatedUser = service.getUser();
    expect(updatedUser?.name).toBe('Jane Doe');
    expect(updatedUser?.email).toBe(mockUser.email); // Email inchangé
    expect(updatedUser?.id).toBe(mockUser.id); // ID inchangé
    
    // Vérifier que les données sont mises à jour dans le localStorage
    const storedUser = localStorage.getItem('currentUser');
    expect(storedUser).toContain('Jane Doe');
  });

  it('should not update user if no user is logged in', () => {
    // Aucun utilisateur connecté
    expect(service.getUser()).toBeNull();
    
    // Essayer de mettre à jour
    service.updateUser({ name: 'New Name' });
    
    // Aucun changement
    expect(service.getUser()).toBeNull();
  });
});
