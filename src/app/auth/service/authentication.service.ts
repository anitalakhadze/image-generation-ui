import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import firebase from "firebase/compat";
import {AngularFireAuth} from "@angular/fire/compat/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  // constructor(
  //   private httpClient: HttpClient
  // ) { }
  //
  // login(body: any) {
  //   return this.httpClient.post(environment.apiUrl + "/auth/authenticate", body);
  // }

  userData!: Observable<firebase.User>;

  constructor(
    public afAuth: AngularFireAuth // Inject Firebase auth service
  ) {
    // @ts-ignore
    this.userData = afAuth.authState;
  }

  // Sign up with email/password
  signUp(email: string, password: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        window.alert('You have been successfully registered!');
        console.log(result.user);
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  // Sign in with email/password
  signIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  /* Sign out */
  signOut() {
    this
      .afAuth
      .signOut()
      .then(() => console.log('User has been successfully signed out'));
  }
}
