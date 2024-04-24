import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ModuleComponent } from './module.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ModuleComponent }
	])],
	exports: [RouterModule]
})
export class ModuleRoutingModule { }
