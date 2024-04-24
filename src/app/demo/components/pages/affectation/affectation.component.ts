import { Component, OnInit } from '@angular/core';
import { affectation } from 'src/app/demo/api/affectation';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { AffectationService } from 'src/app/demo/service/affectation.service';
import { calendar } from 'src/app/demo/api/calendar';
import { CalendarService } from 'src/app/demo/service/calendar.service';

@Component({
    templateUrl: './affectation.component.html',
    providers: [MessageService],
})
export class AffectationComponent implements OnInit {
    affectationDialog: boolean = false;
    deleteAffectationDialog: boolean = false;
    deleteAffectationsDialog: boolean = false;
    affectations: affectation[] = [];
    selectedaffectations: affectation[] = [];
    cols: any[] = [];
    rowsPerPageOptions = [5, 10, 20];
    calendars: calendar[] = [];
    calendarsSelected: calendar[] = [];
    affectation: affectation = {
        id: 0,
        semester: 0,
        calendars: [],
    };
    submitted: boolean = false;
    constructor(
        private calendarService: CalendarService,
        private AffectationService: AffectationService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.AffectationService.getAllAffectations().subscribe(
            (data) => (this.affectations = data)
        );

        this.calendarService
            .getAllCalendars()
            .subscribe((data) => (this.calendars = data));

        this.cols = [
            { field: 'semester', header: 'Semester' },
            { field: 'calendars', header: 'Calendars' },
        ];
    }

    openNew() {
        this.affectation = {
            id: 0,
            semester: 0,
            calendars: [],
        };
        this.calendarsSelected = [];
        this.affectationDialog = true;
    }

    deleteSelectedaffectations() {
        this.deleteAffectationsDialog = true;
    }

    editaffectation(affectation: affectation) {
        this.affectation = { ...affectation };
        this.calendarsSelected = this.affectation.calendars;
        this.affectationDialog = true;
    }

    deleteaffectation(affectation: affectation) {
        this.affectation = { ...affectation };
        this.deleteAffectationDialog = true;
    }

    confirmDeleteSelected() {
        this.deleteAffectationsDialog = false;
        this.selectedaffectations.forEach((affectation) => {
            this.AffectationService.removeAffectation(affectation.id).subscribe({
                next: () => {
                    this.affectations = this.affectations.filter(
                        (val) => val.id !== affectation.id
                    );
                    this.selectedaffectations = this.selectedaffectations.filter(
                        (val) => val.id !== affectation.id
                    );
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Affectation Deleted',
                        life: 3000,
                    });
                },
                error: (error) => {
                    console.error('Error deleting affectation:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to delete affectation',
                        life: 3000,
                    });
                },
            });
        });
    }

    confirmDelete() {
        this.deleteAffectationDialog = false;
        this.AffectationService.removeAffectation(this.affectation.id).subscribe(
            () => {
                this.affectations = this.affectations.filter(
                    (val) => val.id !== this.affectation.id
                );
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'affectation Deleted',
                    life: 3000,
                });
                this.affectation = {
                    id: 0,
                    semester:0,
                    calendars: [],
                };
            },
            (error) => {
                console.error('Error deleting affectation:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to delete affectation',
                    life: 3000,
                });
            }
        );
    }

    hideDialog() {
        this.affectationDialog = false;
        this.submitted = false;
    }

    saveaffectation() {
        this.submitted = true;
        this.affectation.calendars = this.calendarsSelected;
        if (this.affectation.id === 0) {
            this.AffectationService.addAffectation(this.affectation).subscribe((newaffectation) => {
                this.affectations.push(newaffectation);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'affectation Added',
                    life: 3000,
                });
            });
        } else {
            this.AffectationService.updateAffectation(this.affectation).subscribe(
                (updatedaffectation) => {
                    const index = this.affectations.findIndex(
                        (s) => s.id === updatedaffectation.id
                    );
                    if (index !== -1) {
                        this.affectations[index] = updatedaffectation;
                    }
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'affectation Updated',
                        life: 3000,
                    });
                }
            );
        }
        this.affectationDialog = false;
        this.affectation = {
            id: 0,
            semester:0,
            calendars: [],
        };
        this.calendarsSelected = [];
    }
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }
    isSelectedCalendar(calendar: any): boolean {
        return this.calendarsSelected.some(
            (calendarSelected) => calendarSelected.id === calendar.id
        );
    }
    toggleSelectionCalendar(calendar: any, affectation: any) {
        if (affectation) {
            this.calendarsSelected.push(calendar);
        } else {
            this.calendarsSelected = this.calendarsSelected.filter(
                (s) => s.id !== calendar.id
            );
        }
    }
}
