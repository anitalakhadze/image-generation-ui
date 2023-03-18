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
  serviceUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
  iframeLoading = true;

  serviceLoading = true;
  presentationUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(environment.presentationUrl);

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

    this.authService.getLoggedInUser().currentUser?.getIdToken()
      .then(
        (id_token) => {
          // document.location.href = `${environment.apiAuthUrl}?id_token=${id_token}`
          this.serviceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`${environment.apiAuthUrl}?id_token=${id_token}`);
        }
      ).catch(
      (err) => {
        console.log(err)
        // this.toastr.error("Error while redirecting to FollowFox.ai", 'ERROR')
      }
    )

    setTimeout(() => {
      this.serviceLoading = false;
      this.closePresentationIframe();
      // this.serviceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(environment.apiUrl);
      // this.serviceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://fastapi.tiangolo.com/async/#asynchronous-code');
    }, 15000)
  }

  signOut() {
    this.loading = true;
    this.closeServiceIframe();
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

  closeServiceIframe() {
    const serviceIframe = window.parent.document.getElementById('service-iframe');
    // @ts-ignore
    serviceIframe.parentNode?.removeChild(serviceIframe);
  }

  closePresentationIframe() {
    const presentationIframe = window.parent.document.getElementById('presentation-iframe');
    // @ts-ignore
    presentationIframe.parentNode?.removeChild(presentationIframe);
  }

}
