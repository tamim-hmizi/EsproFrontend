import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from './layout/app.layout.component';

@NgModule({
    imports: [
        RouterModule.forRoot(
            [
                {
                    path: '',
                    component: AppLayoutComponent,
                    children: [
                        {
                            path: '',
                            loadChildren: () =>
                                import(
                                    './demo/components/dashboard/dashboard.module'
                                ).then((m) => m.DashboardModule),
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
                    path: 'auth',
                    loadChildren: () =>
                        import('./demo/components/auth/auth.module').then(
                            (m) => m.AuthModule
                        ),
                },
                { path: 'notfound', component: NotfoundComponent },
                { path: '**', redirectTo: '/notfound' },
            ],
            {
                scrollPositionRestoration: 'enabled',
                anchorScrolling: 'enabled',
                onSameUrlNavigation: 'reload',
            }
        ),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
