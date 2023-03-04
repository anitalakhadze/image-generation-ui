import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../service/authentication.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  hide: boolean = true;
  loadingGAuth = false;

  registerForm!: FormGroup;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthenticationService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  // Convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.loading = true;
    this
      .authService
      .signUp(
        this.f['email'].value,
        this.f['password'].value
      )
      .then(() => {
        this.loading = false;
        this.toastr.success('You have successfully signed up', 'SUCCESS')
        this.router.navigate(['login']);
      }, err => {
        this.loading = false;
        this.toastr.error(this.authService.getSignupErrorMessage(err), 'ERROR');
        this.registerForm.reset();
        this.registerForm.controls['email'].setErrors(null);
        this.registerForm.controls['password'].setErrors(null);
      });
  }

  googleAuth() {
    this.loadingGAuth = true;
    this.authService.doGoogleLogin()
      .then(() => {
        this.loadingGAuth = false;
        this.router.navigate(['home']);
      }, err => {
        this.loadingGAuth = false;
        this.toastr.error(this.authService.getGAuthErrorMessage(err), 'ERROR');
        this.registerForm.reset();
        this.registerForm.controls['email'].setErrors(null);
        this.registerForm.controls['password'].setErrors(null);
      });
  }
}
