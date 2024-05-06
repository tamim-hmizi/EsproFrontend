import { AccessRoutingModule } from './../../auth/access/access-routing.module';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Calendar } from 'src/app/demo/api/calendar';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { CalendarService } from 'src/app/demo/service/calendar.service';
import { ChangeDetectorRef } from '@angular/core';
import { formatDate } from '@angular/common';

@Component({
    templateUrl: './calendar.component.html',
    providers: [MessageService],
})
export class CalendarComponent implements OnInit {
    academic_year: string;
    minEndDate: Date; // Property to store the minimum end date
    calendarDialog: boolean = false;
    deleteCalendarDialog: boolean = false;
    deleteCalendarsDialog: boolean = false;
    calendars: Calendar[] = [];
    calendar: Calendar = {
        id: 0,
        academic_year: '',
        archive: '',
        start_date: new Date(),
        end_date: new Date(),
    };
    selectedcalendars: Calendar[] = [];
    submitted: boolean = false;
    cols: any[] = [];
    rowsPerPageOptions = [5, 10, 20];
    showCalendarDialog: boolean = false; // Controls visibility of the dialog
    highlightedDates: Date[] = []; // Holds dates to be highlighted

    constructor(
        private CalendarService: CalendarService,
        private messageService: MessageService,
        private cdr: ChangeDetectorRef,
    ) {}

    ngOnInit() {
        this.CalendarService.getAllCalendars().subscribe(
            (data) => {
                this.calendars = data;
                console.log(data);
                });
    
        this.cols = [
            { field: 'academic year', header: 'Acadaemic year' },
            { field: 'archive', header: 'Archive' },
            { field: 'start_date', header: 'Start_date' },
            { field: 'end_date', header: 'End_date' },
        ];
    }

    openCalendarDialog(selectedCalendar: Calendar) {
        const startDate = new Date(selectedCalendar.start_date);
        const endDate = new Date(selectedCalendar.end_date);
      
        this.highlightedDates = this.getHighlightedDates(startDate, endDate);
        
        console.log("Highlighted dates:", this.highlightedDates);
        
        this.showCalendarDialog = true; // Open the dialog
    }

    getHighlightedDates(startDate: Date, endDate: Date): Date[] {
        const dates = [];
        let currentDate = new Date(startDate);
    
        while (currentDate <= endDate) {
            dates.push(new Date(currentDate)); // Ensure correct date objects
            currentDate.setDate(currentDate.getDate() + 1); // Increment day
        }
    
        return dates;
    }
      
    onStartDateChange() {
      // Update the minimum end date when start date changes
      this.minEndDate = this.calendar.start_date;
    }
  
    onEndDateChange() {
      // No need for any logic here as we are only updating the minEndDate property
    }
    openNew() {
        this.calendar = {
            id: 0,
            academic_year: '',
            archive: '',
            start_date: new Date(),
            end_date: new Date(),
        };
        this.calendarDialog = true;
    }

    deleteSelectedcalendars() {
        this.deleteCalendarsDialog = true;
    }

    editcalendar(calendar: Calendar) {
        this.calendar = { ...calendar };
        this.calendarDialog = true;
    }

    deletecalendar(calendar: Calendar) {
        this.calendar = { ...calendar };
        this.deleteCalendarDialog = true;
    }

    confirmDeleteSelected() {
        this.deleteCalendarsDialog = false;
        this.selectedcalendars.forEach((calendar) => {
            this.CalendarService.removeCalendar(calendar.id).subscribe({
                next: () => {
                    this.calendars = this.calendars.filter(
                        (val) => val.id !== calendar.id
                    );
                    this.selectedcalendars = this.selectedcalendars.filter(
                        (val) => val.id !== calendar.id
                    );
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'calendars Deleted',
                        life: 3000,
                    });
                },
                error: (error) => {
                    console.error('Error deleting calendar:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to delete calendar',
                        life: 3000,
                    });
                },
            });
        });
        this.selectedcalendars = [];
    }

    confirmDelete() {
        this.deleteCalendarDialog = false;
        this.CalendarService.removeCalendar(this.calendar.id).subscribe(
            () => {
                this.calendars = this.calendars.filter(
                    (val) => val.id !== this.calendar.id
                );
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'calendar Deleted',
                    life: 3000,
                });
                this.calendar = {
                    id: 0,
                    academic_year: '',
                    archive: '',
                    start_date: new Date(),
                    end_date: new Date(),
                };
            },
            (error) => {
                console.error('Error deleting calendar:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to delete calendar',
                    life: 3000,
                });
            }
        );
    }

    hideDialog() {
        this.calendarDialog = false;
        this.submitted = false;
    }

    savecalendar() {
        this.submitted = true;
        if (this.calendar.id === 0) {
            this.CalendarService.addCalendar(this.calendar).subscribe(
                (newcalendar) => {
                    this.calendars.push(newcalendar);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'calendar Added',
                        life: 3000,
                    });
                }
            );
        } else {
            this.CalendarService.updateCalendar(this.calendar).subscribe(
                (updatedcalendar) => {
                    const index = this.calendars.findIndex(
                        (s) => s.id === updatedcalendar.id
                    );
                    if (index !== -1) {
                        this.calendars[index] = updatedcalendar;
                    }
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'calendar Updated',
                        life: 3000,
                    });
                }
            );
        }
        this.calendarDialog = false;
        this.calendar = {
            id: 0,
            academic_year: '',
            archive: '',
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
    updateEndDateMinDate() {
        this.minEndDate = this.calendar.start_date;
    }
}