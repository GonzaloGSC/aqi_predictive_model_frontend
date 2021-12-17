import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SessionService } from '../sessionservice/session-service';

@Injectable({
    providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

    constructor(private ss: SessionService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        let token = this.ss.RetornaToken();

        let request = req;

        if (token) {
            request = req.clone({
                setHeaders: {
                    Authorization: token
                }
            });
        }

        return next.handle(request);
    }

}