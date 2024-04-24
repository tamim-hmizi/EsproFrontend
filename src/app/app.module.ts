import { NgModule } from '@angular/core';
import {
    HashLocationStrategy,
    LocationStrategy,
    PathLocationStrategy,
} from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ToolbarModule } from 'primeng/toolbar';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService } from 'primeng/api';


@NgModule({
    declarations: [AppComponent, NotfoundComponent],
    imports: [AppRoutingModule,
        AppLayoutModule,
        TableModule,
        DialogModule,
        InputTextModule,
        ButtonModule,
        CalendarModule,
        ToolbarModule,
        DropdownModule,
        CheckboxModule,
    ],
    providers: [{ provide: LocationStrategy, useClass: PathLocationStrategy}],
    bootstrap: [AppComponent],
})
export class AppModule {}
