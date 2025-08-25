import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Header } from './header';
import { AuthService } from '../../services/auth.service';
import { UserContextService, User } from '../../services/user-context.service';
import { of } from 'rxjs';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockUserContextService: jasmine.SpyObj<UserContextService>;

  const mockUser: User = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://example.com/avatar.jpg',
    role: 'admin'
  };

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated', 'logout']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const userContextServiceSpy = jasmine.createSpyObj('UserContextService', ['currentUser$']);

    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: UserContextService, useValue: userContextServiceSpy }
      ]
    }).compileComponents();

    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockUserContextService = TestBed.inject(UserContextService) as jasmine.SpyObj<UserContextService>;

    mockUserContextService.currentUser$ = of(mockUser);
    mockAuthService.isAuthenticated.and.returnValue(true);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with user data', () => {
    expect(component.currentUser).toEqual(mockUser);
  });

  it('should show authenticated state', () => {
    expect(component.isAuthenticated).toBeTrue();
  });

  it('should toggle user menu', () => {
    expect(component.isUserMenuOpen).toBeFalse();
    
    component.toggleUserMenu();
    expect(component.isUserMenuOpen).toBeTrue();
    
    component.toggleUserMenu();
    expect(component.isUserMenuOpen).toBeFalse();
  });

  it('should toggle mobile menu', () => {
    expect(component.isMobileMenuOpen).toBeFalse();
    
    component.toggleMobileMenu();
    expect(component.isMobileMenuOpen).toBeTrue();
    
    component.toggleMobileMenu();
    expect(component.isMobileMenuOpen).toBeFalse();
  });

  it('should close all menus', () => {
    component.isUserMenuOpen = true;
    component.isMobileMenuOpen = true;
    
    component.closeMenus();
    
    expect(component.isUserMenuOpen).toBeFalse();
    expect(component.isMobileMenuOpen).toBeFalse();
  });

  it('should close menus on logout', () => {
    component.isUserMenuOpen = true;
    component.isMobileMenuOpen = true;
    
    component.logout();
    
    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    expect(component.isUserMenuOpen).toBeFalse();
    expect(component.isMobileMenuOpen).toBeFalse();
  });

  it('should close user menu when clicking outside', () => {
    component.isUserMenuOpen = true;
    
    const mockEvent = {
      target: document.createElement('div')
    } as Event;
    
    component.onDocumentClick(mockEvent);
    
    expect(component.isUserMenuOpen).toBeFalse();
  });

  it('should not close user menu when clicking inside user profile', () => {
    component.isUserMenuOpen = true;
    
    const mockElement = document.createElement('div');
    mockElement.className = 'user-profile';
    const mockEvent = {
      target: mockElement
    } as Event;
    
    // Mock closest method
    spyOn(mockElement, 'closest').and.returnValue(mockElement);
    
    component.onDocumentClick(mockEvent);
    
    expect(component.isUserMenuOpen).toBeTrue();
  });
});
