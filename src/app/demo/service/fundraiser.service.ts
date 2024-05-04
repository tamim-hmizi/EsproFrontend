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

  addFundraiser(name: string, description: string, moneytocollect: number, photoFile?: File): Observable<Fundraiser> {
    const formData: FormData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('moneytocollect', moneytocollect.toString());
    if (photoFile) {
      formData.append('photoFile', photoFile); // Correctly append the photo file
    }
    return this.http.post<Fundraiser>(`${this.baseUrl}/add-fundraiser`, formData);
  }
  
  
  

  removeFundraiser(fundraiserId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/remove-fundraiser/${fundraiserId}`);
  }

  updateFundraiser(id: number, name: string, description: string,moneytocollect: number, photoFile?: File): Observable<Fundraiser> {
    const formData: FormData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('moneytocollect', moneytocollect.toString());
    
    if (photoFile) {
      formData.append('photoFile', photoFile);
    }
  
    // Include the ID in the URL
    return this.http.put<Fundraiser>(`${this.baseUrl}/update-fundraiser/${id}`, formData);
  }
  
  
  getTotalDonations(fundraiserId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/${fundraiserId}/totalDonation`);
  }
}