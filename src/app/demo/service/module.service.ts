import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Module } from '../api/module'; 

@Injectable({
  providedIn: 'root'
})
export class ModuleService {

  private baseUrl = 'http://localhost:8089/esprobackend/module';

  constructor(private http: HttpClient) { }

  getAllModules(): Observable<Module[]> {
    return this.http.get<Module[]>(`${this.baseUrl}/retrieve-all-modules`);
  }

  getModuleById(moduleId: number): Observable<Module> {
    return this.http.get<Module>(`${this.baseUrl}/retrieve-module/${moduleId}`);
  }

  addModule(module: Module): Observable<Module> {
    return this.http.post<Module>(`${this.baseUrl}/add-modules`, module);
  }

  removeModule(moduleId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/remove-module/${moduleId}`);
  }

  updateModule(module: Module): Observable<Module> {
    return this.http.put<Module>(`${this.baseUrl}/update-module`, module);
  }
}
