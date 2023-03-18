import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./auth/page/login/login.component";
import {RegisterComponent} from "./auth/page/register/register.component";
import {HomeComponent} from "./page/home/home.component";
import {AngularFireAuthGuard} from "@angular/fire/compat/auth-guard";
import {map, pipe} from "rxjs";
import {isNotAnonymous} from "@angular/fire/auth-guard";
import {ResetPasswordComponent} from "./auth/page/reset-password/reset-password.component";
import {UserManagementComponent} from "./auth/page/user-management/user-management.component";

export const redirectAnonymousTo = (redirect: any[]) =>
  pipe(isNotAnonymous, map(loggedIn => loggedIn || redirect));

const redirectUnauthorizedToLogin = () => redirectAnonymousTo(['login']);

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'home'},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'password/reset', component: ResetPasswordComponent},
  {path: 'user/management', component: UserManagementComponent},
  {path: 'home', component: HomeComponent, canActivate: [AngularFireAuthGuard], data : { authGuardPipe: redirectUnauthorizedToLogin }},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
