import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './webservice/guard';

export const routes: Routes = [
    {
        path: 'pages',
        loadChildren: () => import('./pages/pages.module')
            .then(m => m.PagesModule),
        canActivateChild: [AuthGuardService],

    },
    //   { path: 'login', component: LoginComponent },
    //   { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'pages/home' },
];

const config: ExtraOptions = {
    useHash: true,
};

@NgModule({
    imports: [RouterModule.forRoot(routes, config)],
    exports: [RouterModule],
})
export class AppRoutingModule {
}
