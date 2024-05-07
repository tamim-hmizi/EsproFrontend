import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EventDetailComponent } from './eventdetail.component';

@NgModule({
    imports: [
        RouterModule.forChild([{ path: '', component: EventDetailComponent }]),
    ],
    exports: [RouterModule],
})
export class EventDetailRoutingModule {}
