import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { NgForOf, NgIf } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { RippleModule } from 'primeng/ripple';
import { MessageService, SharedModule } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { Module } from 'src/app/demo/api/module';
import { Level } from 'src/app/demo/api/level';
import { Option } from 'src/app/demo/api/option';
import { Classroom } from 'src/app/demo/api/classroom';
import { LevelService } from 'src/app/demo/service/level.service';
import { OptionService } from 'src/app/demo/service/option.service';
import { ClassroomService } from 'src/app/demo/service/classroom.service';
import { ModuleService } from '../../../service/module.service';
import { Skill } from '../../../api/skill';
import { SkillService } from '../../../service/skill.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';

@Component({
    // selector: 'app-classroom',
    // standalone: true,
    //   imports: [
    //       ButtonModule,
    //       DialogModule,
    //       InputTextModule,
    //       InputTextareaModule,
    //       NgForOf,
    //       NgIf,
    //       PaginatorModule,
    //       RippleModule,
    //       SharedModule,
    //       TableModule,
    //       ToastModule,
    //       ToolbarModule
    //   ],
    templateUrl: './classroom.component.html',
    styleUrl: './classroom.component.scss',
    providers: [MessageService],
})
export class ClassroomComponent implements OnInit {
    classroomDialog: boolean = false;
    deleteClassroomDialog: boolean = false;
    deleteClassroomsDialog: boolean = false;
    classrooms: Classroom[] = [];
    selectedClassrooms: Classroom[] = [];
    availableModules: Module[] = [];
    selectedModules: Module[] = [];
    availableLevels: Level[] = [];
    availableOptions: Option[] = [];
    selectedLevel: Level;
    selectedOption: Option;
    // levels: Level[] = [];
    // options: Option[] = [];
    cols: any[];

    classroom: Classroom = {
        id: 0,
        name: '',
        level: null,
        option: null,
        startYear: '',
        endYear: '',
        classroomSalle: '',

        modules: [],
    };

    submitted: boolean = false;
    f;

    // //how to implement validators in  coordination with my classroom.component.html give me code next line
    //     classroomForm = this.builder.group({
    //         name: this.builder.control('', Validators.compose([Validators.required])),
    //         level: this.builder.control('', Validators.compose([Validators.required])),
    //         option: this.builder.control('', Validators.compose([Validators.required])),
    //         modules: this.builder.control(''),
    //     });

    constructor(
        private classroomService: ClassroomService,
        private levelService: LevelService,
        private optionService: OptionService,
        private messageService: MessageService,
        private moduleService: ModuleService,
        private builder: FormBuilder,
    ) {}

    ngOnInit() {
        this.classroomService
            .getAllClassrooms()
            .subscribe((data) => (this.classrooms = data));

        this.cols = [
            { field: 'name', header: 'Name' },
            { field: 'level', header: 'Level' },
            { field: 'option', header: 'Option' },
            { field: 'modules', header: 'Modules' },
            { field: 'startYear', header: 'StartYear' },
            { field: 'endYear', header: 'EndYear' },
            { field: 'classroomSalle', header: 'ClassroomSalle' },
        ];

        // Fetch  available levels when component initializes
        this.fetchAvailableLevels();
        // Fetch available options when component initializes
        this.fetchAvailableOptions();
        // Fetch available modules when component initializes
        this.fetchAvailableModules();
    }

    fetchAvailableLevels() {
        this.levelService.getAllLevels().subscribe((data) => {
            this.availableLevels = data;
        });
    }

    fetchAvailableOptions() {
        this.optionService.getAllOptions().subscribe((data) => {
            this.availableOptions = data;
        });
    }

    fetchAvailableModules() {
        this.moduleService.getAllModules().subscribe((data) => {
            this.availableModules = data;
        });
    }

    openNew() {
        this.classroom = {
            id: 0,
            name: '',
            level: null,
            option: null,
            modules: [],
            startYear: '',
            endYear: '',
            classroomSalle: '',
        };
        this.selectedModules = []; // Clear selectedModules array
        this.classroomDialog = true;
    }

    deleteSelectedClassrooms() {
        this.deleteClassroomsDialog = true;
    }

    editClassroom(classroom: Classroom) {
        this.classroom = { ...classroom };
        this.classroomDialog = true;
    }

    deleteClassroom(classroom: Classroom) {
        this.classroom = { ...classroom };
        this.deleteClassroomDialog = true;
    }

    hideDialog() {
        this.classroomDialog = false;
        this.submitted = false;
    }

