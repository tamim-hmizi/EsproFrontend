import { Component, OnInit } from '@angular/core';
import { Module } from 'src/app/demo/api/module';
import { Skill } from 'src/app/demo/api/skill';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ModuleService } from 'src/app/demo/service/module.service';
import { SkillService } from 'src/app/demo/service/skill.service';

@Component({
    templateUrl: './module.component.html',
    styleUrls: ['./module.component.css'],
    providers: [MessageService],
})
export class ModuleComponent implements OnInit {
    moduleDialog: boolean = false;
    deleteModuleDialog: boolean = false;
    deleteModulesDialog: boolean = false;
    modules: Module[] = [];
    selectedModules: Module[] = [];
    availableSkills: Skill[] = [];
    selectedSkills: Skill[] = [];
    cols: any[];

    module: Module = {
        id: 0,
        name: '',
        description: '',
        teaching_hours: 0,
        ects: 0,
        skills: [],
    };

    submitted: boolean = false;

    constructor(
        private moduleService: ModuleService,
        private skillService: SkillService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.moduleService
            .getAllModules()
            .subscribe((data) => (this.modules = data));

        this.cols = [
            { field: 'description', header: 'Description' },
            { field: 'teaching_hours', header: 'Teaching Hours' },
            { field: 'ects', header: 'ECTS' },
        ];

        // Fetch available skills when component initializes
        this.fetchAvailableSkills();
    }

    // Fetch available skills
    fetchAvailableSkills() {
        this.skillService.getAllSkills().subscribe((data) => {
            this.availableSkills = data;
        });
    }

    openNew() {
        this.module = {
            id: 0,
            name: '',
            description: '',
            teaching_hours: 0,
            ects: 0,
            skills: [],
        };
        this.selectedSkills = []; // Clear selectedSkills array
        this.moduleDialog = true;
    }

    deleteSelectedModules() {
        this.deleteModulesDialog = true;
    }

    editModule(module: Module) {
        this.module = { ...module };
        this.moduleDialog = true;
    }

    deleteModule(module: Module) {
        this.module = { ...module };
        this.deleteModuleDialog = true;
    }

    confirmDeleteSelected() {
        this.deleteModulesDialog = false;
        const selectedIds = this.selectedModules.map((module) => module.id);
        selectedIds.forEach((id) => {
            this.moduleService.removeModule(id).subscribe(
                () => {
                    this.modules = this.modules.filter((val) => val.id !== id);
                    this.selectedModules = this.selectedModules.filter(
                        (module) => module.id !== id
                    );
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Module Deleted',
                        life: 3000,
                    });
                },
                (error) => {
                    console.error('Error deleting module:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to delete module',
                        life: 3000,
                    });
                }
            );
        });
    }

    confirmDelete() {
        this.deleteModuleDialog = false;
        this.moduleService.removeModule(this.module.id).subscribe(
            () => {
                this.modules = this.modules.filter(
                    (val) => val.id !== this.module.id
                );
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Module Deleted',
                    life: 3000,
                });
                this.module = {
                    id: 0,
                    name: '',
                    description: '',
                    teaching_hours: 0,
                    ects: 0,
                    skills: [],
                };
            },
            (error) => {
                console.error('Error deleting module:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to delete module',
                    life: 3000,
                });
            }
        );
    }

    hideDialog() {
        this.moduleDialog = false;
        this.submitted = false;
    }

    saveModule() {
        this.submitted = true;

        // Assign selected skills to module.skills
        this.module.skills = this.selectedSkills.map((skill) => ({ ...skill }));

        if (this.module.id === 0) {
            console.log('New Module Object:', this.module); // Log the module object before API call
            this.moduleService.addModule(this.module).subscribe((newModule) => {
                this.modules.push(newModule);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Module Added',
                    life: 3000,
                });
            });
        } else {
            console.log('Updated Module Object:', this.module); // Log the module object before API call
            this.moduleService
                .updateModule(this.module)
                .subscribe((updatedModule) => {
                    const index = this.modules.findIndex(
                        (m) => m.id === updatedModule.id
                    );
                    if (index !== -1) {
                        this.modules[index] = updatedModule;
                    }
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Module Updated',
                        life: 3000,
                    });
                });
        }
        this.moduleDialog = false;
        this.module = {
            id: 0,
            name: '',
            description: '',
            teaching_hours: 0,
            ects: 0,
            skills: [],
        };
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }

    // Check if a skill is selected
    isSelected(skill: Skill): boolean {
        return this.selectedSkills.some(
            (selectedSkill) => selectedSkill.id === skill.id
        );
    }

    // Toggle selection of a skill
    toggleSelection(skill: Skill, event: any) {
        if (event) {
            // Add skill to selectedSkills array
            this.selectedSkills.push(skill);
        } else {
            // Remove skill from selectedSkills array
            this.selectedSkills = this.selectedSkills.filter(
                (selectedSkill) => selectedSkill.id !== skill.id
            );
        }
    }
}
