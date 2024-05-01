import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RegisterComponent} from './register.component'

import { RegisterRoutingModule } from './register-routing-module';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  
  imports: [
    CommonModule,
    RegisterRoutingModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    PasswordModule


    
    

  ],


  //declarer les components qui sont inclus dans le module
  declarations: [RegisterComponent]
})
export class RegisterModule { }
