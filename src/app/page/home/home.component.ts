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
  displayIframe = true;
  iframeUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(environment.apiUrl);

  constructor(
    public authService: AuthenticationService,
    private router: Router,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer
  ) {
  }

  signOut() {
    this.closeIframe();
    this.authService.signOut()
      .then(() => {
        this.router.navigate(['login']);
      }, err => {
        console.log(err);
        this.toastr.error(err.message);
      });
  }


  closeIframe() {
    const iframe = window.parent.document.getElementById('gradio-iframe');
    // @ts-ignore
    iframe.parentNode?.removeChild(iframe);
  }
}
