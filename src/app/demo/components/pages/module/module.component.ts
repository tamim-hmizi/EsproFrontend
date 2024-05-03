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
    providers: [MessageService]
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
        skills: []
    };

    submitted: boolean = false;

    constructor(
        private moduleService: ModuleService,
        private skillService: SkillService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.moduleService.getAllModules().subscribe(data => this.modules = data);

        this.cols = [
            { field: 'name', header: 'name' },
            { field: 'description', header: 'Description' },
            { field: 'teaching_hours', header: 'Teaching Hours' },
            { field: 'ects', header: 'ECTS' }
        ];

        // Fetch available skills when component initializes
        this.fetchAvailableSkills();
    }

    // Fetch available skills
    fetchAvailableSkills() {
        this.skillService.getAllSkills().subscribe(data => {
            this.availableSkills = data;
        });
    }

    isSkillSelected(skill: Skill): boolean {
        return this.module.skills.some(selectedSkill => selectedSkill.id === skill.id);
    }


    openNew() {
        this.module = {
            id: 0,
            name: '',
            description: '',
            teaching_hours: 0,
            ects: 0,
            skills: []
        };
        this.selectedSkills = []; // Clear selectedSkills array
        this.moduleDialog = true;
    }

    deleteSelectedModules() {
        this.deleteModulesDialog = true;
    }

    editModule(module: Module) {
        this.module = { ...module };
        this.selectedSkills = [...module.skills]; // Initialize selectedSkills with the skills associated with the module
        this.moduleDialog = true;
    }


    deleteModule(module: Module) {
        this.module = { ...module };
        this.deleteModuleDialog = true;
    }



    confirmDeleteSelected() {
        this.deleteModulesDialog = false;
        const selectedIds = this.selectedModules.map(module => module.id);
        selectedIds.forEach(id => {
            this.moduleService.removeModule(id).subscribe(() => {
                this.modules = this.modules.filter(val => val.id !== id);
                this.selectedModules = this.selectedModules.filter(module => module.id !== id);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Module Deleted', life: 3000 });
            }, error => {
                console.error('Error deleting module:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete module', life: 3000 });
            });
        });
    }



    confirmDelete() {
        this.deleteModuleDialog = false;
        this.moduleService.removeModule(this.module.id).subscribe(() => {
            this.modules = this.modules.filter(val => val.id !== this.module.id);
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Module Deleted', life: 3000 });
            this.module = { id: 0, name: '', description: '', teaching_hours: 0, ects: 0, skills: [] };
        }, error => {
            console.error('Error deleting module:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete module', life: 3000 });
        });
    }

    hideDialog() {
        this.moduleDialog = false;
        this.submitted = false;
    }


    saveModule() {
        // Check if description field is filled
        if (!this.module.description) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill in the description field', life: 3000 });
            return; // Exit the method early if validation fails
        }

        // Check if teaching_hours and ects are greater than 0
        if (this.module.teaching_hours <= 0 || this.module.ects <= 0) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Teaching hours and ECTS must be greater than 0', life: 3000 });
            return; // Exit the method early if validation fails
        }

        // Check if at least one skill is selected
        if (this.selectedSkills.length === 0) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select at least one skill', life: 3000 });
            return; // Exit the method early if validation fails
        }

        this.submitted = true;

        this.module.skills = [...this.selectedSkills]; // Update module object with selected skills

    if (this.module.id === 0) {
        this.moduleService.addModule(this.module).subscribe(newModule => {
            this.modules.push(newModule);
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Module Added', life: 3000 });
        });
        // Add module logic...
    } else {
        console.log('Updated Module Object:', this.module); // Log the module object before API call
        this.moduleService.updateModule(this.module).subscribe(updatedModule => {
            const index = this.modules.findIndex(m => m.id === updatedModule.id);
            if (index !== -1) {
                this.modules[index] = updatedModule;
            }
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Module Updated', life: 3000 });
        });
    }
    this.moduleDialog = false;
    this.module = {
        id: 0,
        name: '',
        description: '',
        teaching_hours: 0,
        ects: 0,
        skills: []
    };
}




    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    // Check if a skill is selected
    isSelected(skill: Skill): boolean {
        return this.selectedSkills.some(selectedSkill => selectedSkill.id === skill.id);
    }

    toggleSelection(skill: Skill, isChecked: boolean) {
        if (isChecked) {
            // Check if the skill is already selected
            const index = this.selectedSkills.findIndex(selectedSkill => selectedSkill.id === skill.id);
            if (index === -1) {
                // Skill is not selected, so add it to the array
                this.selectedSkills.push(skill);
            }
        } else {
            // Skill is being deselected, so remove it from the array
            this.selectedSkills = this.selectedSkills.filter(selectedSkill => selectedSkill.id !== skill.id);
        }
    }


    showFileDialog() {
        document.getElementById('fileInput').click();
    }

    onFileSelected(event: Event) {
        const fileInput = event.target as HTMLInputElement;
        const file = fileInput.files[0];
        this.moduleService.uploadPdf(file).subscribe(
            response => {
                console.log('Upload successful:', response);
                // Delay the refresh by 1 second (1000 milliseconds)
                setTimeout(() => {
                    // Trigger a manual refresh after the delay
                    window.location.reload();
                }, 700); // Adjust the delay time as needed
            },
            error => {
                console.error('Upload failed:', error);
                // Handle upload error
            }
        );
    }





}
