import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NivelTresPage } from './nivel-tres.page';

describe('NivelTresPage', () => {
  let component: NivelTresPage;
  let fixture: ComponentFixture<NivelTresPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NivelTresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
