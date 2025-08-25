import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_ENDPOINTS } from '../config/api.config';
import { Observable, tap } from 'rxjs';
import { TokenService } from './token.service';
import { UserContextService, User } from './user-context.service';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token?: string;
  user?: User;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private userContextService: UserContextService
  ) {}

  register(payload: RegisterPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(API_ENDPOINTS.auth.register, payload)
      .pipe(tap((res) => {
        if (res?.token) {
          this.tokenService.setToken(res.token);
        }
        if (res?.user) {
          this.userContextService.setUser(res.user);
        }
      }));
  }

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(API_ENDPOINTS.auth.login, payload)
      .pipe(tap((res) => {
        if (res?.token) {
          this.tokenService.setToken(res.token);
        }
        if (res?.user) {
          this.userContextService.setUser(res.user);
        }
      }));
  }

  // logout(): Observable<void> {
  //   return this.http.post<void>(API_ENDPOINTS.auth.logout, {});
  // }

  logout(): void {
    this.tokenService.clearToken();
    this.userContextService.clearUser();
  }

  isAuthenticated(): boolean {
    return !!this.tokenService.getToken();
  }
}