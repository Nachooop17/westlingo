import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NivelDosPage } from './nivel-dos.page';

describe('NivelDosPage', () => {
  let component: NivelDosPage;
  let fixture: ComponentFixture<NivelDosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NivelDosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
