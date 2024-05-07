import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EventClientComponent } from './eventclient.component';
import { EventDetailComponent } from '../eventDetail/eventdetail.component';
@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: EventClientComponent },
            { path: ':id', component: EventDetailComponent },
        ]),
    ],
    exports: [RouterModule],
})
export class EventClientRoutingModule {}
