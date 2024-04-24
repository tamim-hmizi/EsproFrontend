import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { affectation } from '../api/affectation';

@Injectable({
    providedIn: 'root',
})
export class AffectationService {
    private baseUrl = 'http://localhost:8089/esprobackend/affectation';

    constructor(private http: HttpClient) {}

    getAllAffectations(): Observable<affectation[]> {
        return this.http.get<affectation[]>(`${this.baseUrl}/retrieve-all-affectations`);
    }

    getAffectationById(affectationId: number): Observable<affectation> {
        return this.http.get<affectation>(
            `${this.baseUrl}/retrieve-affectation/${affectationId}`
        );
    }

    addAffectation(affectation: affectation): Observable<affectation> {
        return this.http.post<affectation>(`${this.baseUrl}/add-affectation`, affectation);
    }

    removeAffectation(affectationId: number): Observable<void> {
        return this.http.delete<void>(
            `${this.baseUrl}/remove-affectation/${affectationId}`
        );
    }

    updateAffectation(affectation: affectation): Observable<affectation> {
        return this.http.put<affectation>(`${this.baseUrl}/modify-affectation`, affectation);
    }
}
