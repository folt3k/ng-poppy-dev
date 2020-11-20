import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import * as hljs from 'highlight.js';
import typescript from 'highlight.js/lib/languages/typescript';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

hljs.registerLanguage('typescript', typescript);

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
