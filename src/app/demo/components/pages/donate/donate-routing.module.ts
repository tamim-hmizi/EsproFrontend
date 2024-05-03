import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DonateComponent } from './donate.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: DonateComponent }
	])],
	exports: [RouterModule]
})
export class DonateRoutingModule { }
