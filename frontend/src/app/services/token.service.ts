// token.service.ts
import { Injectable } from '@angular/core';
import { getAuth } from "firebase/auth";

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private token: string | null = null;

  setToken(token: string): void {
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  clearToken(): void {
    this.token = null;
  }

  isLoggedIn(): boolean {
    const auth = getAuth();
    if (this.token === null || auth.currentUser === null) {
      return false;
    }
    return true;
  }
}