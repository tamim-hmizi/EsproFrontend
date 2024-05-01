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
                    { path: 'skill', loadChildren: () => import('../app/demo/components/pages/skill/skill.module').then(m => m.SkillModule) },
                    { path: 'module', loadChildren: () => import('../app/demo/components/pages/module/module.module').then(m => m.ModuleModule) },
                    { path: 'donation', loadChildren: () => import('../app/demo/components/pages/donation/donation.module').then(m => m.DonationModule) },
                    { path: 'fundraiser', loadChildren: () => import('../app/demo/components/pages/fundraiser/fundraiser.module').then(m => m.FundraiserModule) },
                    { path: 'donate', loadChildren: () => import('../app/demo/components/pages/donate/donate.module').then(m => m.DonateModule) },
                    {path: 'affectation',loadChildren: () =>import('../app/demo/components/pages/affectation/affectation.module').then((m) => m.AffectationModule)},
                    {path: 'vacation',loadChildren: () =>import('./demo/components/pages/vacation/vacation.module').then((m) => m.VacationModule)},
                    {path: 'calendar',loadChildren: () =>import('../app/demo/components/pages/calendar/calendar.module').then((m) => m.CalendarModule)},
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
