import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Affectation } from '../api/affectation';

@Injectable({
    providedIn: 'root',
})
export class AffectationService {
    private baseUrl = 'http://localhost:8089/esprobackend/affectation';

    constructor(private http: HttpClient) {}

    getAllAffectations(): Observable<Affectation[]> {
        console.log("Fetching all affectations..."); // Log the request
        return this.http.get<Affectation[]>(`${this.baseUrl}/retrieve-all-affectations`).pipe(
            tap((data) => console.log("Received affectations:", data)), // Log the response
            catchError(this.handleError) // Catch and handle errors
        );
    }

    getAffectationById(affectationId: number): Observable<Affectation> {
        return this.http.get<Affectation>(`${this.baseUrl}/retrieve-affectation/${affectationId}`).pipe(
            catchError(this.handleError) // Handle errors
        );
    }

    addAffectation(affectation: Affectation): Observable<Affectation> {
        return this.http.post<Affectation>(`${this.baseUrl}/add-affectation`, affectation).pipe(
            catchError(this.handleError) // Handle errors
        );
    }

    removeAffectation(affectationId: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/remove-affectation/${affectationId}`).pipe(
            catchError(this.handleError) // Handle errors
        );
    }

    updateAffectation(affectation: Affectation): Observable<Affectation> {
        return this.http.put<Affectation>(`${this.baseUrl}/modify-affectation`, affectation).pipe(
            catchError(this.handleError) // Handle errors
        );
    }

    // Error handling for HTTP requests
    private handleError(error: HttpErrorResponse): Observable<never> {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            console.error(
                `Backend returned code ${error.status}, body was: ${error.error}`
            );
        }
        return throwError(
            'Something went wrong with the HTTP request; please try again later.'
        );
    }

    addBulkAffectations(affectations: Affectation[]): Observable<Affectation[]> {
        return this.http.post<Affectation[]>(`${this.baseUrl}/bulk-import`, affectations).pipe(
            catchError(this.handleError) // Handle HTTP errors
        );
    }
    
}
