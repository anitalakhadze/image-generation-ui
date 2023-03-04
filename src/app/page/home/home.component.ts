import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../auth/service/authentication.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  loading = false;
  iframeUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
  iframeLoading = true;

  constructor(
    public authService: AuthenticationService,
    private router: Router,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
    private httpClient: HttpClient
  ) {
  }

  ngOnInit(): void {
    // this.httpClient.get(environment.apiHealthCheckUrl)
    //   .subscribe({
    //     next: () => {
    //       this.iframeLoading = false;
    //       this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(environment.apiUrl);
    //     },
    //     error: () => {
    //       this.iframeLoading = false;
    //       this.toastr.error("Error while trying to connect to API", 'ERROR')
    //     }
    //   })
  }

  signOut() {
    this.loading = true;
    // this.closeIframe();
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
