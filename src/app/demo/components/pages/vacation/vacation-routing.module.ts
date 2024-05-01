import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VacationComponent } from './vacation.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: VacationComponent }
	])],
	exports: [RouterModule]
})
export class VacationRoutingModule { }
