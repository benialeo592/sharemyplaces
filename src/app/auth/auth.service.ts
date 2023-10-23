import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthResponseData } from './auth-response-data';
import { HttpClient } from '@angular/common/http';
import { UserAuth } from './userAuth';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user = new BehaviorSubject<UserAuth | null>(null);
  private secretKey: string = environment.firebase.apiKey;
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) { }

  public registration(email: string, password:string) : Observable<AuthResponseData>{
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
      this.secretKey,
      { email: email, password: password, returnSecureToken: true }
    );
  }

  public login(email: string, password: string): Observable<AuthResponseData> {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + this.secretKey, { email: email, password: password, returnSecureToken: true }
    ).pipe(tap(resData => {
      const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
      const userData = new UserAuth(resData.email, resData.localId, resData.idToken, expirationDate);
      this.user.next(userData);
      this.autoLogout(+resData.expiresIn * 1000);
      localStorage.setItem('userData', JSON.stringify(userData));
    }));
  }

  public logout() {
    this.user.next(null);
    localStorage.removeItem('userData');
    this.router.navigate(['/auth']);
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  public autoLogin() {
    let storageItems = localStorage.getItem('userData')
    const userData: { email: string, id: string, _token: string, _tokenExpirationDate: string } = storageItems ? JSON.parse(storageItems) : null;
    if (!userData) {
      return;
    }
    const loadedUser = new UserAuth(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  public autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);

  }
}
