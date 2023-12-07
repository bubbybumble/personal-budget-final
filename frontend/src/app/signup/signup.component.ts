import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { TokenService } from '../services/token.service'
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {

  formData = {
    username: '',
    password: '',
    confirmPassword: '',
  };
  passwordInvalid = false;
  passwordsMatch = true;
  constructor(private http: HttpClient, private tokenService: TokenService, private router: Router, private dataService: DataService) {}

  signin() {
    const signupUrl = environment.apiUrl + '/signup';

    const formData = new FormData();
    // formData.append('username', this.formData.username);
    // formData.append('password', this.formData.password);
    // formData.append('confirmPassword', this.formData.confirmPassword);

    // const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (this.formData.password.length < 6){
      this.passwordInvalid = true;
    } else if (this.formData.password != this.formData.confirmPassword) {
      this.passwordsMatch = false;
    } else { // password valid


      const auth = getAuth();
      createUserWithEmailAndPassword(auth, this.formData.username, this.formData.password)
      .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        user.getIdToken().then(res => {
          this.tokenService.setToken(res);
          this.dataService.createData()
          this.router.navigate(['/']);
          console.log("successful signup");
        });
        

       
        
        
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === 'auth/email-already-in-use') {
          window.alert("That email already exists, please try logging in, or use another email")
        }
      });


    }
    
  }

    
}