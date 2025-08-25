import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserContextService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Vérifier s'il y a un utilisateur stocké dans le localStorage au démarrage
    this.initializeUserFromStorage();
  }

  /**
   * Définit l'utilisateur connecté
   * @param user - Les informations de l'utilisateur
   */
  setUser(user: User): void {
    this.currentUserSubject.next(user);
    // Stocker dans le localStorage pour persister entre les sessions
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  /**
   * Récupère l'utilisateur actuellement connecté
   * @returns L'utilisateur connecté ou null
   */
  getUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Efface les informations de l'utilisateur connecté
   */
  clearUser(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
  }

  /**
   * Met à jour partiellement les informations de l'utilisateur connecté
   * @param updates - Les informations à mettre à jour
   */
  updateUser(updates: Partial<User>): void {
    const currentUser = this.currentUserSubject.value;
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      this.setUser(updatedUser);
    }
  }

  /**
   * Vérifie si un utilisateur est connecté
   * @returns true si un utilisateur est connecté, false sinon
   */
  isUserLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  /**
   * Initialise l'utilisateur depuis le localStorage au démarrage de l'application
   */
  private initializeUserFromStorage(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur depuis le localStorage:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }
}
