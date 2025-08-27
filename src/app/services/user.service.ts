import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_ENDPOINTS } from "../config/api.config";
import { Observable, tap } from "rxjs";

export interface UserProfile {
    id?: string;
    name?: string;
    email?: string;
    password?: string;
    role?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface UpdateUserPayload {
    name?: string;
    email?: string;
    password?: string;
}

@Injectable({
    providedIn: 'root'
})

export class UserService {
    constructor(private http:HttpClient) {}

    getAllUsers(): Observable<UserProfile[]> {
        return this.http.get<UserProfile[]>(API_ENDPOINTS.user.all);
    }

    getProfile(): Observable<UserProfile> {
        return this.http.get<UserProfile>(API_ENDPOINTS.user.profile);
    }

    updateProfile(payload: UpdateUserPayload): Observable<UserProfile> {
        return this.http.put<UserProfile>(API_ENDPOINTS.user.profile, payload)
   }

    deleteProfile() {
        return this.http.delete<UserProfile>(API_ENDPOINTS.user.profile)
    }
}