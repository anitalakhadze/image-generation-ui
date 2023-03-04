import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../../service/authentication.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  loading = false;
  resetPasswordForm!: FormGroup

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.resetPasswordForm = this.formBuilder.group({
      email: ['', Validators.required]
    });
  }

  // Convenience getter for easy access to form fields
  get f() {
    return this.resetPasswordForm.controls;
  }

  onSubmit() {
    this.loading = true;
    this
      .authService
      .resetPasswordInit(
        this.f['email'].value
      )
      .then(() => {
        this.loading = false;
        this.toastr.success('Reset link has been successfully sent to E-mail', 'SUCCESS');
        this.router.navigate(['login']);
      }, err => {
        this.loading = false;
        this.toastr.error(this.authService.getSignInErrorMessage(err), 'ERROR');
        this.resetPasswordForm.reset();
        this.resetPasswordForm.controls['email'].setErrors(null);
      });
  }

}
