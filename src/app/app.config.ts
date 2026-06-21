import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHighcharts } from 'highcharts-angular';
import { routes } from './app.routes';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomPaginatorIntl } from './shared/custom-paginator-intl';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { RepeatTypeComponent } from './shared/repeat-type.component';
import { mockApiInterceptor } from './services/mock-api.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([mockApiInterceptor])),
    provideHighcharts(),
    { provide: MatPaginatorIntl, useClass: CustomPaginatorIntl },
    provideAnimations(),
    importProvidersFrom(
      FormlyModule.forRoot({
        validationMessages: [
          { name: 'required', message: 'This field is required.' },
          { name: 'minimumDeposit', message: (err:any, field:any) => `Minimum deposit is ${field?.model?.accountType === 'investment' ? 1000 : 100} ${field?.model?.currency || 'USD'}.` },
        ],
        types: [
          { name: 'repeat', component: RepeatTypeComponent }
        ]
      }),
      FormlyMaterialModule
    ),
  ]
};
