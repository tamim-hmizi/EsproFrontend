import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {  SponsorComponent } from './sponsor.component';


@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: SponsorComponent }
	])],
	exports: [RouterModule]
})
export class SponsorRoutingModule { }
