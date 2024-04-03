import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SkillComponent } from './skill.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: SkillComponent }
	])],
	exports: [RouterModule]
})
export class SkillRoutingModule { }
