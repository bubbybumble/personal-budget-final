import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { firebaseConfig } from './firebase.config';
import * as firebase from 'firebase/app';
import { TokenService } from './services/token.service';
import { AuthComponent } from './auth/auth.component';
import { PiechartComponent } from './piechart/piechart.component';
import { EditComponent } from './edit/edit.component';
import { AddComponent } from './add/add.component';
import { ListComponent } from './list/list.component';
import { LogoutComponent } from './logout/logout.component'
import { DataService } from './services/data.service';
import { BarchartComponent } from './barchart/barchart.component';
import { PolarChartComponent } from './polarchart/polarchart.component';

firebase.initializeApp(firebaseConfig);

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    DashboardComponent,
    AuthComponent,
    PiechartComponent,
    EditComponent,
    AddComponent,
    ListComponent,
    LogoutComponent,
    BarchartComponent,
    PolarChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    
  ],
  providers: [
    TokenService,
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
