import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Option } from '../api/option';

@Injectable({
    providedIn: 'root',
})
export class OptionService {
    private baseUrl = 'http://localhost:8089/esprobackend/option';

    constructor(private http: HttpClient) {}

    getAllOptions(): Observable<Option[]> {
        return this.http.get<Option[]>(`${this.baseUrl}/retrieve-all-options`);
    }

    getOptionById(optionId: number): Observable<Option> {
        return this.http.get<Option>(
            `${this.baseUrl}/retrieve-option/${optionId}`,
        );
    }

    addOption(
        option: Option,
        startYear: string,
        endYear: string,
    ): Observable<Option> {
        return this.http.post<Option>(
            `${this.baseUrl}/add-option/${startYear}/${endYear}`,
            option,
        );
    }

    removeOption(optionId: number): Observable<void> {
        return this.http.delete<void>(
            `${this.baseUrl}/remove-option/${optionId}`,
        );
    }

    updateOption(
        option: Option,
        startYear: string,
        endYear: string,
    ): Observable<Option> {
        return this.http.put<Option>(
            `${this.baseUrl}/modify-option/${startYear}/${endYear}`,
            option,
        );
    }
    retrieveStartYearAndEndYearForClassroomsByOptionId(optionId: number): Observable<string[]> {
        return this.http.get<string[]>(
            `${this.baseUrl}/retrieve-classroom-years/${optionId}`,
        );
    }
}
