import { Component, OnInit } from '@angular/core';
import { event } from 'src/app/demo/api/event';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { EventService } from 'src/app/demo/service/event.service';
import { sponsor } from 'src/app/demo/api/sponsor';
import { SponsorService } from 'src/app/demo/service/sponsor.service';

@Component({
    templateUrl: './event.component.html',
    providers: [MessageService],
})
export class EventComponent implements OnInit {
    eventDialog: boolean = false;
    deleteEventDialog: boolean = false;
    deleteEventsDialog: boolean = false;
    events: event[] = [];
    selectedevents: event[] = [];
    cols: any[] = [];
    rowsPerPageOptions = [5, 10, 20];
    sponsors: sponsor[] = [];
    sponsorsSelected: sponsor[] = [];
    event: event = {
        id: 0,
        title: '',
        description: '',
        date: new Date(),
        place: '',
        sponsors: [],
    };
    submitted: boolean = false;
    constructor(
        private sponsorService: SponsorService,
        private EventService: EventService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.EventService.getAllEvents().subscribe(
            (data) => (this.events = data)
        );

        this.sponsorService
            .getAllSponsors()
            .subscribe((data) => (this.sponsors = data));

        this.cols = [
            { field: 'title', header: 'Title' },
            { field: 'description', header: 'Description' },
            { field: 'date', header: 'Date' },
            { field: 'place', header: 'Place' },
            { field: 'sponsors', header: 'Sponsors' },
        ];
    }

    openNew() {
        this.event = {
            id: 0,
            title: '',
            description: '',
            date: new Date(),
            place: '',
            sponsors: [],
        };
        this.sponsorsSelected = [];
        this.eventDialog = true;
    }

    deleteSelectedevents() {
        this.deleteEventsDialog = true;
    }

    editevent(event: event) {
        this.event = { ...event };
        this.sponsorsSelected = this.event.sponsors;
        this.eventDialog = true;
    }

    deleteevent(event: event) {
        this.event = { ...event };
        this.deleteEventDialog = true;
    }

    confirmDeleteSelected() {
        this.deleteEventsDialog = false;
        this.selectedevents.forEach((event) => {
            this.EventService.removeEvent(event.id).subscribe({
                next: () => {
                    this.events = this.events.filter(
                        (val) => val.id !== event.id
                    );
                    this.selectedevents = this.selectedevents.filter(
                        (val) => val.id !== event.id
                    );
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Event Deleted',
                        life: 3000,
                    });
                },
                error: (error) => {
                    console.error('Error deleting event:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to delete event',
                        life: 3000,
                    });
                },
            });
        });
    }

    confirmDelete() {
        this.deleteEventDialog = false;
        this.EventService.removeEvent(this.event.id).subscribe(
            () => {
                this.events = this.events.filter(
                    (val) => val.id !== this.event.id
                );
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'event Deleted',
                    life: 3000,
                });
                this.event = {
                    id: 0,
                    title: '',
                    description: '',
                    date: new Date(),
                    place: '',
                    sponsors: [],
                };
            },
            (error) => {
                console.error('Error deleting event:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to delete event',
                    life: 3000,
                });
            }
        );
    }

    hideDialog() {
        this.eventDialog = false;
        this.submitted = false;
    }

    saveevent() {
        this.submitted = true;
        this.event.sponsors = this.sponsorsSelected;
        if (this.event.id === 0) {
            this.EventService.addEvent(this.event).subscribe((newevent) => {
                this.events.push(newevent);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'event Added',
                    life: 3000,
                });
            });
        } else {
            this.EventService.updateEvent(this.event).subscribe(
                (updatedevent) => {
                    const index = this.events.findIndex(
                        (s) => s.id === updatedevent.id
                    );
                    if (index !== -1) {
                        this.events[index] = updatedevent;
                    }
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'event Updated',
                        life: 3000,
                    });
                }
            );
        }
        this.eventDialog = false;
        this.event = {
            id: 0,
            title: '',
            description: '',
            date: new Date(),
            place: '',
            sponsors: [],
        };
        this.sponsorsSelected = [];
    }
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }
    isSelectedSponsor(sponsor: any): boolean {
        return this.sponsorsSelected.some(
            (sponsorSelected) => sponsorSelected.id === sponsor.id
        );
    }
    toggleSelectionSponsor(sponsor: any, event: any) {
        if (event) {
            this.sponsorsSelected.push(sponsor);
        } else {
            this.sponsorsSelected = this.sponsorsSelected.filter(
                (s) => s.id !== sponsor.id
            );
        }
    }
}
