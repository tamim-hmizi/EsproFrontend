import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { user } from '../api/user';

@Injectable({
    providedIn: 'root',
})
export class userService {
    private baseUrl = 'http://localhost:8089/esprobackend/user';

    constructor(private http: HttpClient) {}

    getAllusers(): Observable<user[]> {
        let val = this.http.get<user[]>(`${this.baseUrl}/retrieve-all-users`);
        return val;
    }

    getuserById(userId: number): Observable<user> {
        return this.http.get<user>(`${this.baseUrl}/retrieve-user/${userId}`);
    }

    adduser(user: user): Observable<user> {
        return this.http.post<user>(`${this.baseUrl}/add-user`, user);
    }

    removeuser(userId: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/remove-user/${userId}`);
    }

    updateuser(userId: number, user: user): Observable<user> {
        return this.http.put<user>(
            `${this.baseUrl}/modify-chambre/${userId}`,
            user
        );
    }
}
