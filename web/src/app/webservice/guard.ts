import { Injectable } from '@angular/core';
import { Router, NavigationEnd, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { menuCont, comprobar } from '../webservice/enviroments';


@Injectable()
export class AuthGuardService implements CanActivateChild {

    existe: boolean = false;

    constructor(private _router: Router) {

    }

    canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        if (menuCont.menu !== null) {
            if (state.url !== '/pages/mantenedor/claves') {

                this.existe = comprobar(state.url);

                if (this.existe == false) {

                    this._router.navigate(['/login']);
                }
            }
        }

        return true;
    }

}