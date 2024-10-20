import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NivelNuevePage } from './nivel-nueve.page';

describe('NivelNuevePage', () => {
  let component: NivelNuevePage;
  let fixture: ComponentFixture<NivelNuevePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NivelNuevePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
