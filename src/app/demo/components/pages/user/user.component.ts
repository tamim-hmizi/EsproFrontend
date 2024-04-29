import { Component , OnInit} from '@angular/core';

import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { UserService } from 'src/app/demo/service/user.service'; 
import { PositionService } from 'src/app/demo/service/position.service'; 
import { User } from 'src/app/demo/api/user';
import { Position } from 'src/app/demo/api/position';
import { Role } from 'src/app/demo/api/role';
@Component({
  selector: 'app-user',
  
  //imports: [],
  templateUrl: './user.component.html',
  providers: [MessageService]
})
export class UserComponent {
  users: User[] = [];
  imgUrl: string | ArrayBuffer = 'src/assets/photo';


  user: User= {
    idU: 0,
    nameU: '',
    surnameU: '',
    email: '',
    telnum: 0,
    img: '',
    password: '',
    role:null,
    positions: []
};


  cols: any[] = [];
  userDialog: boolean = false;
  userEditDialog: boolean = false;
  submitted: boolean = false;
  //skillDialog: boolean = false;
  deleteUserDialog: boolean = false;
  deleteUsersDialog: boolean = false;

  selectedUsers: User[] = [];
  availablePositions: Position[] = [];
  selectedPositions :Position[] = [];

  


  selectedRole: String; 
  roles: any[] = [ 
    { label: 'ADMIN', value: 'ADMIN' },
    { label: 'User', value: 'USER' },
  
  ];




  convertToRole(roleString: String): Role {
    switch (roleString) {
      case 'ADMIN':
        return Role.Admin;
      case 'USER':
        return Role.User;
      default:
        throw new Error('Invalid role string');
    }
  }






  
  constructor(private userService: UserService,private positionService: PositionService,private messageService: MessageService) { }
//1er methode sera chargé avec chargement de ce compenent
  ngOnInit() {
    this.userService.getAllUsers().subscribe(data => this.users = data)
     

      this.cols = [
          { field: 'idU', header: 'IDU' },
          { field: 'email', header: 'Email' },
          { field: 'nameU', header: 'NameU' },
          { field: 'surnameU', header: 'SurnameU' },
          { field: 'telnum', header: 'Telnum' },
          { field: 'img', header: 'Img' },
          { field: 'role', header: 'Role' },
         
      ];

      this.fetchAvailablePositions();
      if(!this.users)
      
      {
        this.messageService.add({ severity: 'success', summary: 'failed', detail: 'no user found', life: 3000 });
      }


    
  }


  
// Fetch available skills
fetchAvailablePositions() {
  this.positionService.getAllPositions().subscribe(d => {
      this.availablePositions = d;
  });
}

  openNew() {
    this.user = { idU: 0, nameU: '', surnameU: '',email:'',password: '',telnum: 5,img:'', role:Role.Admin,  positions: []};
    this.submitted = false;
    this.userDialog = true;
   // this.moduleDialog = true;
    this.selectedPositions= []; // Clear selectedSkills array
  
}








editUser(user: User) {
  this.user = { ...user };
  this.userEditDialog=true;
}

deleteUser(user: User) {
  this.deleteUserDialog = true;
  this.user = { ...user };
}

deleteSelectedUsers() {
  this.deleteUsersDialog = true;
}



confirmDeleteSelected() {
  this.deleteUsersDialog = false;
  const selectedIds = this.selectedUsers.map(module => module.idU);
  selectedIds.forEach(id => {
      this.userService.removeUser(id).subscribe(() => {
          this.users = this.users.filter(val => val.idU !== id);
          this.selectedUsers = this.selectedUsers.filter(module => module.idU !== id);
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Module Deleted', life: 3000 });
      }, error => {
          console.error('Error deleting module:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete module', life: 3000 });
      });
  });
}



confirmDelete() {
  this.deleteUserDialog = false;
  this.userService.removeUser(this.user.idU).subscribe(() => {
      this.users = this.users.filter(val => val.idU !== this.user.idU);
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Module Deleted', life: 3000 });
      this.user = { idU: 0, nameU: '', surnameU: '',email:'',password: '',telnum: 5,img:'', role:Role.Admin,  positions: []};
   
  }, error => {
      console.error('Error deleting module:', error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete module', life: 3000 });
  });
}

hideDialog() {
  this.userDialog = false;
  this.submitted = false;
}

hideDialogE() {
  this.userEditDialog = false;
  this.submitted = false;
}


saveUser() {
  this.submitted = true;

        // Assign selected skills to module.skills
        this.user.positions = this.selectedPositions.map(position => ({ ...position }));

        if (this.user.idU === 0) {
            console.log('New Module Object:', this.user); // Log the module object before API call
            this.userService.addUser(this.user).subscribe(newModule => {
                this.users.push(newModule);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Module Added', life: 3000 });
            });
  } else {
      console.log('Updated Module Object:', this.user); // Log the module object before API call
      this.userService.updateUser(this.user.idU,this.user).subscribe(updatedUser => {
          const index = this.users.findIndex(m => m.idU === updatedUser.idU);
          if (index !== -1) {
              this.users[index] = updatedUser;
          }
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Module Updated', life: 3000 });
      });
  }
  this.userDialog = false;
  this.userEditDialog = false;
  
  this.user = {
    idU: 0,
    nameU: '',
    surnameU: '',
    email: '',
    telnum: 0,
    img: '',
    password: '',
    role:null,
    positions: []
  };
}








/*confirmDeleteSelected() {
  this.deleteUsersDialog = false;
  this.users = this.users.filter(val => !this.selectedUsers.includes(val));
  this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Users Deleted', life: 3000 });
  this.selectedUsers = [];
}

confirmDelete() {
  this.deleteUserDialog = false;
  this.userService.removeUser(this.user.idU).subscribe(() => {
      this.users = this.users.filter(val => val.idU !== this.user.idU);
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Deleted', life: 3000 });
      this.user = { idU: 0, nameU: '', surnameU: '',email:'',telnum:0,password:'',img:'', role:null,  positions: [] };
  });
}


saveUser() {
  if (this.user.idU === 0) {
    this.user.role = this.convertToRole(this.selectedRole)
      this.userService.addUser(this.user).subscribe(newUser => {
          this.users.push(newUser);
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Added', life: 3000 });
      });
  } else {
      this.userService.updateUser(this.user.idU,this.user).subscribe(updatedUser => {
          const index = this.users.findIndex(s => s.idU === updatedUser.idU);
          if (index !== -1) {
              this.users[index] = updatedUser;
          }
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Updated', life: 3000 });
      });
  }
  this.skillDialog = false;
  this.user = { idU: 0, nameU: '', surnameU: '',email:'',telnum:0,password:'',img:'',role:null,  positions: [] };
}*/


onGlobalFilter(table: Table, event: Event) {
  table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
}

// Check if a skill is selected
isSelected(position: Position): boolean {
  return this.selectedPositions.some(selectedPosition => selectedPosition.idP === position.idP);
}

// Toggle selection of a skill
toggleSelection(position: Position, event: any) {
  if (event) {
      // Add skill to selectedSkills array
      this.selectedPositions.push(position);
  } else {
      // Remove skill from selectedSkills array
      this.selectedPositions = this.selectedPositions.filter(selectedPosition => selectedPosition.idP !== position.idP);
  }
}


}
