import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {KratosLoginResolver} from './kratos.login.resolver';
import {KratosRegisterResolver} from './kratos.register.resolver';
import {DashboardComponent} from './dashboard/dashboard.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    resolve: {
      kratos: KratosLoginResolver
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    resolve: {
      kratos: KratosRegisterResolver
    }
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
