import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Classroom } from 'src/app/demo/api/classroom';
import { LevelService } from 'src/app/demo/service/level.service';
//import { OptionService } from 'src/app/demo/service/option.service';
import { ClassroomService } from 'src/app/demo/service/classroom.service';
import { Level } from 'src/app/demo/api/level';
import { Table } from 'primeng/table';
import { forkJoin } from 'rxjs';

@Component({
    // selector: 'app-level',
    // standalone: true,
    // imports: [],
    templateUrl: './level.component.html',
    styleUrl: './level.component.scss',
    providers: [MessageService],
})
export class LevelComponent implements OnInit {
    levelDialog: boolean = false;
    deleteLevelDialog: boolean = false;
    deleteLevelsDialog: boolean = false;
    levels: Level[] = [];
    selectedLevels: Level[] = [];
    availableClassrooms: Classroom[] = [];
    selectedClassrooms: Classroom[] = [];
    cols: any[];

    level: Level = {
        id: 0,
        name: '',
        classroom_number: 0,
        //classrooms: [],
        startYear: '',
        endYear: '',
    };

    submitted: boolean = false;

    constructor(
        private levelService: LevelService,
        private classroomService: ClassroomService,
        private messageService: MessageService,
    ) {}

    ngOnInit() {
        this.levelService
            .getAllLevels()
            .subscribe((data) => (this.levels = data));

        this.cols = [
            { field: 'name', header: 'Name' },
            { field: 'classroom_number', header: 'Classroom Number' },
        ];

        // Fetch available classrooms when component initializes
        this.fetchAvailableClassrooms();
    }

    // Fetch available classrooms
    fetchAvailableClassrooms() {
        this.classroomService.getAllClassrooms().subscribe((data) => {
            this.availableClassrooms = data;
        });
    }

    openNew() {
        this.level = {
            id: 0,
            name: '',
            classroom_number: 0,
            //classrooms: [],
            startYear: '',
            endYear: '',
        };
        this.selectedLevels = [];
        this.levelDialog = true;
    }

    hideDialog() {
        this.levelDialog = false;
        this.submitted = false;
    }

    deleteSelectedLevels() {
        this.deleteLevelsDialog = true;
    }

    editLevel(level: Level) {
        this.level = { ...level };
        this.levelDialog = true;
    }

    deleteLevel(level: Level) {
        this.level = { ...level };
        this.deleteLevelDialog = true;
    }

    // confirmDeleteSelected() {
    //     this.deleteLevelsDialog = false;
    //     const selectedIds = this.selectedLevels.map((level) => level.id);
    //     selectedIds.forEach((id) => {
    //         this.levelService.removeLevel(id).subscribe(
    //             (data) => {
    //                 this.levels = this.levels.filter((val) => val.id !== id);
    //                 this.selectedLevels = this.selectedLevels.filter(
    //                     (level) => level.id !== id,
    //                 );
    //                 this.messageService.add({
    //                     severity: 'success',
    //                     summary: 'Successful',
    //                     detail: 'Level Deleted',
    //                     life: 3000,
    //                 });
    //             },
    //             (error) => {
    //                 console.error('Error deleting module:', error);
    //                 this.messageService.add({
    //                     severity: 'error',
    //                     summary: 'Error',
    //                     detail: 'Error deleting level',
    //                     life: 3000,
    //                 });
    //             },
    //         );
    //     });
    // }

