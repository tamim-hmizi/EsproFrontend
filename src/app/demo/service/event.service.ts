import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { event } from '../api/event';
import { user } from '../api/user';
import { userService } from './user.service';
import { mail } from '../api/mail';
@Injectable({
    providedIn: 'root',
})
export class EventService {
    private baseUrl = 'http://localhost:8089/esprobackend/Event';

    constructor(private http: HttpClient, private userService: userService) {}

    getAllEvents(): Observable<event[]> {
        return this.http.get<event[]>(`${this.baseUrl}/retrieve-all-Events`);
    }

    getEventById(eventId: number): Observable<event> {
        return this.http.get<event>(
            `${this.baseUrl}/retrieve-Event/${eventId}`
        );
    }

    addEvent(event: event): Observable<event> {
        return this.http.post<event>(`${this.baseUrl}/add-Event`, event);
    }

    removeEvent(eventId: number): Observable<void> {
        return this.http.delete<void>(
            `${this.baseUrl}/remove-Event/${eventId}`
        );
    }

    updateEvent(event: event): Observable<event> {
        return this.http.put<event>(`${this.baseUrl}/modify-Event`, event);
    }
    getEventsByDateAsc(): Observable<event[]> {
        return this.http.get<event[]>(
            `${this.baseUrl}/retrieve-events-ordered-by-date-asc`
        );
    }
    getEventsByDateDesc(): Observable<event[]> {
        return this.http.get<event[]>(
            `${this.baseUrl}/retrieve-events-ordered-by-date-desc`
        );
    }
    searchByTitle(input: string): Observable<event[]> {
        return this.http.get<event[]>(`${this.baseUrl}/search/${input}`);
    }
}
