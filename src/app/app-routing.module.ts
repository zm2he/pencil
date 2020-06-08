/* The Pencil project

   Copyright (c) 2020 Bruce Ziming He<bruce.he.62@gmail.com>
   See LICENSE.txt for more information
*/

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {  AuthGuardService} from './services/auth-guard.service';
import { LoginComponent } from './components/login/login.component';
import { EditComponent } from './components/edit/edit.component';

const routes: Routes = [
  { path: '', redirectTo: '/edit', pathMatch: 'full'},
  { path: 'login', component: LoginComponent},
  { path: 'edit', component: EditComponent, canActivate: [ AuthGuardService] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
