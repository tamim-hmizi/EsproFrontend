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
                    {
                        label: 'Dashboard',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['/'],
                    },
                ],
            },
            {
                label: 'Affectations',
                items: [
                    {
                        label: 'Skill',
                        icon: 'pi pi-fw pi-id-card',
                        routerLink: ['/skill'],
                    },
                    {
                        label: 'Module',
                        icon: 'pi pi-fw pi-check-square',
                        routerLink: ['/module'],
                    },
                    {
                        label: 'Donation',
                        icon: 'pi pi-fw pi-bookmark',
                        routerLink: ['/donation'],
                    },
                    {
                        label: 'Classroom',
                        icon: 'pi pi-fw pi-bookmark',
                        routerLink: ['/classroom'],
                    },
                    {
                        label: 'Level',
                        icon: 'pi pi-fw pi-bookmark',
                        routerLink: ['/level'],
                    },
                    {
                        label: 'Option',
                        icon: 'pi pi-fw pi-bookmark',
                        routerLink: ['/option'],
                    },
                    {
                        label: 'Event',
                        icon: 'pi pi-fw pi-bookmark',
                        routerLink: ['/event'],
                    },
                    {
                        label: 'Sponsor',
                        icon: 'pi pi-fw pi-bookmark',
                        routerLink: ['/sponsor'],
                    },
                ],
            },
        ];
    }
}
