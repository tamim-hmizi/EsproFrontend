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

    saveOption() {
        if (this.option.id === 0) {
            this.optionService
                .addOption(
                    this.option,
                    this.option.startYear,
                    this.option.endYear,
                )
                .subscribe((data) => {
                    this.options.push(data);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Option Created',
                        life: 3000,
                    });
                });
        } else {
            this.optionService
                .updateOption(
                    this.option,
                    this.option.startYear,
                    this.option.endYear,
                )
                .subscribe((data) => {
                    const index = this.options.findIndex(
                        (o) => o.id === data.id,
                    );
                    if (index !== -1) {
                        this.options[index] = data;
                    }
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Option Updated',
                        life: 3000,
                    });
                });
        }
        this.optionDialog = false;
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
