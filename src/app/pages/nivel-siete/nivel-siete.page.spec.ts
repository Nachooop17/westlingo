import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NivelSietePage } from './nivel-siete.page';

describe('NivelSietePage', () => {
  let component: NivelSietePage;
  let fixture: ComponentFixture<NivelSietePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NivelSietePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
