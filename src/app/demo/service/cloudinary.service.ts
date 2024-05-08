import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class CloudinaryService {
    private cloudName = 'dcwpsj3vk';

    constructor(private http: HttpClient) {}

    uploadFile(selectedFile: File): Observable<string> {
        if (!selectedFile) {
            return of('');
        }
        const url = `https://api.cloudinary.com/v1_1/${this.cloudName}/upload`;
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('upload_preset', 'awvuk9gs');

        return this.http.post<any>(url, formData).pipe(
            map((response) => response.secure_url),
            catchError((err: HttpErrorResponse) => {
                console.error('Upload failed:', err);
                return of('');
            })
        );
    }
}
