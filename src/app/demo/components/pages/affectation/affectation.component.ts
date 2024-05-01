import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Affectation } from 'src/app/demo/api/affectation';
import { Calendar } from 'src/app/demo/api/calendar';
import { AffectationService } from 'src/app/demo/service/affectation.service';
import { CalendarService } from 'src/app/demo/service/calendar.service';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ChangeDetectorRef } from '@angular/core';


@Component({
    templateUrl: './affectation.component.html',
    styleUrls: ['./affectation.component.css'],
    providers: [MessageService], // Include the MessageService for notifications
})
export class AffectationComponent implements OnInit {
    @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
    affectationDialog: boolean = false; // For creating/editing affectations
    deleteAffectationDialog: boolean = false; // For confirming delete
    deleteAffectationsDialog: boolean = false; // For deleting multiple affectations
    affectations: Affectation[] = []; // List of affectations
    selectedAffectations: Affectation[] = []; // Selected affectations for deletion
    availableCalendars: Calendar[] = []; // List of available calendars

    cols = [
        { field: 'semester', header: 'Semester' },
        { field: 'calendar.academic_year', header: 'Calendar' }, // Reflecting the new structure
    ];

    affectation: Affectation = {
        id: 0,
        semester: 0,
        calendar: null, // Single Calendar object
    };

    submitted: boolean = false;

    constructor(
        private affectationService: AffectationService,
        private calendarService: CalendarService,
        private messageService: MessageService,
        private changeDetector: ChangeDetectorRef,
    ) {}

    ngOnInit() {
        // Fetch all affectations
        this.affectationService.getAllAffectations().subscribe(
            (data) => {
                this.affectations = data;
                console.log("Fetched affectations:", data);
                this.changeDetector.detectChanges();
            },
            (error) => {
                console.error("Error fetching affectations:", error); // Handle errors
            }
        );

        // Fetch all available calendars
        this.fetchAvailableCalendars();
    }

    fetchAvailableCalendars() {
        this.calendarService.getAllCalendars().subscribe(
            (data) => {
                this.availableCalendars = data;
                console.log("Available calendars:", data);
            },
            (error) => {
                console.error("Error fetching calendars:", error); // Handle errors
            }
        );
    }

    onCalendarChange(event: any) {
        console.log("Calendar selected:", event.value); // Ensure this is not null
        this.affectation.calendar = event.value;
    }
    

    openNew() {
        // Initialize a new affectation for creation
        this.affectation = {
            id: 0,
            semester: 0,
            calendar: null, // Ensure it's a single Calendar object
        };
        this.affectationDialog = true;
    }

    editAffectation(affectation: Affectation) {
        this.affectation = { ...affectation }; // Clone the affectation for editing
        this.affectationDialog = true;
    }

    deleteAffectation(affectation: Affectation) {
        this.affectation = { ...affectation }; // Set the affectation to be deleted
        this.deleteAffectationDialog = true;
    }

    deleteSelectedAffectations() {
        this.deleteAffectationsDialog = true; // Open the confirmation dialog
    }