    // confirmDeleteSelected() {
    //     this.deleteClassroomsDialog = false;
    //     this.classrooms = this.classrooms.filter(
    //         (val) => !this.selectedClassrooms.includes(val),
    //     );
    //     this.messageService.add({
    //         severity: 'success',
    //         summary: 'Successful',
    //         detail: 'Classrooms Deleted',
    //         life: 3000,
    //     });
    //     this.selectedClassrooms = [];
    // }
    // confirmDeleteSelected() {
    //     this.deleteClassroomDialog = false;
    //     const selectedIds = this.selectedClassrooms.map(
    //         (classroom) => classroom.id,
    //     );
    //     selectedIds.forEach((id) => {
    //         this.classroomService.removeClassroom(id).subscribe(
    //             () => {
    //                 this.classrooms = this.classrooms.filter(
    //                     (val) => val.id !== id,
    //                 );
    //                 this.selectedClassrooms = this.selectedClassrooms.filter(
    //                     (classroom) => classroom.id !== id,
    //                 );
    //                 this.messageService.add({
    //                     severity: 'success',
    //                     summary: 'Successful',
    //                     detail: 'Classrooms Deleted',
    //                     life: 3000,
    //                 });
    //             },
    //             (error) => {
    //                 console.error('Error deleting classrooms:', error);
    //                 this.messageService.add({
    //                     severity: 'error',
    //                     summary: 'Error',
    //                     detail: 'Failed to delete classrooms',
    //                     life: 3000,
    //                 });
    //             },
    //         );
    //     });
    // }

