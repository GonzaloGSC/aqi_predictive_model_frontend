/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, LOCALE_ID } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CoreModule } from './@core/core.module';
import { ThemeModule } from './@theme/theme.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {
  NbChatModule,
  NbDatepickerModule,
  NbDialogModule,
  NbMenuModule,
  NbSidebarModule,
  NbToastrModule,
  NbWindowModule,
  NbLayoutModule,
  NbThemeModule,
  NbContextMenuModule,
} from '@nebular/theme';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiService } from './webservice/web-service';
import { SessionService } from './sessionservice/session-service';
import { AuthInterceptorService } from './webservice/interceptor';
import { AuthGuardService } from './webservice/guard';
import localeEs from '@angular/common/locales/es';
import { formatDate, registerLocaleData } from '@angular/common';

import { toastrService } from './toastrservice/toastr.service';
import {OverlayContainer} from "../../node_modules/@angular/cdk/overlay";
import { NbDateFnsDateModule } from '@nebular/date-fns';


registerLocaleData(localeEs, 'es');
@NgModule({
  imports: [
    NbLayoutModule,
    NbThemeModule.forRoot(),
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NbContextMenuModule,
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDateFnsDateModule.forRoot({ format: 'dd/MM/yyyy' }),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    NbChatModule.forRoot({
      messageGoogleMapKey: 'AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY',
    }),
    CoreModule.forRoot(),
    ThemeModule.forRoot(),
  ],
  declarations: [
    AppComponent,
    LoginComponent,
  ],
  bootstrap: [AppComponent],
  providers: [
    toastrService,
    ApiService,
    SessionService,
    AuthGuardService,
    { provide: OverlayContainer },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    { provide: LOCALE_ID, useValue: 'es-ES' }
  ],
})
export class AppModule {
}
