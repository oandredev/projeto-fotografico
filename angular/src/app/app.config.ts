import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { TitleStrategy } from '@angular/router';

import { routes } from './app.routes';

// Custom Title Strategy
import { CustomTitleStrategy } from './core/strategies/custom-title-strategy';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: TitleStrategy,
      useClass: CustomTitleStrategy
    }
  ]
};