import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Calendar } from '../api/calendar';

@Injectable({
    providedIn: 'root',
})
export class CalendarService {
    private baseUrl = 'http://localhost:8089/esprobackend/calendar';

    constructor(private http: HttpClient) {}

    getAllCalendars(): Observable<Calendar[]> {
        return this.http.get<Calendar[]>(`${this.baseUrl}/retrieve-all-calendars`);
    }

    getCalendarById(calendarId: number): Observable<Calendar> {
        return this.http.get<Calendar>(
            `${this.baseUrl}/retrieve-calendar/${calendarId}`
        );
    }

    addCalendars(calendars: Calendar[]): Observable<Calendar[]> {
        return this.http.post<Calendar[]>(`${this.baseUrl}/add-calendar`, calendars);
    }
    
    
    
    removeCalendar(calendarId: number): Observable<void> {
        return this.http.delete<void>(
            `${this.baseUrl}/remove-calendar/${calendarId}`
        );
    }

    updateCalendar(calendar: Calendar): Observable<Calendar> {
        return this.http.put<Calendar>(`${this.baseUrl}/modify-calendar`, calendar);
    }
}
