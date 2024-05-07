import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Publication } from '../api/Publication'; 
import { User } from '../api/user';
import { RDIMember } from '../api/RDIMember';
import { RDI } from '../api/RDI';
import {  HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PublicationService {

  private baseUrl = 'http://localhost:8089/esprobackend/Publication';

  constructor(private http: HttpClient) { }

  getAllPublications(): Observable<Publication[]> {

    return this.http.get<Publication[]>(`${this.baseUrl}/retrieve-all-Publications`);
  }

  getPublication(id: number): Observable<Publication> {
    return this.http.get<Publication>(`${this.baseUrl}/retrieve-Publication/${id}`);
  }
  
  getChercheursbyRdi(rdiId: number): Observable<RDIMember[]> {
    return this.http.get<RDIMember[]>(`${this.baseUrl}/rdichercheur/${rdiId}`);
  }
  addPublication(publication: Publication): Observable<Publication> {
    return this.http.post<Publication>(`${this.baseUrl}/add-Publication`, publication);
  }
  getPublicationsByRdiId(rdiId: number): Observable<Publication[]> {
    return this.http.get<Publication[]>(`${this.baseUrl}/rdi/${rdiId}`);
  }
  getPublicationsByRdiMemberId(rdiMemberid: number): Observable<Publication[]> {
    return this.http.get<Publication[]>(`${this.baseUrl}/rdimember/${rdiMemberid}`);
  }
  updatePublication(publication: Publication): Observable<Publication> {
    return this.http.put<Publication>(`${this.baseUrl}/modify-Publication`, publication);
  }

  deletePublication(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/remove-Publication/${id}`);
  }
  getChercheurs(id: number): Observable<RDIMember[]> 
  {

    return this.http.get<RDIMember[]>(`${this.baseUrl}/retrieve-Publication-Chercheurs/${id}`);
  }
  getChercheursAll(): Observable<RDIMember[]> 
  {

    return this.http.get<RDIMember[]>(`${this.baseUrl}/retrieve-Publication-Chercheurs-ALL`);
  }
  getTopRDIMembers(): Observable<any> 
  {

    return this.http.get(`${this.baseUrl}/top-rdi-members`);
  }
  
  // Method to fetch activity data based on RDI ID and duration
  getActivityData(rdiId: number, duration: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/activity`, {
      params: {
        rdiId: rdiId.toString(),
        duration: duration,
      },
    });
  }
}
