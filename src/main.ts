import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { Calculator } from './app/calculator/calculator';

bootstrapApplication(Calculator, appConfig)
  .catch((err) => console.error(err));
