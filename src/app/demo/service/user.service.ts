import { Injectable } from '@angular/core';


import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from 'src/app/demo/api/user';


@Injectable({
  providedIn: 'root'
})
export class UserService {



  private baseUrl = 'http://localhost:8089/esprot/admin';

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<User[]> {
   
  //  debugger;
    return this.http.get<User[]>(`${this.baseUrl}/retrieve-all-users`);
  }


  

  

  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/retrieve-user/${userId}`);
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/add-user`, user);
  }

  removeUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/remove-user/${userId}`);
  }

  updateUser(userId:number,user: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/update-user/${userId}`, user);
  }


  /*login(email: string, password: string) {
      return this.http.post<any>(`${this.baseUrl}/login`, { email, password });
  }
  login(email: string, password: string) {
    return this.http.post<any>(`${this.baseUrl}/login`, { email, password });
}*/

}
