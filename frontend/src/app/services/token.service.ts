// token.service.ts
import { Injectable } from '@angular/core';
import { getAuth } from "firebase/auth";
import { timer } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private token: string | null = null;

  private timeLeft = 120;
  constructor(private router: Router) {}
  startTimer() {
    const source = timer(1000, 2000);
    const abc = source.subscribe(val => {
      if (this.token) {
        
        this.timeLeft -= val;
        if (this.timeLeft <= 0) {
          this.setToken('none');
          this.router.navigate(['/auth']);
          getAuth().signOut();
          this.resetTimer();
          abc.unsubscribe();
          window.alert("You have been signed out due to inactivity");
        } else if (this.timeLeft <= 20) {
          this.confirmDialogue()
          .then(() => {
            this.resetTimer();
            abc.unsubscribe();
            this.startTimer();
          });
        }
      } else {
        this.resetTimer();
        abc.unsubscribe();
      }
      
    });
  }

  confirmDialogue() {
    return new Promise(function (resolve, reject) {
      let confirmed = window.confirm('Logging out in 20 seconds, do you wish to stay logged in?');

      return confirmed ? resolve(true) : reject(false);
    })
  }
  setToken(token: string): void {
    if (token === "none") {
      this.token = null;
      localStorage.removeItem("token");
    } else {
      this.token = token;
      localStorage.setItem("token", this.token);
      this.startTimer();
      this.resetTimer();
    }
    
  }

  getToken(): string | null {
    if (this.token === null || this.token === undefined) {
      this.token = localStorage.getItem("token");
    }
    this.resetTimer();
    return this.token;
  }

  clearToken(): void {
    this.token = null;
  }

  resetTimer() {
    this.timeLeft = 120;
  }

  isLoggedIn(): boolean {
    const t = this.getToken();
    if (t === null || t === undefined) {
      return false;
    }
    return true;
  }
}