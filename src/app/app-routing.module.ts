import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { LoginModule } from './demo/components/auth/login/login.module';
import { RoleGuardService } from './demo/service/role-guard.service';




@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: AppLayoutComponent, canActivate: [RoleGuardService], data: { roles: ['ADMIN']},
                children: [
                    { path: '', loadChildren: () => import('./demo/components/dashboard/dashboard.module').then(m => m.DashboardModule) },

                    { path: 'skill', loadChildren: () => import('../app/demo/components/pages/skill/skill.module').then(m => m.SkillModule) },
                    { path: 'module', loadChildren: () => import('../app/demo/components/pages/module/module.module').then(m => m.ModuleModule) },
                    { path: 'admin', loadChildren: () => import('../app/demo/components/pages/user/user.module').then(m => m.UserModule) },
                    { path: 'position', loadChildren: () => import('../app/demo/components/pages/position/position.module').then(m => m.PositionModule) },
                   
            
                ]
            },







            {
                path: '', component: AppLayoutComponent, 
                children: [
                    { path: 'profile', loadChildren: () => import('../app/demo/components/pages/profile/profile.module').then(m => m.ProfileModule) },
            
                ]
            }

            ,
            
            { path: 'auth', loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule) },
            { path: 'notfound', component: NotfoundComponent },
            { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' }),
 
  
],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
