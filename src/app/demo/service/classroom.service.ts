import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Classroom } from '../api/classroom';

@Injectable({
    providedIn: 'root',
})
export class ClassroomService {
    private baseUrl = 'http://localhost:8089/esprobackend/classroom';

    constructor(private http: HttpClient) {}

    getAllClassrooms(): Observable<Classroom[]> {
        let val = this.http.get<Classroom[]>(`${this.baseUrl}/retrieve-all-classrooms`);
        return val;
    }

    getClassroomById(ClassroomId: number): Observable<Classroom> {
        return this.http.get<Classroom>(`${this.baseUrl}/retrieve-classroom/${ClassroomId}`);
    }

    addClassroom(Classroom: Classroom): Observable<Classroom> {
        return this.http.post<Classroom>(`${this.baseUrl}/add-classroom`, Classroom);
    }

    removeClassroom(ClassroomId: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/remove-classroom/${ClassroomId}`);
    }

    updateClassroom(ClassroomId: number, Classroom: Classroom): Observable<Classroom> {
        return this.http.put<Classroom>(
            `${this.baseUrl}/modify-classroom/${ClassroomId}`,
            Classroom
        );
    }
}
