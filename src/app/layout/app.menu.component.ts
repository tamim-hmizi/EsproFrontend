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
    userRole: string = ''; 
    ngOnInit() {

        this.userRole = localStorage.getItem('role');
        if (this.userRole === 'ADMIN') {
            // Si l'utilisateur est un admin, afficher tous les éléments du menu
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
                    { /*label: 'Profile', icon: 'pi pi-fw pi-bookmark', routerLink: ['/profile']*/ },
                        { label: 'Skill', icon: 'pi pi-fw pi-id-card', routerLink: ['/skill'] },
                        { label: 'Module', icon: 'pi pi-fw pi-check-square', routerLink: ['/module'] },
                        { label: 'Donation', icon: 'pi pi-fw pi-bookmark', routerLink: ['/pages/donation'] },
                        { label: 'User', icon: 'pi pi-fw pi-bookmark', routerLink: ['/admin'] },
                        { label: 'Position', icon: 'pi pi-fw pi-bookmark', routerLink: ['/position'] },
                        { label: 'academicSp', icon: 'pi pi-fw pi-bookmark', routerLink: ['/academicSp'] }
                    ]
                },
                {
                
                    label: 'RDI', icon: 'pi pi-fw pi-bookmark',
                    items: [
                        {
                            label: 'RDI', icon: 'pi pi-fw pi-bookmark',
                            items: [
                                { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/dashbordRDI'] },

                                { label: 'RDIList', icon: 'pi pi-fw pi-home', routerLink: ['/RDI'] },
                               
                            ]
                        },
                        
                            { label: 'Publications', icon: 'pi pi-fw pi-home', routerLink: ['/Publication'] }

                       
                    ]
                },

            ];
        } else {
            // Si l'utilisateur n'est pas un admin, afficher uniquement l'élément "Profile"
            this.model = [
               /* {
                    label: 'Home',
                    items: [
                        { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
                    ]
                },*/ 
                {
                    label: 'Affectations',
                    items: [
                        { label: 'Profile', icon: 'pi pi-fw pi-bookmark', routerLink: ['/profile'] }
                    ]
                }
            ];
        }













       /* this.model = [
            {
                label: 'Home',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
                ]
            },
            {
                label: 'Affectations',
                items: [
                    { label: 'Profile', icon: 'pi pi-fw pi-bookmark', routerLink: ['/profile'] },
                    { label: 'Skill', icon: 'pi pi-fw pi-id-card', routerLink: ['/skill'] },
                    { label: 'Module', icon: 'pi pi-fw pi-check-square', routerLink: ['/module'] },
                    { label: 'Donation', icon: 'pi pi-fw pi-bookmark', routerLink: ['/pages/donation'] },
                    { label: 'User', icon: 'pi pi-fw pi-bookmark', routerLink: ['/admin'] },
                    { label: 'Position', icon: 'pi pi-fw pi-bookmark', routerLink: ['/position'] },
                    { label: 'academicSp', icon: 'pi pi-fw pi-bookmark', routerLink: ['/academicSp'] },
                   
                   
                    // { label: 'Invalid State', icon: 'pi pi-fw pi-exclamation-circle', routerLink: ['/uikit/invalidstate'] },
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
        ];*/
    }
}
