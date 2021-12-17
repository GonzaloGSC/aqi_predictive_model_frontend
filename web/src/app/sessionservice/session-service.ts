import { Injectable } from '@angular/core';
import { ThrowStmt } from '@angular/compiler';
import { menuCont, comprobar } from '../webservice/enviroments';


@Injectable()
export class SessionService {

    public RegistrarSession(VDESC_USER, VID_USER, VNOM_USER, VRUT_USER, VTIPO_USER, VID_ROL, VTOKEN, VROL, VROL_DESC, VEJEC, VRESP) {
        const usuario = {
            desc: VDESC_USER,
            id_user: VID_USER,
            nom_user: VNOM_USER,
            rut: VRUT_USER,
            tipo_user: VTIPO_USER,
            id_rol: VID_ROL,
            token: VTOKEN,
            rol: VROL,
            rol_desc: VROL_DESC,
            ejec: VEJEC,
            resp: VRESP
        };
        sessionStorage.setItem('usuario', JSON.stringify(usuario));
    }

    public RetornaUsuario2(): string {
        const retorno = sessionStorage.getItem('usuario');
        return retorno;
    }

    public BorrarSession() {
        sessionStorage.clear();
    }

    public ValidaSession(): boolean {
        let retorno: boolean;
        if (sessionStorage.getItem('usuario') == null) {
            retorno = false;
        } else {
            retorno = true;
        }
        return retorno;
    }

    public RetornaRol(): string {
        const retorno = JSON.parse(sessionStorage.getItem('usuario')).rol;
        return retorno;
    }

    public RetornaRolNum(): number {
        const retorno = JSON.parse(sessionStorage.getItem('usuario')).id_rol;
        return retorno;
    }

    public RetornaRolDesc(): string {
        const retorno = JSON.parse(sessionStorage.getItem('usuario')).rol_desc;
        return retorno;
    }

    public RetornaUsuario(): number {
        const retorno = JSON.parse(sessionStorage.getItem('usuario')).id_user;
        return retorno;
    }

    public RetornaNombre(): string {
        const retorno = JSON.parse(sessionStorage.getItem('usuario')).nom_user;
        return retorno;
    }

    public RetornaEjecutivo(): number {
        const retorno = JSON.parse(sessionStorage.getItem('usuario')).ejec;
        return retorno;
    }

    public RetornaResponsable(): number {
        const retorno = JSON.parse(sessionStorage.getItem('usuario')).resp;
        return retorno;
    }

    public RetornaTipoUser(): string {
        const retorno = JSON.parse(sessionStorage.getItem('usuario')).tipo_user;
        return retorno;
    }

    public RetornaToken(): string {
        //let token = localStorage.getItem('tokensito'); //MML Problema Token
        if (this.ValidaSession()) {
            const token = JSON.parse(sessionStorage.getItem('usuario')).token;
            return token;
        }
        else {
            return "";
        }
    }
    
    public BorrarSesion() {
        sessionStorage.clear();
        menuCont.menu = null;
    }
}
