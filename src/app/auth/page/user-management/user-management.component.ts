import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService} from "../../service/authentication.service";
import {Subject, takeUntil} from "rxjs";
import {ToastrService} from "ngx-toastr";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

export enum UserManagementActions {
  resetPassword=('resetPassword'),
  recoverEmail=('recoverEmail'),
  verifyEmail=('verifyEmail')
}

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit, OnDestroy {
  ngUnsubscribe: Subject<any> = new Subject<any>();

  hideNewPassword = true;
  hideConfirmPassword = true;

  loadingResetPassword = false;

  public mode: any;
  private actionCode: any;
  public actionCodeChecked: boolean = false;

  resetPasswordForm!: FormGroup

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthenticationService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.resetPasswordForm = this.formBuilder.group({
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });

    this.activatedRoute.queryParams
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(params => {
        // if we didn't receive any parameters,
        // we can't do anything
        if (!params) this.router.navigate(['/home']);

        this.mode = params['mode'];
        this.actionCode = params['oobCode'];

        switch (params['mode']) {
          case UserManagementActions.resetPassword: {
            // Verify the password reset code is valid.
            this.authService.verifyPasswordResetCode(this.actionCode).then(email => {
              this.actionCodeChecked = true;
            }).catch(e => {
              // Invalid or expired action code. Ask user to try to reset the password
              // again.
              this.toastr.error('Invalid or expired action code. Please, try to reset the password again.', 'ERROR');
              this.router.navigate(['/login']);
            });
          } break
          case UserManagementActions.recoverEmail: {

          } break
          case UserManagementActions.verifyEmail: {

          } break
          default: {
            console.log('query parameters are missing');
            this.router.navigate(['/auth/login']);
          }
        }
      })
  }

  ngOnDestroy() {
    // End all subscriptions listening to ngUnsubscribe
    // to avoid memory leaks.
    // @ts-ignore
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  // Convenience getter for easy access to form fields
  get f() {
    return this.resetPasswordForm.controls;
  }

  /**
   * Attempt to confirm the password reset with firebase and
   * navigate user back to home.
   */
  handleResetPassword() {
    if (this.f['newPassword'].value != this.f['confirmPassword'].value) {
      this.toastr.error('New Password and Confirm Password do not match', 'ERROR');
      return;
    }
    this.loadingResetPassword = true;
    // Save the new password.
    this.authService.confirmPasswordReset(
      this.actionCode,
      this.f['newPassword'].value
    ).then(() => {
      this.loadingResetPassword = false;
      // Password reset has been confirmed and new password updated.
      this.toastr.success('New password has been saved', 'SUCCESS');
      this.router.navigate(['/login']); })
      .catch(e => {
        this.loadingResetPassword = false;
      // Error occurred during confirmation. The code might have
      // expired or the password is too weak. alert(e);
        this.toastr.error('Expired action code or the password is too weak. Please, try again.', 'ERROR');
        this.router.navigate(['/login']);
    });
  }
}
