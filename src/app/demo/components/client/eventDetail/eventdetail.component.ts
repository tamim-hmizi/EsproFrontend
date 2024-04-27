import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from 'src/app/demo/service/event.service';
import { event } from 'src/app/demo/api/event';
import { MessageService } from 'primeng/api';

@Component({
    templateUrl: './eventdetail.component.html',
    selector: 'EventClient',
    styleUrls: ['./eventdetail.component.css'],
    providers: [MessageService],
})
export class EventDetailComponent implements OnInit {
    eventId: number;
    eventDetail: event | null = null;

    hasError: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private eventService: EventService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        // Get the event ID from the route parameters
        this.eventId = +this.route.snapshot.paramMap.get('id');

        // Fetch the event details by ID
        this.eventService.getEventById(this.eventId).subscribe({
            next: (data) => {
                this.eventDetail = data;
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load event details',
                });
                this.hasError = true;
            },
        });
    }
}
