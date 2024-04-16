import { Component, OnInit } from '@angular/core';
import { Fundraiser } from 'src/app/demo/api/fundraiser';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { FundraiserService } from 'src/app/demo/service/fundraiser.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  templateUrl: './fundraiser.component.html',
  providers: [MessageService]
})
export class FundraiserComponent implements OnInit {

  fundraiserDialog: boolean = false;
  deleteFundraiserDialog: boolean = false;
  deleteFundraisersDialog: boolean = false;
  fundraisers: Fundraiser[] = [];
  fundraiser: Fundraiser = { id: 0, name: '', description: '' };
  selectedFundraisers: Fundraiser[] = [];
  submitted: boolean = false;
  cols: any[] = [
    { field: 'name', header: 'Name' },
    { field: 'description', header: 'Description' }
  ];
  rowsPerPageOptions = [5, 10, 20];

  fundraiserForm: FormGroup;

  constructor(
    private fundraiserService: FundraiserService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.fundraiserService.getAllFundraisers().subscribe(data => this.fundraisers = data);
    this.fundraiserForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  openNew() {
    this.fundraiser = { id: 0, name: '', description: '' };
    this.submitted = false;
    this.fundraiserDialog = true;
  }

  deleteSelectedFundraisers() {
    this.deleteFundraisersDialog = true;
  }

  editFundraiser(fundraiser: Fundraiser) {
    this.fundraiser = { ...fundraiser };
    this.fundraiserDialog = true;
  }

  deleteFundraiser(fundraiser: Fundraiser) {
    this.deleteFundraiserDialog = true;
    this.fundraiser = { ...fundraiser };
  }

  confirmDeleteSelected() {
    this.deleteFundraisersDialog = false;

    this.selectedFundraisers.forEach(fundraiser => {
      this.fundraiserService.removeFundraiser(fundraiser.id).subscribe(() => {
        this.fundraisers = this.fundraisers.filter(val => val.id !== fundraiser.id);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Fundraiser Deleted', life: 3000 });
      }, error => {
        console.error('Error deleting fundraiser:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete fundraiser', life: 3000 });
      });
    });

    this.selectedFundraisers = [];
  }

  confirmDelete() {
    this.deleteFundraiserDialog = false;
    this.fundraiserService.removeFundraiser(this.fundraiser.id).subscribe(() => {
      this.fundraisers = this.fundraisers.filter(val => val.id !== this.fundraiser.id);
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Fundraiser Deleted', life: 3000 });
      this.fundraiser = { id: 0, name: '', description: '' };
    });
  }

  hideDialog() {
    this.fundraiserDialog = false;
    this.submitted = false;
  }

  saveFundraiser() {
    // Check if both name and description are filled
    if (!this.fundraiser.name || !this.fundraiser.description) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill in both name and description fields', life: 3000 });
        return; // Exit the method early if validation fails
    }

    if (this.fundraiser.id === 0) {
        this.fundraiserService.addFundraiser(this.fundraiser).subscribe(newFundraiser => {
            this.fundraisers.push(newFundraiser);
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Fundraiser Added', life: 3000 });
        });
    } else {
        this.fundraiserService.updateFundraiser(this.fundraiser).subscribe(updatedFundraiser => {
            const index = this.fundraisers.findIndex(f => f.id === updatedFundraiser.id);
            if (index !== -1) {
                this.fundraisers[index] = updatedFundraiser;
            }
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Fundraiser Updated', life: 3000 });
        });
    }
    this.fundraiserDialog = false;
    this.fundraiser = { id: 0, name: '', description: '' };
}



  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
