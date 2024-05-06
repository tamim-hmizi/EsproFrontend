import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RDIMember } from '../api/RDIMember';
import { User } from '../api/user';
import { RDI } from '../api/RDI';

@Injectable({
  providedIn: 'root'
})
export class RDIMemberService {

  private baseUrl = 'http://localhost:8089/espro/RDIMember';

  constructor(private http: HttpClient) { }

  getAllRDIMembers(): Observable<RDIMember[]> {
    return this.http.get<RDIMember[]>(`${this.baseUrl}/retrieve-all-RDIMembers`);
  }
  getUsersAll(): Observable<User[]> 
  {
    return this.http.get<User[]>(`${this.baseUrl}/retrieve-User-ALL`);
  }

  getRDIMember(id: number): Observable<RDIMember> {
    return this.http.get<RDIMember>(`${this.baseUrl}/retrieve-RDIMember/${id}`);
  }
  
  addRDIMember(rdiMember: RDIMember, rdiId: number): Observable<RDIMember> {
    return this.http.post<RDIMember>(`${this.baseUrl}/add-RDIMember/${rdiId}`, rdiMember);
  }
  
  updateRDIMember(rdiMember: RDIMember): Observable<RDIMember> {
    return this.http.put<RDIMember>(`${this.baseUrl}/modify-RDIMember`, rdiMember);
  }
  getRDIMembersByRdiId(rdiId: number): Observable<RDIMember[]> {
    return this.http.get<RDIMember[]>(`${this.baseUrl}/retreive-rdiMember/${rdiId}`);
  }
  getRDI(rdiId: number): Observable<RDI> {
    return this.http.get<RDI>(`${this.baseUrl}/retreive-rdi/${rdiId}`);
  }
  getresearchaxisAll(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/retrieve-all-User`);
  }
  deleteRDIMember(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/remove-RDIMember/${id}`);
  }
  findRDIMemberByUser(user: User): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/retrieve-User-RDIMember/${user}`);
  }
}
