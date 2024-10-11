import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NivelCincoPage } from './nivel-cinco.page';

describe('NivelCincoPage', () => {
  let component: NivelCincoPage;
  let fixture: ComponentFixture<NivelCincoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NivelCincoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
