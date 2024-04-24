import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { sponsor } from '../api/sponsor';

@Injectable({
    providedIn: 'root',
})
export class SponsorService {
    private baseUrl = 'http://localhost:8089/esprobackend/Sponsor';

    constructor(private http: HttpClient) {}

    getAllSponsors(): Observable<sponsor[]> {
        return this.http.get<sponsor[]>(
            `${this.baseUrl}/retrieve-all-Sponsors`
        );
    }

    getSponsorById(sponsorId: number): Observable<sponsor> {
        return this.http.get<sponsor>(
            `${this.baseUrl}/retrieve-Sponsor/${sponsorId}`
        );
    }

    addSponsor(sponsor: sponsor): Observable<sponsor> {
        return this.http.post<sponsor>(`${this.baseUrl}/add-Sponsor`, sponsor);
    }

    removeSponsor(sponsorId: number): Observable<void> {
        return this.http.delete<void>(
            `${this.baseUrl}/remove-Sponsor/${sponsorId}`
        );
    }

    updateSponsor(sponsor: sponsor): Observable<sponsor> {
        return this.http.put<sponsor>(
            `${this.baseUrl}/modify-Sponsor`,
            sponsor
        );
    }
}
