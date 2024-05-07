import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RdiFrontComponent } from './rdifront.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: RdiFrontComponent }

	])],
	exports: [RouterModule]
})
export class RdiFrontRoutingModule { }
