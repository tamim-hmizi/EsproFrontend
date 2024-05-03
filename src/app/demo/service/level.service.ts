import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Level } from '../api/level';

@Injectable({
    providedIn: 'root',
})
export class LevelService {
    private baseUrl = 'http://localhost:8089/esprobackend/level';

    constructor(private http: HttpClient) {}

    getAllLevels(): Observable<Level[]> {
        return this.http.get<Level[]>(`${this.baseUrl}/retrieve-all-levels`);
    }

    getLevelById(levelId: number): Observable<Level> {
        return this.http.get<Level>(
            `${this.baseUrl}/retrieve-level/${levelId}`,
        );
    }

    // addLevel(level: Level): Observable<Level> {
    //     return this.http.post<Level>(`${this.baseUrl}/add-level`, level);
    // }
    //add the startYear and endYear params in addLevel
    addLevel(
        level: Level,
        startYear: string,
        endYear: string,
    ): Observable<Level> {
        return this.http.post<Level>(
            `${this.baseUrl}/add-level/${startYear}/${endYear}`,
            level,
        );
    }

    removeLevel(levelId: number): Observable<void> {
        return this.http.delete<void>(
            `${this.baseUrl}/remove-level/${levelId}`,
        );
    }

    updateLevel(
        level: Level,
        startYear: string,
        endYear: string,
    ): Observable<Level> {
        return this.http.put<Level>(
            `${this.baseUrl}/modify-level/${startYear}/${endYear}`,
            level,
        );
    }
    retrieveStartYearAndEndYearForClassroomsByLevelId(
        levelId: number,
    ): Observable<string[]> {
        return this.http.get<string[]>(
            `${this.baseUrl}/retrieve-classroom-years/${levelId}`,
        );
    }
}
