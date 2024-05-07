import { Component, OnInit } from '@angular/core';
import { ResearchAxis } from 'src/app/demo/api/ResearchAxis';
import { ResearchAxisService } from 'src/app/demo/service/ResearchAxis.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './ResearchAxis.component.html',
  styleUrls: ['./ResearchAxis.component.css'],
  providers: [MessageService]
})
export class ResearchAxisComponent implements OnInit {
  researchAxes: ResearchAxis[] = [];
  selectedResearchAxis: ResearchAxis[] = [];
  cols: any[];
  displayDialog: boolean = false;
  isNewResearchAxis: boolean = false;
  deleteResearchAxisDialog: boolean = false;
  deleteResearchAxissDialog: boolean = false;
  editedResearchAxis: ResearchAxis = {
    id: 0,
    descriptionRA: '',
    subjectRA: ''
  };
  rdiId: number ;

  constructor(
    private researchAxisService: ResearchAxisService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
   

    this.route.params.subscribe(params => {
      this.cols = [
        { field: 'descriptionRA', header: 'descriptionRA' },
        { field: 'subjectRA', header: 'subjectRA' },
      ];   
 this.rdiId = +params['rdiId']; // Convert parameter to number if it's not already
  if (isNaN(this.rdiId)) {
      // No RDI ID parameter, fetch all publications

      this.loadResearchAxes();
         } else {
      // RDI ID parameter present, fetch publications associated with the RDI ID
      this.loadresearchAxisByRdiId(this.rdiId);
  }
});
  }
  loadresearchAxisByRdiId(rdiId: number) {
    // Call your publication service method to fetch publications associated with the RDI ID
    // Example:
     this.researchAxisService.getresearchAxisByRdiId(rdiId).subscribe(researchAxess => {
      this.researchAxes = researchAxess;
      // Fetch chercheurs for each publication
    },
    (error) => {
      console.error('Error fetching research axes:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to fetch research axes',
        life: 3000
      });});
}
  loadResearchAxes(): void {
    this.researchAxisService.getAllResearchAxes().subscribe(
      (researchAxes: ResearchAxis[]) => {
        this.researchAxes = researchAxes;
      },
      (error) => {
        console.error('Error fetching research axes:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch research axes',
          life: 3000
        });
      }
    );
  }

  showDialogToAdd(): void {
    this.isNewResearchAxis = true;
    this.editedResearchAxis = {
      id: 0,
      descriptionRA: '',
      subjectRA: ''
    };
    this.displayDialog = true;
  }

  showDialogToEdit(researchAxis: ResearchAxis): void {
    this.isNewResearchAxis = false;
    this.editedResearchAxis = { ...researchAxis };
    this.displayDialog = true;
  }
  deletePublication(researchAxis: ResearchAxis) {
    this.editedResearchAxis = { ...researchAxis };
    this.deleteResearchAxisDialog = true;
  }

  confirmDeleteResearchAxis() {
    this.deleteResearchAxisDialog = false;
    this.researchAxisService.removeResearchAxis(this.editedResearchAxis.id).subscribe(() => {
      this.loadresearchAxisByRdiId(this.rdiId);
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Publication Deleted', life: 3000 });
    }, error => {
      console.error('Error deleting publication:', error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete researchAxis', life: 3000 });
    });
  }
 
  confirmDeleteSelectedResearchAxis() {
    this.deleteResearchAxisDialog = false;
    const selectedIds = this.selectedResearchAxis.map(researchAxis => researchAxis.id);
    selectedIds.forEach(id => {
      this.researchAxisService.removeResearchAxis(id).subscribe(() => {
        this.loadresearchAxisByRdiId(this.rdiId);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Publication Deleted', life: 3000 });
      }, error => {
        console.error('Error deleting publication:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete publication', life: 3000 });
      });
    });
    this.selectedResearchAxis = [];
  }

  saveResearchAxis(): void {
    if (!this.editedResearchAxis.descriptionRA || !this.editedResearchAxis.subjectRA) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill in both subject and description fields',
        life: 3000,
      });
      return; // If required fields are empty, exit early
    }

    const isDuplicate = this.researchAxes.some(
      (ra) => ra.subjectRA === this.editedResearchAxis.subjectRA && ra.id !== this.editedResearchAxis.id
    );

    if (isDuplicate) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'The subject must be unique',
        life: 3000,
      });
      return; // If there's a duplicate theme, exit early
    }

    if (this.isNewResearchAxis) {
      this.researchAxisService.addResearchAxis(this.editedResearchAxis,this.rdiId).subscribe(
        () => {
          this.loadresearchAxisByRdiId(this.rdiId); // Reload all research axes after adding a new one
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Research Axis Added',
            life: 3000,
          });
          this.displayDialog = false;
        },
        (error) => {
          console.error('Error adding research axis:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to add research axis',
            life: 3000,
          });
        }
      );
    } else {
      this.researchAxisService.modifyResearchAxis(this.editedResearchAxis).subscribe(
        () => {
          this.loadresearchAxisByRdiId(this.rdiId); // Reload all research axes after editing
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Research Axis Updated',
            life: 3000,
          });
          this.displayDialog = false;
        },
        (error) => {
          console.error('Error updating research axis:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update research axis',
            life: 3000,
          });
        }
      );
    }
  }

  deleteResearchAxis(researchAxis: ResearchAxis): void {
    this.researchAxisService.removeResearchAxis(researchAxis.id).subscribe(
      () => {
        this.loadresearchAxisByRdiId(researchAxis.id);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Research Axis Deleted',
          life: 3000
        });
      },
      (error) => {
        console.error('Error deleting research axis:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete research axis',
          life: 3000
        });
      }
    );
  }
  deleteSelectedResearchAxiss() {
    this.deleteResearchAxissDialog = true;
  }

  hideDeleteDialog() {
    this.deleteResearchAxisDialog = false;
  }

  hideDeleteResearchAxissDialog() {
    this.deleteResearchAxissDialog = false;
  }
  cancel(): void {
    this.displayDialog = false;
  }
}
