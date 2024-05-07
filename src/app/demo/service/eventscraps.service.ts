import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { eventscraps as es } from '../api/eventscraps';
@Injectable({
    providedIn: 'root',
})
export class eventscraps {
    private baseUrl = 'http://localhost:8089/esprobackend/EventScraps';
    constructor(private http: HttpClient) {}

    getEventScraps(): Observable<es[]> {
        return this.http.get<es[]>(this.baseUrl + '/retrieve-all-Events');
    }
}