    confirmDeleteSelected() {
        this.deleteLevelsDialog = false;
        const deleteRequests = this.selectedLevels.map((level) =>
            this.levelService.removeLevel(level.id),
        );

        forkJoin(deleteRequests).subscribe(
            (data) => {
                this.selectedLevels.forEach((level) => {
                    this.levels = this.levels.filter(
                        (val) => val.id !== level.id,
                    );
                });
                this.selectedLevels = [];
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Levels Deleted',
                    life: 3000,
                });
            },
            (error) => {
                console.error('Error deleting module:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error deleting levels',
                    life: 3000,
                });
            },
        );
    }

    confirmDelete() {
        this.deleteLevelDialog = false;
        this.levelService.removeLevel(this.level.id).subscribe(
            (data) => {
                this.levels = this.levels.filter(
                    (val) => val.id !== this.level.id,
                );
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Level Deleted',
                    life: 3000,
                });
                this.level = {
                    id: 0,
                    name: '',
                    classroom_number: 0,
                    //classrooms: [],
                    startYear: '',
                    endYear: '',
                };
            },
            (error) => {
                console.error('Error deleting level:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error deleting level',
                    life: 3000,
                });
            },
        );
    }

    // saveLevel() {
    //     if (this.level.id === 0) {
    //         this.levelService.addLevel(this.level).subscribe((newLevel) => {
    //             this.levels.push(newLevel);
    //             this.messageService.add({
    //                 severity: 'success',
    //                 summary: 'Successful',
    //                 detail: 'Level Added',
    //                 life: 3000,
    //             });
    //         });
    //     } else {
    //         this.levelService
    //             .updateLevel(this.level)
    //             .subscribe((updatedLevel) => {
    //                 const index = this.levels.findIndex(
    //                     (l) => l.id === updatedLevel.id,
    //                 );
    //                 if (index !== -1) {
    //                     this.levels[index] = updatedLevel;
    //                 }
    //                 this.messageService.add({
    //                     severity: 'success',
    //                     summary: 'Successful',
    //                     detail: 'Level Updated',
    //                     life: 3000,
    //                 });
    //             });
    //     }
    //     this.levelDialog = false;
    //     this.level = {
    //         id: 0,
    //         name: '',
    //         classroom_number: 0,
    //     };
    // }
    // saveLevel() {
    //     if (!this.isValidLevel()) {
    //         // Handle invalid level data, e.g., display error messages
    //         return;
    //     }
    //
    //     if (this.level.id === 0) {
    //         this.levelService.addLevel(this.level).subscribe((newLevel) => {
    //             this.levels.push(newLevel);
    //             this.messageService.add({
    //                 severity: 'success',
    //                 summary: 'Successful',
    //                 detail: 'Level Added',
    //                 life: 3000,
    //             });
    //         });
    //     } else {
    //         this.levelService
    //             .updateLevel(this.level)
    //             .subscribe((updatedLevel) => {
    //                 const index = this.levels.findIndex(
    //                     (l) => l.id === updatedLevel.id,
    //                 );
    //                 if (index !== -1) {
    //                     this.levels[index] = updatedLevel;
    //                 }
    //                 this.messageService.add({
    //                     severity: 'success',
    //                     summary: 'Successful',
    //                     detail: 'Level Updated',
    //                     life: 3000,
    //                 });
    //             });
    //     }
    // }
    //
    // // Function to check access control conditions for the level data
    // isValidLevel(): boolean {
    //     // Check if name is not null
    //     if (!this.level.name || this.level.name.trim() === '') {
    //         this.messageService.add({
    //             severity: 'error',
    //             summary: 'Error',
    //             detail: 'Name is required',
    //             life: 3000,
    //         });
    //         return false;
    //     }
    //
    //     // Check if classroom number is between 1 and 70
    //     if (
    //         this.level.classroom_number < 1 ||
    //         this.level.classroom_number > 70
    //     ) {
    //         this.messageService.add({
    //             severity: 'error',
    //             summary: 'Error',
    //             detail: 'Classroom number must be between 1 and 70',
    //             life: 3000,
    //         });
    //         return false;
    //     }
    //
    //     return true; // Level data is valid
    // }
    saveLevel() {
        if (!this.isValidLevel()) {
            // Handle invalid level data, e.g., display error messages
            return;
        }
        const startYear = this.level.startYear;
        const endYear = this.level.endYear;
        if (this.level.id === 0) {
            this.levelService
                .addLevel(this.level, startYear, endYear)
                .subscribe((newLevel) => {
                    console.log(newLevel);
                    this.levels.push(newLevel);
                    this.level.id = newLevel.id;
                    this.level.startYear = startYear;
                    this.level.endYear = endYear;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Level Added',
                        life: 3000,
                    });
                });
        } else {
            this.levelService
                .updateLevel(
                    this.level,
                    this.level.startYear,
                    this.level.endYear,
                )
                .subscribe((updatedLevel) => {
                    const index = this.levels.findIndex(
                        (l) => l.id === updatedLevel.id,
                    );
                    if (index !== -1) {
                        this.levels[index] = updatedLevel;
                        this.levels[index].startYear = startYear;
                        this.levels[index].endYear = endYear;
                    }
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Level Updated',
                        life: 3000,
                    });
                });
        }
        this.levelDialog = false;
        this.resetLevel(); // Reset level data after saving
    }

    // Function to check access control conditions for the level data
    // isValidLevel(): boolean {
    //     // Check if name is not null
    //     if (!this.level.name || this.level.name.trim() === '') {
    //         this.messageService.add({
    //             severity: 'error',
    //             summary: 'Error',
    //             detail: 'Name is required',
    //             life: 3000,
    //         });
    //         return false;
    //     }
    //
    //     // Check if classroom number is between 1 and 70
    //     if (
    //         this.level.classroom_number < 1 ||
    //         this.level.classroom_number > 70
    //     ) {
    //         this.messageService.add({
    //             severity: 'error',
    //             summary: 'Error',
    //             detail: 'Classroom number must be between 1 and 70',
    //             life: 3000,
    //         });
    //         return false;
    //     }
    //
    //     return true; // Level data is valid
    // }
    isValidLevel(): boolean {
        // Check if name is not null
        if (!this.level.name || this.level.name.trim() === '') {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Name is required',
                life: 3000,
            });
            return false;
        }

        // Check if the name already exists regardless of case
        // const existingLevel = this.levels.find(
        //     (val) =>
        //         val.name.toLowerCase() === this.level.name.toLowerCase() &&
        //         val.id !== this.level.id,
        // );
        // if (existingLevel) {
        //     // Name already exists
        //     this.messageService.add({
        //         severity: 'error',
        //         summary: 'Error',
        //         detail: 'Level name already exists',
        //         life: 3000,
        //     });
        //     return false;
        // }

        // Check if classroom number is between 1 and 70
        if (
            this.level.classroom_number < 1 ||
            this.level.classroom_number > 70
        ) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Classroom number must be between 1 and 70',
                life: 3000,
            });
            return false;
        }

        // Validate start year and end year
        const startYear = parseInt(
            this.getYearFromDate(this.level.startYear),
            10,
        );
        const endYear = parseInt(this.getYearFromDate(this.level.endYear), 10);
        if (isNaN(startYear) || isNaN(endYear) || startYear >= endYear) {
            // End year must be greater than start year
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'End year must be be start year + 1',
                life: 3000,
            });
            return false;
        }

        if (startYear !== endYear - 1) {
            // End year must be equal to start year + 1
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'End year must be start year + 1',
                life: 3000,
            });
            return false;
        }

        return true; // Level data is valid
    }

    // Function to reset level data after saving
    resetLevel() {
        this.level = {
            id: 0,
            name: '',
            classroom_number: 0,
            //classrooms: [],
            startYear: '',
            endYear: '',
        };
    }

    getYearFromDate(dateString: string): string {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.getFullYear().toString();
    }

    getYear(dateString) {
        var date = new Date(dateString);
        return date.getFullYear();
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains',
        );
    }
}
