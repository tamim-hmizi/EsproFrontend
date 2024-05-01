import { Component,OnInit } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import {AuthService} from '../../../service/auth.service';
import {TokenService} from '../../../service/token.service';
import {AuthenticationResponse} from 'src/app/demo/api/AuthenticationResponse';
import {AuthenticationRequest} from 'src/app/demo/api/AuthenticationRequest';
import {forgetpassService} from 'src/app/demo/service/forgetpass.service';

import { Router } from '@angular/router';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class LoginComponent {


  
  authenticationRequest : AuthenticationRequest={
    password :"",
    email:"",

  }
  authenticationResponse :AuthenticationResponse;

  errorMsg: Array<string>=[""];//pour afficher les erreurs


  valCheck: string[] = ['remember'];
  otpDialog: boolean = false;
  verifDialog: boolean = false;
  submittedd: boolean = false;
  confirmNewPwd:string = '';
  newPwd:string = '';
  changePassword:string;
  errorMsgmail: Array<string>=[""];

  changepwdDialog: boolean = false;
  
  constructor(public layoutService: LayoutService,private authService: AuthService,private router:Router,private tokenService:TokenService,private forgetpwdService:forgetpassService) { }



  ngOnInit() {

   this.newPwd = '';
   //this.email='';
   this.changePassword='';
   this.errorMsg=[''];
   this.errorMsgmail=[''];
this.authenticationRequest.email="";
  }












  login() {
    // vider le msg err chaque submitt
    this.errorMsg = [];
   this.errorMsgmail=[];
    
    this.authService.authenticate(this.authenticationRequest).subscribe({
      next: (data) => {
        this.authenticationResponse = data;
       
     
this.tokenService.setToken(data.jwt,data.nameU,data.surnameU,data.role);
       alert("login success");
           // this.router.navigate(['/admin']);
          this. RedirectBasedOnRole();

      },
      error: (err) => {
        if (err.status === 401) {

          this.errorMsg.push("email or password  incorrect.");
          console.log("Erreur lors de la tentative de connexion :", err);
        } else {
        
          this.errorMsg.push("Une erreur s'est produite lors de la connexion : " + err.message);
        }
      }
    });
  
 ;
  }



    email="";
    otp:number;
//to show the mail verif'dialog
    verifMailing() {
     // this.user = { ...user };
      this.verifDialog=true;
    }


   

//send mail to user
verifMailer( ){
  this.errorMsgmail=[];
  this.forgetpwdService.mailVerification(this.email).subscribe({
    next: (data) => {

      this.otpDialog=true;
   
    },
    error: (err) => {
      console.log("Error:", err);
      this.errorMsgmail.push("Email not found"); // Ajouter le message d'erreur à la liste des erreurs
    }
  });

;
  
}



verifOTP(){
this.forgetpwdService.verifOtp(this.otp,this.email).subscribe({
  next: (data) => {
 //this.changepwdDialog=true;
 console.log('Réponse du serveur :', data);
 this.changepwdDialog=true;
  },
  error: (err) => {
    console.error('Erreur lors de la requête :', err);
 
  }
});

;

}




changerPassword(){


  if (this.newPwd === this.confirmNewPwd) {
   // console.log('Réponse du serveur :', this.newPwd ,this.email);
    this.forgetpwdService.changePassword(this.newPwd,this.email).subscribe({
      next: (data) => {
   
     console.log('Réponse du serveur :', data);
 
    this.hideDialogNEWpass();

      },
      error: (err) => {
        console.error('Erreur lors de la requête :', err);
     
      }
    });
    
    ;
    
  }

  else {
    console.error("Les chaînes ne sont pas égales.");
    this.errorMsg.push("password not the same"); // Ajouter le message d'erreur à la liste des erreurs
  

  }
}





hideDialogEmail() {
 // this.userDialog = false;
  //this.submitted = false;
}
hideDialogOTP() {
 // this.userDialog = false;
  //this.submitted = false;
}

hideDialogNEWpass() {
  //this.userDialog = false;
  this.changepwdDialog = false;
  this.otpDialog =false;
  this.verifDialog = false;
}





//changePassword
/*
console.log('Réponse du serveur :', this.newPwd ,this.email);
this.forgetpwdService.changePassword(this.newPwd,this.email);

    alert("password changed successfuly");
    
    this.router.navigate(['/skill']); // Remplacez '/pageX' par le chemin de votre page X
  } else {
    // Autre action si les chaînes ne sont pas égales
    console.error("Les chaînes ne sont pas égales.");
    this.errorMsg.push("password not the same"); // Ajouter le message d'erreur à la liste des erreurs
  
  }
*/





RedirectTOregister(){
  this.router.navigate(['/auth/register']);
        

}


role:string ='';

RedirectBasedOnRole(){
 this.role =localStorage.getItem('role');
 switch(this.role) {
  case 'ADMIN':
    this.router.navigate(['/admin']);
    break;
  case 'USER':
    this.router.navigate(['/profile']); 
    break; 
  default: 
    this.router.navigate(['/']); // Default landing page
}  

}





/*
    onSubmit() {
      this.authService.authenticate(this.authenticationRequest).subscribe(
        response => {
          
                if (response.jwt) {
                  alert(response.jwt);
                  const jwtToken = response.jwt;
                  localStorage.setItem('JWT', jwtToken);
                  //this.router.navigateByUrl('/dashboard');
               
                this.router.navigate(['/accueil']);
              } else {
                // Connexion échouée, afficher un message d'erreur à l'utilisateur
                //console.log('La connexion a échoué :', response.message);
                // Afficher le message d'erreur à l'utilisateur ou effectuer d'autres actions
              }
            },
            error => {
              // Gérer les erreurs
              console.log('Erreur:', error);
              // Afficher un message d'erreur à l'utilisateur
            }
          );
    }

    




    redirectToMailVerif(){
      this.router.navigate(['/skill']);

    }




*/


}
