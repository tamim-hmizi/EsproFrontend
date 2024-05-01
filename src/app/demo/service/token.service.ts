import { Injectable } from '@angular/core';


import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from 'src/app/demo/api/user';
import { AuthenticationRequest } from 'src/app/demo/api/AuthenticationRequest';
import { AuthenticationResponse } from 'src/app/demo/api/AuthenticationResponse';
//import { AuthenticationRequest } from 'src/app/demo/api/AuthenticationRequest';
import { Role } from 'src/app/demo/api/role';

@Injectable({
  providedIn: 'root'
})
export class TokenService {



  //private baseUrll = 'http://localhost:8089/esprot/auth';

 constructor() { }
/*
  authenticate(authenticationRequest:AuthenticationRequest): Observable<AuthenticationResponse>{
    return this.http.post<AuthenticationResponse>(`${this.baseUrll}/login`, authenticationRequest);
}*/


setToken(token: string, name: string, surname: string, role: Role) {
  localStorage.setItem('jwt', token);
  localStorage.setItem('nameU', name);
  localStorage.setItem('surnameU', surname);
  localStorage.setItem('role', role); // Assurez-vous que role est une chaîne de caractères ou convertissez-le en une chaîne si nécessaire
}
get token(){
   return localStorage.getItem('jwt') as string;
    
    }
}