import { Component } from '@angular/core';

import { NbMenuItem } from '@nebular/theme';
import { ApiService } from '../webservice/web-service';
import { SessionService } from '../sessionservice/session-service';
import { Router, NavigationEnd } from '@angular/router';
import { menuCont, comprobar } from '../webservice/enviroments';

@Component({
    selector: 'ngx-pages',
    styleUrls: ['pages.component.scss'],
    template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent {


    public menu: NbMenuItem[] = [];
    url: any;

    constructor(
        public sessionService: SessionService,
        public apiService: ApiService,
        public router: Router
    ) {

        // // listen to events from Router
        // this.router.events.subscribe(event => {
        //     if (event instanceof NavigationEnd) {
        //         // event is an instance of NavigationEnd, get url!  
        //         this.url = event.urlAfterRedirects;
        //     }
        // })

        // if (this.sessionService.ValidaSession() === false) {
        //     this.router.navigate(['/login']);
        // } else {
        //     this.apiService.TraerMenu().subscribe(data => {

        //         let menu1: NbMenuItem[];
        //         let datos: any = data;

        //         let dt = JSON.parse(datos);

        //         if (dt.estadoSalida == 'S') {

        //             if (dt.estadoToken) {

        //                 menuCont.menu = dt.datosOut;
        //                 menu1 = dt.datosOut;
        //                 this.menu = menu1;

        //                 if (this.url !== '/pages/mantenedor/claves') {

        //                     let retorno = comprobar(this.url);

        //                     if (retorno == false) {
        //                         this.router.navigate(['/login']);
        //                     }
        //                 }
        //             }
        //         }
        //     });
        // }
        menuCont.menu = [{
            children: null,
            icon: "eye-outline",
            link: "home",
            title: "Modelo predictivo",
        }]//dt.datosOut;
        this.menu = [{
            children: null,
            icon: "eye-outline",
            link: "home",
            title: "Modelo predictivo",
        }];
    }
}
