import { Component, OnInit } from '@angular/core';
import { Publication } from 'src/app/demo/api/Publication';
import { PublicationService } from 'src/app/demo/service/Publication.service';
import { MessageService } from 'primeng/api';
import { RDIMember } from 'src/app/demo/api/RDIMember';
import { RDI } from 'src/app/demo/api/RDI';
import { ActivatedRoute } from '@angular/router';
import { TypeP } from 'src/app/demo/api/enum';
import { FormGroup, FormControl, Validators, ValidationErrors, ValidatorFn ,AbstractControl } from '@angular/forms';
import { map, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';


@Component({
  templateUrl: './publication.component.html', // Path to your HTML template
  styleUrls: ['./Publication.component.css'],
  providers: [MessageService]
})
export class PublicationComponent implements OnInit {
  publications: Publication[] = [];
  cols: any[];
  display: boolean = false;
  publicationForm: FormGroup;

  publicationDialog: boolean = false;
  deletePublicationDialog: boolean = false;
  deletePublicationsDialog: boolean = false;
  submitted: boolean = false;
  selectedChercheurs: RDIMember[] = [];
  selectedCountryAdvanced: { label: string; value: TypeP };
  chercheurs : RDIMember[] = [];
  newPublication: Publication = {
    id: 0,
    descriptionP: '',
    subjectP: '',
    dateP: new Date(),
    chercheurs:  [...this.selectedChercheurs] ,
    typeP: null ,
  link:''

  };
  addPublicationForm: FormGroup;

  editMode = false;
  selectedPublications: Publication[] = [];
  maxDate = new Date();  // Utilisez new Date() pour définir la date maximale
   minOneSelectionValidator: ValidatorFn = (control: FormControl): ValidationErrors | null => {
    return (control.value && control.value.length > 0) ? null : { minOneRequired: true };
  };

  constructor(private publicationService: PublicationService,
              private messageService: MessageService,
              private route: ActivatedRoute
             ) { }

              ngOnInit(): void {
                this.route.params.subscribe(params => {
                  this.cols = [
                    { field: 'DescriptionP', header: 'Description' },
                    { field: 'SubjectP', header: 'Subject' },
                    { field: 'DateP', header: 'Date' }, // Assuming you want to display the DateP field in the table
                  ];   
                  this.maxDate = new Date(); 
                  const rdiMemberid = +params['rdiMemberid']; // Convert parameter to number if it's not already

                  const rdiId = +params['rdiId']; // Convert parameter to number if it's not already
              
                  if (rdiId && !isNaN(+rdiId)) {
                    // If rdiId is present and valid, load publications by RDI ID
                    this.loadPublicationsByRdiId(+rdiId);
                    this.fetchChercheursbyRdi(+rdiId);
                  } else
                   {
                    // If no rdiId or rdiMemberid or invalid, fetch all chercheurs and load all publications
                    this.fetchChercheursAll();
                    this.loadPublications();
                  }
                  this.addPublicationForm = new FormGroup({
                    description: new FormControl(this.newPublication.descriptionP, [
                      Validators.required,
                      Validators.minLength(3),
                    ]),
                    subject: new FormControl(this.newPublication.subjectP, [
                      Validators.required,
                      Validators.minLength(3),
                      Validators.maxLength(150),
                    ]),
                    Chercheurs: new FormControl(this.selectedChercheurs, [this.minOneSelectionValidator]), // Validator personnalisé
                    categorie: new FormControl(this.selectedCountryAdvanced, Validators.required), // Validation requise
                    link: new FormControl(this.newPublication.link, {
                      validators: [Validators.pattern('https?://.+')],
                      asyncValidators: [this.linkUniqueValidator.bind(this)], // Utilisation d'un validateur asynchrone
                      updateOn: 'blur', // Validation déclenchée lors de la perte du focus
                    }),
                    date: new FormControl(this.newPublication.dateP, Validators.required),
              
                  });
                  
                });
              
            
            
              }
              linkUniqueValidator(control: AbstractControl): Observable<{ unique: boolean } | null> {
                const link = control.value;
                return this.publicationService.getAllPublications().pipe(
                  debounceTime(300), // Évite les vérifications multiples lors de la saisie
                  distinctUntilChanged(),
                  switchMap((publications: any[]) => {
                    const linkExists = publications.some(publication => publication.link === link);
                    return of(linkExists ? { unique: true } : null);
                  })
                );
              }
              get description(){return this.addPublicationForm.get('description')}
              get subject(){return this.addPublicationForm.get('subject')}
              get Chercheurs(){return this.addPublicationForm.get('Chercheurs')}
              get categorie(){return this.addPublicationForm.get('categorie')}
              get link(){return this.addPublicationForm.get('link')}
              get date(){return this.addPublicationForm.get('date')}
              populateForm(publication: Publication): void {
                const formattedDate = new Date(publication.dateP); // Convertit en objet Date
                this.TypeOptions.forEach(option => {
                  if (option.value === publication.typeP) {  // Correction de l'opérateur
                    this.addPublicationForm.patchValue({
                      description: publication.descriptionP,
                      subject: publication.subjectP,
                      date: formattedDate, // Assurez-vous d'utiliser le format correct
                      
                      categorie: option,
                      Chercheurs: publication.chercheurs,
                      link:publication.link,
    
    
                    });                     
                  }
              });
               
              }
             
              
              TypeOptions: { label: string; value: TypeP }[] = [
                { label: 'Articles de Revues Scientifiques', value: TypeP.A },
                { label: 'Livres ou Chapitres de Livres', value: TypeP.B },
                { label: 'Communications de Conférences', value: TypeP.C },
                { label: 'Rapports Techniques', value: TypeP.D },
                { label: 'Documents de Travail', value: TypeP.E },
                { label: 'Articles de Revues Professionnelles ou Industrielles', value: TypeP.F },
                { label: 'Articles Opinion ou Commentaires', value: TypeP.G }
              ];
              
              filteredCountries:{ label: string; value: TypeP }[] = [];  // Pour les suggestions filtrées
  loadPublications() {
    
    this.publicationService.getAllPublications().subscribe(publications => {
      this.publications = publications;
      // Fetch chercheurs for each publication
      this.publications.forEach(publication => {
        this.fetchChercheurs(publication);
      });
    });
  }
  loadPublicationsByRdiId(rdiId: number) {
    this.fetchChercheursbyRdi(rdiId);
    // Call your publication service method to fetch publications associated with the RDI ID
    // Example:
     this.publicationService.getPublicationsByRdiId(rdiId).subscribe(publications => {
      this.publications = publications;
      // Fetch chercheurs for each publication
      this.publications.forEach(publication => {
        this.fetchChercheurs(publication);
      });
    });
}
loadPublicationsByRdiMemberId(rdiMemberid: number) {
  // Call your publication service method to fetch publications associated with the RDI ID
  // Example:
   this.publicationService.getPublicationsByRdiMemberId(rdiMemberid).subscribe(publications => {
    this.publications = publications;
    // Fetch chercheurs for each publication
    /*this.publications.forEach(publication => {
      this.fetchChercheurs(publication);
    });*/
  });
}
  openNew() {
    this.newPublication = {
      id: 0,
    descriptionP: '',
    subjectP: '',
    dateP: new Date(),
    chercheurs:  [] ,
    typeP: null ,
  link:''
    };
    this.addPublicationForm.get('link').enable();
    this.addPublicationForm.reset(); // Remet à zéro tous les champs du formulaire

    this.populateForm(this.newPublication);
    this.selectedRDIMembers = [];
   
    this.editMode = false;
    this.publicationDialog = true;
  }
  editPublication(publication: Publication) {
    this.populateForm(publication); // Mettre à jour le FormGroup
    this.newPublication.id=publication.id;

this.addPublicationForm.get('link').valid;
this.addPublicationForm.get('link').disable(); // Désactive le champ 'link'

    publication.chercheurs.forEach(chercheur => {this.toggleSelection(chercheur,true);
    });
  
  
 
      this.editMode = true;
    this.publicationDialog = true;
    
  }

  deletePublication(publication: Publication) {
    this.newPublication = { ...publication };
    this.deletePublicationDialog = true;
  }
  showDescription(publication: Publication)

  {
 this.newPublication = { ...publication };
    this.display = true;
  }
  confirmDeletePublication() {
    this.deletePublicationDialog = false;
    this.publicationService.deletePublication(this.newPublication.id).subscribe(() => {
      this.ngOnInit();
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Publication Deleted', life: 3000 });
    }, error => {
      console.error('Error deleting publication:', error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete publication', life: 3000 });
    });
  }

  confirmDeleteSelectedPublications() {
    this.deletePublicationsDialog = false;
    const selectedIds = this.selectedPublications.map(publication => publication.id);
    selectedIds.forEach(id => {
      this.publicationService.deletePublication(id).subscribe(() => {
        this.ngOnInit();
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Publication Deleted', life: 3000 });
      }, error => {
        console.error('Error deleting publication:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete publication', life: 3000 });
      });
    });
    this.selectedPublications = [];
  }

  savePublication() {
    if (this.editMode) {

      this.updatePublication();
    } else {

      this.addPublication();
    }
  }
  SetPublication(): void {
    const clonedSelectedChercheurs =[...this.addPublicationForm.get('Chercheurs').value];
    
    this.newPublication.chercheurs = clonedSelectedChercheurs; 
    this.selectedCountryAdvanced = this.addPublicationForm.get('categorie')?.value;

    // Assigner les valeurs du formulaire à `newPublication`
    this.newPublication.typeP = this.selectedCountryAdvanced.value;
    this.newPublication.descriptionP = this.addPublicationForm.get('description')?.value;
    this.newPublication.subjectP = this.addPublicationForm.get('subject')?.value;
    this.newPublication.dateP = this.addPublicationForm.get('date')?.value;
    this.newPublication.link = this.addPublicationForm.get('link')?.value;
  }
  addPublication() {
this.SetPublication();
  
  this.publicationService.addPublication(this.newPublication).subscribe(
    (newPublication) => {
      this.ngOnInit();
      this.messageService.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Publication ajoutée',
        life: 3000,
      });
      this.cancelEdit(); // Annuler le mode d'édition
    },
    (error) => {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Impossible d’ajouter la publication',
        life: 3000,
      });
    }
  );
}

  
  
 
  
  updatePublication() {
this.SetPublication();
    this.publicationService.updatePublication(this.newPublication).subscribe(() => {
      this.ngOnInit();
      
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Publication Updated', life: 3000 });
    }, error => {
      console.error('Error updating publication:', error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update publication', life: 3000 });
    });
    this.cancelEdit();
  }

  cancelEdit() {

    this.addPublicationForm.reset(); // Remet à zéro tous les champs du formulaire


    this.editMode = false;
    this.publicationDialog = false;
  }

  hideDialog() {
    this.addPublicationForm.reset(); // Remet à zéro tous les champs du formulaire

    this.publicationDialog = false;
    this.submitted = false;
  }
  
  fetchChercheurs(publication: Publication) {
    this.publicationService.getChercheurs(publication.id).subscribe(data => {
      publication.chercheurs = data;
    });
  }
 // Déclarer la variable correctement avec la bonne casse

// Modify the component class
chercheurOptions: RDIMember[] = []; // Assurez-vous de remplir cette liste avec les données appropriées

// Fonction pour récupérer les chercheurs
// Dans votre composant TypeScript
fetchChercheursAll() {
  this.publicationService.getChercheursAll().subscribe(
      (data: RDIMember[]) => {
          this.chercheurOptions = data;
      },
      error => {
          console.error('Erreur lors de la récupération de tous les chercheurs:', error);
      }
  );
}
fetchChercheursbyRdi(id :number) {
  this.publicationService.getChercheursbyRdi(id).subscribe(
      (data: RDIMember[]) => {
          this.chercheurOptions = data;
      },
      error => {
          console.error('Erreur lors de la récupération de tous les chercheurs:', error);
      }
  );
}

    deleteSelectedPublications() {
      this.deletePublicationsDialog = true;
    }
  
    hideDeleteDialog() {
      this.deletePublicationDialog = false;
    }
  
    hideDeletePublicationsDialog() {
      this.deletePublicationsDialog = false;
    }
    selectedRDIMembers: RDIMember[] = [];
// Check if a chercheur is selected


// Toggle selection of a chercheur
// Toggle selection of a chercheur
toggleSelection(chercheur: RDIMember, isChecked: boolean) {
  if (isChecked) {
      // Add chercheur to selectedChercheurs array if not already present
      if (!this.isSelected(chercheur)) {
          this.selectedChercheurs.push(chercheur);
      }
  } else {
      // Remove chercheur from selectedChercheurs array
      this.selectedChercheurs = this.selectedChercheurs.filter(selectedChercheur => selectedChercheur.id !== chercheur.id);
  }
}



filterCountry(event: any) {
  const query = event.query.toLowerCase();
  this.filteredCountries = this.TypeOptions.filter(option =>
    option.label.toLowerCase().startsWith(query)  // Filtre par début de chaîne
  );
}



// publication.component.ts

toggleSelections(chercheurId: number, isChecked: boolean) {
  // Find the chercheur object with the corresponding ID
  const chercheur = this.chercheurOptions.find(chercheur => chercheur.id === chercheurId);
  
  if (isChecked) {
    // Add chercheur to selectedChercheurs array if not already present
    if (!this.isSelected(chercheur)) {
      this.selectedChercheurs.push(chercheur);
    }
  } else {
    // Remove chercheur from selectedChercheurs array
    this.selectedChercheurs = this.selectedChercheurs.filter(selectedChercheur => selectedChercheur.id !== chercheurId);
  }
}

isSelected(chercheur: RDIMember): boolean {
  return this.selectedChercheurs.some(selectedChercheur => selectedChercheur.id === chercheur.id);
}

// Liste de couleurs claires
readonly pastelColors: string[] = [
  '#ffcccc', // Rouge clair
  '#ffddcc', // Orange clair
  '#ffecb3', // Jaune clair
  '#ccffcc', // Vert clair
  '#cceeff', // Bleu clair
  '#e1bee7', // Violet clair
  '#f8bbd0', // Rose clair
  '#d1c4e9', // Indigo clair
];

// Fonction pour obtenir une couleur unique par chercheur
getAvatarColor(name: string): string {
  const index = Math.abs(this.hashString(name) % this.pastelColors.length);
  return this.pastelColors[index];
}

// Fonction pour créer un hash à partir d'une chaîne (nom)
hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char; // Décalage bitwise
    hash |= 0; // Convertir à 32 bits
  }
  return hash;
}
// Déclarez une variable pour contrôler l'affichage de tous les chercheurs
showAll: boolean = false;

// Fonction pour basculer l'affichage de tous les chercheurs
toggleShowAll() {
  this.showAll = !this.showAll;  // Inverser la valeur de showAll
}


getColorFromHash(input: string): string {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
        hash = input.charCodeAt(i) + ((hash << 5) - hash);  // Shift et addition pour obtenir un hash
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {  // Génère trois parties pour une couleur hexadécimale
        const value = (hash >> (i * 8)) & 0xFF;
        color += ('00' + value.toString(16)).substr(-2);  // Ajout de zéros si nécessaire
    }
    return color;
}



  }
  
