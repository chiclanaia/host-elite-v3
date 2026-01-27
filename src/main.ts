
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';

import { AppComponent } from './app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideHttpClient()
  ],
}).catch(err => {
  console.error(err);
  document.body.innerHTML = `<div style="padding: 20px; color: red; font-family: monospace;">
        <h1>Application Startup Error</h1>
        <pre>${err?.message || err}</pre>
        <pre>${err?.stack || ''}</pre>
    </div>`;
});
// Force rebuild trigger
// force rebuild
// force print rebuild 2
// force print rebuild 3
// force print rebuild 4
// force print rebuild 5
// force print rebuild 6
// force print rebuild 7
// force print rebuild 8
// force print rebuild 9
// force print rebuild 10
// force print rebuild 11
// force rebuild 12
