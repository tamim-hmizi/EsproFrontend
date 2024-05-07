import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResearchAxis } from '../api/ResearchAxis';


@Injectable({
  providedIn: 'root'
})
export class ResearchAxisService {
  private baseUrl = 'http://localhost:8089/esprobackend/ResearchAxis'; // Adjust the base URL according to your backend

  constructor(private http: HttpClient) { }

  getAllResearchAxes(): Observable<ResearchAxis[]> {
    return this.http.get<ResearchAxis[]>(`${this.baseUrl}/retrieve-all-ResearchAxiss`);
  }
  
  getresearchAxisByRdiId(rdiId: number): Observable<ResearchAxis[]> {
    return this.http.get<ResearchAxis[]>(`${this.baseUrl}/rdi/${rdiId}`);
  }
  getResearchAxis(id: number): Observable<ResearchAxis> {
    return this.http.get<ResearchAxis>(`${this.baseUrl}/retrieve-ResearchAxis/${id}`);
  }

  addResearchAxis(researchAxis: ResearchAxis,id: number): Observable<ResearchAxis> {
    return this.http.post<ResearchAxis>(`${this.baseUrl}/add-ResearchAxis/${id}`, researchAxis);
  }

  removeResearchAxis(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/remove-ResearchAxis/${id}`);
  }

  modifyResearchAxis(researchAxis: ResearchAxis): Observable<ResearchAxis> {
    return this.http.put<ResearchAxis>(`${this.baseUrl}/modify-ResearchAxis`, researchAxis);
  }
}
