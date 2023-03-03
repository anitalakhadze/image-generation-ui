import { Component } from '@angular/core';
import {AuthenticationService} from "../../auth/service/authentication.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  loading = false;
  iframeUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(environment.apiUrl);
  iframeLoading = true;

  constructor(
    public authService: AuthenticationService,
    private router: Router,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer
  ) {
  }

  signOut() {
    this.loading = true;
    this.closeIframe();
    this.authService.signOut()
      .then(() => {
        this.loading = false;
        this.router.navigate(['login']);
      }, err => {
        this.loading = false;
        console.log(err);
        this.toastr.error(err.message, 'ERROR');
      });
  }


  closeIframe() {
    const iframe = window.parent.document.getElementById('gradio-iframe');
    // @ts-ignore
    iframe.parentNode?.removeChild(iframe);
  }
}
