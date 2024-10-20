import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NivelSeisPage } from './nivel-seis.page';

describe('NivelSeisPage', () => {
  let component: NivelSeisPage;
  let fixture: ComponentFixture<NivelSeisPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NivelSeisPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
