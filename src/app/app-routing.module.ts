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
import {LayoutComponent} from "./layout/layout/layout.component";
import {Img2imgComponent} from "./page/img2img/img2img.component";

export const redirectAnonymousTo = (redirect: any[]) =>
  pipe(isNotAnonymous, map(loggedIn => loggedIn || redirect));

const redirectUnauthorizedToLogin = () => redirectAnonymousTo(['login']);

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'password/reset', component: ResetPasswordComponent},
  {path: 'user/management', component: UserManagementComponent},
  {
    path: 'home',
    component: LayoutComponent,
    children: [
      {
        path: 'stable-diffusion',
        component: HomeComponent
      },
      {
        path: 'control-net',
        component: Img2imgComponent
      }
    ],
    canActivate: [AngularFireAuthGuard],
    data: {authGuardPipe: redirectUnauthorizedToLogin}
  },
  // {path: 'home', component: HomeComponent, canActivate: [AngularFireAuthGuard], data : { authGuardPipe: redirectUnauthorizedToLogin }},
  {path: '', pathMatch: 'full', redirectTo: 'home/stable-diffusion'},
  {path: '**', redirectTo: 'home/stable-diffusion'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
