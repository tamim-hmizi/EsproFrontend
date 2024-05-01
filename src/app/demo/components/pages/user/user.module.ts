import { NgModule } from '@angular/core';
//import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { PositionComponent } from '../position/position.component';
import { academicSp } from 'src/app/demo/api/academicSp';
import { FormsModule } from '@angular/forms';
import { UserRoutingModule } from './user-routing.module'
import { UserService} from '../../../service/user.service';

import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';




@NgModule({
  declarations:[UserComponent], //declarer les components presentes dans ce module user
  imports: [
    CommonModule,
    UserRoutingModule,
    TableModule,
    FileUploadModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    RatingModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    RadioButtonModule,
    InputNumberModule,
    DialogModule,
    //HttpClientModule,
   
   
    TableModule,
    FileUploadModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    RatingModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    RadioButtonModule,
    InputNumberModule,
    DialogModule
]//,//providers: [UserService]
})
export class UserModule { }
