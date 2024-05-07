import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

const BASE_URL = ['http://localhost:8089/'];

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  BASE = environment.BASE_URL;

  isAuthenticated: boolean = false;

  constructor(private http: HttpClient, private route: Router) {}

  register(signRequest: any): Observable<any> {
    return this.http.post(this.BASE + 'signup', signRequest);
  }

  login(loginRequest: any): Observable<any> {
    this.isAuthenticated = true;
    return this.http.post(this.BASE + 'login', loginRequest);
  }

  logout(): void {
    localStorage.clear();
    this.isAuthenticated = false;
    this.route.navigate(['/login']);
  }
}
