import { Injectable } from '@angular/core';


import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from 'src/app/demo/api/user';

@Injectable({
  providedIn: 'root'
})
export class forgetpassService {



  private baseUrllx = 'http://localhost:8089/esprot/resetpwd';
 

  constructor(private http: HttpClient) { }

  



mailVerification(email:string): Observable<any>{
  return this.http.get<any>(`${this.baseUrllx}/verifyMailr/${email}`);
}




verifOtp(otp:number, email:string): Observable<any>{
  return this.http.get<any>(`${this.baseUrllx}/verifyOTP/${otp}/${email}`);
}


changePassword(password:string,email:string): Observable<any>{
  return this.http.post<any>(`${this.baseUrllx}/change-pwd/${email}`,password);
}
}