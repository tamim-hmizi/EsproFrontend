import { Component, OnInit } from '@angular/core';
import { event } from 'src/app/demo/api/event';
import { EventService } from 'src/app/demo/service/event.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { eventscraps as es } from 'src/app/demo/api/eventscraps';
import { eventscraps } from 'src/app/demo/service/eventscraps.service';
@Component({
    templateUrl: './eventclient.component.html',
    selector: 'EventClient',
    styleUrls: ['./eventclient.component.css'],
    providers: [MessageService],
})
export class EventClientComponent implements OnInit {
    events: event[] = [];
    scrapedEvents: es[] = [];
    searchForm: FormGroup;
    isDateAsc: boolean = true;
    isDisplayingScraped: boolean = false;
    constructor(
        private eventService: EventService,
        private formBuilder: FormBuilder,
        private eventscrapsservice: eventscraps
    ) {}

    ngOnInit(): void {
        this.searchForm = this.formBuilder.group({
            searchTerm: ['', Validators.required],
        });
        this.getAllEvents(); // Load all events initially
        this.getAllScrapedEvents();
    }
    getAllScrapedEvents(): void {
        this.eventscrapsservice.getEventScraps().subscribe((data) => {
            this.scrapedEvents = data;
        });
    }
    toggleEventDisplay(): void {
        this.isDisplayingScraped = !this.isDisplayingScraped;
    }

    getAllEvents(): void {
        this.eventService.getAllEvents().subscribe((data) => {
            this.events = data;
        });
    }

    searchEvents(): void {
        const searchTerm = this.searchForm.get('searchTerm')?.value;
        if (searchTerm) {
            this.eventService.searchByTitle(searchTerm).subscribe((data) => {
                this.events = data;
            });
        } else {
            this.eventService
                .getAllEvents()
                .subscribe((data) => (this.events = data));
        }
    }

    sortEventsByDate(): void {
        if (this.isDateAsc) {
            this.eventService.getEventsByDateAsc().subscribe((data) => {
                this.events = data;
                this.isDateAsc = !this.isDateAsc; // Toggle for next sort
            });
        } else {
            this.eventService.getEventsByDateDesc().subscribe((data) => {
                this.events = data;
                this.isDateAsc = !this.isDateAsc; // Toggle for next sort
            });
        }
    }
}
