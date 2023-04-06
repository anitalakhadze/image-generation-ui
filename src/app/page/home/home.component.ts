import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../auth/service/authentication.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PresentationService} from "../../service/presentation/presentation.service";

export interface Image {
  image_base64: string
}

export interface Response {
  images: Image[]
}

interface SamplingMethod {
  displayName: string,
  value: string
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  imageGenerationForm!: FormGroup;
  models: string[] = [];
  samplingMethods: SamplingMethod[] = [
    { displayName: 'Euler a', value: 'sample_euler_ancestral'},
    { displayName: 'Euler', value: 'sample_euler'},
    { displayName: 'LMS', value: 'sample_lms'},
    { displayName: 'Heun', value: 'sample_heun'},
    { displayName: 'DPM2', value: 'sample_dpm_2'},
    { displayName: 'DPM2 a', value: 'sample_dpm_2_ancestral'},
    { displayName: 'DPM++ 2S a', value: 'sample_dpmpp_2s_ancestral'},
    { displayName: 'DPM++ 2M', value: 'sample_dpmpp_2m'},
    { displayName: 'DPM++ SDE', value: 'sample_dpmpp_sde'},
    { displayName: 'DPM fast', value: 'sample_dpm_fast'},
    { displayName: 'DPM adaptive', value: 'sample_dpm_adaptive'}
  ];

  selectedModel = this.models[0];
  selectedSamplingMethod = this.samplingMethods[0].value;
  id_token = '';

  images!: Response;

  apiLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    public authService: AuthenticationService,
    private router: Router,
    private toastr: ToastrService,
    private httpClient: HttpClient,
    private presentationService: PresentationService
  ) {
    this.getLoggedInUserToken();
  }

  getLoggedInUserToken() {
    this.authService.getLoggedInUser().currentUser?.getIdToken()
      .then(
        (id_token) => {
          this.id_token = id_token;
        }
      ).catch(
      (err) => {
        console.log(err)
      }
    );
  }

  initModels() {
    return this.httpClient.get<[]>(environment.apiBaseUrl + '/models');
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
      generator: [-1, Validators.required],
      scheduler: [this.selectedSamplingMethod, Validators.required]
    });

    this.initModels()
      .subscribe((data) => {
          this.apiLoading = false;
          this.models = data;
          this.imageGenerationForm.controls['model'].setValue(this.models[0]);
          // this.generate(true);
        }
      )
  }

  generate(loadPresentation: boolean = false) {
    this.apiLoading = true;
    if (loadPresentation) {
      this.presentationService.showPresentation();
    } else {
      this.presentationService.closePresentation();
    }
    this.imageGenerationForm.controls['id_token'].setValue(this.id_token);
    console.log(this.imageGenerationForm.value);

    this.httpClient.post<Response>(environment.apiBaseUrl + '/predict', this.imageGenerationForm.value)
      .subscribe({
        next: (data) => {
          this.apiLoading = false;
          this.presentationService.closePresentation();
          this.images = data;
        },
        error: (err) => {
          this.apiLoading = false;
          this.presentationService.closePresentation();
          this.toastr.error(err, 'ERROR');
        }
      })
  }
}
