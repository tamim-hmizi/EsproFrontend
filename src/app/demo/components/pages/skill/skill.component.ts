import { Component, OnInit } from '@angular/core';
import { Skill } from 'src/app/demo/api/skill';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { SkillService } from 'src/app/demo/service/skill.service'; 

@Component({
    templateUrl: './skill.component.html',
    providers: [MessageService]
})
export class SkillComponent implements OnInit {

    skillDialog: boolean = false;
    deleteSkillDialog: boolean = false;
    deleteSkillsDialog: boolean = false;
    skills: Skill[] = [];
    skill: Skill = { id: 0, name: '', description: '' };
    selectedSkills: Skill[] = [];
    submitted: boolean = false;
    cols: any[] = [];
    rowsPerPageOptions = [5, 10, 20];

    constructor(private skillService: SkillService, private messageService: MessageService) { }

    ngOnInit() {
        this.skillService.getAllSkills().subscribe(data => this.skills = data);

        this.cols = [
            { field: 'name', header: 'Name' },
            { field: 'description', header: 'Description' }
        ];
    }

    openNew() {
        this.skill = { id: 0, name: '', description: '' };
        this.submitted = false;
        this.skillDialog = true;
    }

    deleteSelectedSkills() {
        this.deleteSkillsDialog = true;
    }

    editSkill(skill: Skill) {
        this.skill = { ...skill };
        this.skillDialog = true;
    }

    deleteSkill(skill: Skill) {
        this.deleteSkillDialog = true;
        this.skill = { ...skill };
    }

    confirmDeleteSelected() {
        this.deleteSkillsDialog = false;
        this.skills = this.skills.filter(val => !this.selectedSkills.includes(val));
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Skills Deleted', life: 3000 });
        this.selectedSkills = [];
    }

    confirmDelete() {
        this.deleteSkillDialog = false;
        this.skillService.removeSkill(this.skill.id).subscribe(() => {
            this.skills = this.skills.filter(val => val.id !== this.skill.id);
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Skill Deleted', life: 3000 });
            this.skill = { id: 0, name: '', description: '' };
        });
    }

    hideDialog() {
        this.skillDialog = false;
        this.submitted = false;
    }

    saveSkill() {
        if (this.skill.id === 0) {
            this.skillService.addSkill(this.skill).subscribe(newSkill => {
                this.skills.push(newSkill);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Skill Added', life: 3000 });
            });
        } else {
            this.skillService.updateSkill(this.skill).subscribe(updatedSkill => {
                const index = this.skills.findIndex(s => s.id === updatedSkill.id);
                if (index !== -1) {
                    this.skills[index] = updatedSkill;
                }
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Skill Updated', life: 3000 });
            });
        }
        this.skillDialog = false;
        this.skill = { id: 0, name: '', description: '' };
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
