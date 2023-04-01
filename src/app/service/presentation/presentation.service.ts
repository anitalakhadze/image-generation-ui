import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PresentationService {

  constructor() { }

  loadPresentationSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loadPresentation = this.loadPresentationSubject.asObservable();

  showPresentation() {
    this.loadPresentationSubject.next(true);
  }

  closePresentation() {
    this.loadPresentationSubject.next(false);
  }

}
