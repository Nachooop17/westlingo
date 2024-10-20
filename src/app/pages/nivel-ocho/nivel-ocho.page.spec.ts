import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NivelOchoPage } from './nivel-ocho.page';

describe('NivelOchoPage', () => {
  let component: NivelOchoPage;
  let fixture: ComponentFixture<NivelOchoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NivelOchoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
