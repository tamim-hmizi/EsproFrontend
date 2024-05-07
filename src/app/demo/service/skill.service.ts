import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Skill } from '../api/skill';

@Injectable({
  providedIn: 'root'
})
export class SkillService {

  private baseUrl = 'http://localhost:8089/esprobackend/skill';

  constructor(private http: HttpClient) { }

  getAllSkills(): Observable<Skill[]> {
    return this.http.get<Skill[]>(`${this.baseUrl}/retrieve-all-skills`);
  }

  getSkillById(skillId: number): Observable<Skill> {
    return this.http.get<Skill>(`${this.baseUrl}/retrieve-skill/${skillId}`);
  }

  addSkill(skill: Skill): Observable<Skill> {
    return this.http.post<Skill>(`${this.baseUrl}/add-skill`, skill);
  }

  removeSkill(skillId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/remove-skill/${skillId}`);
  }

  updateSkill(skill: Skill): Observable<Skill> {
    return this.http.put<Skill>(`${this.baseUrl}/update-skill`, skill);
  }
}
