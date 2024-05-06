import { Component, OnInit } from '@angular/core';
import { RDI } from 'src/app/demo/api/RDI';
import { RDIService } from 'src/app/demo/service/RDI.service';
import { MessageService } from 'primeng/api';
import { RDIMember } from 'src/app/demo/api/RDIMember';
import { Publication } from 'src/app/demo/api/Publication';
import { TypeRecherche } from 'src/app/demo/api/enum';
import { Router } from '@angular/router';
import { ResearchAxis } from 'src/app/demo/api/ResearchAxis';
import { FormBuilder, FormGroup, Validators, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { switchMap, debounceTime, distinctUntilChanged, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
@Component({
  templateUrl: './rdi.component.html', // Path to your HTML template
  styleUrls: ['./RDI.component.css'],
  providers: [MessageService]
})
export class RDIComponent implements OnInit {
  rdis: RDI[] = [];
  cols: any[];
  rdiDialog: boolean = false;
  deleteRDIDialog: boolean = false;
  deleteRDIsDialog: boolean = false;
  submitted: boolean = false;
  selectedMembers: RDIMember[] = [];
  selectedresearchaxis: ResearchAxis[] = [];
  rdiForm: FormGroup;

  members: RDIMember[] = [];
  newRDI: RDI = {
    id: 0,
    theme: '',
    keywords: '',
    dateCreation: new Date(),
    typeR: TypeRecherche.Academique,
    researchAxis: [],
    RDIMembers: [...this.selectedMembers],
    publication: null

  };
  editMode = false;
  selectedRDIs: RDI[] = [];
  selectedTypeR: TypeRecherche;

  publication:Publication[]=[]

  constructor(private rdiService: RDIService,
              private messageService: MessageService,private router: Router, private fb: FormBuilder

              ) {  today: Date;
              }

  ngOnInit(): void {
    this.fetchresearchaxisAll();
    
    this.loadRDIs();
   // this.fetchMembersAll();
    this.cols = [
      { field: 'theme', header: 'Theme' },
      { field: 'KeyWords', header: 'Keywords' },
      { field: 'Date_Creation', header: 'Creation Date' }, // Displaying the Date_Creation field in the table
    ];
    this.rdiForm = this.fb.group({
      theme: ['', [Validators.required, Validators.minLength(3)],[this.createUniqueThemeValidator()] // Utilisation du validateur asynchrone
    ],
      keywords: ['', [Validators.required, Validators.minLength(3)]],
      typeR: [this.selectedTypeR, Validators.required],
      dateCreation: ['', [Validators.required, this.dateValidator]]
    });
  }
  createUniqueThemeValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      const theme = control.value;

      if (!theme || theme.trim() === '') {
        return of(null); // Pas d'erreur si le champ est vide
      }

      return this.rdiService.checkThemeExists(theme).pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((exists) => of(exists ? { unique: true } : null)), // Renvoie une erreur si le thème existe
        catchError(() => of(null)) // Pas d'erreur en cas d'échec de connexion
      );
    };
  }
  get theme(): AbstractControl {
    return this.rdiForm.get('theme');
  }

  get keywords(): AbstractControl {
    return this.rdiForm.get('keywords');
  }

  get typeR(): AbstractControl {
    return this.rdiForm.get('typeR');
  }

  get dateCreation(): AbstractControl {
    return this.rdiForm.get('dateCreation');
  }

  getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  dateValidator(control): { [key: string]: any } | null {
    const currentDate = new Date();
    const selectedDate = new Date(control.value);
    if (selectedDate > currentDate) {
      return { futureDate: true }; // Error if the date is in the future
    }
    return null; // No error if the date is valid
  }
  saveRDI(): void {
    if (!this.rdiForm.valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please correct the form errors.',
        life: 3000
      });
      return;
    }

    if (this.editMode) {
      this.updateRDI();
    } else {
      this.addRDI();
    }
    }

  

  hideDialog(): void {
    this.newRDI = {
      id: 0,
      theme: '',
      keywords: '',
      dateCreation: new Date(),
      typeR: TypeRecherche.Academique,
      researchAxis: [],
      RDIMembers: [],
      publication: null
    };
    this.editMode = false;
    this.rdiDialog = false;
    this.submitted = false;
    // Close the dialog
  }

  getMaxDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    let month: string | number = today.getMonth() + 1;
    let day: string | number = today.getDate();

    // Ajouter un zéro en avant si le mois ou le jour est inférieur à 10
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;

    return `${year}-${month}-${day}`;
  }
  loadRDIs() {
    this.rdiService.getAllRDIs().subscribe(rdis => {
      this.rdis = rdis;
      this.rdis.forEach(rdi => {
        this.fetchMembers(rdi);
        this.fetchpublications(rdi);
      });
    });
  }
  typeOptions = [
    { label: 'Academique', value: TypeRecherche.Academique },
    { label: 'Pedagogique', value: TypeRecherche.Pedagogique },
    { label: 'Appliquee', value: TypeRecherche.Appliquee }
];

  openNew() {
    this.newRDI = {
      id: 0,
      theme: '',
      keywords: '',
      dateCreation: new Date(),
      typeR: TypeRecherche.Academique,
      researchAxis: [],
      RDIMembers: [...this.selectedMembers],
      publication: null

    };
    this.selectedMembers = [];
    this.editMode = false;
    this.rdiDialog = true;
  }

  editRDI(rdi: RDI) {
    this.newRDI = { ...rdi };
    this.editMode = true;
    this.rdiDialog = true;
  }

  deleteRDI(rdi: RDI) {
    this.newRDI = { ...rdi };
    this.deleteRDIDialog = true;
  }

  confirmDeleteRDI() {
    this.deleteRDIDialog = false;
    this.rdiService.deleteRDI(this.newRDI.id).subscribe(() => {
      this.loadRDIs();
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'RDI Deleted', life: 3000 });
    }, error => {
      console.error('Error deleting RDI:', error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete RDI', life: 3000 });
    });
  }

  confirmDeleteSelectedRDIs() {
    this.deleteRDIsDialog = false;
    const selectedIds = this.selectedRDIs.map(rdi => rdi.id);
    selectedIds.forEach(id => {
      this.rdiService.deleteRDI(id).subscribe(() => {
        this.loadRDIs();
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'RDI Deleted', life: 3000 });
      }, error => {
        console.error('Error deleting RDI:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete RDI', life: 3000 });
      });
    });
    this.selectedRDIs = [];
  }

 
  addRDI() {
    const clonedSelectedMembers = [...this.selectedMembers];
    this.newRDI.RDIMembers = clonedSelectedMembers;
    const selectedresearchaxis = [...this.selectedresearchaxis];
    this.newRDI.researchAxis = selectedresearchaxis;
    this.newRDI.typeR = this.selectedTypeR; // Set TypeR with the selected value

    this.rdiService.addRDI(this.newRDI).subscribe(
        newRDI => {
            this.loadRDIs();
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'RDI Added', life: 3000 });
            this.cancelEdit();
        },
        error => {
            console.error('Error adding RDI:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add RDI', life: 3000 });
        }
    );
}

  
  updateRDI() {
    this.newRDI.RDIMembers = this.selectedMembers;
    this.newRDI.typeR = this.selectedTypeR; // Set TypeR with the selected value
    const selectedresearchaxis = [...this.selectedresearchaxis];
    this.newRDI.researchAxis = selectedresearchaxis;
        this.rdiService.updateRDI(this.newRDI).subscribe(() => {
      this.loadRDIs();
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'RDI Updated', life: 3000 });
    }, error => {
      console.error('Error updating RDI:', error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update RDI', life: 3000 });
    });
    this.cancelEdit();
  }

  cancelEdit() {
    this.newRDI = {
      id: 0,
      theme: '',
      keywords: '',
      dateCreation: new Date(),
      typeR: TypeRecherche.Academique,
      researchAxis: [],
      RDIMembers: [],
      publication: null

    };
    this.editMode = false;
    this.rdiDialog = false;
  }

 
  
  researchaxisOptions: ResearchAxis[] = []; // Assurez-vous de remplir cette liste avec les données appropriées

