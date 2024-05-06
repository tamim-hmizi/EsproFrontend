import { Component,OnInit } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { Position } from 'src/app/demo/api/position'; 
import { PositionService } from 'src/app/demo/service/position.service';
import{RegisterRequest} from 'src/app/demo/api/RegisterRequest';
import {AuthService} from '../../../service/auth.service';
import { Router } from '@angular/router';

import { FormControl, Validators } from '@angular/forms';
import {AuthenticationResponse} from 'src/app/demo/api/AuthenticationResponse';
@Component({
  selector: 'app-register',

  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{
  constructor(public layoutService: LayoutService,private router:Router,public positionService:PositionService,private authService: AuthService) { }
registerRequest:RegisterRequest;
errorMsg: Array<string>=[""];
authenticationResponse:AuthenticationResponse;
 // constructor(public layoutService: LayoutService,private authService: AuthService,private router:Router) { }


  availablePositions: Position[] = [];
  selectedPositions :Position[] = [];
  password = new FormControl('', [Validators.required, Validators.pattern('^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$')]);





 passwordStrengthValidator(password: string): { [key: string]: boolean } | null {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!regex.test(password)) {
      return { passwordStrength: true }; // Error object with key 'passwordStrength'
    }
    return null; // Valid password
  }

  fetchAvailablePositions() {
    this.positionService.getAllPositions().subscribe(d => {
        this.availablePositions = d;
    });
  }

  ngOnInit(){
   this. registerRequest={
      nameU: '',
      surnameU: '',
      email: '',
      telnum: 0,
      img: '',
      password: ''
      };





    



  //this.fetchAvailablePositions();

  }
  register() {
    // Vider toujours le message d'erreur à chaque soumission
    // this.errorMsg = [];
    if (this.password.invalid) {
      return; // Prevent submission if password is invalid
    }
  


    
    this.authService.register(this.registerRequest).subscribe({
      next: (data) => {
        this.authenticationResponse = data;
        alert("register success");
        this. registerRequest={
          nameU: '',
          surnameU: '',
          email: '',
          telnum: 0,
          img: '',
          password: ''
          };
    
      





        this.router.navigate(['/auth/register']);
      },
      error: (err) => {
       
        if (err.status === 400) {
          this.errorMsg.push("email or password  incorrect.");
          console.error('Une erreur  lors de l\'enregistrement :', err);
           this.errorMsg = err.error;
        } else {
       
          console.error('Une erreur est survenue lors de l\'enregistrement :', err);
                 }
      }
    });
  }
}
