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
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
                ]
            },
            {
                label: 'Affectations',
                items: [
                    { label: 'Skill', icon: 'pi pi-fw pi-star', routerLink: ['/skill'] },
                    { label: 'Module', icon: 'pi pi-fw pi-book', routerLink: ['/module'] },
                    { label: 'Fundraiser', icon: 'pi pi-fw pi-calendar-plus', routerLink: ['/fundraiser'] },
                    { label: 'Donation', icon: 'pi pi-fw pi-dollar', routerLink: ['/donation'] },
                    { label: 'Donate', icon: 'pi pi-fw pi-bookmark', routerLink: ['/donate'] },
                    { label: 'Vacation', icon: 'pi pi-fw pi-bookmark',routerLink: ['/vacation']},
                    {label: 'Calendar',icon: 'pi pi-fw pi-bookmark',routerLink: ['/calendar']},
                    {label: 'Affectation',icon: 'pi pi-fw pi-bookmark',routerLink: ['/affectation']},



                    // { label: 'Classroom', icon: 'pi pi-fw pi-bookmark', routerLink: ['/pages/classroom'] },
                    // { label: 'Level', icon: 'pi pi-fw pi-bookmark', routerLink: ['/pages/level'] },
                    // { label: 'Option', icon: 'pi pi-fw pi-bookmark', routerLink: ['/pages/option'] },
                    // { label: 'Event', icon: 'pi pi-fw pi-bookmark', routerLink: ['/pages/event'] },
                    // { label: 'Sponsor', icon: 'pi pi-fw pi-bookmark', routerLink: ['/pages/sponsor'] },


                    // { label: 'Button', icon: 'pi pi-fw pi-box', routerLink: ['/uikit/button'] },
                    // { label: 'Table', icon: 'pi pi-fw pi-table', routerLink: ['/uikit/table'] },
                    // { label: 'List', icon: 'pi pi-fw pi-list', routerLink: ['/uikit/list'] },
                    // { label: 'Tree', icon: 'pi pi-fw pi-share-alt', routerLink: ['/uikit/tree'] },
                    // { label: 'Panel', icon: 'pi pi-fw pi-tablet', routerLink: ['/uikit/panel'] },
                    // { label: 'Overlay', icon: 'pi pi-fw pi-clone', routerLink: ['/uikit/overlay'] },
                    // { label: 'Media', icon: 'pi pi-fw pi-image', routerLink: ['/uikit/media'] },
                    // { label: 'Menu', icon: 'pi pi-fw pi-bars', routerLink: ['/uikit/menu'], routerLinkActiveOptions: { paths: 'subset', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' } },
                    // { label: 'Message', icon: 'pi pi-fw pi-comment', routerLink: ['/uikit/message'] },
                    // { label: 'File', icon: 'pi pi-fw pi-file', routerLink: ['/uikit/file'] },
                    // { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/uikit/charts'] },
                ]
            }
        ];
    }
}
