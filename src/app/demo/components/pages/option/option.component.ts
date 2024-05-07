import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Option } from 'src/app/demo/api/option';
import { OptionService } from 'src/app/demo/service/option.service';
import { Table } from 'primeng/table';
import { forkJoin } from 'rxjs';

@Component({
    // selector: 'app-option',
    // standalone: true,
    // imports: [],
    templateUrl: './option.component.html',
    styleUrl: './option.component.scss',
    providers: [MessageService],
})
export class OptionComponent implements OnInit {
    optionDialog: boolean = false;
    deleteOptionDialog: boolean = false;
    deleteOptionsDialog: boolean = false;
    options: Option[] = [];
    selectedOptions: Option[] = [];
    cols: any[];
    option: Option = {
        id: 0,
        name: '',
        classroom_number: 0,
        //classrooms: [],
        startYear: '',
        endYear: '',
    };
    submitted: boolean = false;

    constructor(
        private optionService: OptionService,
        private messageService: MessageService,
    ) {}

    ngOnInit() {
        this.optionService
            .getAllOptions()
            .subscribe((data) => (this.options = data));
        this.cols = [
            { field: 'name', header: 'Name' },
            { field: 'classroom_number', header: 'Classroom Number' },
        ];
    }

    openNew() {
        this.option = {
            id: 0,
            name: '',
            classroom_number: 0,
            startYear: '',
            endYear: '',
        };
        this.submitted = false;
        this.optionDialog = true;
    }

    deleteSelectedOptions() {
        this.deleteOptionsDialog = true;
    }

    editOption(option: Option) {
        this.option = { ...option };
        this.optionDialog = true;
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


    deleteOption(option: Option) {
        this.deleteOptionDialog = true;
        this.option = { ...option };
    }

    confirmDeleteSelected() {
        this.deleteOptionsDialog = false;
        const deleteRequests = this.selectedOptions.map((option) =>
            this.optionService.removeOption(option.id),
        );

        forkJoin(deleteRequests).subscribe(
            (data) => {
                this.selectedOptions.forEach((option) => {
                    this.options = this.options.filter(
                        (val) => val.id !== option.id,
                    );
                });
                this.selectedOptions = [];
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Options Deleted',
                    life: 3000,
                });
            },
            (error) => {
                console.error('Error option module:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error deleting options',
                    life: 3000,
                });
            },
        );
    }

    confirmDelete() {
        this.deleteOptionDialog = false;
        this.optionService.removeOption(this.option.id).subscribe(() => {
            this.options = this.options.filter(
                (val) => val.id !== this.option.id,
            );
            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Option Deleted',
                life: 3000,
            });
            this.option = {
                id: 0,
                name: '',
                classroom_number: 0,
                startYear: '',
                endYear: '',
            };
        });
    }

    hideDialog() {
        this.optionDialog = false;
        this.submitted = false;
    }

    // saveOption() {
    //     if (this.option.id === 0) {
    //         this.optionService
    //             .addOption(
    //                 this.option,
    //                 this.option.startYear,
    //                 this.option.endYear,
    //             )
    //             .subscribe((data) => {
    //                 this.options.push(data);
    //                 this.messageService.add({
    //                     severity: 'success',
    //                     summary: 'Successful',
    //                     detail: 'Option Created',
    //                     life: 3000,
    //                 });
    //             });
    //     } else {
    //         this.optionService
    //             .updateOption(
    //                 this.option,
    //                 this.option.startYear,
    //                 this.option.endYear,
    //             )
    //             .subscribe((data) => {
    //                 const index = this.options.findIndex(
    //                     (o) => o.id === data.id,
    //                 );
    //                 if (index !== -1) {
    //                     this.options[index] = data;
    //                 }
    //                 this.messageService.add({
    //                     severity: 'success',
    //                     summary: 'Successful',
    //                     detail: 'Option Updated',
    //                     life: 3000,
    //                 });
    //             });
    //     }
    //     this.optionDialog = false;
    //     this.option = {
    //         id: 0,
    //         name: '',
    //         classroom_number: 0,
    //         startYear: '',
    //         endYear: '',
    //     };
    // }

    saveOption() {
        if (!this.isValidOption()) {
            // Handle invalid option data, e.g., display error messages
            return;
        }

        if (this.option.id === 0) {
            const startYear = this.option.startYear;
            const endYear = this.option.endYear;
            this.optionService
                .addOption(this.option, startYear, endYear)
                .subscribe((newOption) => {
                    console.log(newOption);
                    this.options.push(newOption);
                    this.option.id = newOption.id;
                    this.optionService.retrieveStartYearAndEndYearForClassroomsByOptionId(this.option.id)
                        .subscribe((years) => {
                            this.option.startYear = years[0];
                            this.option.endYear = years[1];
                        });
                });
            location.reload();
        } else {
            const startYear = this.option.startYear;
            const endYear = this.option.endYear;
            this.optionService
                .updateOption(
                    this.option,
                    this.option.startYear,
                    this.option.endYear,
                )
                .subscribe((updatedOption) => {
                    const index = this.options.findIndex(
                        (o) => o.id === updatedOption.id,
                    );
                    if (index !== -1) {
                        this.options[index] = updatedOption;
                        this.options[index].startYear = startYear;
                        this.options[index].endYear = endYear;
                    }
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Option Updated',
                        life: 3000,
                    });
                    this.optionService.retrieveStartYearAndEndYearForClassroomsByOptionId(this.option.id)
                        .subscribe((years) => {
                            this.options[index].startYear = years[0];
                            this.options[index].endYear = years[1];
                        });
                });
            location.reload();
        }
        this.optionDialog = false;
        this.resetOption(); // Reset option data after saving
        console.log(this.options);
    }

    isValidOption(): boolean {
        // Check if name is not null
        if (!this.option.name || this.option.name.trim() === '') {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Name is required',
                life: 3000,
            });
            return false;
        }

        // Check if classroom number is between 1 and 70
        if (
            this.option.classroom_number < 1 ||
            this.option.classroom_number > 70
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
            this.getYearFromDate(this.option.startYear),
            10,
        );
        const endYear = parseInt(this.getYearFromDate(this.option.endYear), 10);
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

        const existingOption = this.options.find(
            (val) =>
                val.name.toLowerCase() === this.option.name.toLowerCase() &&
                this.getYearFromDate(val.startYear) === this.getYearFromDate(this.option.startYear) &&
                this.getYearFromDate(val.endYear) === this.getYearFromDate(this.option.endYear) &&
                (this.option.id === 0 || val.id !== this.option.id),
        );
        if (existingOption) {
            // Option with the same name, start year, and end year already exists
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'An option with the same name, start year, and end year already exists',
                life: 3000,
            });
            return false;
        }

        return true; // Option data is valid
    }

    resetOption() {
        this.option = {
            id: 0,
            name: '',
            classroom_number: 0,
            startYear: '',
            endYear: '',
        };
    }











    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((<HTMLInputElement>event.target).value, 'contains');
    }
}
