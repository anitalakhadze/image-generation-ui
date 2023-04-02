import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../../auth/service/authentication.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {PresentationService} from "../../service/presentation/presentation.service";

export interface Response {
  canny_base64: string,
  image_base64: string
}

@Component({
  selector: 'app-img2img',
  templateUrl: './img2img.component.html',
  styleUrls: ['./img2img.component.css']
})
export class Img2imgComponent implements OnInit {
  base64ImagePrefix: string = 'data:image/jpeg;base64,';

  imageSrc: string | undefined;
  fileName: string = 'Choose a file';

  imageGenerationForm!: FormGroup;
  id_token = '';

  apiLoading = false;

  images!: Response;

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

  ngOnInit(): void {
    this.imageGenerationForm = this.formBuilder.group({
      id_token: [''],
      dev_bypass_auth_failure: [false],
      prompt: ['hot air balloon', Validators.required],
      negative_prompt: [''],
      num_inference_steps: [20],
      image_data: [null, Validators.required],
      image: []
    });
  }

  generate(loadPresentation: boolean = false) {
    console.log(this.fileName);

    this.apiLoading = true;
    if (loadPresentation) {
      this.presentationService.showPresentation();
    } else {
      this.presentationService.closePresentation();
    }

    this.imageGenerationForm.removeControl('image');
    this.imageGenerationForm.controls['id_token'].setValue(this.id_token);
    console.log(this.imageGenerationForm.value);

    this.httpClient.post<Response>(environment.apiBaseUrl + '/controlnet', this.imageGenerationForm.value)
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

  removeImage() {
    this.imageSrc = undefined;
    this.fileName = 'Choose a file';
    this.imageGenerationForm.controls['image_data'].setValue(null);
    this.imageGenerationForm.controls['image'].setValue(null);
  }

  preview($event: Event) {
    const reader = new FileReader();
    // @ts-ignore
    if ($event.target.files[0]) {
      // @ts-ignore
      this.fileName = $event.target.files[0].fileName;
      // @ts-ignore
      reader.readAsDataURL($event.target.files[0]);
    }
    reader.onload = () => {
      this.imageSrc = reader.result as string;
      this.imageGenerationForm.controls['image_data'].setValue(this.imageSrc.substring(this.imageSrc.indexOf(",") + 1));
    }
  }
}
