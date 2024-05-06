import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserComponent } from './user.component';
import { PositionComponent } from '../position/position.component';
import { StatsComponentComponent } from './stats-component/stats-component.component';
@NgModule({
	imports: [RouterModule.forChild([
        { path: '', component: UserComponent },
		{ path: 'stat', component: StatsComponentComponent },
      
	])],
	exports: [RouterModule]
})
export class UserRoutingModule { }
