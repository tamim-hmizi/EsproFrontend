import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RDIMemberComponent } from './RDIMember.Component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: RDIMemberComponent }
	])],
	exports: [RouterModule]
})
export class RDIMemberRoutingModule { }
