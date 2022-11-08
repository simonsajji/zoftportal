import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeftSidebarComponent } from './components/left-sidebar/left-sidebar.component';
import { RightSidebarComponent } from './components/right-sidebar/right-sidebar.component';
import { FeedsComponent } from './components/feeds/feeds.component';
import { HomeComponent } from './components/home/home.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService as AuthGuard } from '../../services/auth-guard.service';

const routes: Routes = [
  {
    path: '', component: HomeComponent, canActivate: [AuthGuard], data: { role: ['admin', 'receiver'] },
    children: [
      { path: '', component: FeedsComponent, canActivate: [AuthGuard], data: { role: ['admin', 'receiver'] } },
    ]
  },
 
  { path: '**', redirectTo: '', pathMatch: 'full' }]

@NgModule({
  declarations: [
    LeftSidebarComponent,
    RightSidebarComponent,
    FeedsComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class HomepageModule { 
  constructor(){
    console.log("hello")
  }
}
