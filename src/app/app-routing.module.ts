import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from './layout/app.layout.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'login', // Redirect to the login page when the root path is accessed
        pathMatch: 'full', // Ensure exact matching for root path redirection
    },
    {
        path: '',
        component: AppLayoutComponent,
        children: [
            {
                path: 'dashboard',
                loadChildren: () =>
                    import('./demo/components/dashboard/dashboard.module').then(
                        (m) => m.DashboardModule
                    ),
            },
            {
                path: 'skill',
                loadChildren: () =>
                    import(
                        '../app/demo/components/pages/skill/skill.module'
                    ).then((m) => m.SkillModule),
            },
            {
                path: 'module',
                loadChildren: () =>
                    import(
                        '../app/demo/components/pages/module/module.module'
                    ).then((m) => m.ModuleModule),
            },
            {
                path: 'donation',
                loadChildren: () =>
                    import(
                        '../app/demo/components/pages/donation/donation.module'
                    ).then((m) => m.DonationModule),
            },
            {
                path: 'fundraiser',
                loadChildren: () =>
                    import(
                        '../app/demo/components/pages/fundraiser/fundraiser.module'
                    ).then((m) => m.FundraiserModule),
            },
            {
                path: 'donate',
                loadChildren: () =>
                    import(
                        '../app/demo/components/pages/donate/donate.module'
                    ).then((m) => m.DonateModule),
            },
            {
                path: 'event',
                loadChildren: () =>
                    import(
                        '../app/demo/components/pages/event/event.module'
                    ).then((m) => m.EventModule),
            },
            {
                path: 'sponsor',
                loadChildren: () =>
                    import(
                        '../app/demo/components/pages/sponsor/sponsor.module'
                    ).then((m) => m.SponsorModule),
            },
            {
                path: 'eventclient',
                loadChildren: () =>
                    import(
                        '../app/demo/components/client/event/eventclient.module'
                    ).then((m) => m.EventClientModule),
            },
            {
                path: 'eventclient/:id',
                loadChildren: () =>
                    import(
                        '../app/demo/components/client/eventDetail/eventdetail.module'
                    ).then((m) => m.EventDetailModule),
            },
        ],
    },
    {
        path: 'login',
        loadChildren: () =>
            import('../app/demo/components/pages/login/login.module').then(
                (m) => m.LoginModule
            ),
    },
    {
        path: 'register',
        loadChildren: () =>
            import(
                '../app/demo/components/pages/register/register.module'
            ).then((m) => m.RegisterModule),
    },
    { path: 'notfound', component: NotfoundComponent },
    { path: '**', redirectTo: '/notfound' },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            scrollPositionRestoration: 'enabled',
            anchorScrolling: 'enabled',
            onSameUrlNavigation: 'reload',
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
