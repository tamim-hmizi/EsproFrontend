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
        return this.http.get<Classroom[]>(
            `${this.baseUrl}/retrieve-all-classrooms`,
        );
    }

    getClassroomById(classroomId: number): Observable<Classroom> {
        return this.http.get<Classroom>(
            `${this.baseUrl}/retrieve-classroom/${classroomId}`,
        );
    }

    //giveme the other methods
    addClassroom(classroom: Classroom): Observable<Classroom> {
        return this.http.post<Classroom>(
            `${this.baseUrl}/add-classroom`,
            classroom,
        );
    }

    //hello?
    removeClassroom(classroomId: number): Observable<void> {
        return this.http.delete<void>(
            `${this.baseUrl}/remove-classroom/${classroomId}`,
        );
    }

    updateClassroom(classroom: Classroom): Observable<Classroom> {
        return this.http.put<Classroom>(
            `${this.baseUrl}/modify-classroom`,
            classroom,
        );
    }
}
