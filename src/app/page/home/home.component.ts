import { Component } from '@angular/core';
import {AuthenticationService} from "../../auth/service/authentication.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(
    public authService: AuthenticationService,
    private router: Router,
    private toastr: ToastrService
  ) {
  }

  signOut() {
    this.authService.signOut()
      .then(() => {
        this.router.navigate(['login']);
      }, err => {
        console.log(err);
        this.toastr.error(err.message);
      });
  }

}
