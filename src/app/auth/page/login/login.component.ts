import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../service/authentication.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthenticationService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
    if (this.authService.isUserAuthenticated()) {
      this.authService.signOut();
    }

    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  // Convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.loading = true;
    this
      .authService
      .signIn(
        this.f['email'].value,
        this.f['password'].value
      )
      .then(() => {
        this.router.navigate(['home']);
      }, err => {
        this.loading = false;
        this.toastr.error(err.message);
        this.loginForm.reset();
        this.loginForm.controls['email'].setErrors(null);
        this.loginForm.controls['password'].setErrors(null);
      });
  }
}
