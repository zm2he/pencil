/* The Pencil project

   Copyright (c) 2020 Bruce Ziming He<bruce.he.62@gmail.com>
   See LICENSE.txt for more information
*/

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { EditComponent } from './components/edit/edit.component';

import { FirebaseService } from './services/firebase.service';
import { AuthGuardService } from './services/auth-guard.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    EditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [
    FirebaseService,
    AuthGuardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
