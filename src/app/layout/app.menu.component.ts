import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { NgIf } from '@angular/common';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService, private jwtHelper: JwtHelperService) { }

    ngOnInit() {
        // Get the JWT token from wherever you store it (e.g., localStorage)
        const token = localStorage.getItem('jwt');

        // Decode the token to extract user information
        const decodedToken = this.jwtHelper.decodeToken(token);
        // Check if the user has the admin role
        const isAdmin = decodedToken && decodedToken.role === 'ADMIN';

        // Set the menu items based on the user's role
        this.model = [
            {
                label: 'Home',
                items: [
                    {
                        label: 'Dashboard',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['/dashboard'],
                    },
                ],
            },
            {
                label: isAdmin ? 'ADMIN' : 'USER',
                items: isAdmin
                    ? [
                          {
                              label: 'Skill',
                              icon: 'pi pi-fw pi-star',
                              routerLink: ['/skill'],
                          },
                          {
                              label: 'Module',
                              icon: 'pi pi-fw pi-book',
                              routerLink: ['/module'],
                          },
                          {
                              label: 'Fundraiser',
                              icon: 'pi pi-fw pi-calendar-plus',
                              routerLink: ['/fundraiser'],
                          },
                          {
                              label: 'Donation',
                              icon: 'pi pi-fw pi-dollar',
                              routerLink: ['/donation'],
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


                      ]
                    : [
                          {
                              label: 'Donate',
                              icon: 'pi pi-fw pi-bookmark',
                              routerLink: ['/donate'],
                          },
                          {
                              label: 'Event',
                              icon: 'pi pi-fw pi-bookmark',
                              routerLink: ['/eventclient'],
                          },
                      ],
            },
        ];
    }

                    // { label: 'Classroom', icon: 'pi pi-fw pi-bookmark', routerLink: ['/pages/classroom'] },
                    // { label: 'Level', icon: 'pi pi-fw pi-bookmark', routerLink: ['/pages/level'] },
                    // { label: 'Option', icon: 'pi pi-fw pi-bookmark', routerLink: ['/pages/option'] },
                    // { label: 'Event', icon: 'pi pi-fw pi-bookmark', routerLink: ['/pages/event'] },
                    // { label: 'Sponsor', icon: 'pi pi-fw pi-bookmark', routerLink: ['/pages/sponsor'] },




}
