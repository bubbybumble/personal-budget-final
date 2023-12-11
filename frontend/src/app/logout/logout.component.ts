import { Component } from '@angular/core';
import { getAuth } from "firebase/auth";
import { TokenService } from '../services/token.service'
import { Router } from '@angular/router';
@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent {
  constructor(private tokenService: TokenService, private router: Router) {}

  logout() {
    getAuth().signOut();
    this.tokenService.setToken('none');
    this.router.navigate(['/auth']);
  }
}
