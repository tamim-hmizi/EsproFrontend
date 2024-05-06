import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private baseUrl = '/api/dashboard'; // URL de base de votre backend Spring

  constructor(private http: HttpClient) {}

  getStatistics(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/statistics`);
  }

  getPieChartData(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/pieChartData`);
  }

  getBarChartData(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/barChartData`);
  }

  getLineChartData(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/lineChartData`);
  }
}
