import { Component, OnInit } from '@angular/core';
import { sponsor } from 'src/app/demo/api/sponsor';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { SponsorService } from 'src/app/demo/service/sponsor.service';
import { CloudinaryService } from 'src/app/demo/service/cloudinary.service';
@Component({
    templateUrl: './sponsor.component.html',
    styleUrl: './sponsor.component.css',
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
        image: '',
    };
    selectedsponsors: sponsor[] = [];
    submitted: boolean = false;
    cols: any[] = [];
    rowsPerPageOptions = [5, 10, 20];
    selectedFile: File | null = null;
    
    constructor(
        private SponsorService: SponsorService,
        private messageService: MessageService,
        private cloudinaryService: CloudinaryService
    ) {}

    ngOnInit() {
        this.SponsorService.getAllSponsors().subscribe(
            (data) => (this.sponsors = data)
        );

        this.cols = [
            { field: 'name', header: 'Name' },
            { field: 'description', header: 'Description' },
            { field: 'image', header: 'Image' },
        ];
    }

    onFileChange(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.selectedFile = input.files[0];
        }
    }

    openNew() {
        this.sponsor = {
            id: 0,
            name: '',
            description: '',
            image: '',
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
                    image: '',
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
        this.cloudinaryService
            .uploadFile(this.selectedFile)
            .subscribe((response: any) => {
                this.sponsor.image = response;

                this.submitted = true;

                if (this.sponsor.id === 0) {
                    this.SponsorService.addSponsor(this.sponsor).subscribe(
                        (newsponsor) => {
                            this.sponsors.push(newsponsor);
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Successful',
                                detail: 'Sponsor Added',
                                life: 3000,
                            });
                        },
                        (error) => {
                            console.error('Error adding sponsor:', error);
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Failed to add sponsor',
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
                                detail: 'Sponsor Updated',
                                life: 3000,
                            });
                        },
                        (error) => {
                            console.error('Error updating sponsor:', error);
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Failed to update sponsor',
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
                    image: '',
                };
                this.selectedFile = null;
            });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }
}
