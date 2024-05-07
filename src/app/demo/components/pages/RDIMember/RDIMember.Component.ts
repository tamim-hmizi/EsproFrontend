import { Component, OnInit , ViewChild, ElementRef} from '@angular/core';
import { RDIMember } from 'src/app/demo/api/RDIMember'; // Import the RDIMember interface
import { RDIMemberService } from 'src/app/demo/service/rdi-member.service'; // Import the RDIMemberService
import { MessageService } from 'primeng/api';
import { RDIPost } from 'src/app/demo/api/enum';
import { User } from 'src/app/demo/api/user'; // Import the RDIMember interface
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { RDI } from 'src/app/demo/api/RDI';
import { U } from '@fullcalendar/core/internal-common';
import { BehaviorSubject } from 'rxjs';

@Component({
  templateUrl: './RDIMember.component.html', // Path to your HTML template
  styleUrls: ['./RDIMember.component.css'],
  providers: [MessageService]
})
export class RDIMemberComponent implements OnInit   {
  rdiMembers: RDIMember[] = [];
  cols: any[];
  rdiMemberDialog: boolean = false;
  deleteRDIMemberDialog: boolean = false;
  deleteRDIMembersDialog: boolean = false;
  submitted: boolean = false;
  selectedRDIMembers: RDIMember[] = [];
  selectedUser : User= null;
  userOptions: User[] =[];
 
  dropdownSubject = new BehaviorSubject<boolean>(false);
  @ViewChild('dialogRef') dialogRef: ElementRef; // Assurez-vous que le nom correspond


 
  newRDIMember: RDIMember = {
    id: 0,
    position: RDIPost.Chercheur, // Update with appropriate data type
    Publications: [], // Update with appropriate data type
    rdi:null, // Update with appropriate data type
    user : this.selectedUser,// Update with appropriate data type
    dateP: new Date() // Ajoute la date d'aujourd'hui
  };
  editMode = false;
  rdiId :number;
  RDI : RDI;

  constructor(private rdiMemberService: RDIMemberService,
              private messageService: MessageService,private route: ActivatedRoute,private router: Router) { }

              ngOnInit(): void {
                this.route.params.subscribe(params => {
                  this.cols = [
                    { field: 'Position', header: 'Position' },
                    // Add more columns as needed
                  ];  
              
                 this.rdiId = +params['rdiId']; // Convert parameter to number if it's not already
              
                  if (this.rdiId && !isNaN(this.rdiId)) {
                    // If rdiId is present and valid, load RDIMembers by RDI ID
                    this.loadRDIMembersByRdiId(this.rdiId);
                  } else {
                    // If no rdiId or invalid, fetch all chercheurs and load all publications
                    this.loadRDIMembers();
                    this.rdiId = null; // Reset this.rdiId to null
                  }
                });
                this.fetchUsersAll();

              }
              
              refreshUserOptions() {
                this.rdiMemberService.getUsersAll().subscribe((data: User[]) => {
                  this.userOptions = data;
                });
              }
              
              
              
              ngAfterViewInit() {
                this.dropdownSubject.subscribe((isOpen) => {
                  if (isOpen && this.dialogRef) {
                    const dialogElement = this.dialogRef.nativeElement;
                    dialogElement.style.height = '600px'; // Ajuste la hauteur du dialogue
                  }
                });
              }
            
              onDropdownChange() {
                this.dropdownSubject.next(true); // Indiquer que le dropdown est ouvert
              }

              
              fetchUsersAll() {
                this.rdiMemberService.getUsersAll().subscribe(
                    (data: User[]) => {
                        this.userOptions = data;
                    },
                    error => {
                        console.error('Erreur lors de la récupération de tous les users:', error);
                    }
                );
              }
  loadRDIMembers() {
    this.rdiMemberService.getAllRDIMembers().subscribe(rdiMembers => {
      this.rdiMembers = rdiMembers;
    });
  }

  openNew() {
    this.selectedUser=null;
this.selectedposition=null;
    this.newRDIMember = {
      id: 0,
      position: RDIPost.Chercheur, // Update with appropriate data type
      Publications: [], // Update with appropriate data type
      rdi: null, // Update with appropriate data type
      user:  this.selectedUser, // Update with appropriate data type
      dateP: new Date() // Ajoute la date d'aujourd'hui

    };
   
    this.editMode = false;
    this.rdiMemberDialog = true;
    this.refreshUserOptions(); // Réinitialiser les options du dropdown

  }
  
  editRDIMember(rdiMember: RDIMember) {
    this.selectedUser=rdiMember.user;
    this.selectedposition=rdiMember.position;
    this.newRDIMember = { ...rdiMember };
    this.editMode = true;
    this.rdiMemberDialog = true;

  }

