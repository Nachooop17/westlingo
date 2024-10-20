import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NivelSeis1Page } from './nivel-seis.1.page';

describe('NivelSeis1Page', () => {
  let component: NivelSeis1Page;
  let fixture: ComponentFixture<NivelSeis1Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NivelSeis1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
