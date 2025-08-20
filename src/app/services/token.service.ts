import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class TokenService {
    private readonly storageKey = 'auth_token';
    private tokenSubject = new BehaviorSubject<string | null>(this.getToken());
    token = this.tokenSubject.asObservable();

    setToken(token: string): void {
        localStorage.setItem(this.storageKey, token);
        this.tokenSubject.next(token);
    }

    getToken(): string | null {
        return localStorage.getItem(this.storageKey);
    }

    clearToken(): void {
        localStorage.removeItem(this.storageKey);
        this.tokenSubject.next(null);
    }

}