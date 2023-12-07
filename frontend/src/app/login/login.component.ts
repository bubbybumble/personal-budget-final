import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { TokenService } from '../services/token.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  formData = {
    username: '',
    password: '',
  };
  passwordInvalid = false;
  constructor(private http: HttpClient, private tokenService: TokenService, private router: Router) {}
  login() {
    const auth = getAuth();

    signInWithEmailAndPassword(auth, this.formData.username, this.formData.password)
    .then((userCredential) => {
      const user = userCredential.user;
      user.getIdToken().then(res => {
        this.tokenService.setToken(res);
        this.router.navigate(['/']);
      });
      console.log("successful login");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode === 'auth/invalid-credential') {
        window.alert("Incorrect credentials. Please create an account or try again later")
      }
    });
  }
}
