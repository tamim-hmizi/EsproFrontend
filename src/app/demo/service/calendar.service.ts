import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { calendar } from '../api/calendar';

@Injectable({
    providedIn: 'root',
})
export class CalendarService {
    private baseUrl = 'http://localhost:8089/esprobackend/calendar';

    constructor(private http: HttpClient) {}

    getAllCalendars(): Observable<calendar[]> {
        return this.http.get<calendar[]>(`${this.baseUrl}/retrieve-all-calendars`);
    }

    getCalendarById(calendarId: number): Observable<calendar> {
        return this.http.get<calendar>(
            `${this.baseUrl}/retrieve-calendar/${calendarId}`
        );
    }

    addCalendar(calendar: calendar): Observable<calendar> {
        return this.http.post<calendar>(`${this.baseUrl}/add-calendar`, calendar);
    }

    removeCalendar(calendarId: number): Observable<void> {
        return this.http.delete<void>(
            `${this.baseUrl}/remove-calendar/${calendarId}`
        );
    }

    updateCalendar(calendar: calendar): Observable<calendar> {
        return this.http.put<calendar>(`${this.baseUrl}/modify-calendar`, calendar);
    }
}
