import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Affectation } from 'src/app/demo/api/affectation';
import { Calendar } from 'src/app/demo/api/calendar';
import { Module } from 'src/app/demo/api/module';
import { Classroom } from 'src/app/demo/api/classroom';
import { User } from 'src/app/demo/api/user';
import { ClassroomService } from 'src/app/demo/service/classroom.service';
import { UserService } from 'src/app/demo/service/user.service';
import { AffectationService } from 'src/app/demo/service/affectation.service';
import { CalendarService } from 'src/app/demo/service/calendar.service';
import { ModuleService } from 'src/app/demo/service/module.service';
import { MessageService } from 'primeng/api';
import { ChangeDetectorRef } from '@angular/core';
import { Table } from 'primeng/table';
import { forkJoin } from 'rxjs';

@Component({
  templateUrl: './affectation.component.html',
  styleUrls: ['./affectation.component.css'],
  providers: [MessageService],
})
export class AffectationComponent implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  affectationDialog: boolean = false;
  deleteAffectationDialog: boolean = false;
  deleteAffectationsDialog: boolean = false;

  affectations: Affectation[] = [];
  selectedAffectations: Affectation[] = [];
  availableCalendars: Calendar[] = [];
  availableModules: Module[] = [];
  availableClassrooms: Classroom[] = [];
  availableUsers: User[] = [];

  cols = [
    { field: 'semester', header: 'Semester' },
    { field: 'calendar.academic_year', header: 'Calendar' },
    { field: 'module.name', header: 'Module' },
    { field: 'user.firstname', header: 'User' },
    { field: 'classroom.name', header: 'Classroom' },
  ];

  affectation: Affectation = {
    id: 0,
    semester: 0,
    calendar: null,
    module: null,
    user: null,
    classroom: null,
  };

  submitted: boolean = false;

  constructor(
    private affectationService: AffectationService,
    private calendarService: CalendarService,
    private moduleService: ModuleService,
    private messageService: MessageService,
    private changeDetector: ChangeDetectorRef,
    private classroomService: ClassroomService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.fetchAffectations(); // Fetch all affectations on initialization
    this.fetchAvailableCalendars(); // Fetch all available calendars
    this.fetchAvailableModules(); // Fetch all available modules
    this.fetchAvailableClassrooms(); // Fetch all available classrooms
    this.fetchAvailableUsers(); // Fetch all available users
  }

  fetchAffectations() {
    this.affectationService.getAllAffectations().subscribe(
      (data) => {
        this.affectations = data;
        this.changeDetector.detectChanges(); // Trigger change detection
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch affectations',
          life: 3000,
        });
      }
    );
  }

  fetchAvailableCalendars() {
    this.calendarService.getAllCalendars().subscribe(
      (data) => {
        this.availableCalendars = data;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch calendars',
          life: 3000,
        });
      }
    );
  }

  fetchAvailableModules() {
    this.moduleService.getAllModules().subscribe(
      (data) => {
        this.availableModules = data;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch modules',
          life: 3000,
        });
      }
    );
  }

  fetchAvailableClassrooms() {
    this.classroomService.getAllClassrooms().subscribe(
      (data) => {
        this.availableClassrooms = data;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch classrooms',
          life: 3000,
        });
      }
    );
  }

  fetchAvailableUsers() {
    this.userService.getAllUsers().subscribe(
      (data) => {
        this.availableUsers = data;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch users',
          life: 3000,
        });
      }
    );
  }

  onCalendarChange(event: any) {
    this.affectation.calendar = event.value; // Update calendar selection
  }

  onModuleChange(event: any) {
    this.affectation.module = event.value; // Update module selection
  }

  onClassroomChange(event: any) {
    this.affectation.classroom = event.value; // Update classroom selection
  }

  onUserChange(event: any) {
    this.affectation.user = event.value; // Update user selection
  }

  openNew() {
    this.affectation = {
      id: 0,
      semester: 0,
      calendar: null,
      module: null,
      user: null,
      classroom: null,
    };
    this.affectationDialog = true; // Open the create dialog
  }

  editAffectation(affectation: Affectation) {
    this.affectation = { ...affectation }; // Clone for editing
    this.affectationDialog = true; // Open the edit dialog
  }

  saveAffectation() {
    this.submitted = true;

    if (this.affectation.id === 0) { // Creating a new affectation
      this.affectationService.addAffectation(this.affectation).subscribe(
        (newAffectation) => {
          this.affectations.push(newAffectation); // Add to the list
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Affectation added',
            life: 3000,
          });
          this.affectationDialog = false; // Close the dialog
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to add affectation',
            life: 3000,
          });
        }
      );
    } else { // Updating an existing affectation
      this.affectationService.updateAffectation(this.affectation).subscribe(
        (updatedAffectation) => {
          const index = this.affectations.findIndex(
            (affectation) => affectation.id === updatedAffectation.id
          );
          if (index !== -1) {
            this.affectations[index] = updatedAffectation; // Update the list
          }
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Affectation updated',
            life: 3000,
          });
          this.affectationDialog = false; // Close the dialog
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update affectation',
            life: 3000,
          });
        }
      );
    }
  }

  deleteAffectation(affectation: Affectation) {
    this.affectation = { ...affectation }; // Set for deletion
    this.deleteAffectationDialog = true; // Open the confirmation dialog
  }

  confirmDelete() {
    this.deleteAffectationDialog = false; // Close the dialog
    this.affectationService.removeAffectation(this.affectation.id).subscribe(
      () => {
        this.affectations = this.affectations.filter(
          (val) => val.id !== this.affectation.id
        ); // Remove from list
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Affectation deleted',
          life: 3000,
        });
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete affectation',
          life: 3000,
        });
      }
    );
  }

  deleteSelectedAffectations() {
    this.deleteAffectationsDialog = true; // Open the confirmation dialog for multiple deletions
  }

  confirmDeleteSelected() {
    this.deleteAffectationsDialog = false; // Close the dialog

    const deleteObservables = this.selectedAffectations.map(
        (affectation) => this.affectationService.removeAffectation(affectation.id)
    );

    forkJoin(deleteObservables).subscribe(
      () => {
        this.affectations = this.affectations.filter(
          (val) => !this.selectedAffectations.some((sel) => sel.id === val.id)
        ); // Remove deleted items from list
        this.selectedAffectations = []; // Reset the selected list
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Selected affectations deleted.',
          life: 3000,
        });
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete selected affectations.',
          life: 3000,
        });
      }
    );
  }

  hideDialog() {
    this.affectationDialog = false; // Close the dialog
    this.submitted = false; // Reset the submission state
  }

  exportToCSV() {
    const headers = [
      'Affectation ID',
      'Semester',
      'Calendar ID',
      'Academic Year',
      'Start Date',
      'End Date',
      'Archive',
      'Module ID',
      'Module Name',
      'Module Description',
      'Teaching Hours',
      'ECTS',
      'Skills',
      'User ID',
      'User First Name',
      'Classroom ID',
      'Classroom Name'
    ];
  
    const rows = this.affectations.map((affectation) => {
      const skillNames = (affectation.module?.skills || []).map((skill) => skill.name).join('; ');
  
      const startDate = affectation.calendar?.start_date
        ? new Date(affectation.calendar.start_date).toISOString().split('T')[0]
        : '';
      const endDate = affectation.calendar?.end_date
        ? new Date(affectation.calendar.end_date).toISOString().split('T')[0]
        : '';
  
      return [
        affectation.id,
        affectation.semester,
        affectation.calendar?.id || '',
        affectation.calendar?.academic_year || '',
        startDate,
        endDate,
        affectation.calendar?.archive || '',
        affectation.module?.id || '',
        affectation.module?.name || '',
        affectation.module?.description || '',
        affectation.module?.teaching_hours || '',
        affectation.module?.ects || '',
        skillNames,
        affectation.user?.id || '',
        affectation.user?.firstname || '',
        affectation.classroom?.id || '',
        affectation.classroom?.name || '',
      ].join(','); // Join each row into a single comma-separated string
    });
  
    const csvContent = [headers.join(','), ...rows].join('\n'); // Combine headers and rows into one string
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'affectations.csv');
    document.body.appendChild(link);
    link.click(); // Trigger download
    document.body.removeChild(link); // Clean up
  }
  
  triggerFileUpload() {
    this.fileInput.nativeElement.click(); // Trigger file upload
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files ? input.files[0] : null;

    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const content = e.target.result as string;
        const records = this.importFromCSV(content);
        this.importAffectations(records); // Import the parsed records
      };

      reader.readAsText(file); // Read CSV content
    } else {
      this.messageService.add({
        severity: 'error',
          summary: 'Error',
          detail: 'No file selected.',
          life: 3000,
      });
    }
  }

  importFromCSV(content: string) {
    const rows = content.split('\n');
    const headers = rows[0].split(',');

    const expectedHeaders = [
      'Affectation ID',
      'Semester',
      'Calendar ID',
      'Academic Year',
      'Start Date',
      'End Date',
      'Archive',
      'Module ID',
      'Module Name',
      'Skills',
      'User ID',
      'User First Name',
      'Classroom ID',
      'Classroom Name'
    ];

    if (!expectedHeaders.every(header => headers.includes(header))) {
      throw new Error("Invalid CSV format: incorrect headers or missing required fields");
    }

    const records = rows.slice(1).map((row) => {
      const fields = row.split(',');

      if (fields.length !== expectedHeaders.length) {
        throw new Error("CSV row format mismatch");
      }

      const affectation: Affectation = {
        id: parseInt(fields[0], 10),
        semester: parseInt(fields[1], 10),
        calendar: {
          id: parseInt(fields[2], 10),
          academic_year: fields[3],
          start_date: fields[4] ? new Date(fields[4]) : null,
          end_date: fields[5] ? new Date(fields[5]) : null,
          archive: fields[6] || '',
        },
        module: {
          id: parseInt(fields[7], 10),
          name: fields[8],
          description: '',
          teaching_hours: 0,
          ects: 0,
          skills: fields[9] ? fields[9].split(';').map((skill) => ({
            id: 0,
            name: skill.trim(),
            description: '',
          })) : [],
        },
        user: {
            id: parseInt(fields[10], 10),
            firstname: fields[11],
            lastname: fields[12],
            email: '', // Default or extracted from CSV
            password: '', // Not usually included in CSV but placeholder if required
            telephone_number: 0, // Default or extracted from CSV
            role: '', // Default or extracted from CSV
          },
          
        classroom: {
          id: parseInt(fields[13], 10),
          name: fields[14],
        },
      };

      return affectation;
    });

    return records;
  }

  importAffectations(records: Affectation[]) {
    if (records.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Import Warning',
        detail: 'No valid affectations to import.',
        life: 3000,
      });
      return;
    }

    const existingIds = new Set(this.affectations.map((a) => a.id)); // Avoid duplicates
    
    records.forEach((record) => {
      if (existingIds.has(record.id)) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Duplicate Affectation',
          detail: `Affectation with ID ${record.id} already exists.`,
          life: 3000,
        });
      } else {
        this.affectationService.addAffectation(record).subscribe(
          () => {
            this.affectations.push(record); // Add to the list
            this.messageService.add({
              severity: 'success',
              summary: 'Import Successful',
              detail: `Affectation with ID ${record.id} imported.`,
              life: 3000,
            });
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Import Failed',
              detail: `Failed to import affectation with ID ${record.id}.`,
              life: 3000,
            });
          }
        );
      }
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
