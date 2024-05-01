import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { UserService } from '../../service/user.service'
@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        PagesRoutingModule
    ]
    ,providers: [UserService]
})
export class PagesModule { }
