import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NivelTres1Page } from './nivel-tres.1.page';

describe('NivelTres1Page', () => {
  let component: NivelTres1Page;
  let fixture: ComponentFixture<NivelTres1Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NivelTres1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
