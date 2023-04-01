import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LoginComponent} from './auth/page/login/login.component';
import {RegisterComponent} from './auth/page/register/register.component';
import {HomeComponent} from './page/home/home.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from '@angular/common/http';
import {environment} from "../environments/environment";
import {AngularFireModule} from "@angular/fire/compat";
import {AngularFireAuthModule} from "@angular/fire/compat/auth";
import {AuthenticationService} from "./auth/service/authentication.service";
import {ToastrModule} from "ngx-toastr";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatDividerModule} from "@angular/material/divider";
import {ResetPasswordComponent} from './auth/page/reset-password/reset-password.component';
import { UserManagementComponent } from './auth/page/user-management/user-management.component';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatSelectModule} from "@angular/material/select";
import {MatSliderModule} from "@angular/material/slider";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatGridListModule} from "@angular/material/grid-list";
import { Img2imgComponent } from './page/img2img/img2img.component';
import { LayoutComponent } from './layout/layout/layout.component';
import {NgxMatFileInputModule} from "@angular-material-components/file-input";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ResetPasswordComponent,
    UserManagementComponent,
    Img2imgComponent,
    LayoutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    ToastrModule.forRoot(),
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSliderModule,
    FormsModule,
    MatGridListModule,
    NgxMatFileInputModule,
    // ToastrModule added
  ],
  providers: [AuthenticationService, AppComponent],
  bootstrap: [AppComponent]
})

export class AppModule {
}
