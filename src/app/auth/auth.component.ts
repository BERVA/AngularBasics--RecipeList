import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  isLoginMode = true;
  isLoading = false;
  error: string = '';

  constructor(
    private AuthService : AuthService,
    private router: Router
    ) { }

  ngOnInit(): void {
  }

  onSwitchMode(){
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(authForm: NgForm){

    if(!authForm.valid){
      return;
    } else {
      this.isLoading = true;
      const email = authForm.value.email;
      const password = authForm.value.password;
      let authObs: Observable<AuthResponseData>;

      if(this.isLoginMode){
        authObs =  this.AuthService.logIn(email, password);

      } else {
       authObs = this.AuthService.signup(email, password);
      }

      authObs.subscribe(response => {
        this.isLoading = false;
        this.router.navigate(['/recipes'])
      }, errorMessage => {

        this.error = errorMessage;
        this.isLoading = false;
      });
    }
    authForm.reset();
  }

  onHandleError(){
    this.error = null;
  }
}
