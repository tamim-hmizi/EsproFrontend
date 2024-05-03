import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {ClassroomComponent} from './classroom.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: ClassroomComponent }
    ])],
    exports: [RouterModule]
})
export class ClassroomRoutingModule { }
