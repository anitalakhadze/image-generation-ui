import {Component} from '@angular/core';
import {AuthenticationService} from "../../auth/service/authentication.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {PresentationService} from "../../service/presentation/presentation.service";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {

  signOutBtnLoading: boolean = false;

  constructor(
    public authService: AuthenticationService,
    public router: Router,
    private toastr: ToastrService,
    public presentationService: PresentationService
  ) {
  }

  signOut() {
    this.signOutBtnLoading = true;
    this.authService.signOut()
      .then(() => {
        this.signOutBtnLoading = false;
        this.router.navigate(['login']);
      }, err => {
        this.signOutBtnLoading = false;
        console.log(err);
        this.toastr.error(err.message, 'ERROR');
      });
  }

}
