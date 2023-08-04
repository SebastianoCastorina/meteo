import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, map, tap } from 'rxjs';
import { IRegister } from '../models/auth/register';
import { IAccessData } from '../models/auth/access-data';
import { Router } from '@angular/router';
import { ILogin } from '../models/auth/login';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private jwtHelper: JwtHelperService = new JwtHelperService();
  url: string = 'http://localhost:3000';
  registerUrl: string = this.url + '/register';
  loginUrl: string = this.url + '/login';

  private authSubject = new BehaviorSubject<null | IAccessData>(null);
  user$ = this.authSubject.asObservable();
  isLoggedIn$ = this.user$.pipe(
    map((user) => (user?.accessToken ? true : false))
  );

  constructor(private http: HttpClient, private router: Router) {}

  register(data: IRegister) {
    return this.http.post<IAccessData>(this.registerUrl, data);
  }

  login(data: ILogin) {
    return this.http.post<IAccessData>(this.loginUrl, data).pipe(
      tap((data) => {
        this.authSubject.next(data);
        localStorage.setItem('accessData', JSON.stringify(data));
      })
    );
  }

  logout() {
    this.authSubject.next(null);
    localStorage.removeItem('accessData');
    this.router.navigate(['auth/login']);
  }
}
