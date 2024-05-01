import { Component, OnInit } from '@angular/core';
import { vacation } from 'src/app/demo/api/vacation';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { VacationService } from 'src/app/demo/service/vacation.service';

@Component({
    templateUrl: './vacation.component.html',
    providers: [MessageService],
})
export class VacationComponent implements OnInit {
    duration: number;
    minEndDate: Date; // Property to store the minimum end date
    vacationDialog: boolean = false;
    deleteVacationDialog: boolean = false;
    deleteVacationsDialog: boolean = false;
    vacations: vacation[] = [];
    vacation: vacation = {
        id: 0,
        duration: 0,
        type: '',
        start_date: new Date(),
        end_date: new Date(),
    };
    selectedvacations: vacation[] = [];
    submitted: boolean = false;
    cols: any[] = [];
    rowsPerPageOptions = [5, 10, 20];

    constructor(
        private VacationService: VacationService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.VacationService.getAllVacations().subscribe(
            (data) => {
                this.vacations = data;
                console.log(data);
                });
    
        this.cols = [
            { field: 'duration', header: 'Duration' },
            { field: 'type', header: 'Type' },
            { field: 'start_date', header: 'Start_date' },
            { field: 'end_date', header: 'End_date' },
        ];
    }

    

    // ... previous code ...
  
    onStartDateChange() {
      // Update the minimum end date when start date changes
      this.minEndDate = this.vacation.start_date;
    }
  
    onEndDateChange() {
      // No need for any logic here as we are only updating the minEndDate property
    }
    openNew() {
        this.vacation = {
            id: 0,
            duration: 0,
            type: '',
            start_date: new Date(),
            end_date: new Date(),
        };
        this.vacationDialog = true;
    }

    deleteSelectedvacations() {
        this.deleteVacationsDialog = true;
    }

    editvacation(vacation: vacation) {
        this.vacation = { ...vacation };
        this.vacationDialog = true;
    }

    deletevacation(vacation: vacation) {
        this.vacation = { ...vacation };
        this.deleteVacationDialog = true;
    }

    confirmDeleteSelected() {
        this.deleteVacationsDialog = false;
        this.selectedvacations.forEach((vacation) => {
            this.VacationService.removeVacation(vacation.id).subscribe({
                next: () => {
                    this.vacations = this.vacations.filter(
                        (val) => val.id !== vacation.id
                    );
                    this.selectedvacations = this.selectedvacations.filter(
                        (val) => val.id !== vacation.id
                    );
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'vacations Deleted',
                        life: 3000,
                    });
                },
                error: (error) => {
                    console.error('Error deleting vacation:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to delete vacation',
                        life: 3000,
                    });
                },
            });
        });
        this.selectedvacations = [];
    }

    confirmDelete() {
        this.deleteVacationDialog = false;
        this.VacationService.removeVacation(this.vacation.id).subscribe(
            () => {
                this.vacations = this.vacations.filter(
                    (val) => val.id !== this.vacation.id
                );
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'vacation Deleted',
                    life: 3000,
                });
                this.vacation = {
                    id: 0,
                    duration: 0,
                    type: '',
                    start_date: new Date(),
                    end_date: new Date(),
                };
            },
            (error) => {
                console.error('Error deleting vacation:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to delete vacation',
                    life: 3000,
                });
            }
        );
    }

    hideDialog() {
        this.vacationDialog = false;
        this.submitted = false;
    }

    savevacation() {
        this.submitted = true;
         // Check if all required fields are filled
        if (this.vacation.duration === 0 || !this.vacation.type || !this.vacation.start_date || !this.vacation.end_date) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all required fields', life: 3000 });
            return;
  }
        if (this.vacation.id === 0) {
            this.VacationService.addVacation(this.vacation).subscribe(
                (newvacation) => {
                    this.vacations.push(newvacation);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'vacation Added',
                        life: 3000,
                    });
                }
            );
        } else {
            this.VacationService.updateVacation(this.vacation).subscribe(
                (updatedvacation) => {
                    const index = this.vacations.findIndex(
                        (s) => s.id === updatedvacation.id
                    );
                    if (index !== -1) {
                        this.vacations[index] = updatedvacation;
                    }
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'vacation Updated',
                        life: 3000,
                    });
                }
            );
        }
        this.vacationDialog = false;
        this.vacation = {
            id: 0,
            duration: 0,
            type: '',
            start_date: new Date(),
            end_date: new Date(),
        };
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }

 

    calculateDuration() {
  const startDate = new Date(this.vacation.start_date);
  const endDate = new Date(this.vacation.end_date);

  // Check if the start date is greater than or equal to the end date
  if (startDate >= endDate) {
    endDate.setDate(startDate.getDate() + 1);
    this.vacation.end_date = endDate; // Assign the updated endDate directly
  }

  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  this.vacation.duration = diffDays;
}
updateEndDateMinDate() {
    this.minEndDate = this.vacation.start_date;
}
}