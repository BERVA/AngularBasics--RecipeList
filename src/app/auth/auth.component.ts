import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as fromApp from '../store/app.reducer';
import * as fromAuth from './store/auth.actions';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error: string = '';
  private storeSub: Subscription;
  constructor(
    private store: Store<fromApp.AppState>
    ) { }
  ngOnInit(): void {
    this.storeSub = this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
      if(this.error){
        this.error = authState.authError
      }
    });
  }
  onSwitchMode(){
    this.isLoginMode = !this.isLoginMode;
  }
  onSubmit(authForm: NgForm){
    if(!authForm.valid){
      return;
    } else {
      const email = authForm.value.email;
      const password = authForm.value.password;
      if(this.isLoginMode){
        this.store.dispatch(new fromAuth.LoginStart({email, password}))
      } else {
        this.store.dispatch(new fromAuth.SignupStart({email, password}))
      }
    }
    authForm.reset();
  }
  onHandleError(){
    this.store.dispatch(new fromAuth.ClearError())
  }
  ngOnDestroy(){
    this.storeSub.unsubscribe();
  }
}
