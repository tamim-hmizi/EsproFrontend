import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'skill', loadChildren: () => import('./skill/skill.module').then(m => m.SkillModule) },
        { path: 'module', loadChildren: () => import('./module/module.module').then(m => m.ModuleModule) },
        { path: 'donation', loadChildren: () => import('./donation/donation.module').then(m => m.DonationModule) },
        { path: 'fundraiser', loadChildren: () => import('./fundraiser/fundraiser.module').then(m => m.FundraiserModule) },
        { path: 'donate', loadChildren: () => import('./donate/donate.module').then(m => m.DonateModule) },
      

        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
