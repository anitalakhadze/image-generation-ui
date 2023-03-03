import {Injectable} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {Auth, getAuth} from "@angular/fire/auth";
import {environment} from "../../../environments/environment";
import {initializeApp} from "@angular/fire/app";
import firebase from "firebase/compat/app";

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
      getAuth().onAuthStateChanged(function(user){
        if (user) {
          resolve(user);
        } else {
          reject('No user logged in');
        }
      });
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
  //
  // GoogleAuth() {
  //   return this.AuthLogin(new firebase.auth.GoogleAuthProvider());
  // }
  //
  // // Auth logic to run auth providers
  // AuthLogin(provider: firebase.auth.AuthProvider) {
  //   return this.afAuth
  //     .signInWithPopup(provider)
  //     .then((result) => {
  //       console.log('You have been successfully logged in!');
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }

  doGoogleLogin(){
    return new Promise<any>((resolve, reject) => {
      let provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      this.afAuth
        .signInWithPopup(provider)
        .then(res => {
          resolve(res);
        }, err => {
          console.log(err);
          reject(err);
        })
    })
  }

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

  getSignInErrorMessage(err: { code: any; message: any; }): string {
    const errorCode = err.code;
    let errorMessage = err.message;
    switch (errorCode) {
      case 'auth/user-disabled':
        errorMessage = 'The user corresponding to the given email has been disabled';
        break;
      case 'auth/invalid-email':
        errorMessage = 'The email address is not valid';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Password is invalid for the given email';
        break;
      case 'auth/user-not-found':
        errorMessage = 'There is no user corresponding to the given email';
        break;
    }
    return errorMessage;
  }

  getGAuthErrorMessage(err: { code: any; message: any; }): string {
    const errorCode = err.code;
    let errorMessage = err.message;
    switch (errorCode) {
      case 'auth/cancelled-popup-request':
        errorMessage = 'Only one popup request is allowed at one time';
        break;
      case 'auth/popup-blocked':
        errorMessage = 'Popup was blocked by the browser';
        break;
      case 'auth/popup-closed-by-user':
        errorMessage = 'Popup window is closed by the user without completing the sign in to the provider';
        break;
      case 'auth/account-exists-with-different-credential':
        errorMessage = 'There already exists an account with the email address asserted by the credential';
        break;
    }
    return errorMessage;
  }

  getSignupErrorMessage(err: { code: any; message: any; }): string {
    const errorCode = err.code;
    let errorMessage = err.message;
    switch (errorCode) {
      case 'auth/email-already-in-use':
        errorMessage = 'There already exists an account with the given email address';
        break;
      case 'auth/invalid-email':
        errorMessage = 'The email address is not valid';
        break;
      case 'auth/operation-not-allowed':
        errorMessage = 'Email/password accounts are not enabled';
        break;
      case 'auth/weak-password':
        errorMessage = 'The password is not strong enough';
        break;
    }
    return errorMessage;
  }
}
