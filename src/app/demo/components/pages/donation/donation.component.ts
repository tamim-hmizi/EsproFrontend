import { Component, OnInit } from '@angular/core';
import { Donation } from 'src/app/demo/api/donation';
import { DonationService } from 'src/app/demo/service/donation.service';
import { FundraiserService } from 'src/app/demo/service/fundraiser.service';

@Component({
  selector: 'app-donation',
  templateUrl: './donation.component.html',
  styleUrls: ['./donation.component.css']
})
export class DonationComponent implements OnInit {

  donations: Donation[];
  data: any;
  options: any;
  fundraiserNames: string[] = []; // Array to store fundraiser names

  constructor(private donationService: DonationService, private fundraiserService: FundraiserService) { }

  ngOnInit() {
    this.loadDonations();
  }

  loadDonations() {
    this.donationService.getAllDonations().subscribe(
      (donations: Donation[]) => {
        this.donations = donations;
        this.loadFundraiserNames();
      },
      (error) => {
        console.error('Error loading donations:', error);
      }
    );
  }

  loadFundraiserNames() {
    this.fundraiserService.getAllFundraisers().subscribe(
      (fundraisers: any[]) => {
        this.fundraiserNames = fundraisers.map(f => f.name);
        this.prepareChartData();
      },
      (error) => {
        console.error('Error loading fundraiser names:', error);
      }
    );
  }

  prepareChartData() {
    // Get unique payment methods
    const paymentMethods = [...new Set(this.donations.map(d => d.type))];

    // Initialize data for the chart
    this.data = {
      labels: this.fundraiserNames,
      datasets: paymentMethods.map((method, index) => ({
        label: method,
        backgroundColor: this.getBackgroundColor(index),
        data: this.getDonationAmountsByFundraiserAndMethod(method)
      }))
    };

    this.options = {
      maintainAspectRatio: false,
      scales: {
        x: { stacked: true },
        y: {
          stacked: true,
          ticks: {
            maxTicksLimit: 10 // Display a maximum of 10 ticks on the y-axis
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: (context) => {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += '$' + context.parsed.y.toFixed(2); // Adding '$' before the value
              }
              return label;
            }
          }
        }
      }
    };
  }

  // Function to get donation amounts by fundraiser and payment method
  getDonationAmountsByFundraiserAndMethod(paymentMethod: string): number[] {
    return this.fundraiserNames.map(fundraiser =>
      this.donations
        .filter(d => d.fundraiserName === fundraiser && d.type === paymentMethod)
        .reduce((sum, donation) => sum + donation.amount, 0)
    );
  }

  // Function to get background colors
  getBackgroundColor(index: number): string {
    const colors = ['#36A2EB', '#FFCE56', '#FF6384']; // Blue, Yellow, Red
    return colors[index % colors.length]; // Cycle through colors
  }
}
