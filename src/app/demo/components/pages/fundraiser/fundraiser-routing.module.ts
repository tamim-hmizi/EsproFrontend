import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FundraiserComponent } from './fundraiser.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: FundraiserComponent }
	])],
	exports: [RouterModule]
})
export class FundraiserRoutingModule { }
