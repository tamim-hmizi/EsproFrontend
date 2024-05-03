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
  fundraiser: Fundraiser = { id: 0, name: '', description: '', displayPicture: '' };
  selectedFundraisers: Fundraiser[] = [];
  submitted: boolean = false;
  cols: any[] = [
    { field: 'name', header: 'Name' },
    { field: 'description', header: 'Description' },
    { field: 'displayPicture', header: 'Photo' }
  ];
  rowsPerPageOptions = [5, 10, 20];

  fundraiserForm: FormGroup;
  selectedFile: File | undefined; // Define selectedFile property

  constructor(
    private fundraiserService: FundraiserService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.fundraiserService.getAllFundraisers().subscribe(data => {
      this.fundraisers = data;
      this.fundraisers.forEach(fundraiser => {
        // No need for conversion, assuming displayPicture is a base64-encoded string
        fundraiser.displayPicture = 'data:image/png;base64,' + fundraiser.displayPicture;
      });
    }, error => {
      console.error("Error fetching fundraisers:", error);
    });

    this.fundraiserForm = this.fb.group({
      name: ['', Validators.required], // Add validators if needed
      description: ['', Validators.required], // Add validators if needed
      photo: [null, Validators.required] // Initialize the photo FormControl
    });
  }
  
  blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error("Failed to read blob as base64"));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
  


  openNew() {
    this.fundraiser = { id: 0, name: '', description: '', displayPicture: '' };
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
      this.fundraiser = { id: 0, name: '', description: '', displayPicture: '' };
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
  
    // Check if a photo is selected
    if (!this.selectedFile) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select a photo', life: 3000 });
      return; // Exit the method if no photo is selected
    }
  
    // Call the service method to add or update the fundraiser
    if (this.fundraiser.id === 0) {
      // Adding a new fundraiser
      this.fundraiserService.addFundraiser(this.fundraiser.name, this.fundraiser.description, this.selectedFile).subscribe(newFundraiser => {
        // Convert the blob to base64
        this.blobToBase64(this.selectedFile).then(base64String => {
          // Update the displayPicture property of the newly added fundraiser
          newFundraiser.displayPicture = base64String;
          // Add the new fundraiser to the list
          this.fundraisers.push(newFundraiser);
          // Display success message
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Fundraiser Added', life: 3000 });
          // Reset form and close dialog
          this.fundraiserDialog = false;
          this.fundraiserForm.reset();
        }).catch(error => {
          console.error('Error converting blob to base64:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add fundraiser', life: 3000 });
        });
      }, error => {
        console.error('Error adding fundraiser:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add fundraiser', life: 3000 });
      });
    } else {
      // Updating an existing fundraiser
      this.fundraiserService.updateFundraiser(this.fundraiser.id, this.fundraiser.name, this.fundraiser.description, this.selectedFile).subscribe(updatedFundraiser => {
        // Convert the blob to base64
        this.blobToBase64(this.selectedFile).then(base64String => {
          // Update the displayPicture property of the updated fundraiser
          updatedFundraiser.displayPicture = base64String;
          // Find the index of the updated fundraiser in the list
          const index = this.fundraisers.findIndex(f => f.id === updatedFundraiser.id);
          if (index !== -1) {
            // Replace the existing fundraiser with the updated one
            this.fundraisers[index] = updatedFundraiser;
          }
          // Display success message
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Fundraiser Updated', life: 3000 });
          // Reset form and close dialog
          this.fundraiserDialog = false;
          this.fundraiserForm.reset();
        }).catch(error => {
          console.error('Error converting blob to base64:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update fundraiser', life: 3000 });
        });
      }, error => {
        console.error('Error updating fundraiser:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update fundraiser', life: 3000 });
      });
    }
  }
  

  

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }


  onFileChange(event: any) {
    if (event.target.files && event.target.files.length) {
        const file = event.target.files[0];
        this.selectedFile = file; // Assign the selected file to selectedFile property

        // Convert the selected file to base64 and assign it to the displayPicture property
        this.blobToBase64(file).then(base64String => {
            this.fundraiser.displayPicture = base64String;
        }).catch(error => {
            console.error('Error converting blob to base64:', error);
        });
    }
}



}
