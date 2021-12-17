import { Component, OnInit } from '@angular/core';
import { ApiService } from '../webservice/web-service';
import { SessionService } from '../sessionservice/session-service';
import { HttpParams } from '@angular/common/http';
import { Parser } from 'xml2js';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { VersionSistema } from '../webservice/enviroments';
import { toastrService } from '../toastrservice/toastr.service';
import { NbToastrConfig, NbToastrService } from '@nebular/theme';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
    selector: 'ngx-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    error = false;
    errorserver = false;
    errorusu = false;

    navegador: any = '';

    version: any = VersionSistema.n_version;
    validar: number = 0
    alerta: string = '';

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private ws: ApiService,
        private ss: SessionService,
        private toastr: toastrService,
    ) {
        document.getElementById('nb-global-spinner').style.display = 'none';
        this.navegador = this.getBrowserInfo();
    }

    ngOnInit() {
        this.VerificarCorreo();
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
        });
        this.ss.BorrarSession();
        

    }

    // onLoad(){
    //   this.loginForm = this.formBuilder.group({
    //     username: ['', Validators.required],
    //     password: ['', Validators.required],
    //   });
    // }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;
        this.error = false;
        this.errorserver = false;
        this.errorusu = false;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        const body = {
            'email': this.f.username.value,
            'pass': this.f.password.value,
            'navegador': this.navegador,
            'version': this.version
        }

        this.loading = true;
        this.ws.IniciarSesion(body).subscribe(data => {

            let datos = JSON.parse(data);

            if (datos.datosOut[0].MENSAJE == 'S') {

                this.ss.RegistrarSession(datos.datosOut[0].DESC_USER,
                    datos.datosOut[0].ID_USER,
                    datos.datosOut[0].NOM_USER,
                    datos.datosOut[0].RUT_USER,
                    datos.datosOut[0].TIPO_USER,
                    datos.datosOut[0].ID_ROL,
                    datos.Token,
                    datos.datosOut[0].NOMBRE_ROL,
                    datos.datosOut[0].DESCRIPCION_ROL,
                    datos.datosOut[0].EJECUTIVO,
                    datos.datosOut[0].ID_BM_RESPONSABLE
                );
                this.validar = datos.datosOut[0].VALIDAR_VERSION;
                if (this.validar == 1) {
                    this.toastr.showToast(datos.datosOut[0].MENSAJE_VERSION, "Mensaje:", 'bottom-right', 'warning', 0, true, true, false);

                    setTimeout(() => {
                        // this.router.navigate(['/pages/home']);
                        this.router.navigate(['/pages/' + datos.datosOut[0].MEN_LINK]);
                    }, 2000);

                } else {

                    this.router.navigate(['/pages/' + datos.datosOut[0].MEN_LINK]);
                }
            } else {
                this.loading = false;
                this.submitted = false;
                this.error = true;
                this.errorusu = true;
            }
        }, error => {
            this.loading = false;
            this.submitted = false;

            this.error = true;
            this.errorserver = true;
        });
    }


    getBrowserInfo = function () {
        var ua = navigator.userAgent, tem,
            M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if (/trident/i.test(M[1])) {
            tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
            return 'IE ' + (tem[1] || '');
        }
        if (M[1] === 'Chrome') {
            tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
            if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
        }
        M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
        if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
        return M.join(' ');
    };

    AbrirModalAlert(msj: string) {
        this.alerta = msj;
        document.getElementById("ModalAlert").style.display = "block";
    }
    CerrarModalAlert() {
        document.getElementById("ModalAlert").style.display = "none";
    }

    VerificarCorreo() {
        this.loading = true
        this.route.queryParams.subscribe(params => {
            if (params.v_mail) {
                const body = {
                    valor: params.v_mail,
                };
                this.ws.ValidarCorreo(body).subscribe((data) => {
                    let datos = JSON.parse(data);
                    if (datos.estadoSalida == "S") {
                        if(datos.datosOut[0] && datos.datosOut[0].Resultado == 1){
                            this.toastr.showToast("Correo verificado exitosamente.", "Mensaje: ", 'bottom-right', 'success', 20000, true, true, false);
                        } else{
                            this.toastr.showToast("No se pudo verificar el correo, es posible que el link de verificación ya no sea válido.", "ERROR: ", 'bottom-right', 'danger', 20000, true, true, false);
                        }
                        this.loading = false;
                        this.ss.BorrarSession();
                        this.router.navigate(['/login']);
                    }
                    else if (datos.estadoSalida == "N") {
                        this.loading = false;
                        this.toastr.showToast("Error, intente más tarde.", "ERROR: ", 'bottom-right', 'danger', 10000, true, true, false);
                        this.ss.BorrarSession();
                        this.router.navigate(['/login']);
                    }
                }, error => {
                    this.loading = false;
                    this.toastr.showToast("Error, intente más tarde.", "ERROR: ", 'bottom-right', 'danger', 10000, true, true, false);
                    this.ss.BorrarSession();
                    this.router.navigate(['/login']);
                });

            } else{
                this.loading = false;
            }
        })

    }
}
