import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Fundraiser } from '../api/fundraiser';

@Injectable({
  providedIn: 'root'
})
export class FundraiserService {

  private baseUrl = 'http://localhost:8089/esprobackend/fundraiser';

  constructor(private http: HttpClient) { }

  getAllFundraisers(): Observable<Fundraiser[]> {
    return this.http.get<Fundraiser[]>(`${this.baseUrl}/retrieve-all-fundraisers`);
  }

  getFundraiserById(fundraiserId: number): Observable<Fundraiser> {
    return this.http.get<Fundraiser>(`${this.baseUrl}/retrieve-fundraiser/${fundraiserId}`);
  }

  addFundraiser(fundraiser: Fundraiser): Observable<Fundraiser> {
    return this.http.post<Fundraiser>(`${this.baseUrl}/add-fundraiser`, fundraiser);
  }

  removeFundraiser(fundraiserId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/remove-fundraiser/${fundraiserId}`);
  }

  updateFundraiser(fundraiser: Fundraiser): Observable<Fundraiser> {
    return this.http.put<Fundraiser>(`${this.baseUrl}/update-fundraiser`, fundraiser);
  }
}
