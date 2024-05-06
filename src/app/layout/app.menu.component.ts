import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
                    { label: 'RDI', icon: 'pi pi-fw pi-home', routerLink: ['/RDI'] },
                    { label: 'Publications', icon: 'pi pi-fw pi-home', routerLink: ['/Publication'] }


                ]
            },
          
            {
                
                        label: 'RDI', icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: 'RDI', icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] },

                                    { label: 'RDIList', icon: 'pi pi-fw pi-home', routerLink: ['/RDI'] },
                                   
                                ]
                            },
                            
                                { label: 'Publications', icon: 'pi pi-fw pi-home', routerLink: ['/Publication'] }

                           
                        ]
                    },
                   
                  
            
           
        ];
    }
}
