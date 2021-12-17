import { NgModule } from '@angular/core';
import { ContextMenuModule } from 'ngx-contextmenu'
import { NbContextMenuModule, NbMenuModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import {
    NbActionsModule,
    NbButtonModule,
    NbCardModule,
    NbCheckboxModule,
    NbDatepickerModule, NbIconModule,
    NbInputModule,
    NbRadioModule,
    NbSelectModule,
    NbUserModule,
    NbTabsetModule,
    NbSpinnerModule,
    NbStepperModule,

} from '@nebular/theme';

import {
    NbMomentDateModule,
} from '@nebular/moment';

import {
    NbDateFnsDateModule,
} from '@nebular/date-fns';

import { PagesRoutingModule } from './pages-routing.module';
import { FormsModule } from '@angular/forms';
import { SortDirective } from '../directives/sort.directive';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { ChartsModule } from 'ng2-charts';
import { NgxGaugeModule } from 'ngx-gauge';

import { HomeComponent } from './home/home.component';

@NgModule({
    imports: [
        NgxGaugeModule,
        ChartsModule,
        PagesRoutingModule,
        ThemeModule,
        NbContextMenuModule,
        NbMenuModule,
        NbActionsModule,
        NbButtonModule,
        NbCardModule,
        NbCheckboxModule,
        NbDatepickerModule, NbIconModule,
        NbInputModule,
        NbRadioModule,
        NbSelectModule,
        NbUserModule,
        NbTabsetModule,
        NbSpinnerModule,
        FormsModule,
        NgxPaginationModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        ContextMenuModule.forRoot(),

        NbStepperModule,
        NbMomentDateModule,
        NbDateFnsDateModule.forRoot({
            parseOptions: { useAdditionalWeekYearTokens: true, useAdditionalDayOfYearTokens: true },
            formatOptions: { useAdditionalWeekYearTokens: true, useAdditionalDayOfYearTokens: true },
            format: 'dd.mm.yyyy'
        }),
        NgSelectModule,
    ],
    declarations: [
        PagesComponent,
        SortDirective,

        HomeComponent,
    ],
})
export class PagesModule {
}
