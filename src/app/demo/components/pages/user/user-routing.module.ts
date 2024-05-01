import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserComponent } from './user.component';
import { PositionComponent } from '../position/position.component';

@NgModule({
	imports: [RouterModule.forChild([
        { path: '', component: UserComponent },
      
	])],
	exports: [RouterModule]
})
export class UserRoutingModule { }
