import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../auth/service/authentication.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  imageGenerationForm!: FormGroup;

  models: string[] = [
    "irakli-last-damon_2-ep99-gs00700",
    "irakli-last-damon_3-ep99-gs00700",
    "irakli-last-damon_5-ep99-gs00500"
  ];
  samplingMethods: string[] = [
    "DDIMScheduler",
    "DDPMScheduler",
    "HeunDiscreteScheduler",
    "KDPM2AncestralDiscreteScheduler",
    "DPMSolverSinglestepScheduler",
    "EulerDiscreteScheduler",
    "KDPM2DiscreteScheduler",
    "DPMSolverMultistepScheduler",
    "DEISMultistepScheduler",
    "PNDMScheduler",
    "EulerAncestralDiscreteScheduler"
  ];

  selectedModel = this.models[0];
  selectedSamplingMethod = this.samplingMethods[0];
  id_token = '';

  apiLoading = false;

  // end

  loading = false;
  serviceUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');

  presentationUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(environment.presentationUrl);

  constructor(
    private formBuilder: FormBuilder,
    public authService: AuthenticationService,
    private router: Router,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
    private httpClient: HttpClient
  ) {
  }

  ngOnInit(): void {
    this.imageGenerationForm = this.formBuilder.group({
      id_token: [''],
      dev_bypass_auth_failure: [false],
      model: [this.models[0], Validators.required],
      prompt: ['loeb wearing sunglasses in front of the ocean in a city', Validators.required],
      height: [512, Validators.required],
      width: [512, Validators.required],
      num_inference_steps: [30, Validators.required],
      guidance_scale: [7, Validators.required],
      negative_prompt: ['bad anatomy, blurry, low quality, bad', Validators.required],
      generator: [555, Validators.required],
      scheduler: [this.samplingMethods[0], Validators.required]
    });

    this.authService.getLoggedInUser().currentUser?.getIdToken()
      .then(
        (id_token) => {
          this.id_token = id_token;
        }
      ).catch(
      (err) => {
        console.log(err)
      }
    )
  }

  signOut() {
    this.loading = true;
    // this.closeServiceIframe();
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

  // closeServiceIframe() {
  //   const serviceIframe = window.parent.document.getElementById('service-iframe');
  //   // @ts-ignore
  //   serviceIframe.parentNode?.removeChild(serviceIframe);
  // }
  //
  // closePresentationIframe() {
  //   const presentationIframe = window.parent.document.getElementById('presentation-iframe');
  //   // @ts-ignore
  //   presentationIframe.parentNode?.removeChild(presentationIframe);
  // }

  generate() {
    this.apiLoading = true;
    this.imageGenerationForm.controls['id_token'].setValue(this.id_token);
    console.log(this.imageGenerationForm.value);
    this.httpClient.post(environment.apiBaseUrl + '/predict', this.imageGenerationForm.value)
      .subscribe({
          next: (data) => {
            this.apiLoading = false;
            console.log(data);
            this.toastr.success('success')
          },
          error: (err) => {
            this.apiLoading = false;
            console.log(err);
            this.toastr.error('error');
          }
        }
      )
  }
}
