import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { PopoverModule } from 'ng-poppy';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { RouterTestingModule } from '@angular/router/testing';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterTestingModule.withRoutes([]),
    CoreModule,
    SharedModule,
    PopoverModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
