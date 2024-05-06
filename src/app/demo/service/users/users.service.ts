import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { User } from 'src/app/demo/api/user';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  apiUrl = environment.ResUrl + 'api/users/';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    const headers = this.createAuthorizationHeader();

    return this.http.get<User[]>(this.apiUrl + 'getallUser', { headers }).pipe(
      catchError((error) => {
        console.error('Error during API request:', error);
        console.error('Error details:', error.error);
        throw error;
      })
    );
  }

  private createAuthorizationHeader(): HttpHeaders {
    const jwtToken = localStorage.getItem('jwt');

    if (jwtToken) {
      return new HttpHeaders().set('Authorization', 'Bearer ' + jwtToken);
    } else {
      console.error('JWT token not found in local storage');
      return new HttpHeaders();
    }
  }

  ajouterUser(u: User): Observable<User> {
    const headers = this.createAuthorizationHeader();
    return this.http.post<User>(this.apiUrl + 'add', u, { headers }).pipe(
      catchError((error) => {
        console.error('Error during API request:', error);
        console.error('Error details:', error.error);
        throw error;
      })
    );
  }
  deleteUser(id: number): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.delete(this.apiUrl + 'delete/' + id, { headers });
  }

  getuserbyid(id: number): Observable<User> {
    const headers = this.createAuthorizationHeader();
    return this.http.get<User>(this.apiUrl + 'getbyid/' + id, { headers });
  }
  getuserbyemail(email: string): Observable<User> {
    const headers = this.createAuthorizationHeader();
    return this.http.get<User>(this.apiUrl + 'getbyemail/' + email, { headers });
  }
  updateuser(u: User): Observable<User> {
    const headers = this.createAuthorizationHeader();
    return this.http.put<User>(this.apiUrl + 'update', u, { headers });
  }
}