// Fonction pour récupérer les chercheurs
// Dans votre composant TypeScript
fetchresearchaxisAll() {
  this.rdiService.getresearchaxisAll().subscribe(
      (data: ResearchAxis[]) => {
          this.researchaxisOptions = data;
      },
      error => {
          console.error('Erreur lors de la récupération de tous les researchaxis:', error);
      }
  );
}


toggleSelectionresearchaxischercheur (researchaxis, isChecked: boolean) {
  if (isChecked) {
      // Add chercheur to selectedChercheurs array if not already present
      if (!this.isSelected(researchaxis)) {
          this.selectedresearchaxis.push(researchaxis);
      }
  } else {
      // Remove chercheur from selectedChercheurs array
      this.selectedresearchaxis = this.selectedresearchaxis.filter(selectedresearchaxiss => selectedresearchaxiss.id !== researchaxis.id);
  }
}

isSelectedresearchaxis(researchaxis: ResearchAxis): boolean {
  return this.selectedresearchaxis.some(selectedresearchaxiss => selectedresearchaxiss.id === researchaxis.id);
}
navigateToPublications(rdiId: number) {
  this.router.navigate(['publications', rdiId]);
}
navigateToreseachaxis(rdiId: number) {
  this.router.navigate(['ResearchAxis', rdiId]);
}
navigateToreseachaxisAll() {
  this.router.navigate(['ResearchAxis']);
}
navigateToRDIMembers(rdiId: number) {
  this.router.navigate(['RDIMember', rdiId]);
}
  fetchMembers(rdi: RDI) {
    this.rdiService.retrieveRDIMembers(rdi.id).subscribe(data => {
      rdi.RDIMembers = data;
    });
  }
  fetchpublications
  (rdi: RDI) {
    this.rdiService.retrieveRDIPublication(rdi.id).subscribe(data => {
      rdi.publication = data;
    });
  }
  fetchMembersAll() {
    this.rdiService.retrieveAllRDIMembers().subscribe(
      (data: RDIMember[]) => {
        this.members = data;
      },
      error => {
        console.error('Error fetching all members:', error);
      }
    );
  }

  deleteSelectedRDIs() {
    this.deleteRDIsDialog = true;
  }

  hideDeleteDialog() {
    this.deleteRDIDialog = false;
  }

  hideDeleteRDIsDialog() {
    this.deleteRDIsDialog = false;
  }

  toggleSelection(memberId: number, isChecked: boolean) {
    const member = this.members.find(member => member.id === memberId);
  
    if (isChecked) {
      if (!this.isSelected(member)) {
        this.selectedMembers.push(member);
      }
    } else {
      this.selectedMembers = this.selectedMembers.filter(selectedMember => selectedMember.id !== memberId);
    }
  }

  isSelected(member: RDIMember): boolean {
    return this.selectedMembers.some(selectedMember => selectedMember.id === member.id);
  }
  hasResponsable(rdi: RDI): boolean {
    return rdi.RDIMembers.some(member => member.position === 'ResponsableRDI');
  }
  
}

