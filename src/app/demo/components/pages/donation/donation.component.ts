import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Donation } from 'src/app/demo/api/donation';
import { DonationService } from 'src/app/demo/service/donation.service';

@Component({
  selector: 'app-donation',
  templateUrl: './donation.component.html',
  styleUrls: ['./donation.component.css']
})
export class DonationComponent implements OnInit {

  donations: Donation[];
  displayDialog: boolean;
  cols: any[]; // Define cols array

  donationForm: FormGroup; // Define form group for donation form
  submitted: boolean = false;

  constructor(private donationService: DonationService, private messageService: MessageService, private fb: FormBuilder) {
    this.donations = [];
    this.displayDialog = false;
    // Initialize cols array
    this.cols = [
      { field: 'type', header: 'Type' },
      { field: 'amount', header: 'Amount' },
      { field: 'status', header: 'Status' },
      { field: 'user', header: 'User' }
    ];
  }

  ngOnInit() {
    this.loadDonations();
    // Initialize donation form
    this.donationForm = this.fb.group({
      type: ['', Validators.required],
      amount: ['', Validators.required],
      status: ['', Validators.required],
      // Add more form controls as needed
    });
  }

  loadDonations() {
    this.donationService.getAllDonations().subscribe(
      (donations: Donation[]) => {
        this.donations = donations;
      },
      (error) => {
        console.error('Error loading donations:', error);
      }
    );
  }

  showDialog() {
    this.displayDialog = true;
  }

  hideDialog() {
    this.displayDialog = false;
    this.submitted = false; // Reset submitted flag
    this.donationForm.reset(); // Reset form
  }

  onSubmit() {
    this.submitted = true;
    if (this.donationForm.invalid) {
      return;
    }
    // Add code to submit the donation form and handle the response
  }
}
