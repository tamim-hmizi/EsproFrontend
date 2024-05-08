import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { vacation } from '../api/vacation';

@Injectable({
    providedIn: 'root',
})
export class VacationService {
    private baseUrl = 'http://localhost:8089/esprobackend/vacation';

    constructor(private http: HttpClient) {}

    getAllVacations(): Observable<vacation[]> {
        return this.http.get<vacation[]>(`${this.baseUrl}/retrieve-all-vacations`);
    }

    getVacationById(vacationId: number): Observable<vacation> {
        return this.http.get<vacation>(
            `${this.baseUrl}/retrieve-vacation/${vacationId}`
        );
    }

    addVacation(vacation: vacation): Observable<vacation> {
        return this.http.post<vacation>(`${this.baseUrl}/add-vacation`, vacation);
    }

    removeVacation(vacationId: number): Observable<void> {
        return this.http.delete<void>(
            `${this.baseUrl}/remove-vacation/${vacationId}`
        );
    }

    updateVacation(vacation: vacation): Observable<vacation> {
        return this.http.put<vacation>(`${this.baseUrl}/modify-vacation`, vacation);
    }
}
