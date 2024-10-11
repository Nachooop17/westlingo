import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NivelCinco1Page } from './nivel-cinco.1.page';

describe('NivelCinco1Page', () => {
  let component: NivelCinco1Page;
  let fixture: ComponentFixture<NivelCinco1Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NivelCinco1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
