import { Injectable } from '@angular/core';


import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterRequest } from 'src/app/demo/api/RegisterRequest';
import { AuthenticationRequest } from 'src/app/demo/api/AuthenticationRequest';
import { AuthenticationResponse } from 'src/app/demo/api/AuthenticationResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthService {



  private baseUrll = 'http://localhost:8089/esprot/auth';
  //private baseUrllx = 'http://localhost:8089/esprot/admin';

  constructor(private http: HttpClient) { }

  authenticate(authenticationRequest:AuthenticationRequest): Observable<AuthenticationResponse>{
    return this.http.post<AuthenticationResponse>(`${this.baseUrll}/login`, authenticationRequest);
}

register(registerRequest:RegisterRequest): Observable<any>{
  return this.http.post<any>(`${this.baseUrll}/register`, registerRequest);
}






}