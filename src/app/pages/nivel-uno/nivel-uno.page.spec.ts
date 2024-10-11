import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NivelUnoPage } from './nivel-uno.page';

describe('NivelUnoPage', () => {
  let component: NivelUnoPage;
  let fixture: ComponentFixture<NivelUnoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NivelUnoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
