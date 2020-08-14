import {NgModule} from '@angular/core';
import {ServerModule, ServerTransferStateModule} from '@angular/platform-server';

import {AppModule} from './app.module';
import {AppComponent} from './app.component';
import {MatInputModule} from '@angular/material/input';
import {KratosLoginResolver} from './kratos.login.resolver';
import {BrowserModule} from '@angular/platform-browser';
import {KratosRegisterResolver} from './kratos.register.resolver';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    MatInputModule,
    ServerTransferStateModule,
  ],
  providers: [
    KratosLoginResolver,
    KratosRegisterResolver
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {
}
