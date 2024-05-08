import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
@Injectable({
    providedIn: 'root',
})
export class SmsService {
    private baseUrl = 'http://localhost:8089/esprobackend/sendsms';
    constructor(private http: HttpClient) {}

    sendSms(message: string): Observable<string> {
        const url = `${this.baseUrl}/+21621611816/${message}`;
        return this.http.get<string>(url).pipe(
            catchError((error) => {
                console.error('Error sending SMS:', error);
                return throwError(error);
            })
        );
    }
}
