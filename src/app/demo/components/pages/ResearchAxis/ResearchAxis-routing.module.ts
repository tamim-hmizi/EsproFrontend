import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ResearchAxisComponent } from './ResearchAxis.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ResearchAxisComponent }
	])],
	exports: [RouterModule]
})
export class ResearchAxisRoutingModule { }
