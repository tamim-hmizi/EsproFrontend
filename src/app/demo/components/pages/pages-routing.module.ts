import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'skill',
                loadChildren: () =>
                    import('./skill/skill.module').then((m) => m.SkillModule),
            },
            {
                path: 'module',
                loadChildren: () =>
                    import('./module/module.module').then(
                        (m) => m.ModuleModule
                    ),
            },
            { path: '**', redirectTo: '/notfound' },
        ]),
    ],
    exports: [RouterModule],
})
export class PagesRoutingModule {}
