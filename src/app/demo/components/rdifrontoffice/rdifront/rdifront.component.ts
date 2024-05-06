import { Component, OnInit } from '@angular/core';
import { RDIService } from 'src/app/demo/service/RDI.service';
import { PublicationService } from 'src/app/demo/service/Publication.service';
import { RDI } from 'src/app/demo/api/RDI';
import { DataView } from 'primeng/dataview';
import { SelectItem } from 'primeng/api';
import { RDIMember } from 'src/app/demo/api/RDIMember';
import { Router } from '@angular/router'; // To handle navigation

@Component({
  templateUrl: './rdifront.component.html',
  styleUrls: ['./rdifront.component.css']

})
export class RdiFrontComponent implements OnInit {
  RDIs: RDI[] = []; // All RDIs
  myrdi:RDI
  userrdi:RDIMember
  rdiActivityData = new Map<number, number>(); // Store activity data for RDIs
  similarRDIs: RDI[] = [];
   myid =parseInt(localStorage.getItem('idU'));
rating :number;
sortOptions: SelectItem[] = [];

sortOrder: number = 0;

sortField: string = '';
  constructor(
    private rdiService: RDIService,
    private publicationService: PublicationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAllRDIs(); // Fetch all RDIs
    if (this.myid) {
      // Fetch the RDI data for the current user
      this.rdiService.findRDIMemberByUser(this.myid).subscribe(
        (rdi) => {
          this.userrdi=rdi;
          this.myrdi = rdi.rdi; // Store the RDI data
        },
        (error) => {
          console.error('Error fetching RDI data:', error);
        }
      );
    }
    this.sortOptions = [
      { label: 'ALL', value: '!price' },
      { label: 'My Interest', value: 'price' }
  ];
  }
  navigateToDetails(rdiId: number) {
    this.router.navigate(['/details', rdiId]); // Navigate to RDI details with the given ID
  }
  loadAllRDIs(): void {
    this.rdiService.getAllRDIs().subscribe(
      (rdis) => {
        this.RDIs = rdis; // Store all RDIs
        this.fetchRDIActivity(); // Fetch activity for all RDIs
      },
      (error) => {
        console.error('Error fetching RDIs:', error);
      }
    );
  }

  
  loadSimilarRDIs(): void {
    this.rdiService.getMostSimilarRDIs(1).subscribe(
      (rdis) => {
        this.RDIs = rdis; // Store the similar RDIs
      },
      (error) => {
        console.error('Error loading similar RDIs:', error);
      }
    );
  }
  fetchRDIActivity(): void {
    this.RDIs.forEach((rdi) => {
      this.publicationService.getActivityData(rdi.id, '12 mois').subscribe(
        (data) => {
          const totalActivity = data.data.reduce((acc, val) => acc + val, 0); // Sum all elements
          this.rdiActivityData.set(rdi.id, this.calculateRating(totalActivity)); // Calculate rating based on total activity

        },
        (error) => {
          console.error(`Error fetching activity data for RDI ${rdi.id}:`, error);
        }
      );
    });
  }

  calculateRating(totalActivity: number): number {
    if (totalActivity <= 10) {
      return 1;
    } else if (totalActivity <= 20) {
      return 2;
    } else if (totalActivity <= 30) {
      return 3;
    } else if (totalActivity <= 40) {
      return 4;
    } else {
      return 5;
    }
  }
  onSortChange(event: any) {
    const value = event.value;

    if (value.indexOf('!') === 0) {
        this.sortOrder = -1;
        this.sortField = value.substring(1, value.length);
        this.loadAllRDIs();
    } else {
        this.sortOrder = 1;
        this.sortField = value;
        this.loadSimilarRDIs();
    }
}
  onFilter(dv: DataView, event: Event) {
    dv.filter((event.target as HTMLInputElement).value);
}
}
