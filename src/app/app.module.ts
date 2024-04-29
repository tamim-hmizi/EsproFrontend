import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import {UserService} from './demo/service/user.service'
//import { HttpClientModule } from '@angular/common/http';
import { provideHttpClient ,withInterceptors} from '@angular/common/http';
import {customInterceptor} from './layout/service/costum.interceptor'

@NgModule({
    declarations: [AppComponent, NotfoundComponent],
    imports: [AppRoutingModule, AppLayoutModule,/*HttpClientModule*/],
    providers: [
        { provide: LocationStrategy, useClass: PathLocationStrategy},
        /*UserService ,*/ provideHttpClient(withInterceptors([customInterceptor])),
       
    ],
    bootstrap: [AppComponent],
    
})
export class AppModule {}
