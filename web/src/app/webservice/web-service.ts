import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Injectable()
export class ApiService {
    constructor(private http: HttpClient) {
        if (window.location.href.includes("localhost")) {
            this.urlWS = 'http://localhost:8080/'; // LOCALHOST
        } else {
            this.urlWS = document.location.origin + '/' + document.location.pathname + '/test/'; // prod
        }
    }
    urlWS: string = ''; // LOCALHOST
    noparams = new HttpParams();
    public IniciarSesion(body) {
        return this.http.post<any>(this.urlWS + 'IniciarSesion', body, { responseType: 'json' });
    }
    public CrearUsuario(body) {
        return this.http.post<any>(this.urlWS + 'CrearUsuario', body, { responseType: 'json' });
    }
    public ListarUsuarios(body) {
        return this.http.post<any>(this.urlWS + 'ListarUsuarios', body, { responseType: 'json' });
    }
    public EliminarUsuario(body) {
        return this.http.post<any>(this.urlWS + 'EliminarUsuario', body, { responseType: 'json' });
    }
    public TraerMenu() {
        return this.http.post<any>(this.urlWS + 'TraerMenu', { responseType: 'json' });
    }
    public SubirArchivos(body) {
        return this.http.post<any>(this.urlWS + 'SubirArchivos', body, { responseType: 'json' });
    }
    public CambiarClave(body) {
        return this.http.post<any>(this.urlWS + 'CambiarClave', body, { responseType: 'json' });
    }
    public AgregarUsuario(body) {
        return this.http.post<any>(this.urlWS + 'AgregarUsuario', body, { responseType: 'json' });
    }
    public ModificarUsuario(body) {
        return this.http.post<any>(this.urlWS + 'ModificarUsuario', body, { responseType: 'json' });
    }
    public TraerInfoUsuario(body) {
        return this.http.post<any>(this.urlWS + 'TraerInfoUsuario', body, { responseType: 'json' });
    }
    public ListarRoles(body) {
        return this.http.post<any>(this.urlWS + 'ListarRoles', body, { responseType: 'json' });
    }
    public ValidarCorreo(body) {
        return this.http.post<any>(this.urlWS + 'ValidarCorreo', body, { responseType: 'json' });
    }
    public InfoUsuario(body) {
        return this.http.post<any>(this.urlWS + 'InfoUsuario', body, { responseType: 'json' });
    }
    /////////////////////////////////////////////MODELO
    public Predecir(body) {
        return this.http.post<any>(this.urlWS + 'modelo/predecir', body, { responseType: 'json' });
    }
    public TraerComunas(body) {
        return this.http.post<any>(this.urlWS + 'modelo/traerComunas', body, { responseType: 'json' });
    }
    
}