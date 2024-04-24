import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'skill', loadChildren: () => import('./skill/skill.module').then(m => m.SkillModule) },
        { path: 'module', loadChildren: () => import('./module/module.module').then(m => m.ModuleModule) },
        { path: 'affectation', loadChildren: () => import('./affectation/affectation.module').then(m => m.AffectationModule) },
        { path: 'calendar', loadChildren: () => import('./calendar/calendar.module').then(m => m.CalendarModule) },
        { path: 'leave', loadChildren: () => import('./vacation/vacation.module').then(m => m.VacationModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
