import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NivelUno1Page } from './nivel-uno.1.page';

describe('NivelUno1Page', () => {
  let component: NivelUno1Page;
  let fixture: ComponentFixture<NivelUno1Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NivelUno1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
