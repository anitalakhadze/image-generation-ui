import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../service/authentication.service";

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
  ) {
  }

  ngOnInit(): void {
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
      .then(r => {
        console.log(r);
        this.router.navigate(['home'])
          .then(() => console.log('User has signed in'))
      });
      // .subscribe({
      //   next: (data) => {
      //     // @ts-ignore
      //     let token = data['token'];
      //     console.log(token);
      //     this.router.navigate(['home'])
      //   },
      //   error: () => console.log('error')
      // });
  }
}
