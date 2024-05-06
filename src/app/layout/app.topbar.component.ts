import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import {AuthService} from '../../app/demo/service/auth.service';
import { Router } from '@angular/router';
@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    items!: MenuItem[];

  //  itemss!: SelectItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(public layoutService: LayoutService,private router:Router, private authService:AuthService) { 
      
}



logout() {
    localStorage.clear();
    this.router.navigate(['/auth/login']);
   
}

mfaEnabled = false;

toggleState() {
    this.mfaEnabled = !this.mfaEnabled;

    // Envoyer la demande à votre backend pour mettre à jour l'état de 2FA
    this.authService.updateMfa(parseInt(localStorage.getItem('idU')), this.mfaEnabled.toString()).subscribe({
        next: (data) => {
    
            console.log("success");
       
        },
        error: (err) => {
          console.log("Error:", err);
          //this.errorMsgmail.push("Email not found"); // Ajouter le message d'erreur à la liste des erreurs
        }
      });
    
    ;
}
/*
updateMfa(idU:number,mfaEnabled:string): Observable<any>{
  return this.http.post<any>(`${this.baseUrll}/updatemfa/${idU}`, mfaEnabled);
}
 */




   
}
