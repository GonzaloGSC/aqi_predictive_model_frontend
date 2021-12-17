import { Component, ElementRef, OnInit, TemplateRef } from '@angular/core'; //ViewChild, ViewChildren 
import { Router } from '@angular/router';
import { SessionService } from '../../sessionservice/session-service';
import { ApiService } from '../../webservice/web-service';
import { AplicarFiltro } from '../../utiles/filter-table'
import { NgSelectConfig } from '@ng-select/ng-select';
import * as moment from 'moment';
import { toastrService } from '../../toastrservice/toastr.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { color } from 'd3-color';
import { compileNgModuleFromRender2 } from '@angular/compiler/src/render3/r3_module_compiler';
import { nullSafeIsEquivalent } from '@angular/compiler/src/output/output_ast';

@Component({
    selector: 'ngx-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    constructor(
        public ws: ApiService,
        public ss: SessionService,
        public router: Router,
        // private elRef: ElementRef,
        private config: NgSelectConfig,
        private toastr: toastrService,
        private modalService: NgbModal,
        // private contentRef: TemplateRef<Object>
    ) {
        this.config.notFoundText = 'Ninguna opción encontrada';
        // this.config.appendTo = 'body';
        // this.config.bindValue = 'value';
        this.CargaComunas();
    }

    ngOnInit(): void {
        document.documentElement.style.setProperty('--colHover', '#61d862'); //13c77c
        document.documentElement.style.setProperty('--colAzul', '#13c77c');
        document.documentElement.style.setProperty('--colAzulAlt', 'rgb(0, 105, 185)');
        document.documentElement.style.setProperty('--colFilasTabla', 'rgba(163, 160, 160, 0.055)');
        document.documentElement.style.setProperty('--colHeadTabla', '#343434');
        document.documentElement.style.setProperty('--colOutLine1', '#7f7f7f');
        document.documentElement.style.setProperty('--colDisabled', '#cacacc');
        document.documentElement.style.setProperty('--colAvisoError', '#ff3142');
        document.documentElement.style.setProperty('--colBotonAlt', '#acacac');
        document.documentElement.style.setProperty('--colVerde0', '#00b887');
        document.documentElement.style.setProperty('--colAmarillo0', '#ffc551');
    }

    IniciarCarga() {
        this.loading = true
        this.loadingCola.push("carga");
    }

    DetenerCarga() {
        if (this.loadingCola.length > 0) {
            this.loadingCola.pop();
            if (this.loadingCola.length == 0) {
                this.loading = false;
            }
        } else {
            this.loading = false;
        }
    }

    loading = false;
    loadingCola = [];
    bloqueo = true;
    codigoError = null;

    selectComuna: number = null;
    opcionesComuna = [];

    fechaInicio: Date = new Date();
    pm25Ingreso: string = "";
    pm10Ingreso: string = "";
    o3Ingreso: string = "";
    no2Ingreso: string = "";
    coIngreso: string = "";
    temperaturaIngreso: string = "";

    datosFechas = [];
    datosNiveles = [];
    datosCurva = [];

    graficaData: ChartDataSets[] = [
        {
            data: this.datosCurva,
            label: 'AQI',
            backgroundColor: [],
            pointBackgroundColor: [],
            pointBorderColor: [],
        },
    ];
    graficaLabels: Label[] = this.datosFechas;
    graficaOptions: (ChartOptions & { annotation?: any }) = {
        responsive: true,
        animation: {
            duration: 1000,
            easing: 'easeOutExpo'
        }
    };
    graficaColors: Color[] = [
        {
            borderColor: '#009859',
            backgroundColor: 'rgba(0, 152, 89, 0.1)',
        },
    ];
    graficaLegend = true;
    graficaType = 'line';
    graficaPlugins = [];

    filasTabla = []

    CargaComunas() {
        this.IniciarCarga();
        this.opcionesComuna = [];
        const body = {};
        this.ws.TraerComunas(body).subscribe((datos) => {
            this.DetenerCarga();
            this.codigoError = datos.error;
            if (datos.success == true) {
                this.opcionesComuna = datos.data;
            }
            else {
                this.toastr.showToast(datos.message, "ERROR: ", 'bottom-right', 'warning', 10000, true, true, true);
            }
        }, error => {
            this.DetenerCarga();
            this.toastr.showToast("Error, intente más tarde.", "ERROR: ", 'bottom-right', 'danger', 10000, true, true, true);
        });
    }

    FormatoNumero(carac, value, largoInt, largoDec, codigoVariable, elemento) {
        var separadorDcimal = ',';
        var separadorMiles = '.';
        var permitidos = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', separadorDcimal];
        var formateado = value.replace(new RegExp(`[^${permitidos.join('')}]`, 'g'), '');
        let mascara = '';
        var regex = "/^\d{0," + largoInt.toString() + "}(?:\,\d{0," + largoDec.toString() + "})?$/";
        var re = new RegExp(regex, "g");

        if (re.test(formateado)) {
            var [integer, decimal] = formateado.split(separadorDcimal);
            integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, separadorMiles);
            if (decimal != undefined) {
                mascara = integer + separadorDcimal + decimal;
            } else {
                if (carac == separadorDcimal || carac == separadorMiles) {
                    mascara = integer + separadorDcimal;
                } else {
                    mascara = integer;
                }
            }

        } else {
            var [integer, decimal] = formateado.split(separadorDcimal);
            // integer.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            if (integer.length >= largoInt) {
                integer = integer.slice(0, largoInt).replace(/\B(?=(\d{3})+(?!\d))/g, separadorMiles);
            } else {
                integer = integer.slice(0, integer.length).replace(/\B(?=(\d{3})+(?!\d))/g, separadorMiles);
            }
            if (decimal != undefined) {
                decimal = decimal.slice(0, largoDec);
                mascara = integer + separadorDcimal + decimal;
            } else {
                if (carac == separadorDcimal || carac == separadorMiles) {
                    mascara = integer + separadorDcimal;
                } else {
                    mascara = integer;
                }
            }
        }
        elemento.value = mascara;
        if (codigoVariable == "pm25") {
            this.pm25Ingreso = mascara;
        }
        if (codigoVariable == "pm10") {
            this.pm10Ingreso = mascara;
        }
        if (codigoVariable == "o3") {
            this.o3Ingreso = mascara;
        }
        if (codigoVariable == "no2") {
            this.no2Ingreso = mascara;
        }
        if (codigoVariable == "co") {
            this.coIngreso = mascara;
        }
        if (codigoVariable == "temp") {
            this.temperaturaIngreso = mascara;
        }

    }

    RenderCampo(valor, modo) {
        if (valor == null || valor == undefined) {
            return valor;
        }
        if (modo == 1) { // Para campos como PKs, que no deben tener espacios vacios
            return valor.toString().replace(/\s/g, '');  //replace(/\./g, ',');
        }
        if (modo == 2) { // Para campos de texto, que pueden tener espacios vacios, pero no asi, espacios vacios juntos.
            return valor.toString().replace(/  /gi, "");
        }
        if (modo == 3) { // Para campos de fechas
            return moment(valor).format('DD/MM/YYYY HH:mm');
        }
        if (modo == 4) { // Para numeros enteros o decimales
            var separadorDcimal = ',';
            var separadorMiles = '.';
            var formateado = valor.toString().replace(/\./g, separadorDcimal);
            var [integer, decimal] = formateado.split(separadorDcimal);
            integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, separadorMiles);
            if (decimal) {
                return integer + "," + decimal;
            } else {
                return integer;
            }
        }
        if (modo == 5) { // Para campos de fechas de solo DD/MM/YYYY
            var dia = valor.toString().substring(8, 10);
            var mes = valor.toString().substring(5, 7);
            var anno = valor.toString().substring(0, 4);
            return dia + '/' + mes + '/' + anno;
        }
        if (modo == 6) { // Para numeros enteros o decimales de porcentaje con 2 decimales
            var valorAux = valor.toFixed(2);
            var separadorDcimal = ',';
            var separadorMiles = '.';
            var formateado = valorAux.toString().replace(/\./g, separadorDcimal);
            var [integer, decimal] = formateado.split(separadorDcimal);
            integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, separadorMiles);
            if (decimal) {
                return integer + "," + decimal;
            } else {
                return integer;
            }
        }
    }

    RealizarPrediccion() {
        this.IniciarCarga();
        var diccionario: any = {};
        var formats = [
            "YYYY-MM-DD HH:mm",
        ];
        var permitidos = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ','];
        diccionario.pm25 = parseFloat(this.pm25Ingreso.replace(new RegExp(`[^${permitidos.join('')}]`, 'g'), '').replace(/,/g, '.'));
        diccionario.pm10 = parseFloat(this.pm10Ingreso.replace(new RegExp(`[^${permitidos.join('')}]`, 'g'), '').replace(/,/g, '.'));
        diccionario.o3 = parseFloat(this.o3Ingreso.replace(new RegExp(`[^${permitidos.join('')}]`, 'g'), '').replace(/,/g, '.'));
        diccionario.no2 = parseFloat(this.no2Ingreso.replace(new RegExp(`[^${permitidos.join('')}]`, 'g'), '').replace(/,/g, '.'));
        diccionario.co = parseFloat(this.coIngreso.replace(new RegExp(`[^${permitidos.join('')}]`, 'g'), '').replace(/,/g, '.'));
        diccionario.temperatura = parseFloat(this.temperaturaIngreso.replace(new RegExp(`[^${permitidos.join('')}]`, 'g'), '').replace(/,/g, '.'));

        if (!diccionario.pm25) {
            diccionario.pm25 = 0;
        }
        if (!diccionario.pm10) {
            diccionario.pm10 = 0;
        }
        if (!diccionario.o3) {
            diccionario.o3 = 0;
        }
        if (!diccionario.no2) {
            diccionario.no2 = 0;
        }
        if (!diccionario.co) {
            diccionario.co = 0;
        }
        if (!diccionario.temperatura) {
            diccionario.temperatura = 0;
        }

        try {
            diccionario.fecha_d = this.fechaInicio.getDate();
            diccionario.fecha_m = this.fechaInicio.getMonth() + 1;
            diccionario.fecha_y = this.fechaInicio.getFullYear();
        } catch {
            diccionario.fecha_d = 0;
            diccionario.fecha_m = 0;
            diccionario.fecha_y = 0;
        }

        diccionario.codigo_comuna = this.selectComuna;

        console.log("enviado: ", diccionario)
        this.datosFechas = [];
        this.datosNiveles = [];
        this.datosCurva = [];

        this.ws.Predecir(diccionario).subscribe((datos) => {
            this.DetenerCarga();
            console.log("datos ", datos)
            this.codigoError = datos.error;
            if (datos.success == true) {
                
                for (var fecha of datos.data.fechas) {
                    this.datosFechas.push(this.RenderCampo(fecha, 5))
                }
                this.datosNiveles = datos.data.cod_calidad_aire;
                this.datosCurva = datos.data.puntos;
                this.filasTabla = [];
                for (var index=0; index<30;index++) {
                    this.filasTabla.push({fecha: this.datosFechas[index], nivel: this.datosNiveles[index]});
                }
                var color1 = "#35b435";
                var color2 = "#e7e231";
                var color3 = "#df8d30";
                var color4 = "#df4f30";
                var color5 = "#b830df";
                var colores1 = [];
                for (var numero of this.datosCurva) {
                    if (numero <= 50) {
                        colores1.push(color1);
                    }
                    if (numero > 50 && numero <= 100) {
                        colores1.push(color2);
                    }
                    if (numero > 100 && numero <= 150) {
                        colores1.push(color3);
                    }
                    if (numero > 150 && numero <= 200) {
                        colores1.push(color4);
                    }
                    if (numero > 200 && numero <= 300) {
                        colores1.push(color5);
                    }
                }


                this.graficaData = [
                    {
                        data: this.datosCurva,
                        label: 'AQI',
                        backgroundColor: colores1,
                        pointBackgroundColor: colores1,
                        pointBorderColor: colores1,
                        pointRadius: 5,
                        pointHoverRadius: 10,
                        pointHitRadius: 15
                    },
                ];
                this.graficaLabels = this.datosFechas;
                this.toastr.showToast(datos.message, "Mensaje: ", 'bottom-right', 'success', 10000, true, true, true);
            }
            else {
                this.toastr.showToast(datos.message, "Mensaje: ", 'bottom-right', 'warning', 10000, true, true, true);
            }
        }, error => {
            this.DetenerCarga();
            this.toastr.showToast("Error, intente más tarde.", "ERROR: ", 'bottom-right', 'danger', 10000, true, true, true);
        });
    }

    LimpiarTodo() {
        this.fechaInicio = null;
        this.pm25Ingreso = "";
        this.pm10Ingreso = "";
        this.o3Ingreso = "";
        this.no2Ingreso = "";
        this.coIngreso = "";
        this.temperaturaIngreso = "";
        this.selectComuna = null;
        this.codigoError = null;
        this.graficaData = [
            {
                data: null,
                label: 'AQI',
            },
        ];
    }
}
