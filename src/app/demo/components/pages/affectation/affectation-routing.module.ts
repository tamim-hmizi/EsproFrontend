import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AffectationComponent } from './affectation.component';

@NgModule({
    imports: [RouterModule.forChild([{ path: '', component: AffectationComponent }])],
    exports: [RouterModule],
})
export class AffectationRoutingModule {}
