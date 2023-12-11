// token.service.ts
import { Injectable } from '@angular/core';
import { getAuth } from "firebase/auth";

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private token: string | null = null;

  setToken(token: string): void {
    if (token === "none") {
      this.token = null;
      localStorage.removeItem("token");
    } else {
      this.token = token;
      localStorage.setItem("token", this.token);
    }
    
  }

  getToken(): string | null {
    if (this.token === null || this.token === undefined) {
      this.token = localStorage.getItem("token");
    }
    return this.token;
  }

  clearToken(): void {
    this.token = null;
  }

  isLoggedIn(): boolean {
    const t = this.getToken();
    if (t === null || t === undefined) {
      return false;
    }
    return true;
  }
}