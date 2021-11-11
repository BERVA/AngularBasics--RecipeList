import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap } from "rxjs/operators";
import { BehaviorSubject, throwError } from "rxjs";
import { User } from "./user.model";
import { Router } from "@angular/router";
import { Anahtar } from "./keys";


export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}


@Injectable({
  providedIn: 'root'
})

export class AuthService {

  user = new BehaviorSubject<User>(null);
  token: string = '';

  private tokenExpirationTimer: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private anahtar: Anahtar
    ){}
  apiKey = this.anahtar.anahtar;

  apiUrl: string = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=';
  loginUrl: string = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='

  signup(email: string, password: string){
    return this.http.post<AuthResponseData>(this.apiUrl + this.apiKey, {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe(catchError(this.handleError), tap(resData => {
      this.handleAuthentication(
        resData.email,
        resData.localId,
        resData.idToken,
        +resData.expiresIn
        )

    }))
  }

  logIn(email: string, password: string){
    return this.http
    .post<AuthResponseData>(this.loginUrl + this.apiKey, {email: email, password: password, returnSecureToken: true })
    .pipe(catchError(this.handleError), tap(resData => {
      this.handleAuthentication(
        resData.email,
        resData.localId,
        resData.idToken,
        +resData.expiresIn
        )
    }))
  }

  logout(){
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');

    if(this.tokenExpirationTimer){
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number){
    this.tokenExpirationTimer =
    setTimeout(()=>{
      this.logout();
    } , expirationDuration);
  }

  autoLogin(){
    const userData :{
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    }= JSON.parse(localStorage.getItem('userData'));
    const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
    if(!userData){
      return;
    }
    if(loadedUser.token){
      this.user.next(loadedUser);
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration)
    }
  }



  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number){
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
      const user = new User(
        email,
        userId,
        token,
        expirationDate
        );
        this.user.next(user);
        this.autoLogout(expiresIn * 1000)
        localStorage.setItem('userData', JSON.stringify(user))
  }

  private handleError(errorRes: HttpErrorResponse){
    let errorMessage = "An error occured!";

      if(!errorRes.error || !errorRes.error.error){
        return throwError(errorMessage);
      } else {
        switch (errorRes.error.error.message){
          case 'EMAIL_EXISTS':
            errorMessage= 'The email address is already in use by another account.';
            break;
          case 'OPERATION_NOT_ALLOWED':
            errorMessage = 'Password sign-in is disabled for this project.';
            break;
          case 'TOO_MANY_ATTEMPTS_TRY_LATER':
            errorMessage = 'We have blocked all requests from this device due to unusual activity. Try again later.';
            break;
          case 'EMAIL_NOT_FOUND':
            errorMessage = 'User not found';
            break;
          case 'INVALID_PASSWORD':
            errorMessage = 'The password is invalid';
            break;
          case 'USER_DISABLED':
            errorMessage = 'The user account has been disabled.';
            break;
          default:
            errorMessage = 'An unknown error occurred!';
            break;
        }
        return throwError(errorMessage)
      }

  }

}
