import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PositionComponent } from './position.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: PositionComponent }
	])],
	exports: [RouterModule]
})
export class PositionRoutingModule { }
