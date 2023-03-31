import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../../auth/service/authentication.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {DomSanitizer} from "@angular/platform-browser";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-img2img',
  templateUrl: './img2img.component.html',
  styleUrls: ['./img2img.component.css']
})
export class Img2imgComponent implements OnInit {

  imageSrc: string | undefined;

  imageGenerationForm!: FormGroup;
  id_token = '';

  fileName = '';

  apiLoading = false;
  file_store!: FileList;

  constructor(
    private formBuilder: FormBuilder,
    public authService: AuthenticationService,
    private router: Router,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
    private httpClient: HttpClient
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
      prompt: ['hot air balloon', Validators.required],
      image_data: [null, Validators.required]
    });

    this.imageGenerationForm.controls['image_data'].valueChanges.subscribe((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageSrc = reader.result as string;
        console.log(this.imageSrc)
      }
    })
  }

  generate(loadPresentation: boolean = false) {

    console.log(this.imageGenerationForm.value)

    // this.apiLoading = true;
    // this.loadPresentation = loadPresentation;
    // this.imageGenerationForm.controls['id_token'].setValue(this.id_token);
    // console.log(this.imageGenerationForm.value);
    //
    // this.httpClient.post<Response>(environment.apiBaseUrl + '/predict', this.imageGenerationForm.value)
    //   .subscribe((data) => {
    //       this.apiLoading = false;
    //       this.loadPresentation = false;
    //       this.images = data;
    //     }
    //   )
  }

  getImage($event: Event) {
    // @ts-ignore
    if ($event.target.files && $event.target.files[0]) {
      // @ts-ignore
      let file = $event.target.files[0];

      console.log(file);
    }
  }

  removeImage() {
    this.imageSrc = undefined;
    this.imageGenerationForm.controls['image_data'].setValue(null);
  }
}
