import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import {Actions, ofType, createEffect} from "@ngrx/effects";
import { Action } from "@ngrx/store";
import { Observable, of } from "rxjs";
import { catchError, switchMap, map, tap } from "rxjs/operators";
import { AuthService } from "../auth.service";
import {Anahtar} from "../keys"
import { User } from "../user.model";

import * as AuthActions from "./auth.actions";

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

export interface LoginResponseData extends AuthResponseData {
  registered: boolean;
}


const handleAuthentication = (expiresIn: number, email: string, userId: string, token:string) => {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000 );

    const user = new User(email, userId, token, expirationDate);
    localStorage.setItem('userData', JSON.stringify(user))
    return new AuthActions.AuthenticateSuccess({
      email: email,
      userId: userId,
      token: token,
      expirationDate: expirationDate,
      redirect: true
    })
}
const handleError = (errorRes: HttpErrorResponse) => {

  let errorMessage = "An error occured!";
  if(!errorRes.error || !errorRes.error.error){
    return of(new AuthActions.AuthenticateFail(errorMessage));
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
    return of(new AuthActions.AuthenticateFail(errorMessage))
  }
}

@Injectable()

export class AuthEffects {

  authLogin = createEffect( (): Observable<Action> | any  =>
    this.actions$.pipe(
      ofType(AuthActions.LOGIN_START),
      switchMap((authData: AuthActions.LoginStart) => {
        return this.http
          .post<AuthResponseData>(
            this.anahtar.loginKey,
            {
              email: authData.login.email,
              password: authData.login.password,
              returnSecureToken: true
            })
            .pipe(
              tap((resData) => {
                this.authService.setLogoutTimer(+resData.expiresIn * 1000)

              }),
              map(
                (resData) => {
                  return handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken)
                }
              ),
              catchError(
                (errorRes: HttpErrorResponse) => {
                  return handleError(errorRes)
                }
                )
              )
      })
    ), { dispatch: true }
  );

  authSignUp = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.SIGNUP_START),
      switchMap((signupAction: AuthActions.SignupStart) => {
        return this.http
          .post<AuthResponseData | HttpErrorResponse>(this.anahtar.signupKey, {
            email: signupAction.payload.email,
            password: signupAction.payload.password,
            returnSecureToken: true,
          })
          .pipe(
            tap((responseData: AuthResponseData | any) => {
              this.authService.setLogoutTimer(responseData.expiresIn)
            }),
            map((responseData:AuthResponseData | any) =>
              handleAuthentication(
                +responseData.expiresIn,
                responseData.email,
                responseData.localId,
                responseData.idToken
              )
            ),
            catchError((errorResponse: HttpErrorResponse) =>
              handleError(errorResponse)
            )
          );
      })
    )
  );


  autoLogin = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.AUTO_LOGIN),
        map(()=>{
          const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string;
            } = JSON.parse(localStorage.getItem('userData'));
            if(!userData){
              return { type: 'No Effect'};
            }
            const tokenExpirationDate = new Date(userData._tokenExpirationDate);
            const loadedUser = new User(
              userData.email,
              userData.id,
              userData._token,
              tokenExpirationDate
            );

            if(loadedUser.token){
              const expirationDuration = tokenExpirationDate.getTime() - new Date().getTime();
              this.authService.setLogoutTimer(expirationDuration)

              return new AuthActions.AuthenticateSuccess({
                email: loadedUser.email,
                userId: loadedUser.id,
                token: loadedUser.token,
                expirationDate: new Date(userData._tokenExpirationDate),
                redirect: false
                });
            }
            return {type: 'No Effect'}
      })
    ), {dispatch: true}
  )

  authlogout = createEffect(
    () => this.actions$.pipe(
      ofType(AuthActions.LOGOUT),
      tap(
        ()=> {
          this.authService.clearLogoutTimer();
          localStorage.removeItem('userData');
          this.router.navigate(['/auth']);
        }
      )
    ), {dispatch: false}
  )
  authRedirect = createEffect(() =>
    this.actions$.pipe
      (
        ofType(AuthActions.AUTHENTICATE_SUCCESS),
          tap(
            (authSuccesAction: AuthActions.AuthenticateSuccess) =>
            {
              if(authSuccesAction.user.redirect){
                this.authService.clearLogoutTimer();
                this.router.navigate(['/']);
              }

            }
          )
      )
    ,{dispatch: false}
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private anahtar: Anahtar,
    private router: Router,
    private authService: AuthService
    ){}
}
