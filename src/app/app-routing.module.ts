import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from './layout/app.layout.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'login', 
        pathMatch: 'full', 
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
            {
                path: 'level',
                loadChildren: () =>
                    import(
                        '../app/demo/components/pages/level/level.module'
                        ).then((m) => m.LevelModule),
            },
            {
                path: 'option',
                loadChildren: () =>
                    import(
                        '../app/demo/components/pages/option/option.module'
                        ).then((m) => m.OptionModule),
            },
            {
                path: 'classroom',
                loadChildren: () =>
                    import(
                        '../app/demo/components/pages/classroom/classroom.module'
                        ).then((m) => m.ClassroomModule),
            },
            { path: 'RDI', loadChildren: () => import('./demo/components/pages/rdi/rdi.module').then(m => m.RDIModule) },
            { path: 'Publication', loadChildren: () => import('./demo/components/pages/publication/publication.module').then(m => m.PublicationModule) },
            { path: 'RDIS', loadChildren: () => import('./demo/components/rdifrontoffice/rdifront/rdifront.module').then(m => m.RdiFrontModule) },
            { path: 'RDIMember/:rdiId', loadChildren: () => import('./demo/components/pages/RDIMember/RDIMember.module').then(m => m.RDIMemberModule) },
            { path: 'details/:rdiId', loadChildren: () => import('./demo/components/rdifrontoffice/DETAILS/details.module').then(m => m.DetailsModule) },
            { path: 'publications/:rdiId', loadChildren: () => import('./demo/components/pages/publication/publication.module').then(m => m.PublicationModule) },
            { path: 'ResearchAxis/:rdiId', loadChildren: () => import('./demo/components/pages/ResearchAxis/ResearchAxis.module').then(m => m.ResearchAxisModule) },
            { path: 'dashbordRDI', loadChildren: () => import('./demo/components/pages/dashboard/dashboard.module').then(m => m.DashboardModule) },
            { path: 'Publication', loadChildren: () => import('./demo/components/pages/publication/publication.module').then(m => m.PublicationModule) },
<<<<<<< HEAD
=======
            { path: 'affectation',loadChildren: () =>import('../app/demo/components/pages/affectation/affectation.module').then((m) => m.AffectationModule)},
            { path: 'vacation',loadChildren: () =>import('./demo/components/pages/vacation/vacation.module').then((m) => m.VacationModule)},
            { path: 'calendar',loadChildren: () =>import('../app/demo/components/pages/calendar/calendar.module').then((m) => m.CalendarModule)},
>>>>>>> houssem
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
