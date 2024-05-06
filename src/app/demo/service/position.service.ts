import { Injectable } from '@angular/core';


import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Position } from '../api/position';

@Injectable({
  providedIn: 'root'
})
export class PositionService {

 
  private baseUrl = 'http://localhost:8089/esprot/pos';

  constructor(private http: HttpClient) { }

  getAllPositions(): Observable<Position[]> {
    return this.http.get<Position[]>(`${this.baseUrl}/retrieve-all-positions`);
  }

  

  getPositionrById(posId: number): Observable<Position> {
    return this.http.get<Position>(`${this.baseUrl}/retrieve-pos/${posId}`);
  }

  addPosition(pos: Position): Observable<Position> {
    return this.http.post<Position>(`${this.baseUrl}/add-pos`, pos);
  }

  removePosition(posId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/remove-pos/${posId}`);
  }

  updatePosition(posId:number,pos: Position): Observable<Position> {
    return this.http.put<Position>(`${this.baseUrl}/updatePos/${posId}`, pos);
  }



  



}
