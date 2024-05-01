import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RDIMember } from '../api/RDIMember';
import { RDI, ResearchAxis } from '../api/RDI';
import { Publication } from '../api/Publication';

@Injectable({
  providedIn: 'root'
})
export class RDIService {

  private baseUrl = 'http://localhost:8089/esprot/RDI';

  constructor(private http: HttpClient) { }

  getAllRDIs(): Observable<RDI[]> {
    return this.http.get<RDI[]>(`${this.baseUrl}/retrieve-all-RDIs`);
  }
  getresearchaxisAll(): Observable<ResearchAxis[]> {
    return this.http.get<ResearchAxis[]>(`${this.baseUrl}/retrieve-all-ResearchAxis`);
  }
  getRDI(id: number): Observable<RDI> {
    return this.http.get<RDI>(`${this.baseUrl}/retrieve-RDI/${id}`);
  }

  addRDI(rdi: RDI): Observable<RDI> {
    return this.http.post<RDI>(`${this.baseUrl}/add-RDI`, rdi);
  }

  updateRDI(rdi: RDI): Observable<RDI> {
    return this.http.put<RDI>(`${this.baseUrl}/modify-RDI`, rdi);
  }

  deleteRDI(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/remove-RDI/${id}`);
  }
  retrieveRDIPublication(id: number): Observable<Publication[]> {
    return this.http.get<Publication[]>(`${this.baseUrl}/retrieve-RDIPublication/${id}`);
  }
  
  retrieveRDIMembers(id: number): Observable<RDIMember[]> {
    return this.http.get<RDIMember[]>(`${this.baseUrl}/retrieve-RDIMembers/${id}`);
  }
  
  retrieveAllRDIMembers(): Observable<RDIMember[]> {
    return this.http.get<RDIMember[]>(`${this.baseUrl}/retrieve-all-RDIMembers`);
  }
  checkThemeExists(theme:string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/check-theme/${theme}`);
  }
}
