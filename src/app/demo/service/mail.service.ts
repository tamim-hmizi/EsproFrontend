import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
@Injectable({
    providedIn: 'root',
})
export class MailService {
    private baseUrl = 'http://localhost:8089/esprobackend/sendemail';
    constructor(private http: HttpClient) {}

    sendEmail(to: string, subject: string, text: string): Observable<string> {
        const url = `${this.baseUrl}/${to}/${subject}/${text}`;
        return this.http.get<string>(url).pipe(
            catchError((error) => {
                console.error('Error sending email:', error);
                return throwError(error);
            })
        );
    }
}
