import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { PositionComponent } from '../position/position.component';

@NgModule({
	imports: [RouterModule.forChild([
        { path: '', component: ProfileComponent },
      
	])],
	exports: [RouterModule]
})
export class UserRoutingModule { }
