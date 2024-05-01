import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OptionComponent } from './option.component';

@NgModule({
    imports: [
        RouterModule.forChild([{ path: '', component: OptionComponent }]),
    ],
    exports: [RouterModule],
})
export class OptionRoutingModule {}
