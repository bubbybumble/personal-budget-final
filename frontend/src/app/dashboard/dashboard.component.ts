import { Component } from '@angular/core';
import { TokenService } from '../services/token.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  constructor(private tokenService: TokenService, private router: Router) {}

  ngOnInit(): void {
    // Check if the user is authenticated. If not, redirect to the login page.
    if (!this.tokenService.isLoggedIn()) {
      this.router.navigate(['/auth']);
    }
    // If the user is authenticated, you can proceed with other initialization logic.
  }

  logToken(){
    const token = this.tokenService.getToken();
    console.log('Authentication Token:', token);
  }
}
