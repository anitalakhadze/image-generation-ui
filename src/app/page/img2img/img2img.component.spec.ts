import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Img2imgComponent } from './img2img.component';

describe('Img2imgComponent', () => {
  let component: Img2imgComponent;
  let fixture: ComponentFixture<Img2imgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Img2imgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Img2imgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
