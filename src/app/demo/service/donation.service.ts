import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Donation } from '../api/donation'; 

@Injectable({
  providedIn: 'root'
})
export class DonationService {

  private baseUrl = 'http://localhost:8089/esprobackend/donation';

  constructor(private http: HttpClient) { }

  getAllDonations(): Observable<Donation[]> {
    return this.http.get<Donation[]>(`${this.baseUrl}/retrieve-all-donations`);
  }

  getDonationById(DonationId: number): Observable<Donation> {
    return this.http.get<Donation>(`${this.baseUrl}/retrieve-donation/${DonationId}`);
  }




}