    confirmDeleteSelected() {
        this.deleteClassroomsDialog = false;
        const selectedIds = this.selectedClassrooms.map(
            (classroom) => classroom.id,
        );
        selectedIds.forEach((id, index) => {
            this.classroomService.removeClassroom(id).subscribe(
                () => {
                    this.classrooms = this.classrooms.filter(
                        (val) => val.id !== id,
                    );
                    this.selectedClassrooms = this.selectedClassrooms.filter(
                        (classroom) => classroom.id !== id,
                    );
                    if (index === selectedIds.length - 1) {
                        // Display success message only once
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Classrooms Deleted',
                            life: 3000,
                        });
                    }
                },
                (error) => {
                    console.error('Error deleting classrooms:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to delete classrooms',
                        life: 3000,
                    });
                },
            );
        });
    }

    confirmDelete() {
        this.deleteClassroomDialog = false;
        this.classroomService.removeClassroom(this.classroom.id).subscribe(
            () => {
                this.classrooms = this.classrooms.filter(
                    (val) => val.id !== this.classroom.id,
                );
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Module Deleted',
                    life: 3000,
                });
                this.classroom = {
                    id: 0,
                    name: '',
                    level: null,
                    option: null,
                    modules: [],
                    startYear: '',
                    endYear: '',
                    classroomSalle: '',
                };
            },
            (error) => {
                console.error('Error deleting classroom:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'An error occurred',
                    life: 3000,
                });
            },
        );
    }

    // saveClassroom() {
    //     this.submitted = true;
    //     // Assign selected modules  to classroom.modules
    //     this.classroom.modules = this.selectedModules.map((module) => ({
    //         ...module,
    //     }));
    //     // Assign selected modules  to classroom.modules
    //     this.classroom.level = this.selectedLevel;
    //     // Assign selected modules  to classroom.modules
    //     this.classroom.option = this.selectedOption;
    //     if (this.classroom.id === 0) {
    //         console.log('New classroom Object:', this.classroom);
    //         this.classroomService
    //             .addClassroom(this.classroom)
    //             .subscribe((data) => {
    //                 this.classrooms.push(data);
    //                 this.messageService.add({
    //                     severity: 'success',
    //                     summary: 'Successful',
    //                     detail: 'Classroom Created',
    //                     life: 3000,
    //                 });
    //             });
    //     } else {
    //         console.log('New classroom Object:', this.classroom);
    //
    //         this.classroomService
    //             .updateClassroom(this.classroom)
    //             .subscribe((data) => {
    //                 const index = this.classrooms.findIndex(
    //                     (val) => val.id === this.classroom.id,
    //                 );
    //                 if (index !== -1) {
    //                     this.classrooms[index] = data;
    //                 }
    //                 this.messageService.add({
    //                     severity: 'success',
    //                     summary: 'Successful',
    //                     detail: 'Classroom Updated',
    //                     life: 3000,
    //                 });
    //             });
    //     }
    //     this.classroomDialog = false;
    //     this.classroom = {
    //         id: 0,
    //         name: '',
    //         level: null,
    //         option: null,
    //         modules: [],
    //         startYear: '',
    //         endYear: '',
    //         classroomSalle: '',
    //     };
    // }
    saveClassroom() {
        this.submitted = true;

        // Check access control conditions
        if (!this.isValidClassroom()) {
            // Handle invalid classroom data, e.g., display error messages
            return;
        }

        // Assign selected modules to classroom.modules
        this.classroom.modules = this.selectedModules.map((module) => ({
            ...module,
        }));

        // Assign selected modules to classroom.modules
        this.classroom.level = this.selectedLevel;

        // Assign selected modules to classroom.modules
        this.classroom.option = this.selectedOption;

        if (this.classroom.id === 0) {
            console.log('New classroom Object:', this.classroom);
            this.classroomService
                .addClassroom(this.classroom)
                .subscribe((data) => {
                    this.classrooms.push(data);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Classroom Created',
                        life: 3000,
                    });
                });
        } else {
            console.log('New classroom Object:', this.classroom);

            this.classroomService
                .updateClassroom(this.classroom)
                .subscribe((data) => {
                    const index = this.classrooms.findIndex(
                        (val) => val.id === this.classroom.id,
                    );
                    if (index !== -1) {
                        this.classrooms[index] = data;
                    }
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Classroom Updated',
                        life: 3000,
                    });
                });
        }
        this.classroomDialog = false;
        this.resetClassroom(); // Reset classroom data after saving
    }

    // Function to check access control conditions
    // isValidClassroom(): boolean {
    //     // Example access control checks
    //     if (!this.classroom.name || this.classroom.name.trim() === '') {
    //         // Name cannot be empty
    //         this.messageService.add({
    //             severity: 'error',
    //             summary: 'Error',
    //             detail: 'Name is required',
    //             life: 3000,
    //         });
    //         return false;
    //     }
    //
    //     if (this.classroom.endYear <= this.classroom.startYear) {
    //         // End year must be greater than start year
    //         this.messageService.add({
    //             severity: 'error',
    //             summary: 'Error',
    //             detail: 'End year must be greater than start year',
    //             life: 3000,
    //         });
    //         return false;
    //     }
    //
    //     // Additional access control checks as needed
    //
    //     return true; // Classroom data is valid
    // }
    // isValidClassroom(): boolean {
    //     // Example access control checks
    //     if (!this.classroom.name || this.classroom.name.trim() === '') {
    //         // Name cannot be empty
    //         this.messageService.add({
    //             severity: 'error',
    //             summary: 'Error',
    //             detail: 'Name is required',
    //             life: 3000,
    //         });
    //         return false;
    //     }
    //
    //     // Check if the name already exists regardless of case
    //     const existingClassroom = this.classrooms.find(
    //         (val) =>
    //             val.name.toLowerCase() === this.classroom.name.toLowerCase() &&
    //             val.id !== this.classroom.id,
    //     );
    //     if (existingClassroom) {
    //         // Name already exists
    //         this.messageService.add({
    //             severity: 'error',
    //             summary: 'Error',
    //             detail: 'Classroom name already exists',
    //             life: 3000,
    //         });
    //         return false;
    //     }
    //
    //     // Validate start year and end year
    //     const startYear = parseInt(
    //         this.getYearFromDate(this.classroom.startYear),
    //         10,
    //     );
    //     const endYear = parseInt(
    //         this.getYearFromDate(this.classroom.endYear),
    //         10,
    //     );
    //     if (isNaN(startYear) || isNaN(endYear) || startYear !== endYear + 1) {
    //         // End year must be greater than start year
    //         this.messageService.add({
    //             severity: 'error',
    //             summary: 'Error',
    //             detail: 'Start year must be end year + 1',
    //             life: 3000,
    //         });
    //         return false;
    //     }
    //
    //     // Additional access control checks as needed
    //
    //     return true; // Classroom data is valid
    // }
    //
    // // Helper function to extract year from date string
    // getYearFromDate(dateString: string): string {
    //     if (!dateString) return '';
    //     const date = new Date(dateString);
    //     return date.getFullYear().toString();
    // }

    isValidClassroom(): boolean {
        // Example access control checks
        if (!this.classroom.name || this.classroom.name.trim() === '') {
            // Name cannot be empty
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Name is required',
                life: 3000,
            });
            return false;
        }

        // Check if the name already exists regardless of case
        const existingClassroom = this.classrooms.find(
            (val) =>
                val.name.toLowerCase() === this.classroom.name.toLowerCase() &&
                val.id !== this.classroom.id,
        );
        if (existingClassroom) {
            // Name already exists
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Classroom name already exists',
                life: 3000,
            });
            return false;
        }

        // Validate start year and end year
        const startYear = parseInt(
            this.getYearFromDate(this.classroom.startYear),
            10,
        );
        const endYear = parseInt(
            this.getYearFromDate(this.classroom.endYear),
            10,
        );
        if (isNaN(startYear) || isNaN(endYear) || startYear >= endYear) {
            // End year must be greater than start year
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'End year must be start year + 1',
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

        // Additional access control checks as needed

        return true; // Classroom data is valid
    }

    // Helper function to extract year from date string
    getYearFromDate(dateString: string): string {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.getFullYear().toString();
    }

    // Function to reset classroom data after saving
    resetClassroom() {
        this.classroom = {
            id: 0,
            name: '',
            level: null,
            option: null,
            modules: [],
            startYear: '',
            endYear: '',
            classroomSalle: '',
        };
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

    isSelectedModule(module: Module): boolean {
        return this.selectedModules.some((m) => m.id === module.id);
    }

    isSelectedLevel(level: Level): boolean {
        return this.selectedLevel && this.selectedLevel.id === level.id;
    }

    isSelectedOption(option: Option): boolean {
        return this.selectedOption && this.selectedOption.id === option.id;
    }

    toggleSelectionModule(module: Module, event: any) {
        if (event) {
            this.selectedModules.push(module);
        } else {
            this.selectedModules = this.selectedModules.filter(
                (m) => m.id !== module.id,
            );
        }
    }

    toggleSelectionLevel(level: Level, event: any) {
        if (event) {
            this.selectedLevel = level;
        } else {
            this.selectedLevel = null;
        }
    }

    toggleSelectionOption(option: Option, event: any) {
        if (event) {
            this.selectedOption = option;
        } else {
            this.selectedOption = null;
        }
    }

    generateClassroomSalle() {
        //const tab = [A, B, C, D, E, F, G, H, I, J, K, L, M];
        const tab = [
            'A',
            'B',
            'C',
            'D',
            'E',
            'F',
            'G',
            'H',
            'I',
            'J',
            'K',
            'L',
            'M',
        ];
        //hey copilot listen to me  i wanna generate a random classroom salle from the tab array in the form of  A211  in this exemple bloc A 2nd floor room 11 you can go up to 5 floors and 14 rooms in each bloc after generating the salle i want to save it the classroomSalle attribute in the classroom object in the data base using the updateclassroom function in the classroom service i want you go generate salles for all classrooms  okey you can start next line
        const bloc = tab[Math.floor(Math.random() * tab.length)];
        const floor = Math.floor(Math.random() * 4) + 1;
        const room = Math.floor(Math.random() * 14) + 1;
        this.classroom.classroomSalle = `${bloc}${floor}${room}`;
        this.classroomService
            .updateClassroom(this.classroom)
            .subscribe((data) => {
                const index = this.classrooms.findIndex(
                    (val) => val.id === this.classroom.id,
                );
                if (index !== -1) {
                    this.classrooms[index] = data;
                }
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Classroom Salle Updated',
                    life: 3000,
                });
            });
    }

    //can you generate salles for all classrooms?
    generateAllClassroomSalles() {
        this.classrooms.forEach((classroom) => {
            if (classroom.classroomSalle) {
                return;
            }

            let tab;
            if (classroom.name.startsWith('3A')) {
                tab = ['I', 'J', 'K'];
            } else if (classroom.name.startsWith('3B')) {
                tab = ['M'];
            } else if (
                classroom.name.startsWith('1A') ||
                classroom.name.startsWith('2A') ||
                classroom.name.startsWith('2P')
            ) {
                tab = ['A', 'B', 'C', 'D'];
            } else if (classroom.name.startsWith('4')) {
                tab = ['G'];
            } else if (classroom.name.startsWith('5')) {
                tab = ['Chargia'];
            }

            const bloc = tab[Math.floor(Math.random() * tab.length)];
            const floor = Math.floor(Math.random() * 4) + 1;
            const room = Math.floor(Math.random() * 14) + 1;

            classroom.classroomSalle = `${bloc}${floor}${room < 10 ? `0${room}` : room}`;

            this.classroomService
                .updateClassroom(classroom)
                .subscribe((data) => {
                    const index = this.classrooms.findIndex(
                        (val) => val.id === classroom.id,
                    );
                    if (index !== -1) {
                        this.classrooms[index] = data;
                    }
                });
        });

        this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Classroom Salles Generated',
            life: 3000,
        });
    }

    //const  =["1A","2A","2P","3A","3B"];
}
