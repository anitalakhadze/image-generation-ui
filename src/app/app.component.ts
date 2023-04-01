import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {environment} from "../environments/environment";
import {PresentationService} from "./service/presentation/presentation.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Image Generation UI';

  loadPresentation = false;
  presentationUrl: SafeResourceUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(environment.presentationUrl);

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private presentationService: PresentationService
  ) {
    this.matIconRegistry.addSvgIcon(
      "google",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/google.svg")
    );
  }

  ngOnInit(): void {
    this.presentationService.loadPresentationSubject.subscribe((loadPresentation) => {
      this.loadPresentation = loadPresentation
    })
  }

  removePresentationIframe() {
    const presentationIframe = window.parent.document.getElementById('presentation-iframe');
    // @ts-ignore
    presentationIframe.parentNode?.removeChild(presentationIframe);
  }

  ngOnDestroy(): void {
    this.presentationService.loadPresentationSubject.unsubscribe();
    this.removePresentationIframe();
  }
}
