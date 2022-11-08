import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService as AuthGuard } from './services/auth-guard.service';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { HomepageModule } from './modules/homepage/homepage.module';

const routes: Routes = [
  {
    path: 'homepage', loadChildren: () => HomepageModule,
    canActivate: [AuthGuard], data: { role: ['admin', 'register'] }
  },
 
  { path: '', loadChildren: () => AuthenticationModule },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
