import { Component } from '@angular/core';
import {AuthenticationService} from "../../auth/service/authentication.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {

  loadPresentation: boolean = false;
  signOutBtnLoading: boolean = false;

  presentationUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(environment.presentationUrl);

  constructor(
    public authService: AuthenticationService,
    public router: Router,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer
  ) {
  }

  signOut() {
    this.signOutBtnLoading = true;
    // this.removePresentationIframe();
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

  removePresentationIframe() {
    const presentationIframe = window.parent.document.getElementById('presentation-iframe');
    // @ts-ignore
    presentationIframe.parentNode?.removeChild(presentationIframe);
  }

}
