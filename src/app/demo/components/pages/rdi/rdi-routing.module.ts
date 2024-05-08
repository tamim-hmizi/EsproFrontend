import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RDIComponent } from './rdi.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: RDIComponent }
	])],
	exports: [RouterModule]
})
export class RDIRoutingModule { }
