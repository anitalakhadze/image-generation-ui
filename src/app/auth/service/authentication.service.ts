import {Injectable} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {Auth, getAuth} from "@angular/fire/auth";
import {environment} from "../../../environments/environment";
import {initializeApp} from "@angular/fire/app";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    public afAuth: AngularFireAuth, // Inject Firebase auth service
  ) {
  }

  getCurrentUser(){
    return new Promise<any>((resolve, reject) => {
      var user = getAuth().onAuthStateChanged(function(user){
        if (user) {
          resolve(user);
        } else {
          reject('No user logged in');
        }
      })
    })
  }

  isUserAuthenticated(): boolean {
    // return this.isAuthenticated;
    return this.getLoggedInUser() != null;
  }

  // get logged in user
  getLoggedInUser(): Auth {
    const app = initializeApp(environment.firebaseConfig);
    return getAuth(app);
  }

  // doGoogleLogin(){
  //   return new Promise<any>((resolve, reject) => {
  //     let provider = new firebase.auth.GoogleAuthProvider();
  //     provider.addScope('profile');
  //     provider.addScope('email');
  //     this.afAuth.auth
  //       .signInWithPopup(provider)
  //       .then(res => {
  //         resolve(res);
  //       }, err => {
  //         console.log(err);
  //         reject(err);
  //       })
  //   })
  // }

  // Sign up with email/password
  signUp(email: string, password: string) {
    // return this.afAuth.createUserWithEmailAndPassword(email, password);
    return new Promise<any>((resolve, reject) => {
      this.afAuth.createUserWithEmailAndPassword(email, password)
        .then(res => {
          resolve(res);
        }, err => reject(err))
    })
  }

  // Sign in with email/password
  signIn(email: string, password: string) {
    // return this.afAuth.signInWithEmailAndPassword(email, password);
    return new Promise<any>((resolve, reject) => {
      this.afAuth.signInWithEmailAndPassword(email, password)
        .then(res => {
          resolve(res);
        }, err => reject(err))
    })
  }

  /* Sign out */
  signOut() {
    // return this.afAuth.signOut();
    return new Promise<void>((resolve, reject) => {
      if(getAuth().currentUser){
        this.afAuth.signOut()
          .then(res => {
            resolve(res);
          }, err => reject(err))
      }
    });
  }
}