  deleteRDIMember(rdiMember: RDIMember) {
    this.newRDIMember = { ...rdiMember };
    this.deleteRDIMemberDialog = true;
  }
 fetchuserAll() {
    this.rdiMemberService.getUsersAll().subscribe(
        (data: User[]) => {
            this.userOptions = data;
        },
        error => {
            console.error('Erreur lors de la récupération de tous les researchaxis:', error);
        }
    );
  }
  confirmDeleteRDIMember() {
    this.deleteRDIMemberDialog = false;
    this.rdiMemberService.deleteRDIMember(this.newRDIMember.id).subscribe(() => {
      this.loadRDIMembersByRdiId(this.rdiId);
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'RDIMember Deleted', life: 3000 });
    }, error => {
      console.error('Error deleting RDIMember:', error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete RDIMember', life: 3000 });
    });
  }
  
  confirmDeleteSelectedRDIMembers() {
    this.deleteRDIMembersDialog = false;
    const selectedIds = this.selectedRDIMembers.map(rdiMember => rdiMember.id);
    selectedIds.forEach(id => {
      this.rdiMemberService.deleteRDIMember(id).subscribe(() => {
        this.loadRDIMembersByRdiId(this.rdiId);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'RDIMember Deleted', life: 3000 });
      }, error => {
        console.error('Error deleting RDIMember:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete RDIMember', life: 3000 });
      });
    });
    this.selectedRDIMembers = [];
  }
  selectedposition: RDIPost;

  positionOptions = [
    { label: 'ResponsableRDI', value:RDIPost.ResponsableRDI  },
    { label: 'Chercheur', value: RDIPost.Chercheur }
];

loadRDIMembersByRdiId(rdiId: number) {
  this.rdiMemberService.getRDIMembersByRdiId(rdiId).subscribe(rdiMembers => {
    // Trier la liste pour que le "ResponsableRDI" soit en haut
    this.rdiMembers = rdiMembers.sort((a, b) => {
      if (a.position === RDIPost.ResponsableRDI) {
        return -1; // Mettre en haut
      } else if (b.position === RDIPost.ResponsableRDI) {
        return 1; // Mettre en bas
      } else {
        return 0; // Pas de changement
      }
    });
  });
}







saveRDIMember() {
 

  // Check if the selected user is already assigned to another position
  const userExists = this.rdiMembers.some(member => member.user.id === this.selectedUser.id);
  if (userExists && !this.editMode) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'This user is already assigned to another position', life: 3000 });
    return;
  }

  // Check if the selected position is "ResponsableRDI" and there is already a responsible assigned
  if (this.selectedposition === RDIPost.ResponsableRDI && this.rdiMembers.some(member => member.position === RDIPost.ResponsableRDI)) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'There can be only one responsible RDI', life: 3000 });
    return;
  }

  if (this.editMode) {
    this.updateRDIMember();
  } else {
    this.addRDIMember();
  }
}

  addRDIMember() {
   
        this.newRDIMember.position=this.selectedposition;
        this.newRDIMember.user=this.selectedUser;
    this.rdiMemberService.addRDIMember(this.newRDIMember,this.rdiId).subscribe(
      newRDIMember => {
        this.cancelEdit();
        this.loadRDIMembersByRdiId(this.rdiId);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'RDIMember Added', life: 3000 });
      },
      error => {
        console.error('Error adding RDIMember:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add RDIMember', life: 3000 });
      }
    );
  }
  navigateToPublications(rdiMemberid:number){  this.router.navigate(['publications',rdiMemberid]);
  this.selectedUser=null

}

  updateRDIMember() {
    this.newRDIMember.position=this.selectedposition;
    this.newRDIMember.user=this.selectedUser;
    this.rdiMemberService.updateRDIMember(this.newRDIMember).subscribe(() => {
      this.loadRDIMembersByRdiId(this.rdiId);
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'RDIMember Updated', life: 3000 });
    }, error => {
      console.error('Error updating RDIMember:', error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update RDIMember', life: 3000 });
    });
    this.cancelEdit();
    this.selectedUser=null
  }

  cancelEdit() {
    this.newRDIMember = {
      id: 0,
      position: RDIPost.Chercheur, // Update with appropriate data type
      Publications: [], // Update with appropriate data type
      rdi: null, // Update with appropriate data type
      user: null, // Update with appropriate data type
      dateP: new Date() // Ajoute la date d'aujourd'hui

    };
    this.editMode = false;
    this.rdiMemberDialog = false;
  }

  hideDialog() {
    this.rdiMemberDialog = false;
    this.submitted = false;

  }

 
  
  deleteSelectedRDIMembers() {
    this.deleteRDIMembersDialog = true;
  }

  hideDeleteRDIMemberDialog() {
    this.deleteRDIMemberDialog = false;
  }

  hideDeleteRDIMembersDialog() {
    this.deleteRDIMembersDialog = false;
  }

  selectedRDIMember: RDIMember;

  onRowSelect(event) {
    this.messageService.add({ severity: 'info', summary: 'RDIMember Selected', detail: 'Position: ' + event.data.Position, life: 3000 });
  }

  onRowUnselect(event) {
    this.messageService.add({ severity: 'info', summary: 'RDIMember Unselected', detail: 'Position: ' + event.data.Position, life: 3000 });
  }
}
