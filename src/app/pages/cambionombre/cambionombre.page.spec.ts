import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CambionombrePage } from './cambionombre.page';

describe('CambionombrePage', () => {
  let component: CambionombrePage;
  let fixture: ComponentFixture<CambionombrePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CambionombrePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
