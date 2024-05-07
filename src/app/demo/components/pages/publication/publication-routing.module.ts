import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PublicationComponent } from './publication.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: PublicationComponent }
	])],
	exports: [RouterModule]
})
export class PublicationeRoutingModule { }
