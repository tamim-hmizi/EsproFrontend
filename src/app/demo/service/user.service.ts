import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../api/user';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private baseUrl = 'http://localhost:8089/esprobackend/user';

    constructor(private http: HttpClient) {}

    getAllUsers(): Observable<User[]> {
        let val = this.http.get<User[]>(`${this.baseUrl}/retrieve-all-users`);
        return val;
    }

    getUserById(UserId: number): Observable<User> {
        return this.http.get<User>(`${this.baseUrl}/retrieve-user/${UserId}`);
    }

    addUser(User: User): Observable<User> {
        return this.http.post<User>(`${this.baseUrl}/add-user`, User);
    }

    removeUser(UserId: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/remove-user/${UserId}`);
    }

    updateUser(UserId: number, User: User): Observable<User> {
        return this.http.put<User>(
            `${this.baseUrl}/modify-user/${UserId}`,
            User
        );
    }
}
