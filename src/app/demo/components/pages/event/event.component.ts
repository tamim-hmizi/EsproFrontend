import { Component, OnInit } from '@angular/core';
import { event } from 'src/app/demo/api/event';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { EventService } from 'src/app/demo/service/event.service';
import { sponsor } from 'src/app/demo/api/sponsor';
import { SponsorService } from 'src/app/demo/service/sponsor.service';
import { MailService } from 'src/app/demo/service/mail.service';
import { SmsService } from 'src/app/demo/service/sms.service';
import { UsersService as userService } from 'src/app/demo/service/users/users.service';
import { format } from 'date-fns';
import { CloudinaryService } from 'src/app/demo/service/cloudinary.service';
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
    selectedBanner: File | null = null;
    selectedAffiche: File | null = null;
    selectedlogo: File | null = null;
    today: Date;
    event: event = {
        id: 0,
        title: '',
        description: '',
        date: new Date(),
        place: '',
        banner: '',
        affiche: '',
        logo: '',
        sponsors: [],
    };
    submitted: boolean = false;
    constructor(
        private sponsorService: SponsorService,
        private EventService: EventService,
        private messageService: MessageService,
        private mailService: MailService,
        private smsService: SmsService,
        private userService: userService,
        private cloudinaryService: CloudinaryService
    ) {
        this.today = new Date();
    }

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
            { field: 'banner', header: 'Banner' },
            { field: 'affiche', header: 'Affiche' },
            { field: 'logo', header: 'Logo' },
            { field: 'sponsors', header: 'Sponsors' },
        ];
    }
    onBannerChange(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.selectedBanner = input.files[0];
        }
    }
    onAfficheChange(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.selectedAffiche = input.files[0];
        }
    }
    onLogoChange(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.selectedlogo = input.files[0];
        }
    }

    openNew() {
        this.event = {
            id: 0,
            title: '',
            description: '',
            date: new Date(),
            place: '',
            banner: '',
            affiche: '',
            logo: '',
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
                    banner: '',
                    affiche: '',
                    logo: '',
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
        // Upload the first image (banner)
        this.cloudinaryService
            .uploadFile(this.selectedBanner)
            .subscribe((bannerUrl) => {
                // Assign the banner URL to the event
                this.event.banner = bannerUrl;

                // Upload the second image (affiche)
                this.cloudinaryService
                    .uploadFile(this.selectedAffiche)
                    .subscribe((afficheUrl) => {
                        // Assign the affiche URL to the event
                        this.event.affiche = afficheUrl;

                        // Upload the third image (logo)
                        this.cloudinaryService
                            .uploadFile(this.selectedlogo)
                            .subscribe((logoUrl) => {
                                // Assign the logo URL to the event
                                this.event.logo = logoUrl;

                                // Decide whether to create or update the event
                                if (this.event.id === 0) {
                                    // Create a new event
                                    this.EventService.addEvent(
                                        this.event
                                    ).subscribe(
                                        (newevent) => {
                                            this.events.push(newevent);

                                            // Success message
                                            this.messageService.add({
                                                severity: 'success',
                                                summary: 'Successful',
                                                detail: 'Event Added',
                                                life: 3000,
                                            });

                                            // Send email and SMS invitations to all users
                                            this.userService
                                                .getUsers()
                                                .subscribe({
                                                    next: (users) => {
                                                        users.forEach(
                                                            (user) => {
                                                                this.mailService
                                                                    .sendEmail(
                                                                        user.email,
                                                                        `Invitation to ${newevent.title}`,
                                                                        `${
                                                                            newevent.description
                                                                        } hosted in ${
                                                                            newevent.place
                                                                        } at ${format(
                                                                            new Date(
                                                                                newevent.date
                                                                            ),
                                                                            'PPP'
                                                                        )}`
                                                                    )
                                                                    .subscribe({
                                                                        error: (
                                                                            error
                                                                        ) =>
                                                                            console.error(
                                                                                'Email failed:',
                                                                                error
                                                                            ),
                                                                    });

                                                                this.smsService
                                                                    .sendSms(
                                                                        `Invitation to ${
                                                                            newevent.title
                                                                        } : ${
                                                                            newevent.description
                                                                        } hosted in ${
                                                                            newevent.place
                                                                        } at ${format(
                                                                            new Date(
                                                                                newevent.date
                                                                            ),
                                                                            'PPP'
                                                                        )}`
                                                                    )
                                                                    .subscribe({
                                                                        error: (
                                                                            error
                                                                        ) =>
                                                                            console.error(
                                                                                'SMS failed:',
                                                                                error
                                                                            ),
                                                                    });
                                                            }
                                                        );
                                                    },
                                                    error: (error) =>
                                                        console.error(
                                                            'Failed to fetch users:',
                                                            error
                                                        ),
                                                });

                                            // Reset the event and dialog
                                            this.eventDialog = false;
                                            this.event = {
                                                id: 0,
                                                title: '',
                                                description: '',
                                                date: new Date(),
                                                place: '',
                                                banner: '',
                                                affiche: '',
                                                logo: '',
                                                sponsors: [],
                                            };
                                            this.sponsorsSelected = [];
                                            this.selectedAffiche = null;
                                            this.selectedBanner = null;
                                            this.selectedlogo = null;
                                        },
                                        (error) => {
                                            console.error(
                                                'Error adding event:',
                                                error
                                            );
                                            this.messageService.add({
                                                severity: 'error',
                                                summary: 'Error',
                                                detail: 'Failed to add event',
                                                life: 3000,
                                            });
                                        }
                                    );
                                } else {
                                    // Update an existing event
                                    this.EventService.updateEvent(
                                        this.event
                                    ).subscribe(
                                        (updatedevent) => {
                                            const index = this.events.findIndex(
                                                (s) => s.id === updatedevent.id
                                            );
                                            if (index !== -1) {
                                                this.events[index] =
                                                    updatedevent;
                                            }

                                            this.messageService.add({
                                                severity: 'success',
                                                summary: 'Successful',
                                                detail: 'Event Updated',
                                                life: 3000,
                                            });

                                            // Reset the event and dialog
                                            this.eventDialog = false;
                                            this.event = {
                                                id: 0,
                                                title: '',
                                                description: '',
                                                date: new Date(),
                                                place: '',
                                                banner: '',
                                                affiche: '',
                                                logo: '',
                                                sponsors: [],
                                            };
                                            this.sponsorsSelected = [];
                                        },
                                        (error) => {
                                            console.error(
                                                'Error updating event:',
                                                error
                                            );
                                            this.messageService.add({
                                                severity: 'error',
                                                summary: 'Error',
                                                detail: 'Failed to update event',
                                                life: 3000,
                                            });
                                        }
                                    );
                                }
                            });
                    });
            });
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
