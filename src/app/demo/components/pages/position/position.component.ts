import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';

import { Position } from 'src/app/demo/api/position';

import { Table } from 'primeng/table';
import { PositionService } from 'src/app/demo/service/position.service'; 


@Component({
  selector: 'app-position',
  //standalone: true,
  //imports: [],
  templateUrl: './position.component.html',
  providers: [MessageService]
})
export class PositionComponent {
/* idP: number;
    nameP: string;
    shiftHours: number; */



    positionDialog: boolean = false;
    deletePositionDialog: boolean = false;
    deletePositionsDialog: boolean = false;
    positions: Position[] = [];
    position: Position = { idP: 0, nameP: '', shiftHours: 0 };
    selectedPositions: Position[] = [];
    submitted: boolean = false;
    cols: any[] = [];
    rowsPerPageOptions = [5, 10, 20];

    constructor(private positionService: PositionService, private messageService: MessageService) { }

    ngOnInit() {
        this.positionService.getAllPositions().subscribe(data => this.positions = data);

        this.cols = [
            { field: 'nameP', header: 'NameP' },
            { field: 'shiftHours', header: 'ShiftHours' }
        ];

        if(!this.positions)
      
      {
        this.messageService.add({ severity: 'success', summary: 'failed', detail: 'no user found', life: 3000 });
      }
    }

    openNew() {
        this.position = { idP: 0, nameP: '', shiftHours:0  };
        this.submitted = false;
        this.positionDialog = true;
    }

    deleteSelectedPositions() {
        this.deletePositionsDialog = true;
    }

    editPosition(skill: Position) {
        this.position = { ...skill };
        this.positionDialog = true;
    }

    deletePosition(skill: Position) {
        this.deletePositionDialog = true;
        this.position = { ...skill };
    }

    confirmDeleteSelected() {
        this.deletePositionsDialog = false;
        this.positions = this.positions.filter(val => !this.selectedPositions.includes(val));
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Positions Deleted', life: 3000 });
        this.selectedPositions = [];
    }

    confirmDelete() {
        this.deletePositionDialog = false;
        this.positionService.removePosition(this.position.idP).subscribe(() => {
            this.positions = this.positions.filter(val => val.idP !== this.position.idP);
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Position Deleted', life: 3000 });
            this.position = { idP: 0, nameP: '', shiftHours: 0 };
        });
    }

    hideDialog() {
        this.positionDialog = false;
        this.submitted = false;
    }

    savePosition() {
        if (this.position.idP === 0) {
            this.positionService.addPosition(this.position).subscribe(newPosition => {
                this.positions.push(newPosition);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Position Added', life: 3000 });
            });
        } else {
            this.positionService.updatePosition(this.position.idP,this.position).subscribe(updatedPosition => {
                const index = this.positions.findIndex(s => s.idP === updatedPosition.idP);
                if (index !== -1) {
                    this.positions[index] = updatedPosition;
                }
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Skill Updated', life: 3000 });
            });
        }
        this.positionDialog = false;
        this.position = { idP: 0, nameP: '', shiftHours: 0 };
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }



    
}
