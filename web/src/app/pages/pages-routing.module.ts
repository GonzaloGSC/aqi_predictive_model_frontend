import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { AuthGuardService } from '../webservice/guard';
import { HomeComponent } from './home/home.component';

const routes: Routes = [{
    path: '',
    component: PagesComponent,
    children: [
        // {
        //     path: 'mantenedor',
        //     loadChildren: () => import('./mantenedor/mantenedor.module')
        //         .then(m => m.MantenedorModule),
        // },
        {
            path: 'home',
            component: HomeComponent
        },
    ],
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PagesRoutingModule {
}
