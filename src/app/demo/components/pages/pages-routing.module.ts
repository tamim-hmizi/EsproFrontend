import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: 'skill', loadChildren: () => import('./skill/skill.module').then(m => m.SkillModule) },
            { path: 'module', loadChildren: () => import('./module/module.module').then(m => m.ModuleModule) },
            { path: 'admin', loadChildren: () => import('./user/user.module').then(m => m.UserModule) },
            { path: 'position', loadChildren: () => import('./position/position.module').then(m => m.PositionModule) },
            
           

            { path: 'profile', loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule) },
            
            { path: '**', redirectTo: '/notfound' }
        ]),
       
    ],
    exports: [RouterModule]
})
export class PagesRoutingModule { }