    confirmDelete() {
        this.deleteAffectationDialog = false; // Close the confirmation dialog
        this.affectationService.removeAffectation(this.affectation.id).subscribe(
            () => {
                this.affectations = this.affectations.filter(
                    (val) => val.id !== this.affectation.id
                ); // Remove the deleted affectation
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Affectation Deleted',
                    life: 3000,
                });
            },
            (error) => {
                console.error("Error deleting affectation:", error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to delete affectation',
                    life: 3000,
                });
            }
        );
    }

    saveAffectation() {
        this.submitted = true;

        if (this.affectation.calendar) {
            console.log("Calendar to be saved:", this.affectation.calendar); // Debugging
        } else {
            console.error("affectation.calendar is null"); // Indicates a problem
        }
        

        if (this.affectation.id === 0) {
            console.log("Affectation to be saved:", this.affectation);
            // Create a new affectation
            this.affectationService.addAffectation(this.affectation).subscribe((newAffectation) => {
                this.affectations.push(newAffectation); // Add the new affectation to the list
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Affectation Added',
                    life: 3000,
                });
            });
        } else {
            // Update an existing affectation
            this.affectationService.updateAffectation(this.affectation).subscribe((updatedAffectation) => {
                const index = this.affectations.findIndex(
                    (m) => m.id === updatedAffectation.id
                );
                if (index !== -1) {
                    this.affectations[index] = updatedAffectation; // Update the list
                }
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Affectation Updated',
                    life: 3000,
                });
            });
        }

        this.affectationDialog = false; // Close the dialog after saving
    }

    hideDialog() {
        this.affectationDialog = false; // Hide the dialog
        this.submitted = false; // Reset the submitted state
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement). value,
            'contains'
        ); // Implement a global filter for the table
    }

    exportToCSV() {
        const headers = ['Affec ID', 'Semester', 'Calen ID', 'Academic Year', 'Start_date', 'End_date', 'Archive']; // Define CSV headers
        const delimiter = ','; // CSV typically uses commas to separate fields
    
        // Create the CSV content from your data (affectations)
        const rows = this.affectations.map(affectation => [
            affectation.id,
            affectation.semester,
            affectation.calendar?.id,
            affectation.calendar?.academic_year || '', // Provide a default value if null
            affectation.calendar?.start_date,
            affectation.calendar?.end_date,
            affectation.calendar?.archive,
        ]);
    
        const csvContent = [headers.join(delimiter), ...rows.map(row => row.join(delimiter))].join('\n'); // Create CSV content
    
        // Create a Blob for the CSV content
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
        // Create a hidden anchor tag to trigger the download
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob); // Create a URL for the Blob
        link.setAttribute('href', url); // Set the download link
        link.setAttribute('download', 'affectations.csv'); // Set the filename
        link.style.visibility = 'hidden'; // Hide the link
        document.body.appendChild(link); // Append the link to the DOM
        link.click(); // Trigger the download
        document.body.removeChild(link); // Clean up
    }

    triggerFileUpload() {
        this.fileInput.nativeElement.click(); // Simulate a click to trigger file upload
    }
    
    importFromCSV(content: string) {
        const rows = content.split('\n'); // Split CSV content into rows
        const headers = rows[0].split(','); // Get CSV headers
    
        // Validate CSV headers
        if (
            headers.length < 7 ||
            headers[0] !== 'Affec ID' ||
            headers[1] !== 'Semester' ||
            headers[2] !== 'Calen ID' ||
            headers[3] !== 'Academic Year' ||
            headers[4] !== 'Start_date' ||
            headers[5] !== 'End_date' ||
            headers[6] !== 'Archive'
        ) {
            throw new Error("Invalid CSV format: incorrect headers or insufficient fields");
        }
    
        // Process CSV data into a list of Affectation objects
        const records = rows.slice(1).map(row => {
            const fields = row.split(','); // Split row into fields
    
            // Check that the row has the expected number of fields
            if (fields.length !== headers.length) {
                throw new Error("CSV row format mismatch");
            }
    
            // Create an Affectation object from the CSV data
            const affectation: Affectation = {
                id: parseInt(fields[0], 10), // Convert to number
                semester: parseInt(fields[1], 10), // Convert to number
                calendar: {
                    id: parseInt(fields[2], 10), // Calendar ID
                    academic_year: fields[3], // Academic Year
                    start_date: fields[4] ? new Date(fields[4]) : null, // Start Date
                    end_date: fields[5] ? new Date(fields[5]) : null, // End Date
                    archive: fields[6] || '', // Archive status
                },
            };
    
            return affectation; // Return the Affectation object
        });
    
        return records; // Return the list of processed Affectation objects
    }

    onFileChange(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files ? input.files[0] : null;
    
        if (file) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                const content = e.target.result as string;
                console.log("CSV Content:", content); // Debugging: Check CSV content
                const records = this.importFromCSV(content);
                console.log("Parsed Records:", records); // Debugging: Check parsed records
                this.importAffectations(records); // Import the parsed records
            };
    
            reader.readAsText(file); // Read the CSV file as text
        } else {
            console.error("No file selected."); // Error handling for no file selected
        }
    }
    
    
    importAffectations(records: Affectation[]) {
        if (records.length === 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Import Warning',
                detail: 'No valid affectations to import.',
                life: 3000,
            });
            return; // Exit early if there's nothing to import
        }
    
        // Loop through each record to add to the system
        records.forEach(record => {
            this.affectationService.addAffectation(record).subscribe(
                () => {
                    this.affectations.push(record); // Add to the list of affectations
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Import Successful',
                        detail: `Affectation with ID ${record.id} imported.`,
                        life: 3000,
                    });
                },
                (error) => {
                    console.error(`Error importing affectation with ID ${record.id}:`, error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Import Failed',
                        detail: `Failed to import affectation with ID ${record.id}.`,
                        life: 3000,
                    });
                }
            );
        });
    }
    
}
