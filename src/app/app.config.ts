import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomPaginatorIntl } from './shared/custom-paginator-intl';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),
    { provide: MatPaginatorIntl, useClass: CustomPaginatorIntl },
    provideAnimations(),
    importProvidersFrom(FormlyModule.forRoot(), FormlyMaterialModule),
  ]
};
