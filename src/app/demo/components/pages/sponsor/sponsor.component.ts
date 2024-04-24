import { Component, OnInit } from '@angular/core';
import { sponsor } from 'src/app/demo/api/sponsor';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { SponsorService } from 'src/app/demo/service/sponsor.service';

@Component({
    templateUrl: './sponsor.component.html',
    providers: [MessageService],
})
export class SponsorComponent implements OnInit {
    sponsorDialog: boolean = false;
    deleteSponsorDialog: boolean = false;
    deleteSponsorsDialog: boolean = false;
    sponsors: sponsor[] = [];
    sponsor: sponsor = {
        id: 0,
        name: '',
        description: '',
    };
    selectedsponsors: sponsor[] = [];
    submitted: boolean = false;
    cols: any[] = [];
    rowsPerPageOptions = [5, 10, 20];

    constructor(
        private SponsorService: SponsorService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.SponsorService.getAllSponsors().subscribe(
            (data) => (this.sponsors = data)
        );

        this.cols = [
            { field: 'name', header: 'Name' },
            { field: 'description', header: 'Description' },
        ];
    }

    openNew() {
        this.sponsor = {
            id: 0,
            name: '',
            description: '',
        };
        this.sponsorDialog = true;
    }

    deleteSelectedsponsors() {
        this.deleteSponsorsDialog = true;
    }

    editsponsor(sponsor: sponsor) {
        this.sponsor = { ...sponsor };
        this.sponsorDialog = true;
    }

    deletesponsor(sponsor: sponsor) {
        this.sponsor = { ...sponsor };
        this.deleteSponsorDialog = true;
    }

    confirmDeleteSelected() {
        this.deleteSponsorsDialog = false;
        this.selectedsponsors.forEach((sponsor) => {
            this.SponsorService.removeSponsor(sponsor.id).subscribe({
                next: () => {
                    this.sponsors = this.sponsors.filter(
                        (val) => val.id !== sponsor.id
                    );
                    this.selectedsponsors = this.selectedsponsors.filter(
                        (val) => val.id !== sponsor.id
                    );
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'sponsors Deleted',
                        life: 3000,
                    });
                },
                error: (error) => {
                    console.error('Error deleting sponsor:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to delete sponsor',
                        life: 3000,
                    });
                },
            });
        });
        this.selectedsponsors = [];
    }

    confirmDelete() {
        this.deleteSponsorDialog = false;
        this.SponsorService.removeSponsor(this.sponsor.id).subscribe(
            () => {
                this.sponsors = this.sponsors.filter(
                    (val) => val.id !== this.sponsor.id
                );
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'sponsor Deleted',
                    life: 3000,
                });
                this.sponsor = {
                    id: 0,
                    name: '',
                    description: '',
                };
            },
            (error) => {
                console.error('Error deleting sponsor:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to delete sponsor',
                    life: 3000,
                });
            }
        );
    }

    hideDialog() {
        this.sponsorDialog = false;
        this.submitted = false;
    }

    savesponsor() {
        this.submitted = true;
        if (this.sponsor.id === 0) {
            this.SponsorService.addSponsor(this.sponsor).subscribe(
                (newsponsor) => {
                    this.sponsors.push(newsponsor);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'sponsor Added',
                        life: 3000,
                    });
                }
            );
        } else {
            this.SponsorService.updateSponsor(this.sponsor).subscribe(
                (updatedsponsor) => {
                    const index = this.sponsors.findIndex(
                        (s) => s.id === updatedsponsor.id
                    );
                    if (index !== -1) {
                        this.sponsors[index] = updatedsponsor;
                    }
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'sponsor Updated',
                        life: 3000,
                    });
                }
            );
        }
        this.sponsorDialog = false;
        this.sponsor = {
            id: 0,
            name: '',
            description: '',
        };
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }
}
