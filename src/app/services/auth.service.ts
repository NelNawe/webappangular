import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_ENDPOINTS } from '../config/api.config';
import { Observable, tap } from 'rxjs';
import { TokenService } from './token.service';

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
  user?: {
    id?: string;
    name?: string;
    email?: string;
  }
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {}

  register(payload: RegisterPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(API_ENDPOINTS.auth.register, payload)
      .pipe(tap((res) => {
        if (res?.token) {
          this.tokenService.setToken(res.token);
        }
      }));
  }

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(API_ENDPOINTS.auth.login, payload)
      .pipe(tap((res) => {
        if (res?.token) {
          this.tokenService.setToken(res.token);
        }
      }));
  }

  // logout(): Observable<void> {
  //   return this.http.post<void>(API_ENDPOINTS.auth.logout, {});
  // }

  logout(): void {
    this.tokenService.clearToken();
  }

  isAuthenticated(): boolean {
    return !!this.tokenService.getToken();
  }
}