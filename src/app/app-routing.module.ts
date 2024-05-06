import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: AppLayoutComponent,
                children: [
                    { path: '', loadChildren: () => import('./demo/components/dashboard/dashboard.module').then(m => m.DashboardModule) },
                    { path: 'RDI', loadChildren: () => import('./demo/components/pages/rdi/rdi.module').then(m => m.RDIModule) },
                    { path: 'Publication', loadChildren: () => import('./demo/components/pages/publication/publication.module').then(m => m.PublicationModule) },
                    { path: 'RDIMember/:rdiId', loadChildren: () => import('./demo/components/pages/RDIMember/RDIMember.module').then(m => m.RDIMemberModule) },
                    { path: 'publications/:rdiId', loadChildren: () => import('./demo/components/pages/publication/publication.module').then(m => m.PublicationModule) },
                    { path: 'ResearchAxis/:rdiId', loadChildren: () => import('./demo/components/pages/ResearchAxis/ResearchAxis.module').then(m => m.ResearchAxisModule) },
                    { path: 'details/:rdiId', loadChildren: () => import('./demo/components/rdifrontoffice/DETAILS/details.module').then(m => m.DetailsModule) },
                    { path: 'RDIS', loadChildren: () => import('./demo/components/rdifrontoffice/rdifront/rdifront.module').then(m => m.RdiFrontModule) },
]

                
            },
            { path: 'auth', loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule) },
            { path: 'notfound', component: NotfoundComponent },
            { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
